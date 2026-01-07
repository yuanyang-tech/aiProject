
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "../types";

// 初始化 Gemini 客户端
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * 根据对话历史生成智能回复建议
 */
export async function getSmartSuggestions(history: Message[]): Promise<string[]> {
  const ai = getAI();
  const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是客服助理解析以下对话并给出3条最合适的回复建议（简短、专业、友好）。\n\n对话历史：\n${historyText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Suggestion Error:', error);
    return ["好的，我马上去为您核实。", "请稍等，我正在为您查询。", "非常抱歉给您带来了不便。"];
  }
}

/**
 * 为长对话生成简短摘要
 */
export async function summarizeConversation(history: Message[]): Promise<string> {
  const ai = getAI();
  const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请用一句话总结以下客服对话的核心需求：\n\n${historyText}`,
    });
    return response.text || "无法生成摘要";
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    return "摘要生成失败";
  }
}

/**
 * 情感分析，判断客户当前情绪
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
