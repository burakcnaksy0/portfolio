import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import { experienceApi } from '@/api/experience.api';

export function ExperiencePage() {
  const { data, isLoading } = useQuery({ queryKey: ['experiences'], queryFn: experienceApi.getAll });
  const experiences = data?.data?.data ?? [];

  return (
    <div className="container-custom py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Experience</h1>
        <p className="section-subtitle mb-16">My professional journey</p>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-24">
            <Briefcase size={48} className="mx-auto mb-4 text-primary-400 opacity-50" />
            <p style={{ color: 'var(--text-muted)' }}>No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'var(--border-color)' }} />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 w-4 h-4 rounded-full border-2 border-primary-500 bg-primary-500 bg-opacity-20 z-10"
                    style={{ transform: 'translateX(-50%)' }} />

                  <div className="card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{exp.position}</h3>
                        <p className="font-semibold text-primary-400">{exp.company}</p>
                      </div>
                      {exp.current && (
                        <span className="badge bg-accent-500 bg-opacity-20 text-accent-400 border-accent-500">Current</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' — '}
                          {exp.current ? 'Present' : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : ''}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
