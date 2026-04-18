import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { educationApi } from '@/api/education.api';

export function EducationPage() {
  const { data, isLoading } = useQuery({ 
    queryKey: ['education'], 
    queryFn: educationApi.getEducation 
  });
  const educationList = data?.data?.data ?? [];

  return (
    <div className="container-custom py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Education</h1>
        <p className="section-subtitle mb-16">My academic background and qualifications</p>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : educationList.length === 0 ? (
          <div className="text-center py-24">
            <GraduationCap size={48} className="mx-auto mb-4 text-primary-400 opacity-50" />
            <p style={{ color: 'var(--text-muted)' }}>No education records yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'var(--border-color)' }} />

            <div className="space-y-8">
              {educationList.map((edu, i) => (
                <motion.div
                  key={edu.id}
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
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{edu.schoolName}</h3>
                        <p className="font-semibold text-primary-400">{edu.degree} in {edu.department}</p>
                      </div>
                      {edu.current && (
                        <span className="badge bg-accent-500 bg-opacity-20 text-accent-400 border-accent-500">Currently Studying</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>
                          {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          {' — '}
                          {edu.current ? 'Present' : edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : ''}
                        </span>
                      </div>
                      {edu.gpa && (
                        <div className="flex items-center gap-1.5">
                          <Award size={14} />
                          <span>GPA: {edu.gpa.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
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
