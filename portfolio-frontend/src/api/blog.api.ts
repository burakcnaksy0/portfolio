import api from './axios';
import type { ApiResponse, PageResponse, BlogPost, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types';

export const blogApi = {
  getPublished: (params?: { tag?: string; search?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<PageResponse<BlogPost>>>('/api/blog', { params }),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<BlogPost>>(`/api/blog/${slug}`),

  getAllAdmin: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<PageResponse<BlogPost>>>('/api/blog/admin/all', { params }),

  create: (data: CreateBlogPostRequest) =>
    api.post<ApiResponse<BlogPost>>('/api/blog', data),

  update: (id: number, data: UpdateBlogPostRequest) =>
    api.put<ApiResponse<BlogPost>>(`/api/blog/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/api/blog/${id}`),
};
