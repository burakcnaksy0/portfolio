import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderGit2, BookOpen, Briefcase, Award,
  MessageSquare, LogOut, Menu, X, Code2, ChevronRight, User
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import toast from 'react-hot-toast';

const sidebarLinks = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/profile',      label: 'Profile',      icon: User },
  { to: '/admin/projects',     label: 'Projects',     icon: FolderGit2 },
  { to: '/admin/blog',         label: 'Blog',         icon: BookOpen },
  { to: '/admin/experience',   label: 'Experience',   icon: Briefcase },
  { to: '/admin/education',    label: 'Education',    icon: Award },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/messages',     label: 'Messages',     icon: MessageSquare },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {} finally {
      logout();
      navigate('/admin/login', { replace: true });
      toast.success('Logged out');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500 bg-opacity-10">
            <Code2 size={20} className="text-primary-400" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Burakcan Aksoy</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500 bg-opacity-15 text-primary-400 border border-primary-500 border-opacity-30'
                  : 'hover:bg-primary-500 hover:bg-opacity-5 hover:text-primary-400'
              }`
            }
            style={({ isActive }) => ({ color: isActive ? undefined : 'var(--text-secondary)' })}
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col border-r lg:hidden"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 h-16 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-secondary)' }}>
            <Menu size={20} />
          </button>
          <span className="font-semibold gradient-text">Admin Panel</span>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
