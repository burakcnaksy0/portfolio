import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Search, FolderKanban, ArrowUpRight } from 'lucide-react';
import { projectApi } from '@/api/project.api';
import { tagApi } from '@/api/tag.api';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Project } from '@/types';

export function ProjectsPage() {
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: tagsData } = useQuery({ queryKey: ['tags'], queryFn: tagApi.getAll });
  const { data, isLoading } = useQuery({
    queryKey: ['projects', { tag: activeTag, page }],
    queryFn: () => projectApi.getAll({ tag: activeTag, page, size: 9 }),
  });

  const tags     = tagsData?.data?.data ?? [];
  const projects = data?.data?.data?.content ?? [];
  const total    = data?.data?.data?.totalPages ?? 0;

  return (
    <PageTransition>
      <div className="container-custom py-16">
        <SectionHeader
          title="Projects"
          subtitle="A collection of things I've built"
          icon={<><FolderKanban size={14} /><span className="text-sm font-medium">Portfolio</span></>}
        />

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTag(undefined); setPage(0); }}
            className={`badge cursor-pointer transition-all ${!activeTag ? 'ring-2 ring-primary-500 shadow-glow-sm' : 'opacity-60 hover:opacity-100'}`}
          >
            All
          </motion.button>
          {tags.map((tag) => (
            <motion.button
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTag(tag.slug); setPage(0); }}
              className={`badge cursor-pointer transition-all ${activeTag === tag.slug ? 'ring-2 ring-primary-500 shadow-glow-sm' : 'opacity-60 hover:opacity-100'}`}
            >
              {tag.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <Search size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--accent)' }} />
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No projects found for this filter.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 0.5 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-2 mt-14"
          >
            {[...Array(total)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  page === i ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-4, 4]), { stiffness: 300, damping: 30 });

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
        className="card h-full flex flex-col overflow-hidden group"
      >
        {project.imageUrls && project.imageUrls.length > 0 ? (
          <div className="h-48 overflow-hidden relative">
            <img src={project.imageUrls[0]} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <span className="text-white text-sm font-medium flex items-center gap-1">
                View Project <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-glow), transparent)' }}>
            <span className="text-4xl">🚀</span>
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300"
            style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
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
                className="flex items-center gap-1.5 text-xs font-medium hover:text-primary-400 transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                <Github size={14} /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium hover:text-accent-400 transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
