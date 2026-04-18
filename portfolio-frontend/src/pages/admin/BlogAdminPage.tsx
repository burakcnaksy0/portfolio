import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { blogApi } from '@/api/blog.api';
import { tagApi } from '@/api/tag.api';
import { uploadApi } from '@/api/upload.api';
import type { BlogPost } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  title:         z.string().min(1, 'Title required'),
  summary:       z.string().optional(),
  content:       z.string().min(1, 'Content required'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  published:     z.boolean().optional(),
  tagIds:        z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

export function BlogAdminPage() {
  const qc = useQueryClient();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [page, setPage]           = useState(0);

  const { data }     = useQuery({ queryKey: ['blog-admin', page], queryFn: () => blogApi.getAllAdmin({ page, size: 15 }) });
  const { data: tagData } = useQuery({ queryKey: ['tags'], queryFn: tagApi.getAll });
  const posts   = data?.data?.data?.content ?? [];
  const total   = data?.data?.data?.totalPages ?? 0;
  const tags    = tagData?.data?.data ?? [];

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const selectedTagIds = watch('tagIds') ?? [];

  const createMutation = useMutation({
    mutationFn: blogApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); toast.success('Post created'); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => blogApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); toast.success('Post updated'); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog-admin'] }); toast.success('Deleted'); setDeleteId(null); },
  });

  const coverUploadMutation = useMutation({
    mutationFn: uploadApi.uploadImage,
    onSuccess: (res) => {
      setValue('coverImageUrl', res.data.data.url);
      toast.success('Cover image uploaded');
    },
    onError: () => toast.error('Upload failed')
  });

  const contentUploadMutation = useMutation({
    mutationFn: uploadApi.uploadImage,
    onSuccess: (res) => {
      const url = res.data.data.url;
      const current = watch('content') || '';
      setValue('content', current + `\n![image](${url})\n`);
      toast.success('Image inserted');
    },
    onError: () => toast.error('Upload failed')
  });

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true); };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    reset({
      title: p.title, summary: p.summary ?? '',
      content: p.content, coverImageUrl: p.coverImageUrl ?? '',
      published: p.published, tagIds: p.tags.map(t => t.id),
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); reset({}); };

  const onSubmit = (data: FormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
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
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Blog Posts</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{posts.length} items</p>
          </div>
          <button onClick={openCreate} className="btn-primary" id="create-blog-btn">
            <Plus size={18} /> New Post
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--border-color)' }}>
                  {['Title','Tags','Status','Views','Date','Actions'].map(h => (
                    <th key={h} className="px-6 py-4 font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b transition-all hover:bg-primary-500 hover:bg-opacity-5"
                    style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-6 py-4">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map(t => <span key={t.id} className="badge text-xs">{t.name}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.published
                        ? <span className="flex items-center gap-1 text-accent-400 text-xs"><Eye size={12} /> Published</span>
                        : <span className="flex items-center gap-1 text-yellow-400 text-xs"><EyeOff size={12} /> Draft</span>
                      }
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>{p.viewCount}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary-500 hover:bg-opacity-10 hover:text-primary-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto mb-4 text-primary-400 opacity-30" />
                <p style={{ color: 'var(--text-muted)' }}>No posts yet</p>
              </div>
            )}
          </div>
        </div>

        {total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(total)].map((_,i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl ${page===i ? 'btn-primary' : 'btn-secondary'}`}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              {editing ? 'Edit Post' : 'New Post'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
                <input {...register('title')} className="input-field" placeholder="Post title" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Summary</label>
                <textarea {...register('summary')} rows={2} className="input-field resize-none" placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Cover Image URL</label>
                <div className="flex gap-2">
                  <input {...register('coverImageUrl')} className="input-field flex-1" placeholder="https://..." />
                  <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) coverUploadMutation.mutate(file);
                  }} />
                  <button type="button" onClick={() => coverInputRef.current?.click()} className="btn-secondary whitespace-nowrap" disabled={coverUploadMutation.isPending}>
                    {coverUploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Content (Markdown) *</label>
                  <input type="file" accept="image/*" ref={contentInputRef} className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) contentUploadMutation.mutate(file);
                  }} />
                  <button type="button" onClick={() => contentInputRef.current?.click()} className="text-xs btn-secondary py-1 px-2 h-auto" disabled={contentUploadMutation.isPending}>
                    {contentUploadMutation.isPending ? '...' : '+ Insert Image'}
                  </button>
                </div>
                <textarea {...register('content')} rows={14}
                  className="input-field resize-none font-mono text-sm"
                  placeholder="Write your post in Markdown..." />
                {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
              </div>
              <div className="flex items-center gap-3">
                <input {...register('published')} type="checkbox" id="published" className="w-4 h-4" />
                <label htmlFor="published" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Publish immediately</label>
              </div>
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
                  {isBusy ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Post'}
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 max-w-sm w-full text-center">
            <Trash2 size={40} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Delete Post?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}
                className="btn-primary flex-1" style={{ background: '#ef4444' }}>
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
