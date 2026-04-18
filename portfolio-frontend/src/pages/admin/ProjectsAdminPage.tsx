import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Github, ExternalLink, Star, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectApi } from '@/api/project.api';
import { tagApi } from '@/api/tag.api';
import { uploadApi } from '@/api/upload.api';
import type { Project } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  title:       z.string().min(1, 'Title required'),
  description: z.string().optional(),
  githubUrl:   z.string().url('Must be a URL').optional().or(z.literal('')),
  demoUrl:     z.string().url('Must be a URL').optional().or(z.literal('')),
  imageUrls:   z.array(z.string().url()).optional().default([]),
  featured:    z.boolean().optional(),
  displayOrder:z.number().optional(),
  tagIds:      z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

export function ProjectsAdminPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Project | null>(null);
  const [deleteId, setDeleteId]         = useState<number | null>(null);

  const { data }     = useQuery({ queryKey: ['projects', { page: 0, size: 100 }], queryFn: () => projectApi.getAll({ size: 100 }) });
  const { data: tagData } = useQuery({ queryKey: ['tags'], queryFn: tagApi.getAll });
  const projects = data?.data?.data?.content ?? [];
  const tags     = tagData?.data?.data ?? [];

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { imageUrls: [], tagIds: [] }
  });
  const selectedTagIds = watch('tagIds') ?? [];
  const currentImageUrls = watch('imageUrls') ?? [];

  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Project created'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => projectApi.update(id, data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['projects'] }); 
      qc.invalidateQueries({ queryKey: ['project'] }); 
      toast.success('Project updated'); 
      closeModal(); 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); toast.success('Deleted'); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };

  const openEdit = (p: Project) => {
    setEditing(p);
    reset({
      title: p.title, description: p.description ?? '',
      githubUrl: p.githubUrl ?? '', demoUrl: p.demoUrl ?? '',
      imageUrls: p.imageUrls ?? [], featured: p.featured,
      displayOrder: p.displayOrder, tagIds: p.tags.map(t => t.id),
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); reset({}); };

  const onSubmit = (data: FormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading('Uploading Image...');
    try {
      const res = await uploadApi.uploadImage(file);
      setValue('imageUrls', [...currentImageUrls, res.data.data.url]);
      toast.success('Image uploaded', { id: tid });
    } catch {
      toast.error('Image upload failed', { id: tid });
    }
  };

  const removeImage = (index: number) => {
    setValue('imageUrls', currentImageUrls.filter((_, i) => i !== index));
  };

  const toggleTag = (id: number) => {
    const current = selectedTagIds;
    setValue('tagIds', current.includes(id) ? current.filter(t => t !== id) : [...current, id]);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Projects</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{projects.length} total</p>
          </div>
          <button onClick={openCreate} className="btn-primary" id="create-project-btn">
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Projects Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--border-color)' }}>
                  {['Title','Tags','Featured','Links','Actions'].map(h => (
                    <th key={h} className="px-6 py-4 font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b transition-colors hover:bg-opacity-5 hover:bg-primary-500"
                    style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrls && p.imageUrls.length > 0 && <img src={p.imageUrls[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map(t => <span key={t.id} className="badge text-xs">{t.name}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.featured && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={16} style={{ color: 'var(--text-muted)' }} /></a>}
                        {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} style={{ color: 'var(--text-muted)' }} /></a>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg transition-colors hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-400" style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg transition-colors hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400" style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No projects yet. Create one!</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {editing ? 'Edit Project' : 'New Project'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input {...register('title')} className="input-field" placeholder="Project title" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea {...register('description')} rows={4} className="input-field resize-none" placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>GitHub URL</label>
                  <input {...register('githubUrl')} className="input-field" placeholder="https://github.com/..." />
                  {errors.githubUrl && <p className="text-red-400 text-xs mt-1">{errors.githubUrl.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Demo URL</label>
                  <input {...register('demoUrl')} className="input-field" placeholder="https://demo.com" />
                  {errors.demoUrl && <p className="text-red-400 text-xs mt-1">{errors.demoUrl.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Project Images</label>
                <div className="flex flex-col gap-3">
                  {currentImageUrls.map((url, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={url} readOnly className="input-field flex-1 text-xs" />
                      <img src={url} alt="" className="w-8 h-8 rounded object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <label className="btn-secondary flex items-center justify-center cursor-pointer px-4 text-sm w-full border-dashed border-2">
                      <Upload size={16} /> Upload New Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input {...register('featured')} type="checkbox" id="featured" className="w-4 h-4 rounded" />
                <label htmlFor="featured" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured project</label>
              </div>
              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                        className={`badge cursor-pointer transition-all ${selectedTagIds.includes(tag.id) ? 'ring-2 ring-primary-500' : 'opacity-60'}`}>
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isBusy} className="btn-primary flex-1">
                  {isBusy ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card p-8 max-w-sm w-full text-center">
            <Trash2 size={40} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Project?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}
                className="btn-primary flex-1 bg-red-500 hover:bg-red-600" style={{ background: '#ef4444' }}>
                {deleteMutation.isPending ? '...' : 'Delete'}
              </button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
