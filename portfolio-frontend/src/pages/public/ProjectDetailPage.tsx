import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectApi } from '@/api/project.api';
import { PageTransition } from '@/components/ui/PageTransition';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const project = data?.data?.data;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (!project?.imageUrls) return;
    const len = project.imageUrls.length;
    setCurrentImageIndex((prev) => (prev === len - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!project?.imageUrls) return;
    const len = project.imageUrls.length;
    setCurrentImageIndex((prev) => (prev === 0 ? len - 1 : prev - 1));
  };

  if (isLoading) return (
    <div className="container-custom py-16">
      <div className="skeleton h-8 w-48 mb-8 rounded-lg" />
      <div className="skeleton h-72 rounded-2xl mb-8" />
      <div className="space-y-3">
        {[...Array(5)].map((_,i) => <div key={i} className="skeleton h-4 rounded" />)}
      </div>
    </div>
  );

  if (isError || !project) return (
    <div className="container-custom py-16 text-center">
      <p style={{ color: 'var(--text-muted)' }}>Project not found.</p>
      <Link to="/projects" className="btn-primary mt-6 inline-flex">Back to Projects</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="container-custom py-16 max-w-4xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/projects" className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all hover:gap-3"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            <span className="gradient-text">{project.title}</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            {project.githubUrl && (
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Github size={16} /> GitHub
              </motion.a>
            )}
            {project.demoUrl && (
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={16} /> Live Demo
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {project.tags.map((tag) => <span key={tag.id} className="badge">{tag.name}</span>)}
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 text-sm mb-10"
          style={{ color: 'var(--text-muted)' }}
        >
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        </motion.div>

        {/* Description */}
        {project.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose-custom mb-10"
          >
            <p>{project.description}</p>
          </motion.div>
        )}

        {/* Image Carousel */}
        {project.imageUrls && project.imageUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-2xl overflow-hidden h-72 md:h-[500px] group mt-10"
            style={{
              background: 'var(--bg-card)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 30px var(--accent-glow)',
              border: '1px solid var(--border-color)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={project.imageUrls[currentImageIndex]}
                alt={project.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
            
            {project.imageUrls.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronRight size={20} />
                </motion.button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.imageUrls.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      whileHover={{ scale: 1.3 }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex
                          ? 'w-6 bg-white'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
