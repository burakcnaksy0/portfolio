import api from './axios';
import type { ApiResponse, PageResponse, Message, SendMessageRequest } from '@/types';

export const messageApi = {
  send: (data: SendMessageRequest) => api.post<ApiResponse<void>>('/api/messages', data),
  getAll: (params?: { page?: number; size?: number; unreadOnly?: boolean }) =>
    api.get<ApiResponse<PageResponse<Message>>>('/api/messages', { params }),
  markRead: (id: number) => api.put<ApiResponse<void>>(`/api/messages/${id}/read`),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/messages/${id}`),
};
