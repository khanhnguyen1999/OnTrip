export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    friends?: [],
    groups?: [],
    createdAt?: string,
    preferredCurrency?: string;
  }
  
  export interface Group {
    id: string;
    name: string;
    description?: string;
    members: User[];
    createdAt: string;
    updatedAt: string;
    totalBalance: number;
    coverImage?: string;
  }
  
  export interface Friend {
    id: string;
    user: User;
    balance: number;
    addedAt: string;
  }
  
  export interface Expense {
    id: string;
    title: string;
    amount: number;
    currency: string;
    paidBy: {
      userId: string;
      amount: number;
    }[];
    splitBetween: {
      userId: string;
      amount: number;
    }[];
    date: string;
    category: ExpenseCategory;
    notes?: string;
    receipt?: string;
    groupId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Settlement {
    id: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    currency: string;
    date: string;
    status: "pending" | "completed";
    method: "cash" | "online" | "bank";
    notes?: string;
  }
  
  export interface Activity {
    id: string;
    type: "expense" | "settlement" | "group" | "friend";
    date: string;
    data: any;
    read: boolean;
  }
  
  export type ExpenseCategory = 
    | "food" 
    | "transportation" 
    | "housing" 
    | "utilities" 
    | "entertainment" 
    | "shopping" 
    | "health" 
    | "travel" 
    | "education" 
    | "other";
  
  export interface Message {
    id: string;
    groupId: string;
    senderId: string;
    text: string;
    timestamp: string;
    attachments?: string[];
    mentions?: string[];
  }