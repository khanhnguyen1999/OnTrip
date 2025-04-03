import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { mockUsers } from "@/mocks/users";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user with matching email (mock authentication)
          const user = mockUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
        }
      },
      
      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          const existingUser = mockUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          
          if (existingUser) {
            throw new Error("Email already in use");
          }
          
          // Create new user
          const newUser: User = {
            id: `user${mockUsers.length + 1}`,
            name,
            email,
            avatar: undefined,
            friends: [],
            groups: [],
            createdAt: new Date().toISOString(),
          };
          
          // In a real app, we would save this to the backend
          // For now, we'll just set it in the store
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred", 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({ user: { ...user, ...updates } });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);