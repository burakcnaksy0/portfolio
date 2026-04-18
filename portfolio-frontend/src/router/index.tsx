import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './AdminRoutes';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Public pages — lazy loaded
const HomePage          = lazy(() => import('@/pages/public/HomePage').then(m => ({ default: m.HomePage })));
const ProjectsPage      = lazy(() => import('@/pages/public/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/pages/public/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const BlogPage          = lazy(() => import('@/pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage    = lazy(() => import('@/pages/public/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const ExperiencePage    = lazy(() => import('@/pages/public/ExperiencePage').then(m => ({ default: m.ExperiencePage })));
const EducationPage     = lazy(() => import('@/pages/public/EducationPage').then(m => ({ default: m.EducationPage })));
const CertificatesPage  = lazy(() => import('@/pages/public/CertificatesPage').then(m => ({ default: m.CertificatesPage })));
const ContactPage       = lazy(() => import('@/pages/public/ContactPage').then(m => ({ default: m.ContactPage })));

// Admin pages — lazy loaded
const LoginPage             = lazy(() => import('@/pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage         = lazy(() => import('@/pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProjectsAdminPage     = lazy(() => import('@/pages/admin/ProjectsAdminPage').then(m => ({ default: m.ProjectsAdminPage })));
const BlogAdminPage         = lazy(() => import('@/pages/admin/BlogAdminPage').then(m => ({ default: m.BlogAdminPage })));
const ExperienceAdminPage   = lazy(() => import('@/pages/admin/ExperienceAdminPage').then(m => ({ default: m.ExperienceAdminPage })));
const CertificatesAdminPage = lazy(() => import('@/pages/admin/CertificatesAdminPage').then(m => ({ default: m.CertificatesAdminPage })));
const MessagesAdminPage     = lazy(() => import('@/pages/admin/MessagesAdminPage').then(m => ({ default: m.MessagesAdminPage })));
const ProfileAdminPage      = lazy(() => import('@/pages/admin/ProfileAdminPage').then(m => ({ default: m.ProfileAdminPage })));
const EducationAdminPage    = lazy(() => import('@/pages/admin/EducationAdminPage').then(m => ({ default: m.EducationAdminPage })));


const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',                element: <HomePage /> },
      { path: '/projects',        element: <ProjectsPage /> },
      { path: '/projects/:slug',  element: <ProjectDetailPage /> },
      { path: '/blog',            element: <BlogPage /> },
      { path: '/blog/:slug',      element: <BlogDetailPage /> },
      { path: '/experience',      element: <ExperiencePage /> },
      { path: '/education',       element: <EducationPage /> },
      { path: '/certificates',    element: <CertificatesPage /> },
      { path: '/contact',         element: <ContactPage /> },
    ],
  },

  // ── Admin login (no layout wrapper) ─────────────────────────────────────────
  { path: '/admin/login', element: <LoginPage /> },

  // ── Admin (protected) ───────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',              element: <DashboardPage /> },
          { path: '/admin/projects',     element: <ProjectsAdminPage /> },
          { path: '/admin/blog',         element: <BlogAdminPage /> },
          { path: '/admin/experience',   element: <ExperienceAdminPage /> },
          { path: '/admin/education',    element: <EducationAdminPage /> },
          { path: '/admin/certificates', element: <CertificatesAdminPage /> },
          { path: '/admin/messages',     element: <MessagesAdminPage /> },
          { path: '/admin/profile',      element: <ProfileAdminPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
