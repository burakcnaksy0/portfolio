import api from './axios';
import { Education, EducationRequest, ApiResponse } from '@/types';

export const educationApi = {
  getEducation: () => 
    api.get<ApiResponse<Education[]>>('/education'),
  
  createEducation: (data: EducationRequest) => 
    api.post<ApiResponse<Education>>('/education', data),
  
  updateEducation: (id: number, data: EducationRequest) => 
    api.put<ApiResponse<Education>>(`/education/${id}`, data),
  
  deleteEducation: (id: number) => 
    api.delete<ApiResponse<void>>(`/education/${id}`),
};
