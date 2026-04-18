import api from './axios';
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/api/auth/login', data),
  refresh: () => api.post<ApiResponse<LoginResponse>>('/api/auth/refresh'),
  logout:  () => api.post<ApiResponse<void>>('/api/auth/logout'),
};
