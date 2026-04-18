import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/projects',    label: 'Projects' },
  { to: '/blog',        label: 'Blog' },
  { to: '/experience',  label: 'Experience' },
  { to: '/certificates',label: 'Certificates' },
  { to: '/contact',     label: 'Contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
    >
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="p-2 rounded-xl bg-primary-500 bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
            <Code2 size={20} className="text-primary-400" />
          </div>
          <span className="gradient-text">Burakcan AKSOY</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary-400 bg-primary-500 bg-opacity-10'
                    : 'hover:text-primary-400 hover:bg-primary-500 hover:bg-opacity-5'
                }`
              }
              style={{ color: 'var(--text-secondary)' }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-primary-500 hover:bg-opacity-10"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl transition-all duration-200 hover:bg-primary-500 hover:bg-opacity-10"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--border-color)', background: 'var(--glass-bg)' }}
          >
            <nav className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'text-primary-400 bg-primary-500 bg-opacity-10' : ''
                    }`
                  }
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
