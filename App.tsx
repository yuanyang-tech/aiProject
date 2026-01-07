
import React, { useState } from 'react';
import { DashboardTab, Conversation, Customer } from './types';
import { MOCK_CONVERSATIONS, MOCK_CUSTOMERS } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DashboardOverview from './components/DashboardOverview';
import CustomerList from './components/CustomerList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.INBOX);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(MOCK_CONVERSATIONS[0].id);

  const activeConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedConversationId) || MOCK_CONVERSATIONS[0];
  const activeCustomer = MOCK_CUSTOMERS.find(c => c.id === activeConversation.customerId)!;

  const renderContent = () => {
    switch (activeTab) {
      case DashboardTab.INBOX:
        return (
          <div className="flex h-full gap-6">
            {/* 对话列表列 */}
            <div className="w-80 flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索客户或对话..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {MOCK_CONVERSATIONS.map(conv => {
                  const customer = MOCK_CUSTOMERS.find(c => c.id === conv.customerId)!;
                  const isSelected = selectedConversationId === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10' 
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img src={customer.avatar} className="w-10 h-10 rounded-full" alt="" />
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{customer.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{conv.priority} 优先级</p>
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-notification-ping">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {conv.lastMessage}
                      </p>
                      {/* 选中时的装饰条 */}
                      {isSelected && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 聊天主窗口 */}
            <div className="flex-1 min-w-0">
              <ChatWindow conversation={activeConversation} customer={activeCustomer} />
            </div>

            {/* 客户资料右侧栏 */}
            <div className="hidden xl:block w-72 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="text-center mb-6">
                  <img src={activeCustomer.avatar} className="w-20 h-20 rounded-2xl mx-auto mb-4 border-4 border-slate-50 shadow-sm" alt="" />
                  <h4 className="font-bold text-slate-800 text-lg">{activeCustomer.name}</h4>
                  <p className="text-sm text-slate-500">{activeCustomer.email}</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">客户标签</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCustomer.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">上次访问</span>
                      <span className="text-xs font-medium text-slate-700">2小时前</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">会话次数</span>
                      <span className="text-xs font-medium text-slate-700">12 次</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h5 className="font-bold text-slate-800 text-sm mb-4">备注</h5>
                <textarea 
                  placeholder="点击添加客户备注..."
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-slate-600 focus:ring-1 focus:ring-indigo-500 h-24 resize-none"
                />
              </div>
            </div>
          </div>
        );
      case DashboardTab.ANALYTICS:
        return <DashboardOverview />;
      case DashboardTab.CUSTOMERS:
        return <CustomerList />;
      case DashboardTab.SETTINGS:
        return (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm max-w-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">系统设置</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">AI 自动摘要</h4>
                  <p className="text-xs text-slate-400">开启后将自动为所有新对话生成简短摘要。</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl opacity-50">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">深色模式</h4>
                  <p className="text-xs text-slate-400">切换 UI 到深色主题风格。</p>
                </div>
                <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-20">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === DashboardTab.INBOX && '收件箱'}
            {activeTab === DashboardTab.ANALYTICS && '数据看板'}
            {activeTab === DashboardTab.CUSTOMERS && '客户关系管理'}
            {activeTab === DashboardTab.SETTINGS && '偏好设置'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">在线客服 - 001</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
