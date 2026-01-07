
import React from 'react';
import { Customer, Conversation } from './types';

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
  },
  {
    id: 'c3',
    name: '王大锤',
    email: 'dachui.wang@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c3',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000),
    location: '广州, 中国',
    tags: ['投诉', '紧急']
  },
  {
    id: 'c4',
    name: '陈美琳',
    email: 'meilin.chen@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c4',
    status: 'online',
    lastSeen: new Date(),
    location: '深圳, 中国',
    tags: ['活跃用户', '复购客户']
  },
  {
    id: 'c5',
    name: '赵铁柱',
    email: 'tuezhu.zhao@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c5',
    status: 'offline',
    lastSeen: new Date(Date.now() - 172800000),
    location: '成都, 中国',
    tags: ['新用户']
  },
  {
    id: 'c6',
    name: '周小杰',
    email: 'xiaojie.zhou@example.com',
    avatar: 'https://i.pravatar.cc/150?u=c6',
    status: 'away',
    lastSeen: new Date(Date.now() - 7200000),
    location: '杭州, 中国',
    tags: ['自营店客户', '兴趣广泛']
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
  },
  {
    id: 'conv2',
    customerId: 'c2',
    lastMessage: '好的，谢谢你的回复。',
    unreadCount: 0,
    priority: 'medium',
    startedAt: new Date(Date.now() - 5000000),
    messages: [
      { id: 'm4', role: 'user', content: '我的订单什么时候发货？', timestamp: new Date(Date.now() - 6000000), status: 'sent' },
      { id: 'm5', role: 'agent', content: '您的订单预计会在明天下午发出。', timestamp: new Date(Date.now() - 5500000), status: 'sent' },
      { id: 'm6', role: 'user', content: '好的，谢谢你的回复。', timestamp: new Date(Date.now() - 5000000), status: 'sent' }
    ]
  }
];
