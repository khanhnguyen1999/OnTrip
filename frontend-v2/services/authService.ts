import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUsers, currentUser } from "@/mocks/users";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await delay(1000);
    
    // Check if user exists in mock data
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }
    
    // Mock successful login
    const mockResponse = {
      user,
      token: "mock-auth-token-12345",
      refreshToken: "mock-refresh-token-12345",
    };
    
    // Store tokens
    await AsyncStorage.setItem("auth_token", mockResponse.token);
    await AsyncStorage.setItem("refresh_token", mockResponse.refreshToken);
    
    return mockResponse;
  },
  
  register: async (name: string, email: string, password: string) => {
    // Simulate API call
    await delay(1000);
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error("Email already in use");
    }
    
    // Mock successful registration
    const newUser = {
      id: `user${mockUsers.length + 1}`,
      name,
      email,
      preferredCurrency: "USD",
    };
    
    const mockResponse = {
      user: newUser,
      token: "mock-auth-token-new-user",
      refreshToken: "mock-refresh-token-new-user",
    };
    
    // Store tokens
    await AsyncStorage.setItem("auth_token", mockResponse.token);
    await AsyncStorage.setItem("refresh_token", mockResponse.refreshToken);
    
    return mockResponse;
  },
  
  logout: async () => {
    // Simulate API call
    await delay(500);
    
    // Clear tokens
    await AsyncStorage.removeItem("auth_token");
    await AsyncStorage.removeItem("refresh_token");
    
    return { success: true };
  },
  
  getCurrentUser: async () => {
    // Simulate API call
    await delay(500);
    
    // Return mock current user
    return currentUser;
  },
  
  updateProfile: async (userData: Partial<typeof currentUser>) => {
    // Simulate API call
    await delay(1000);
    
    // Return updated user data
    return {
      ...currentUser,
      ...userData,
    };
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    // Simulate API call
    await delay(1000);
    
    // Mock password change
    return { success: true };
  },
};