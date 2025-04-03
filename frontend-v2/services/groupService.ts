import api from "./api";
import { Group, User, Expense } from "@/types";
import { mockGroups } from "@/mocks/groups";
import { mockExpenses } from "@/mocks/expenses";
import { mockUsers } from "@/mocks/users";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const groupService = {
  getGroups: async () => {
    // Simulate API call
    await delay(800);
    
    return mockGroups;
  },
  
  getGroupById: async (groupId: string) => {
    // Simulate API call
    await delay(500);
    
    const group = mockGroups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    return group;
  },
  
  createGroup: async (groupData: Partial<Group>) => {
    // Simulate API call
    await delay(1000);
    
    // Create new group with mock data
    const newGroup: Group = {
      id: `group${mockGroups.length + 1}`,
      name: groupData.name || "New Group",
      description: groupData.description || "",
      members: groupData.members || [mockUsers[0]],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBalance: 0,
      coverImage: groupData.coverImage,
    };
    
    return newGroup;
  },
  
  updateGroup: async (groupId: string, groupData: Partial<Group>) => {
    // Simulate API call
    await delay(800);
    
    const group = mockGroups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    // Update group with new data
    const updatedGroup = {
      ...group,
      ...groupData,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedGroup;
  },
  
  deleteGroup: async (groupId: string) => {
    // Simulate API call
    await delay(800);
    
    return { success: true };
  },
  
  addMemberToGroup: async (groupId: string, userId: string) => {
    // Simulate API call
    await delay(600);
    
    const group = mockGroups.find(g => g.id === groupId);
    const user = mockUsers.find(u => u.id === userId);
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Check if user is already a member
    if (group.members.some(m => m.id === userId)) {
      throw new Error("User is already a member of this group");
    }
    
    // Add user to group
    const updatedGroup = {
      ...group,
      members: [...group.members, user],
      updatedAt: new Date().toISOString(),
    };
    
    return updatedGroup;
  },
  
  removeMemberFromGroup: async (groupId: string, userId: string) => {
    // Simulate API call
    await delay(600);
    
    const group = mockGroups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    // Remove user from group
    const updatedGroup = {
      ...group,
      members: group.members.filter(m => m.id !== userId),
      updatedAt: new Date().toISOString(),
    };
    
    return updatedGroup;
  },
  
  getGroupExpenses: async (groupId: string) => {
    // Simulate API call
    await delay(700);
    
    // Filter expenses by group ID
    const expenses = mockExpenses.filter(e => e.groupId === groupId);
    
    return expenses;
  },
  
  getGroupBalances: async (groupId: string) => {
    // Simulate API call
    await delay(800);
    
    const group = mockGroups.find(g => g.id === groupId);
    
    if (!group) {
      throw new Error("Group not found");
    }
    
    // Calculate balances between members
    const balances = group.members.map(member => {
      // In a real app, this would calculate the actual balance
      // based on expenses and settlements
      const randomBalance = Math.round((Math.random() * 200 - 100) * 100) / 100;
      
      return {
        userId: member.id,
        userName: member.name,
        balance: randomBalance,
      };
    });
    
    return balances;
  },
};