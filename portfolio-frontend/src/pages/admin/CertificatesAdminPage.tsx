import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Award, ExternalLink, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificateApi } from '@/api/certificate.api';
import { uploadApi } from '@/api/upload.api';
import type { Certificate } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  title:         z.string().min(1, 'Required'),
  issuer:        z.string().min(1, 'Required'),
  issueDate:     z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  imageUrl:      z.string().url().optional().or(z.literal('')),
  displayOrder:  z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export function CertificatesAdminPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Certificate | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const { data } = useQuery({ queryKey: ['certificates'], queryFn: certificateApi.getAll });
  const certs = data?.data?.data ?? [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: certificateApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['certificates'] }); toast.success('Created'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => certificateApi.update(id, data as Parameters<typeof certificateApi.update>[1]),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['certificates'] }); toast.success('Updated'); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: certificateApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['certificates'] }); toast.success('Deleted'); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit   = (c: Certificate) => {
    setEditing(c);
    reset({ title: c.title, issuer: c.issuer, issueDate: c.issueDate ?? '',
      credentialUrl: c.credentialUrl ?? '', imageUrl: c.imageUrl ?? '', displayOrder: c.displayOrder });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); reset({}); };

  const onSubmit = (data: FormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data as Parameters<typeof certificateApi.create>[0]);
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading('Uploading PDF...');
    try {
      const res = await uploadApi.uploadPdf(file);
      setValue('credentialUrl', res.data.data.url);
      toast.success('PDF uploaded', { id: tid });
    } catch {
      toast.error('PDF upload failed', { id: tid });
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading('Uploading image...');
    try {
      const res = await uploadApi.uploadImage(file);
      setValue('imageUrl', res.data.data.url);
      toast.success('Image uploaded', { id: tid });
    } catch {
      toast.error('Image upload failed', { id: tid });
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Certificates</h1>
          <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.length === 0 && (
            <div className="col-span-full text-center py-16 card">
              <Award size={48} className="mx-auto mb-4 text-primary-400 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>No certificates yet</p>
            </div>
          )}
          {certs.map((cert) => (
            <div key={cert.id} className="card p-5 flex flex-col">
              {cert.imageUrl && <img src={cert.imageUrl} alt={cert.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{cert.title}</div>
              <div className="text-sm text-primary-400 mt-1">{cert.issuer}</div>
              {cert.issueDate && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{cert.issueDate}</div>}
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-2 text-primary-400 hover:text-primary-300">
                  <ExternalLink size={12} /> View
                </a>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(cert)} className="btn-secondary text-xs flex-1 py-2"><Pencil size={14} /> Edit</button>
                <button onClick={() => setDeleteId(cert.id)} className="text-xs flex-1 py-2 rounded-xl border border-red-500 border-opacity-30 text-red-400 hover:bg-red-500 hover:bg-opacity-10 transition-colors"><Trash2 size={14} className="inline mr-1" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Certificate</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input {...register('title')} className="input-field" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Issuer *</label>
                <input {...register('issuer')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Issue Date</label>
                <input {...register('issueDate')} type="date" className="input-field" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Credential URL (or upload PDF)</label>
                <div className="flex gap-2">
                  <input {...register('credentialUrl')} className="input-field flex-1" placeholder="https://..." />
                  <label className="btn-secondary flex items-center justify-center cursor-pointer px-4">
                    <Upload size={16} />
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleUploadPdf} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Image URL (or upload Image)</label>
                <div className="flex gap-2">
                  <input {...register('imageUrl')} className="input-field flex-1" placeholder="https://..." />
                  <label className="btn-secondary flex items-center justify-center cursor-pointer px-4">
                    <Upload size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isBusy} className="btn-primary flex-1">{isBusy ? '...' : 'Save'}</button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 max-w-sm w-full text-center">
            <p className="mb-6 font-medium" style={{ color: 'var(--text-primary)' }}>Delete certificate?</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} className="btn-primary flex-1" style={{ background: '#ef4444' }}>Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
