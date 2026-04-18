// ─── API Wrappers ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  email: string;
  role: string;
}

export interface AuthUser {
  email: string;
  role: string;
  accessToken: string;
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrls?: string[];
  featured: boolean;
  displayOrder: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrls?: string[];
  featured?: boolean;
  displayOrder?: number;
  tagIds?: number[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

// ─── Blog Posts ───────────────────────────────────────────────────────────────
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImageUrl?: string;
  viewCount: number;
  published: boolean;
  publishedAt?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  summary?: string;
  coverImageUrl?: string;
  published?: boolean;
  tagIds?: number[];
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {}

// ─── Experiences ──────────────────────────────────────────────────────────────
export interface Experience {
  id: number;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  companyLogoUrl?: string;
  displayOrder: number;
}

export interface ExperienceRequest {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  companyLogoUrl?: string;
  displayOrder?: number;
}

// ─── Certificates ─────────────────────────────────────────────────────────────
export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface CertificateRequest {
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  displayOrder?: number;
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  name: string;
  email: string;
  subject?: string;
  body: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalProjects: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalExperiences: number;
  totalCertificates: number;
  totalMessages: number;
  unreadMessages: number;
  totalTags: number;
}

// ─── Profile ───────────────────────────────────────────────────────────────────
export interface Profile {
  id: number;
  fullName: string;
  title: string;
  about: string;
  email: string;
  profileImageUrl?: string;
  cvUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  gitlabUrl?: string;
}

export interface ProfileRequest extends Partial<Profile> {}
