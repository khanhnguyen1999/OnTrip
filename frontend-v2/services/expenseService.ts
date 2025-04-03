import api from "./api";
import { Expense } from "@/types";
import { mockExpenses } from "@/mocks/expenses";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  getExpenses: async () => {
    // Simulate API call
    await delay(800);
    
    return mockExpenses;
  },
  
  getExpenseById: async (expenseId: string) => {
    // Simulate API call
    await delay(500);
    
    const expense = mockExpenses.find(e => e.id === expenseId);
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    return expense;
  },
  
  createExpense: async (expenseData: Partial<Expense>) => {
    // Simulate API call
    await delay(1000);
    
    // Create new expense with mock data
    const newExpense: Expense = {
      id: `expense${mockExpenses.length + 1}`,
      title: expenseData.title || "New Expense",
      amount: expenseData.amount || 0,
      currency: expenseData.currency || "USD",
      paidBy: expenseData.paidBy || [],
      splitBetween: expenseData.splitBetween || [],
      date: expenseData.date || new Date().toISOString(),
      category: expenseData.category || "other",
      notes: expenseData.notes,
      receipt: expenseData.receipt,
      groupId: expenseData.groupId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newExpense;
  },
  
  updateExpense: async (expenseId: string, expenseData: Partial<Expense>) => {
    // Simulate API call
    await delay(800);
    
    const expense = mockExpenses.find(e => e.id === expenseId);
    
    if (!expense) {
      throw new Error("Expense not found");
    }
    
    // Update expense with new data
    const updatedExpense = {
      ...expense,
      ...expenseData,
      updatedAt: new Date().toISOString(),
    };
    
    return updatedExpense;
  },
  
  deleteExpense: async (expenseId: string) => {
    // Simulate API call
    await delay(800);
    
    return { success: true };
  },
  
  getUserExpenses: async (userId: string) => {
    // Simulate API call
    await delay(700);
    
    // Filter expenses where user is involved
    const expenses = mockExpenses.filter(e => 
      e.paidBy.some(p => p.userId === userId) || 
      e.splitBetween.some(s => s.userId === userId)
    );
    
    return expenses;
  },
  
  getExpensesByCategory: async (category: string) => {
    // Simulate API call
    await delay(700);
    
    // Filter expenses by category
    const expenses = mockExpenses.filter(e => e.category === category);
    
    return expenses;
  },
};