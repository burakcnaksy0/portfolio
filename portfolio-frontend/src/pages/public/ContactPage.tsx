import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, FileText } from 'lucide-react';
import { messageApi } from '@/api/message.api';
import toast from 'react-hot-toast';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  body:    z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => messageApi.send(data),
    onSuccess: () => {
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    },
    onError: () => {},
  });

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle mb-12">Have a project in mind? Let's talk.</p>

          <div className="card p-8">
            <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <User size={14} className="inline mr-1" /> Name *
                </label>
                <input {...register('name')} placeholder="Burakcan Aksoy" className="input-field" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={14} className="inline mr-1" /> Email *
                </label>
                <input {...register('email')} type="email" placeholder="burakcan@ornek.com" className="input-field" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <FileText size={14} className="inline mr-1" /> Subject
                </label>
                <input {...register('subject')} placeholder="Proje İşbirliği" className="input-field" />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <MessageSquare size={14} className="inline mr-1" /> Message *
                </label>
                <textarea
                  {...register('body')}
                  rows={6}
                  placeholder="Projenizden bahsedin..."
                  className="input-field resize-none"
                />
                {errors.body && <p className="text-red-400 text-xs mt-1">{errors.body.message}</p>}
              </div>

              <button type="submit" disabled={isPending} className="btn-primary w-full">
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Send size={18} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
