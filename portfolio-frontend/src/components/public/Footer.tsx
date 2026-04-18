import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Heart, Mail, ExternalLink, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile.api';

export function Footer() {
  const { data: profileReq } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
  const profile = profileReq?.data?.data as any; // Cast as any to bypass build errors for now
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-20 pb-10 border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'var(--bg-secondary)' }}>
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6 group">
              <div className="p-2 rounded-xl bg-primary-500/10 border border-primary-500/20 group-hover:border-primary-500/50 transition-colors">
                <Code2 size={24} className="text-primary-400" />
              </div>
              <span className="gradient-text">Burakcan AKSOY</span>
            </Link>
            <p className="text-base leading-relaxed mb-8 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              Software Engineer passionate about building scalable web applications and distributed systems. 
              Always striving for clean code and exceptional user experiences.
            </p>
            <div className="flex items-center gap-3">
               {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Github size={20} />
                </a>
               )}
               {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Linkedin size={20} />
                </a>
               )}
               {profile?.email && (
                <a href={`mailto:${profile.email}`} 
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300">
                  <Mail size={20} />
                </a>
               )}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50" style={{ color: 'var(--text-primary)' }}>
              Navigation
            </h3>
            <ul className="grid grid-cols-1 gap-4">
              {[
                ['/projects', 'Projects'],
                ['/blog', 'Articles'],
                ['/experience', 'Career'],
                ['/certificates', 'Awards'],
                ['/contact', 'Contact']
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm font-medium transition-colors hover:text-primary-400 flex items-center gap-2 group"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/20 group-hover:bg-primary-400 transition-colors"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Column */}
          <div className="md:col-span-2">
             <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50" style={{ color: 'var(--text-primary)' }}>
              Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Available for hire
              </div>
              <Link to="/admin/login" className="inline-flex items-center gap-2 text-xs py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={12} /> Admin Login
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <span className="opacity-60">© {year} Built with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-bounce" />
            <span className="font-semibold text-primary-400">Burakcan Aksoy</span>
          </div>
          
          <div className="flex items-center gap-6 opacity-60">
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>Istanbul, Turkey</span>
            </div>
            <span>v1.0.5 Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
