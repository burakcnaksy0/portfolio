import api from './axios';
import type { ApiResponse, Tag } from '@/types';

export const tagApi = {
  getAll: () => api.get<ApiResponse<Tag[]>>('/api/tags'),
  create: (name: string) => api.post<ApiResponse<Tag>>('/api/tags', { name }),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/tags/${id}`),
};
