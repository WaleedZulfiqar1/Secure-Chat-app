import { EncryptionMethod, UserRole } from '@/lib/constants';

export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  rsaPublicKey?: string;
  rsaPrivateKey?: string;
}

export interface Message {
  _id?: string;
  content: string;
  encryptedContent?: string;
  senderId: string;
  receiverId: string;
  encryptionMethod: EncryptionMethod;
  encryptionTime?: number;
  decryptionTime?: number;
  createdAt: Date;
  isIntercepted?: boolean;
}

export interface EncryptionStat {
  _id?: string;
  method: EncryptionMethod;
  messageLength: number;
  encryptionTime: number;
  decryptionTime: number;
  createdAt: Date;
  userId: string;
}

export interface ChatPartner {
  _id: string;
  username: string;
  lastMessage?: Message;
  unreadCount?: number;
}