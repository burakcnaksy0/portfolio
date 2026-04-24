import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Code2, Heart, Mail, ExternalLink, Globe, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile.api';

const socialIcons = [
  { key: 'github',   icon: Github,   field: 'githubUrl' },
  { key: 'linkedin', icon: Linkedin, field: 'linkedinUrl' },
  { key: 'email',    icon: Mail,     field: 'email',     prefix: 'mailto:' },
  { key: 'phone',    icon: Phone,    field: 'phoneNumber', prefix: 'tel:' },
];

const footerLinks = [
  ['/projects',    'Projects'],
  ['/blog',        'Articles'],
  ['/experience',  'Career'],
  ['/certificates','Awards'],
  ['/contact',     'Contact'],
  ['/admin/login', 'Admin'],
];

export function Footer() {
  const { data: profileReq } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
  const profile = profileReq?.data?.data as any;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden z-10" style={{ background: 'var(--bg-secondary)' }}>
      {/* Animated gradient top border */}
      <div className="gradient-divider" />

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'var(--orb-1)', filter: 'blur(120px)' }} />
      <div className="absolute top-1/2 left-0 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'var(--orb-2)', filter: 'blur(100px)' }} />

      <div className="container-custom relative z-10 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-2xl mb-6 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="p-2 rounded-xl border transition-all duration-300"
                style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}
              >
                <Code2 size={24} style={{ color: 'var(--accent)' }} />
              </motion.div>
              <span className="gradient-text font-extrabold">Burakcan AKSOY</span>
            </Link>
            <p className="text-base leading-relaxed mb-8 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              {profile?.about?.substring(0, 120)}...
            </p>

            {/* Social icons with hover lift */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ key, icon: Icon, field, prefix }) => {
                const value = profile?.[field];
                if (!value) return null;
                const href = prefix ? `${prefix}${value}` : value;
                return (
                  <motion.a
                    key={key}
                    href={href}
                    target={prefix ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={key}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 lg:col-start-7 text-center lg:text-left">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--text-muted)' }}>
              Navigation
            </h3>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {footerLinks.map(([href, label]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm font-medium transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-150"
                      style={{ background: 'var(--accent)' }} />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status/Location Column */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--text-muted)' }}>
              Status
            </h3>
            <div className="flex flex-col items-center lg:items-start gap-5">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Globe size={16} style={{ color: 'var(--accent)' }} />
                <span>Istanbul, Turkey</span>
              </div>
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 15px rgba(16,185,129,0.2)', '0 0 0px rgba(16,185,129,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#34d399',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open to work
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="gradient-divider mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm"
          style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <span>© {year}</span>
            <span className="font-semibold gradient-text">Burakcan Aksoy</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">Software Engineer</span>
          </div>
          <div className="flex items-center gap-1 text-xs opacity-60">
            <span>Built with</span>
            <Heart size={12} className="text-red-400" />
            <span>& lots of coffee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
