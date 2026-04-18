import api from './axios';
import type { ApiResponse, PageResponse, Project, CreateProjectRequest, UpdateProjectRequest } from '@/types';

export const projectApi = {
  getAll: (params?: { tag?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<PageResponse<Project>>>('/api/projects', { params }),

  getFeatured: () =>
    api.get<ApiResponse<Project[]>>('/api/projects/featured'),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Project>>(`/api/projects/${slug}`),

  create: (data: CreateProjectRequest) =>
    api.post<ApiResponse<Project>>('/api/projects', data),

  update: (id: number, data: UpdateProjectRequest) =>
    api.put<ApiResponse<Project>>(`/api/projects/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/api/projects/${id}`),
};
