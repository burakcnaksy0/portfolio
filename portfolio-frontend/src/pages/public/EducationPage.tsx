import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { educationApi } from '@/api/education.api';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function EducationPage() {
  const { data, isLoading } = useQuery({ 
    queryKey: ['education'], 
    queryFn: educationApi.getEducation 
  });
  const educationList = data?.data?.data ?? [];

  return (
    <PageTransition>
      <div className="container-custom py-16">
        <SectionHeader
          title="Education"
          subtitle="My academic background and qualifications"
          icon={<><GraduationCap size={14} /><span className="text-sm font-medium">Academics</span></>}
        />

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : educationList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <GraduationCap size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--accent)' }} />
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No education records yet.</p>
          </motion.div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Animated timeline line */}
            <div className="timeline-line" />

            <div className="space-y-10">
              {educationList.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative pl-16"
                >
                  {/* Animated timeline dot */}
                  <div className="timeline-dot" />

                  <motion.div
                    whileHover={{ x: 4 }}
                    className="card p-6 hover:shadow-glow transition-all duration-500"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{edu.schoolName}</h3>
                        <p className="font-semibold gradient-text">{edu.degree} in {edu.department}</p>
                      </div>
                      {edu.current && (
                        <motion.span
                          animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 12px rgba(16,185,129,0.3)', '0 0 0px rgba(16,185,129,0)'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="badge"
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', borderColor: '#34d399' }}
                        >
                          Currently Studying
                        </motion.span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} style={{ color: 'var(--accent)' }} />
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
                          <Award size={14} style={{ color: 'var(--accent)' }} />
                          <span className="font-medium">
                            GPA: <span className="gradient-text font-bold">{edu.gpa.toFixed(2)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
