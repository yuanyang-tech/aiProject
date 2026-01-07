
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Customer, Message, MessageStatus } from '../types';
import { getSmartSuggestions, summarizeConversation, analyzeSentiment } from '../services/geminiService';

interface ChatWindowProps {
  conversation: Conversation;
  customer: Customer;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, customer }) => {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
    fetchAiInsights(conversation.messages);
  }, [conversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAiInsights = async (history: Message[]) => {
    setIsAiLoading(true);
    try {
      const [newSuggestions, newSummary, lastSentiment] = await Promise.all([
        getSmartSuggestions(history),
        summarizeConversation(history),
        analyzeSentiment(history[history.length - 1]?.content || '')
      ]);
      setSuggestions(newSuggestions);
      setSummary(newSummary);
      setSentiment(lastSentiment);
    } finally {
      setIsAiLoading(false);
    }
  };

  const updateMessageStatus = (id: string, status: MessageStatus) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, status } : msg));
  };

  const handleSendMessage = async (text: string = inputText) => {
    const messageContent = text.trim();
    if (!messageContent) return;
    
    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      role: 'agent',
      content: messageContent,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // 模拟网络延迟和发送成功
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 提高模拟成功率
      updateMessageStatus(messageId, isSuccess ? 'sent' : 'failed');
      
      if (isSuccess) {
        setTimeout(() => {
          const customerReply: Message = {
            id: (Date.now() + 1).toString(),
            role: 'user',
            content: '好的，我已经收到了。',
            timestamp: new Date(),
            status: 'sent'
          };
          setMessages(prev => {
            const finalMessages = [...prev, customerReply];
            fetchAiInsights(finalMessages);
            return finalMessages;
          });
        }, 2000);
      }
    }, 800);
  };

  // 处理建议点击：填充并发送
  const handleSuggestionClick = (text: string) => {
    setInputText(text); // 视觉上填充到输入框
    handleSendMessage(text); // 立即触发发送
  };

  const sentimentIcon = {
    positive: '😊',
    neutral: '😐',
    negative: '😠'
  };

  const renderStatus = (status?: MessageStatus) => {
    if (!status) return null;
    switch (status) {
      case 'sending':
        return (
          <svg className="animate-spin h-3 w-3 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'sent':
        return (
          <svg className="h-3 w-3 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-3 w-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* 顶部标题栏 */}
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              customer.status === 'online' ? 'bg-green-500' : customer.status === 'away' ? 'bg-amber-500' : 'bg-slate-300'
            }`}></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              {customer.name}
              {sentiment && (
                <span title={`客户情绪: ${sentiment}`} className="text-lg">
                  {sentimentIcon[sentiment]}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">{customer.location} • {customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
      </header>

      {/* 对话摘要预览 */}
      {summary && (
        <div className="bg-indigo-50 px-6 py-2 border-b border-indigo-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-1 rounded-md text-white">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-xs text-indigo-700 font-medium">AI 摘要：{summary}</p>
        </div>
      )}

      {/* 消息区域 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm relative ${
              msg.role === 'user' 
                ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <p className={`text-[10px] ${msg.role === 'user' ? 'text-slate-400' : 'text-indigo-200'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {msg.role === 'agent' && (
                  <div className="flex items-center">
                    {renderStatus(msg.status)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 智能回复建议 (改用标签/链接样式) */}
      <div className="px-6 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full bg-indigo-500 ${isAiLoading ? 'animate-pulse' : ''}`}></div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">智能助手建议</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-600 border border-indigo-100 hover:border-indigo-600 rounded-full text-[13px] text-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md group"
            >
              <svg className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">{s}</span>
            </button>
          ))}
          {suggestions.length === 0 && !isAiLoading && (
            <span className="text-xs text-slate-400 animate-pulse">正在为您组织语言...</span>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="px-6 py-4 bg-white border-t border-slate-100">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="输入消息，或点击上方建议回复..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none min-h-[44px] max-h-32"
              rows={1}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 group"
          >
            <svg className="w-5 h-5 transform rotate-90 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
