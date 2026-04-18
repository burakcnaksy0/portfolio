import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Heart, Mail, ExternalLink, Globe, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile.api';

export function Footer() {
  const { data: profileReq } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
  const profile = profileReq?.data?.data as any;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-16 pb-8 border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'var(--bg-secondary)' }}>
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6 group">
              <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20 group-hover:border-primary-500/50 transition-colors">
                <Code2 size={24} className="text-primary-400" />
              </div>
              <span className="gradient-text">Burakcan AKSOY</span>
            </Link>
            <p className="text-base leading-relaxed mb-8 max-w-sm opacity-80" style={{ color: 'var(--text-secondary)' }}>
              {profile?.about?.substring(0, 150)}...
            </p>
            <div className="flex items-center gap-4">
               {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" 
                  aria-label="GitHub"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Github size={22} />
                </a>
               )}
               {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                  aria-label="LinkedIn"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Linkedin size={22} />
                </a>
               )}
               {profile?.email && (
                <a href={`mailto:${profile.email}`} 
                  aria-label="Email"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Mail size={22} />
                </a>
               )}
               {profile?.phoneNumber && (
                <a href={`tel:${profile.phoneNumber}`} 
                  aria-label="Phone"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Phone size={22} />
                </a>
               )}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-3 lg:col-start-7 text-center lg:text-left">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8 opacity-50" style={{ color: 'var(--text-primary)' }}>
              Navigation
            </h3>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-4">
              {[
                ['/projects', 'Projects'],
                ['/blog', 'Articles'],
                ['/experience', 'Career'],
                ['/certificates', 'Awards'],
                ['/contact', 'Contact'],
                ['/admin/login', 'Admin Dashboard']
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-base lg:text-sm font-medium transition-colors hover:text-primary-400 flex items-center justify-center lg:justify-start gap-2 group"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span className="hidden lg:block w-1.5 h-1.5 rounded-full bg-primary-500/20 group-hover:bg-primary-400 transition-colors"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status/Location Column */}
          <div className="lg:col-span-2 text-center lg:text-left">
             <h3 className="text-sm font-bold uppercase tracking-widest mb-8 opacity-50" style={{ color: 'var(--text-primary)' }}>
              Location
            </h3>
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="flex items-center gap-2 text-base lg:text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Globe size={18} className="text-primary-400" />
                <span>Istanbul, Turkey</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Available for New Projects
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span>© {year}</span>
            <span className="font-semibold text-primary-400">Burakcan Aksoy</span>
            <span className="hidden md:inline mx-1">|</span>
            <span className="opacity-70">Software Engineer</span>
          </div>
          
          <div className="flex items-center gap-1.5 opacity-80 bg-white/5 px-4 py-2 rounded-full">
            <span>Crafted with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by Burakcan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
