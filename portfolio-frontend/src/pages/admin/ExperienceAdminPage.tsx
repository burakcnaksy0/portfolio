import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { experienceApi } from '@/api/experience.api';
import type { Experience } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  company:      z.string().min(1, 'Required'),
  position:     z.string().min(1, 'Required'),
  description:  z.string().optional(),
  startDate:    z.string().min(1, 'Required'),
  endDate:      z.string().optional(),
  current:      z.boolean().optional(),
  location:     z.string().optional(),
  companyLogoUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export function ExperienceAdminPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Experience | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const { data } = useQuery({ queryKey: ['experiences'], queryFn: experienceApi.getAll });
  const experiences = data?.data?.data ?? [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: experienceApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Created'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => experienceApi.update(id, data as Parameters<typeof experienceApi.update>[1]),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Updated'); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: experienceApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['experiences'] }); toast.success('Deleted'); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit   = (e: Experience) => {
    setEditing(e);
    reset({ company: e.company, position: e.position, description: e.description ?? '',
      startDate: e.startDate, endDate: e.endDate ?? '', current: e.current,
      location: e.location ?? '', companyLogoUrl: e.companyLogoUrl ?? '', displayOrder: e.displayOrder });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); reset({}); };

  const onSubmit = (data: FormData) => {
    const payload = { ...data, startDate: data.startDate, company: data.company, position: data.position };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload });
    else createMutation.mutate(payload as Parameters<typeof experienceApi.create>[0]);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Experience</h1>
          <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add</button>
        </div>

        <div className="space-y-4">
          {experiences.length === 0 && (
            <div className="text-center py-16 card">
              <Briefcase size={48} className="mx-auto mb-4 text-primary-400 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>No experiences yet</p>
            </div>
          )}
          {experiences.map((exp) => (
            <div key={exp.id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{exp.position} @ {exp.company}</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate ?? ''}
                  {exp.location && ` · ${exp.location}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(exp)} className="p-2 rounded-lg hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(exp.id)} className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Experience</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Company *</label>
                  <input {...register('company')} className="input-field" />
                  {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Position *</label>
                  <input {...register('position')} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Start Date *</label>
                  <input {...register('startDate')} type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>End Date</label>
                  <input {...register('endDate')} type="date" className="input-field" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input {...register('current')} type="checkbox" id="current" className="w-4 h-4" />
                <label htmlFor="current" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Currently working here</label>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Location</label>
                <input {...register('location')} className="input-field" placeholder="Istanbul, TR" />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea {...register('description')} rows={4} className="input-field resize-none" />
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
            <p className="mb-6 font-medium" style={{ color: 'var(--text-primary)' }}>Delete this experience?</p>
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
