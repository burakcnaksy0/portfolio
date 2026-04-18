import api from './axios';

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ data: { url: string } }>('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPdf: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ data: { url: string } }>('/api/upload/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
