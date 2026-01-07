
import React, { useState, useMemo } from 'react';
import { KnowledgeItem } from '../types';
import { MOCK_KNOWLEDGE } from '../constants';

const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(MOCK_KNOWLEDGE);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 维护状态：null 表示不在编辑/添加，{ id: '...' } 表示编辑现有，{ id: '' } 表示添加新项
  const [editingItem, setEditingItem] = useState<Partial<KnowledgeItem> | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleAddNew = () => {
    setEditingItem({
      id: '',
      title: '',
      content: '',
      category: '通用',
      tags: [],
      updatedAt: new Date()
    });
  };

  const handleEditItem = (item: KnowledgeItem) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem || !editingItem.title || !editingItem.content) return;

    if (editingItem.id === '') {
      // 新增逻辑
      const newItem: KnowledgeItem = {
        ...editingItem as KnowledgeItem,
        id: `k${Date.now()}`,
        updatedAt: new Date()
      };
      setItems([newItem, ...items]);
    } else {
      // 更新逻辑
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...editingItem, updatedAt: new Date() } as KnowledgeItem 
          : item
      ));
    }
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条知识点吗？此操作不可撤销。')) {
      setItems(items.filter(item => item.id !== id));
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">企业知识库</h1>
          <p className="text-sm text-slate-400 mt-1">
            共收录 <span className="text-indigo-600 font-semibold">{items.length}</span> 条专业知识，AI 会自动调用这些内容回答客户。
          </p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 text-sm font-semibold group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          新建知识点
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="搜索知识标题、内容或分类..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* 知识列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleEditItem(item)}
            className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex flex-col relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase">
                {item.category}
              </span>
              <span className="text-[10px] text-slate-400">
                更新于 {item.updatedAt.toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 flex-1">
              {item.content}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded-md">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
             <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             <p className="font-medium text-slate-500">未找到匹配的知识条目</p>
             <button onClick={() => setSearchTerm('')} className="text-indigo-600 text-sm font-semibold mt-2">显示全部条目</button>
          </div>
        )}
      </div>

      {/* 维护/维护弹窗 */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-[2rem] z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem.id === '' ? '新增知识点' : '维护知识点'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">请填写详细信息以供 AI 系统准确检索</p>
              </div>
              <button 
                onClick={() => setEditingItem(null)} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">标题</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" 
                    placeholder="简明扼要的标题" 
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">业务分类</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="产品参数">产品参数</option>
                    <option value="售后服务">售后服务</option>
                    <option value="操作指南">操作指南</option>
                    <option value="企业文化">企业文化</option>
                    <option value="通用">通用</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">详细内容</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm h-48 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none" 
                  placeholder="请输入详细的知识内容，越详尽 AI 回答越准确..." 
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">标签 (空格分隔)</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none" 
                  placeholder="例如：电池 续航 快充" 
                  value={editingItem.tags?.join(' ')}
                  onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(/\s+/) })}
                />
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row gap-3 bg-slate-50/30 rounded-b-[2rem]">
              {editingItem.id !== '' && (
                <button 
                  onClick={() => editingItem.id && handleDelete(editingItem.id)} 
                  className="px-6 py-3 rounded-xl border border-red-100 text-sm font-bold text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  删除条目
                </button>
              )}
              <div className="flex-1 flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  onClick={() => setEditingItem(null)} 
                  className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!editingItem.title || !editingItem.content}
                  className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  保存并同步至 AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
