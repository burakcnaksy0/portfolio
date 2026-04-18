import api from './axios';
import type { ApiResponse, Certificate, CertificateRequest } from '@/types';

export const certificateApi = {
  getAll: () => api.get<ApiResponse<Certificate[]>>('/api/certificates'),
  create: (data: CertificateRequest) => api.post<ApiResponse<Certificate>>('/api/certificates', data),
  update: (id: number, data: CertificateRequest) => api.put<ApiResponse<Certificate>>(`/api/certificates/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/api/certificates/${id}`),
};
