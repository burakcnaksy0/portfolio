import api from './axios';
import { Education, EducationRequest, ApiResponse } from '@/types';

export const educationApi = {
  getEducation: () => 
    api.get<ApiResponse<Education[]>>('/api/education'),
  
  createEducation: (data: EducationRequest) => 
    api.post<ApiResponse<Education>>('/api/education', data),
  
  updateEducation: (id: number, data: EducationRequest) => 
    api.put<ApiResponse<Education>>(`/api/education/${id}`, data),
  
  deleteEducation: (id: number) => 
    api.delete<ApiResponse<void>>(`/api/education/${id}`),
};
