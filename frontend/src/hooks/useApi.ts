import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { ApiResponse } from '../types';

// Custom hook for data fetching
export const useFetchData = <T>(endpoint: string, queryKey: string): UseQueryResult<T, Error> => {
  return useQuery<T, Error>({
    queryKey: [queryKey],
    queryFn: async (): Promise<T> => {
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      return response.data.data;
    },
  });
};

// Custom hook for data mutations
export const usePostData = <T, R>(endpoint: string, queryKey: string): UseMutationResult<R, Error, T> => {
  const queryClient = useQueryClient();
  
  return useMutation<R, Error, T>({
    mutationFn: (data: T) => apiClient.post<ApiResponse<R>>(endpoint, data).then(res => res.data.data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};