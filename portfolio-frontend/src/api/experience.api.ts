import api from './axios';
import type { ApiResponse, Experience, ExperienceRequest } from '@/types';

export const experienceApi = {
  getAll: () => api.get<ApiResponse<Experience[]>>('/api/experiences'),
  create: (data: ExperienceRequest) => api.post<ApiResponse<Experience>>('/api/experiences', data),
  update: (id: number, data: ExperienceRequest) => api.put<ApiResponse<Experience>>(`/api/experiences/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/experiences/${id}`),
};
