// @ts-nocheck
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Code2, Terminal, Sparkles, Github, ExternalLink, Download, Linkedin, Twitter } from 'lucide-react';
import { projectApi } from '@/api/project.api';
import { blogApi } from '@/api/blog.api';
import { profileApi } from '@/api/profile.api';
import type { Project, BlogPost } from '@/types';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function HomePage() {
  const { data: profileReq } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
  const profile = profileReq?.data?.data;
  
  // Debug için (Sadece geliştirme aşamasında console'da veriyi görmek için)
  console.log('Profile Data Loaded:', profile);


  const { data: featuredData } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectApi.getFeatured(),
  });

  const { data: blogData } = useQuery({
    queryKey: ['blog', 'latest'],
    queryFn: () => blogApi.getPublished({ size: 3 }),
  });

  const featuredProjects: Project[] = featuredData?.data?.data ?? [];
  const latestPosts: BlogPost[]     = blogData?.data?.data?.content ?? [];

  const getCvDownloadUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment:Burakcan_AKSOY_CV/');
    }
    return url;
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500 opacity-5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-emerald-500 opacity-5 rounded-full blur-[100px]" />
        </div>

        <div className="container-custom relative z-10 py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-glow)' }}>
                <Sparkles size={14} />
                <span>Available for work</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Hi, I'm <span className="gradient-text">{profile?.fullName ? profile.fullName.split(' ')[0] : 'a Developer'}</span>
              <br />{profile?.title || 'Full-Stack Developer'}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl mb-10 max-w-2xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              {profile?.about || 'I build scalable, beautiful web applications using modern technologies. Passionate about clean code, great UX, and open-source.'}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link to="/projects" className="btn-primary text-base px-8 py-4">
                <Code2 size={18} />
                View Projects
              </Link>
              
              {profile?.cvUrl ? (
                <a href={getCvDownloadUrl(profile.cvUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-base px-8 py-4" download="Burakcan_AKSOY_CV.pdf">
                  <Download size={18} />
                  Download CV
                </a>
              ) : (
                <Link to="/contact" className="btn-secondary text-base px-8 py-4">
                  <Terminal size={18} />
                  Get In Touch
                </Link>
              )}
            </motion.div>

            {/* Social links & Tech stack */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 mt-12">
              <div className="flex gap-4">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    <Github size={24} />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    <Linkedin size={24} />
                  </a>
                )}
                {profile?.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    <Twitter size={24} />
                  </a>
                )}
              </div>
              
              <div className="hidden sm:block w-px h-6 bg-gray-500 opacity-30"></div>
              
              <div className="flex flex-wrap gap-2">
                {['Java', 'Spring Boot', 'React', 'PostgreSQL'].map((tech) => (
                  <span key={tech} className="badge">{tech}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title">Featured Projects</h2>
                <p className="section-subtitle">Things I've built recently</p>
              </div>
              <Link to="/projects" className="btn-secondary gap-2 hidden md:flex">
                All Projects <ArrowRight size={16} />
              </Link>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProjects.map((project) => (
                <motion.div key={project.id} variants={fadeUp}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-10 md:hidden">
              <Link to="/projects" className="btn-secondary">All Projects <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Blog Posts ─────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="py-24">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title">Latest Posts</h2>
                <p className="section-subtitle">Thoughts and learnings</p>
              </div>
              <Link to="/blog" className="btn-secondary gap-2 hidden md:flex">
                All Posts <ArrowRight size={16} />
              </Link>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {latestPosts.map((post) => (
                <motion.div key={post.id} variants={fadeUp}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <div className="card h-full flex flex-col overflow-hidden group">
        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="h-48 overflow-hidden">
            <img src={project.imageUrls[0]} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
          {project.description && (
            <p className="text-sm mb-4 flex-1 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag.id} className="badge text-xs">{tag.name}</span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-primary-400"
                style={{ color: 'var(--text-muted)' }}>
                <Github size={14} /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-accent-400"
                style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={14} /> Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <div className="card h-full flex flex-col overflow-hidden group">
        {post.coverImageUrl && (
          <div className="h-40 overflow-hidden">
            <img src={post.coverImageUrl} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="badge text-xs">{tag.name}</span>
            ))}
          </div>
          <h3 className="font-bold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
          {post.summary && (
            <p className="text-sm line-clamp-3 flex-1" style={{ color: 'var(--text-secondary)' }}>{post.summary}</p>
          )}
          <div className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            {' · '}{post.viewCount} views
          </div>
        </div>
      </div>
    </Link>
  );
}
