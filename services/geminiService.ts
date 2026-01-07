
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Message, KnowledgeItem } from "../types";
import { MOCK_KNOWLEDGE } from "../constants";

// 初始化 Gemini 客户端
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * 模拟语义搜索知识库
 * 实际项目中会调用后端向量检索接口
 */
const searchKnowledgeBaseLocally = (query: string): KnowledgeItem[] => {
  const q = query.toLowerCase();
  return MOCK_KNOWLEDGE.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.content.toLowerCase().includes(q) ||
    item.tags.some(t => t.toLowerCase().includes(q))
  );
};

// 定义知识库检索函数声明
const searchKnowledgeBaseTool: FunctionDeclaration = {
  name: 'searchKnowledgeBase',
  parameters: {
    type: Type.OBJECT,
    description: '搜索公司的产品说明、服务政策、操作指南等知识库内容，以获取准确的回答信息。',
    properties: {
      query: {
        type: Type.STRING,
        description: '检索关键词或用户的问题核心',
      },
    },
    required: ['query'],
  },
};

/**
 * 根据对话历史生成智能回复建议
 * 内部会自动尝试调用知识库工具以提供更专业的建议
 */
export async function getSmartSuggestions(history: Message[]): Promise<string[]> {
  const ai = getAI();
  const lastUserMsg = [...history].reverse().find(m => m.role === 'user')?.content || '';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是客服助手，分析以下对话。如果用户在询问具体的产品规格、政策或操作，请优先调用知识库搜索工具。最后给出3条最合适的回复建议（简短、专业、友好）。\n\n对话历史：\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`,
      config: {
        tools: [{ functionDeclarations: [searchKnowledgeBaseTool] }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // 处理 Function Call
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'searchKnowledgeBase') {
        const query = (call.args as any).query;
        const results = searchKnowledgeBaseLocally(query);
        
        // 带着结果再次生成建议
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `基于以下知识库查询结果，为用户的问题"${lastUserMsg}"提供3条专业回复建议。\n\n知识库结果：\n${JSON.stringify(results)}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });
        return JSON.parse(secondResponse.text || '[]');
      }
    }

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Suggestion Error:', error);
    // 降级策略：如果失败，尝试基础检索
    const fallbackResults = searchKnowledgeBaseLocally(lastUserMsg);
    if (fallbackResults.length > 0) {
      return [`根据知识库：${fallbackResults[0].title}，我们可以...`, "我可以帮您查到相关信息。", "请稍等。"];
    }
    return ["好的，我马上去为您核实。", "请稍等，我正在为您查询。", "非常抱歉给您带来了不便。"];
  }
}

/**
 * 为长对话生成简短摘要
 */
export async function summarizeConversation(history: Message[]): Promise<string> {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请用一句话总结以下客服对话的核心需求：\n\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`,
    });
    return response.text || "无法生成摘要";
  } catch (error) {
    return "摘要生成失败";
  }
}

/**
 * 情感分析
 */
export async function analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析该段话的情绪，只返回 'positive', 'neutral', 或 'negative' 之一：\n\n"${text}"`,
    });
    const result = response.text?.toLowerCase().trim();
    if (result?.includes('positive')) return 'positive';
    if (result?.includes('negative')) return 'negative';
    return 'neutral';
  } catch {
    return 'neutral';
  }
}
