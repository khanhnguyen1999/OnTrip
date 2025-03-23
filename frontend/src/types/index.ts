// Generic API response interface that can handle different data types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    statusCode?: number;
  }
  
  // For paginated responses
  export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  
  // For error responses
  export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>; // Field-specific validation errors
    statusCode: number;
  }
  
  // Authentication response
  export interface AuthResponse extends ApiResponse<{
    token: string;
    refreshToken?: string;
    expiresIn?: number;
    user: UserDetails;
  }> {}
  
  // User details interface for auth responses
  export interface UserDetails {
    id: string | number;
    email: string;
    name?: string;
    role?: string;
    permissions?: string[];
    createdAt?: string;
    updatedAt?: string;
  }

  export interface User {
    id: string | number;
    email: string;
    name?: string;
    role?: string;
    permissions?: string[];
    createdAt?: string;
    updatedAt?: string;
  }