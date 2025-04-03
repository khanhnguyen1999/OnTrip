import api from "./api";
import { Message } from "@/types";
import { mockMessages } from "@/mocks/messages";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const messageService = {
  getGroupMessages: async (groupId: string) => {
    // Simulate API call
    await delay(800);
    
    // Filter messages by group ID
    const messages = mockMessages.filter(m => m.groupId === groupId);
    
    return messages;
  },
  
  sendMessage: async (messageData: Partial<Message>) => {
    // Simulate API call
    await delay(600);
    
    // Create new message with mock data
    const newMessage: Message = {
      id: `message${mockMessages.length + 1}`,
      groupId: messageData.groupId || "",
      senderId: messageData.senderId || "",
      text: messageData.text || "",
      timestamp: new Date().toISOString(),
      attachments: messageData.attachments,
      mentions: messageData.mentions,
    };
    
    return newMessage;
  },
  
  getDirectMessages: async (userId1: string, userId2: string) => {
    // Simulate API call
    await delay(800);
    
    // In a real app, this would fetch direct messages between two users
    // For mock data, we'll return an empty array
    return [];
  },
};