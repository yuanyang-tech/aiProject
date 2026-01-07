
import React from 'react';
import { Customer, Conversation, KnowledgeItem } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: '张晓明',
    email: 'xiaoming.zhang@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c1',
    status: 'online',
    lastSeen: new Date(),
    location: '北京, 中国',
    tags: ['高级会员', '科技数码', '大客户']
  },
  {
    id: 'c2',
    name: '李丽华',
    email: 'lihua.li@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c2',
    status: 'away',
    lastSeen: new Date(Date.now() - 3600000),
    location: '上海, 中国',
    tags: ['潜在客户', '咨询中']
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    customerId: 'c1',
    lastMessage: '请问这款产品的续航时间是多久？',
    unreadCount: 2,
    priority: 'high',
    startedAt: new Date(Date.now() - 1000000),
    messages: [
      { id: 'm1', role: 'user', content: '您好，我想了解一下最新的 Pro 款机型。', timestamp: new Date(Date.now() - 2000000), status: 'sent' },
      { id: 'm2', role: 'agent', content: '您好！欢迎咨询。Pro 款机型目前有现货，您具体想了解哪些方面呢？', timestamp: new Date(Date.now() - 1500000), status: 'sent' },
      { id: 'm3', role: 'user', content: '请问这款产品的续航时间是多久？', timestamp: new Date(Date.now() - 1000000), status: 'sent' }
    ]
  }
];

export const MOCK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'k1',
    title: '智语 Pro 续航说明',
    content: '智语 Pro 系列配备了 5000mAh 超大电池。在常规办公模式下可使用 15 小时，视频播放模式可达 20 小时。支持 65W 快充，30 分钟可充电至 60%。',
    category: '产品参数',
    tags: ['电池', '续航', 'Pro'],
    updatedAt: new Date(2024, 2, 15)
  },
  {
    id: 'k2',
    title: '退换货政策',
    content: '本商城支持 7 天无理由退货，15 天质量问题换货。退货需保证产品包装完好，不影响二次销售。由于个人原因产生的退货运费需由买家承担。',
    category: '售后服务',
    tags: ['退货', '换货', '政策'],
    updatedAt: new Date(2024, 1, 10)
  },
  {
    id: 'k3',
    title: '如何设置 AI 自动摘要',
    content: '进入设置中心 -> 会话设置 -> 开启“AI 自动摘要”开关。开启后，系统会在会话结束后 10 秒内自动生成内容提要。',
    category: '操作指南',
    tags: ['设置', 'AI', '摘要'],
    updatedAt: new Date(2024, 3, 5)
  }
];
