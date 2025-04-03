import { create } from "zustand";
import { Expense } from "@/types";
import { expenseService } from "@/services/expenseService";

interface ExpenseState {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  fetchExpenseById: (expenseId: string) => Promise<void>;
  createExpense: (expenseData: Partial<Expense>) => Promise<Expense>;
  updateExpense: (expenseId: string, expenseData: Partial<Expense>) => Promise<Expense>;
  deleteExpense: (expenseId: string) => Promise<void>;
  fetchUserExpenses: (userId: string) => Promise<void>;
  fetchGroupExpenses: (groupId: string) => Promise<void>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  currentExpense: null,
  isLoading: false,
  error: null,
  
  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await expenseService.getExpenses();
      set({ expenses, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch expenses" 
      });
    }
  },
  
  fetchExpenseById: async (expenseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const expense = await expenseService.getExpenseById(expenseId);
      set({ currentExpense: expense, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch expense" 
      });
    }
  },
  
  createExpense: async (expenseData: Partial<Expense>) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = await expenseService.createExpense(expenseData);
      set(state => ({ 
        expenses: [...state.expenses, newExpense], 
        isLoading: false 
      }));
      return newExpense;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to create expense" 
      });
      throw error;
    }
  },
  
  updateExpense: async (expenseId: string, expenseData: Partial<Expense>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedExpense = await expenseService.updateExpense(expenseId, expenseData);
      set(state => ({ 
        expenses: state.expenses.map(e => e.id === expenseId ? updatedExpense : e),
        currentExpense: state.currentExpense?.id === expenseId ? updatedExpense : state.currentExpense,
        isLoading: false 
      }));
      return updatedExpense;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to update expense" 
      });
      throw error;
    }
  },
  
  deleteExpense: async (expenseId: string) => {
    set({ isLoading: true, error: null });
    try {
      await expenseService.deleteExpense(expenseId);
      set(state => ({ 
        expenses: state.expenses.filter(e => e.id !== expenseId),
        currentExpense: state.currentExpense?.id === expenseId ? null : state.currentExpense,
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to delete expense" 
      });
    }
  },
  
  fetchUserExpenses: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await expenseService.getUserExpenses(userId);
      set({ expenses, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch user expenses" 
      });
    }
  },
  
  fetchGroupExpenses: async (groupId: string) => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await expenseService.getExpensesByCategory(groupId);
      set({ expenses, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch group expenses" 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));