import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileApi, ProfileData } from '@/api/profile.api';
import { uploadApi } from '@/api/upload.api';
import { useEffect } from 'react';

const schema = z.object({
  fullName: z.string().optional(),
  title: z.string().optional(),
  about: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  gitlabUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().url().optional().or(z.literal('')),
  publicEmail: z.string().email().optional().or(z.literal('')),
  phoneNumber: z.string().optional()
});

export function ProfileAdminPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile
  });
  const profile = data?.data?.data;

  const { register, handleSubmit, reset, setValue } = useForm<ProfileData>({
    resolver: zodResolver(schema),
    defaultValues: profile || {}
  });

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    }
  });

  const handleUploadCv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading('Uploading CV...');
    try {
      const res = await uploadApi.uploadPdf(file);
      setValue('cvUrl', res.data.data.url);
      toast.success('CV uploaded', { id: tid });
    } catch {
      toast.error('CV upload failed', { id: tid });
    }
  };

  const onSubmit = (formData: ProfileData) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Personal Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your personal details and social presence.</p>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={updateMutation.isPending} className="btn-primary flex items-center gap-2">
          <Save size={18} /> {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="card p-8">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input {...register('fullName')} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title / Tagline</label>
              <input {...register('title')} className="input-field" placeholder="Full-Stack Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Public Email (Contact)</label>
              <input {...register('publicEmail')} className="input-field" placeholder="hello@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
              <input {...register('phoneNumber')} className="input-field" placeholder="+90 5XX XXX XX XX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>CV / Resume URL (or upload PDF)</label>
              <div className="flex gap-2">
                <input {...register('cvUrl')} className="input-field flex-1" placeholder="https://..." />
                <label className="btn-secondary flex items-center justify-center cursor-pointer px-4 relative overflow-hidden" title="Upload CV PDF">
                  <Upload size={18} />
                  <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUploadCv} />
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>About Me</label>
            <textarea {...register('about')} className="input-field resize-y" rows={8} placeholder="Write a brief bio..." />
          </div>

          <h3 className="text-xl font-semibold border-b pb-3 pt-6" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>LinkedIn URL</label>
              <input {...register('linkedinUrl')} className="input-field" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>GitHub URL</label>
              <input {...register('githubUrl')} className="input-field" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>GitLab URL</label>
              <input {...register('gitlabUrl')} className="input-field" placeholder="https://gitlab.com/..." />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Twitter URL</label>
              <input {...register('twitterUrl')} className="input-field" placeholder="https://twitter.com/..." />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
