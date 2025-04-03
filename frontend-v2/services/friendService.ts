import api from "./api";
import { Friend, User } from "@/types";
import { mockFriends } from "@/mocks/friends";
import { mockUsers } from "@/mocks/users";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const friendService = {
  getFriends: async () => {
    // Simulate API call
    await delay(800);
    
    return mockFriends;
  },
  
  getFriendById: async (friendId: string) => {
    // Simulate API call
    await delay(500);
    
    const friend = mockFriends.find(f => f.id === friendId);
    
    if (!friend) {
      throw new Error("Friend not found");
    }
    
    return friend;
  },
  
  addFriend: async (userId: string) => {
    // Simulate API call
    await delay(1000);
    
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if already friends
    if (mockFriends.some(f => f.user.id === userId)) {
      throw new Error("Already friends with this user");
    }
    
    // Create new friend relationship
    const newFriend: Friend = {
      id: `friend${mockFriends.length + 1}`,
      user,
      balance: 0,
      addedAt: new Date().toISOString(),
    };
    
    return newFriend;
  },
  
  removeFriend: async (friendId: string) => {
    // Simulate API call
    await delay(800);
    
    return { success: true };
  },
  
  getFriendBalance: async (friendId: string) => {
    // Simulate API call
    await delay(600);
    
    const friend = mockFriends.find(f => f.id === friendId);
    
    if (!friend) {
      throw new Error("Friend not found");
    }
    
    return { balance: friend.balance };
  },
  
  searchUsers: async (query: string) => {
    // Simulate API call
    await delay(700);
    
    // Filter users by name or email containing the query
    const users = mockUsers.filter(
      u => u.name.toLowerCase().includes(query.toLowerCase()) || 
           u.email.toLowerCase().includes(query.toLowerCase())
    );
    
    return users;
  },
};