import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectApi } from '@/api/project.api';

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
      <div className="skeleton h-64 rounded-2xl mb-8" />
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
    <div className="container-custom py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/projects" className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary-400 transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>



        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{project.title}</h1>
          <div className="flex gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                <Github size={16} /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => <span key={tag.id} className="badge">{tag.name}</span>)}
        </div>

        <div className="flex items-center gap-2 text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        </div>

        {project.description && (
          <div className="prose-custom mb-10">
            <p>{project.description}</p>
          </div>
        )}

        {project.imageUrls && project.imageUrls.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-[500px] group bg-black mt-10 shadow-2xl ring-1 ring-white/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={project.imageUrls[currentImageIndex]}
                alt={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>
            
            {project.imageUrls.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.imageUrls.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
