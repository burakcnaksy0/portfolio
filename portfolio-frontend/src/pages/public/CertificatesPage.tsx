import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { certificateApi } from '@/api/certificate.api';

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
    <div className="container-custom py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Certificates</h1>
        <p className="section-subtitle mb-12">Credentials and achievements</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-24">
            <Award size={48} className="mx-auto mb-4 text-primary-400 opacity-50" />
            <p style={{ color: 'var(--text-muted)' }}>No certificates yet.</p>
          </div>
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
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="card p-6 flex flex-col h-full">
                  {cert.imageUrl && (
                    <div className="h-32 rounded-xl overflow-hidden mb-4">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{cert.title}</h3>
                    <p className="text-sm font-medium text-primary-400 mb-2">{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={getCertificateDownloadUrl(cert.credentialUrl, cert.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                      download={`${cert.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate`}
                    >
                      <ExternalLink size={14} /> View Credential
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
