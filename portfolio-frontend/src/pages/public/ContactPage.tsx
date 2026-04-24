import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { messageApi } from '@/api/message.api';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionHeader } from '@/components/ui/SectionHeader';
import toast from 'react-hot-toast';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email'),
  subject: z.string().optional(),
  body:    z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const inputVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormData) => messageApi.send(data),
    onSuccess: () => {
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    },
    onError: () => {},
  });

  return (
    <PageTransition>
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            title="Get In Touch"
            subtitle="Have a project in mind? Let's talk."
            icon={<><Mail size={14} /><span className="text-sm font-medium">Contact</span></>}
            align="center"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -right-8 w-16 h-16 rounded-2xl border opacity-10 -z-10"
              style={{ borderColor: 'var(--accent)', transform: 'rotate(12deg)' }}
            />
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full border opacity-10 -z-10"
              style={{ borderColor: 'var(--gradient-3)' }}
            />

            <div className="card p-8 md:p-10">
              {/* Animated gradient top border for the form card */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{
                  background: 'linear-gradient(90deg, var(--gradient-1), var(--gradient-2), var(--gradient-3))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite',
                }}
              />

              <motion.form
                onSubmit={handleSubmit((d) => mutate(d))}
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
              >
                {/* Name */}
                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <User size={14} className="inline mr-1.5" style={{ color: 'var(--accent)' }} /> Name *
                  </label>
                  <input {...register('name')} placeholder="Burakcan Aksoy" className="input-field" />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" />{errors.name.message}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={14} className="inline mr-1.5" style={{ color: 'var(--accent)' }} /> Email *
                  </label>
                  <input {...register('email')} type="email" placeholder="burakcan@ornek.com" className="input-field" />
                  {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" />{errors.email.message}</p>}
                </motion.div>

                {/* Subject */}
                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <FileText size={14} className="inline mr-1.5" style={{ color: 'var(--accent)' }} /> Subject
                  </label>
                  <input {...register('subject')} placeholder="Project Collaboration" className="input-field" />
                </motion.div>

                {/* Body */}
                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <MessageSquare size={14} className="inline mr-1.5" style={{ color: 'var(--accent)' }} /> Message *
                  </label>
                  <textarea
                    {...register('body')}
                    rows={6}
                    placeholder="Tell me about your project..."
                    className="input-field resize-none"
                  />
                  {errors.body && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" />{errors.body.message}</p>}
                </motion.div>

                <motion.div variants={inputVariants}>
                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full py-4"
                  >
                    {isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
