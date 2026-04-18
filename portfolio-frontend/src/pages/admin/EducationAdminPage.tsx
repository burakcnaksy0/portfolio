import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { educationApi } from '@/api/education.api';
import type { Education } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  schoolName:   z.string().min(1, 'Required'),
  department:   z.string().min(1, 'Required'),
  degree:       z.string().min(1, 'Required'),
  gpa:          z.number().optional().or(z.literal(0)).or(z.null()),
  startDate:    z.string().min(1, 'Required'),
  endDate:      z.string().optional().or(z.literal('')),
  current:      z.boolean().optional(),
  displayOrder: z.number().optional().default(0),
});

type FormData = z.infer<typeof schema>;

export function EducationAdminPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Education | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);

  const { data } = useQuery({ 
    queryKey: ['education'], 
    queryFn: educationApi.getEducation 
  });
  const educationList = data?.data?.data ?? [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: educationApi.createEducation,
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['education'] }); 
      toast.success('Education record created'); 
      closeModal(); 
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => educationApi.updateEducation(id, data as any),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['education'] }); 
      toast.success('Education record updated'); 
      closeModal(); 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: educationApi.deleteEducation,
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['education'] }); 
      toast.success('Education record deleted'); 
      setDeleteId(null); 
    },
  });

  const openCreate = () => { setEditing(null); reset({ current: false, displayOrder: 0 }); setModalOpen(true); };
  const openEdit   = (e: Education) => {
    setEditing(e);
    reset({ 
      schoolName: e.schoolName, 
      department: e.department, 
      degree: e.degree,
      gpa: e.gpa || 0,
      startDate: e.startDate, 
      endDate: e.endDate ?? '', 
      current: e.current,
      displayOrder: e.displayOrder ?? 0
    });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); reset({}); };

  const onSubmit = (data: FormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data as any);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Education</h1>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Education
          </button>
        </div>

        <div className="space-y-4">
          {educationList.length === 0 && (
            <div className="text-center py-16 card">
              <GraduationCap size={48} className="mx-auto mb-4 text-primary-400 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>No education records yet</p>
            </div>
          )}
          {educationList.map((edu) => (
            <div key={edu.id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                   <GraduationCap size={16} className="text-primary-400" />
                   {edu.schoolName}
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {edu.degree} in {edu.department}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {edu.startDate} — {edu.current ? 'Present' : edu.endDate ?? ''}
                  {edu.gpa && edu.gpa > 0 && ` · GPA: ${edu.gpa}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(edu)} className="p-2 rounded-lg hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Pencil size={16} /></button>
                <button onClick={() => setDeleteId(edu.id)} className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 overflow-hidden backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{editing ? 'Edit' : 'Add'} Education</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>School Name *</label>
                <input {...register('schoolName')} className="input-field" placeholder="Istanbul Technical University" />
                {errors.schoolName && <p className="text-red-400 text-xs mt-1">{errors.schoolName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Degree *</label>
                  <input {...register('degree')} className="input-field" placeholder="Bachelor's" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Department *</label>
                  <input {...register('department')} className="input-field" placeholder="Computer Science" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>GPA (Optional)</label>
                  <input {...register('gpa', { valueAsNumber: true })} type="number" step="0.01" className="input-field" placeholder="3.50" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Display Order</label>
                  <input {...register('displayOrder', { valueAsNumber: true })} type="number" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Start Date *</label>
                  <input {...register('startDate')} type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>End Date</label>
                  <input {...register('endDate')} type="date" className="input-field" disabled={editing?.current} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input {...register('current')} type="checkbox" id="edu-current" className="w-4 h-4 cursor-pointer" />
                <label htmlFor="edu-current" className="text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Currently studying here</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isBusy} className="btn-primary flex-1">{isBusy ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 max-w-sm w-full text-center">
            <p className="mb-6 font-medium text-lg" style={{ color: 'var(--text-primary)' }}>Are you sure you want to delete this record?</p>
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
