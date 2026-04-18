import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-20 py-12" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <Code2 size={20} className="text-primary-400" />
              <span className="gradient-text">Burakcan AKSOY</span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Building beautiful and performant web experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['/projects', 'Projects'],
                ['/blog', 'Blog'],
                ['/experience', 'Experience'],
                ['/contact', 'Contact'],
                ['/admin/login', 'Admin Login']
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm transition-colors hover:text-primary-400"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Connect</h3>
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl border transition-all duration-200 hover:border-primary-500 hover:text-primary-400"
                  style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t flex items-center justify-center gap-1 text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <span>© {year} Burakcan AKSOY. Made with</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
        </div>
      </div>
    </footer>
  );
}
