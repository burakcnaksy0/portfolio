import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Download } from 'lucide-react';
import { certificateApi } from '@/api/certificate.api';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function CertificatesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['certificates'], queryFn: certificateApi.getAll });
  const certificates = data?.data?.data ?? [];

  const getCertificateDownloadUrl = (url: string, title: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
      return url.replace('/upload/', `/upload/fl_attachment:${cleanTitle}_Certificate/`);
    }
    return url;
  };

  return (
    <PageTransition>
      <div className="container-custom py-16">
        <SectionHeader
          title="Certificates"
          subtitle="Credentials and achievements"
          icon={<><Award size={14} /><span className="text-sm font-medium">Achievements</span></>}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
          </div>
        ) : certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <Award size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--accent)' }} />
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No certificates yet.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card p-6 flex flex-col h-full group"
                >
                  {cert.imageUrl && (
                    <div className="h-36 rounded-xl overflow-hidden mb-4 relative">
                      <img src={cert.imageUrl} alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300"
                      style={{ color: 'var(--text-primary)' }}>{cert.title}</h3>
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <motion.a
                      href={getCertificateDownloadUrl(cert.credentialUrl, cert.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center gap-2 mt-4 pt-3 border-t text-sm font-medium transition-colors hover:text-primary-300"
                      style={{ color: 'var(--accent)', borderColor: 'var(--border-color)' }}
                      download={`${cert.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate`}
                    >
                      <Download size={14} /> View Credential
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
