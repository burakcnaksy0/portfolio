import api from './axios';

export interface ProfileData {
  fullName: string;
  title: string;
  about: string;
  githubUrl: string;
  linkedinUrl: string;
  gitlabUrl: string;
  twitterUrl: string;
  cvUrl: string;
  publicEmail: string;
}

export const profileApi = {
  getProfile: () => api.get<{ data: ProfileData }>('/api/profile'),
  updateProfile: (data: ProfileData) => api.put<{ data: ProfileData }>('/api/profile', data),
};
