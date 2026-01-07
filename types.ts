
export type MessageRole = 'user' | 'agent' | 'system' | 'ai';
export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  location: string;
  tags: string[];
}

export interface Conversation {
  id: string;
  customerId: string;
  lastMessage: string;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high';
  messages: Message[];
  startedAt: Date;
}

export enum DashboardTab {
  INBOX = 'inbox',
  ANALYTICS = 'analytics',
  CUSTOMERS = 'customers',
  SETTINGS = 'settings'
}
