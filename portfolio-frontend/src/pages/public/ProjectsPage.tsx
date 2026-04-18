import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Search } from 'lucide-react';
import { projectApi } from '@/api/project.api';
import { tagApi } from '@/api/tag.api';
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
    <div className="container-custom py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle mb-10">A collection of things I've built</p>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => { setActiveTag(undefined); setPage(0); }}
            className={`badge cursor-pointer transition-all ${!activeTag ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'}`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => { setActiveTag(tag.slug); setPage(0); }}
              className={`badge cursor-pointer transition-all ${activeTag === tag.slug ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'}`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <Search size={48} className="mx-auto mb-4 text-primary-400 opacity-50" />
            <p style={{ color: 'var(--text-muted)' }}>No projects found for this filter.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(total)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  page === i ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <div className="card h-full flex flex-col overflow-hidden group">
        {project.imageUrls && project.imageUrls.length > 0 ? (
          <div className="h-48 overflow-hidden">
            <img src={project.imageUrls[0]} alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-glow), transparent)' }}>
            <span className="text-4xl">🚀</span>
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
      </div>
    </Link>
  );
}
