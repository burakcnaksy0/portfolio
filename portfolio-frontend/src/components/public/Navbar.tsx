import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/projects',    label: 'Projects' },
  { to: '/blog',        label: 'Blog' },
  { to: '/experience',  label: 'Experience' },
  { to: '/education',   label: 'Education' },
  { to: '/certificates',label: 'Certificates' },
  { to: '/contact',     label: 'Contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll-aware navbar shrink
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'backdrop-blur-xl shadow-glass'
          : 'backdrop-blur-md'
      }`}
      style={{
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        borderColor: scrolled ? 'var(--glass-border)' : 'transparent',
      }}
    >
      <div className={`container-custom flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'h-14' : 'h-16'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl border transition-all duration-300"
            style={{
              background: 'var(--accent-glow)',
              borderColor: 'var(--accent)',
            }}
          >
            <Code2 size={20} style={{ color: 'var(--accent)' }} />
          </motion.div>
          <span className="gradient-text font-extrabold tracking-tight">BA</span>
        </Link>

        {/* Desktop Nav with animated pill */}
        <nav className="hidden md:flex items-center gap-0.5 p-1 rounded-2xl"
          style={{ background: 'var(--accent-glow)' }}
        >
          {navLinks.map(({ to, label }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="relative px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 z-10"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'var(--bg-card)',
                      boxShadow: '0 2px 10px var(--accent-glow)',
                      border: '1px solid var(--glass-border)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle with rotation animation */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 180 }}
            className="p-2.5 rounded-xl transition-all duration-300 border"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-color)',
              background: 'var(--bg-card)',
            }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden p-2.5 rounded-xl border"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-color)',
              background: 'var(--bg-card)',
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu — now with stagger + slide animations */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t backdrop-blur-xl"
            style={{ borderColor: 'var(--border-color)', background: 'var(--glass-bg)' }}
          >
            <nav className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500/10 border border-primary-500/20'
                          : 'hover:bg-primary-500/5'
                      }`
                    }
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
