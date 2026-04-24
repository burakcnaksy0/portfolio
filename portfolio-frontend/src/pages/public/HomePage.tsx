// @ts-nocheck
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Code2, Terminal, Sparkles, Github, ExternalLink, Download, Linkedin, Twitter, Phone, GraduationCap, Calendar, Zap, ArrowUpRight } from 'lucide-react';
import { projectApi } from '@/api/project.api';
import { blogApi } from '@/api/blog.api';
import { profileApi } from '@/api/profile.api';
import { educationApi } from '@/api/education.api';
import { PageTransition } from '@/components/ui/PageTransition';
import type { Project, BlogPost, Education } from '@/types';

const fadeUp = {
  hidden:  { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleUp = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export function HomePage() {
  const { data: profileReq } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
  const profile = profileReq?.data?.data;

  const { data: featuredData } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectApi.getFeatured(),
  });

  const { data: blogData } = useQuery({
    queryKey: ['blog', 'latest'],
    queryFn: () => blogApi.getPublished({ size: 3 }),
  });

  const { data: educationData } = useQuery({
    queryKey: ['education'],
    queryFn: educationApi.getEducation,
  });
  const educationList: Education[] = educationData?.data?.data ?? [];

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
    <PageTransition>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 50, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ background: 'var(--orb-1)' }}
          />
          <motion.div
            animate={{
              x: [0, -40, 60, 0],
              y: [0, 60, -20, 0],
              scale: [1, 0.9, 1.15, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: 'var(--orb-2)' }}
          />
          <motion.div
            animate={{
              x: [0, 30, -50, 0],
              y: [0, -50, 30, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'var(--orb-3)' }}
          />

          {/* Floating geometric shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 right-1/4 w-16 h-16 border rounded-xl opacity-[0.06]"
            style={{ borderColor: 'var(--accent)' }}
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 right-[15%] w-3 h-3 rounded-full opacity-20"
            style={{ background: 'var(--gradient-1)' }}
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/3 right-[10%] w-2 h-2 rounded-full opacity-20"
            style={{ background: 'var(--gradient-3)' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 left-[10%] w-24 h-24 border rounded-full opacity-[0.04]"
            style={{ borderColor: 'var(--gradient-3)' }}
          />
        </div>

        <div className="container-custom relative z-10 py-24 lg:py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Status badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-glow)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#10b981' }}
                />
                <span>Available for work</span>
                <Sparkles size={14} />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              <span style={{ color: 'var(--text-primary)' }}>Hi, I'm </span>
              <span className="gradient-text">{profile?.fullName ? profile.fullName.split(' ')[0] : 'a Developer'}</span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ color: 'var(--text-secondary)' }}
                className="text-4xl md:text-5xl font-bold"
              >
                {profile?.title || 'Full-Stack Developer'}
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {profile?.about || 'I build scalable, beautiful web applications using modern technologies. Passionate about clean code, great UX, and open-source.'}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/projects" className="btn-primary text-base px-8 py-4">
                  <Code2 size={18} />
                  View Projects
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
              
              {profile?.cvUrl ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a href={getCvDownloadUrl(profile.cvUrl)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-base px-8 py-4" download="Burakcan_AKSOY_CV.pdf">
                    <Download size={18} />
                    Download CV
                  </a>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/contact" className="btn-secondary text-base px-8 py-4">
                    <Terminal size={18} />
                    Get In Touch
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Social + Tech */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 mt-14">
              <div className="flex gap-3">
                {[
                  { url: profile?.githubUrl, icon: Github },
                  { url: profile?.linkedinUrl, icon: Linkedin },
                  { url: profile?.twitterUrl, icon: Twitter },
                  { url: profile?.phoneNumber ? `tel:${profile.phoneNumber}` : null, icon: Phone },
                ].filter(s => s.url).map(({ url, icon: Icon }, i) => (
                  <motion.a
                    key={i}
                    href={url!}
                    target={url!.startsWith('tel:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
              
              <div className="hidden sm:block w-px h-8 opacity-20" style={{ background: 'var(--text-muted)' }} />
              
              <div className="flex flex-wrap gap-2">
                {['Java', 'Spring Boot', 'React', 'PostgreSQL'].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="badge"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="py-28 relative">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />

          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                  <Zap size={12} />
                  Featured Work
                </div>
                <h2 className="section-title">
                  <span className="gradient-text">Projects</span>
                </h2>
                <p className="section-subtitle mt-2">Things I've built recently</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link to="/projects" className="btn-secondary gap-2 hidden md:flex">
                  All Projects <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProjects.map((project, i) => (
                <motion.div key={project.id} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12 md:hidden">
              <Link to="/projects" className="btn-secondary">
                All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Blog Posts ─────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="py-28 relative">
          <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />

          <div className="container-custom">
            <div className="flex items-end justify-between mb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                  <Sparkles size={12} />
                  Blog
                </div>
                <h2 className="section-title">
                  <span className="gradient-text">Latest Posts</span>
                </h2>
                <p className="section-subtitle mt-2">Thoughts and learnings</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Link to="/blog" className="btn-secondary gap-2 hidden md:flex">
                  All Posts <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {latestPosts.map((post, i) => (
                <motion.div key={post.id} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}

/* ── Project Card with 3D tilt hover ─────────────────────────────────────── */
function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link to={`/projects/${project.slug}`}>
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 600 }}
        className="card h-full flex flex-col overflow-hidden group cursor-pointer"
      >
        {project.imageUrls && project.imageUrls.length > 0 ? (
          <div className="h-48 overflow-hidden relative">
            <img src={project.imageUrls[0]} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium flex items-center gap-1">
                View Project <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--accent-glow), transparent)' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute w-32 h-32 border rounded-full opacity-10"
              style={{ borderColor: 'var(--accent)' }}
            />
            <span className="text-4xl relative z-10">🚀</span>
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
            {project.title}
          </h3>
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
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
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
      </motion.div>
    </Link>
  );
}

/* ── Blog Card ───────────────────────────────────────────────────────────── */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="card h-full flex flex-col overflow-hidden group"
      >
        {post.coverImageUrl && (
          <div className="h-40 overflow-hidden relative">
            <img src={post.coverImageUrl} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="badge text-xs">{tag.name}</span>
            ))}
          </div>
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-sm line-clamp-3 flex-1" style={{ color: 'var(--text-secondary)' }}>{post.summary}</p>
          )}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t text-xs" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
            <span>·</span>
            <span>{post.viewCount} views</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
