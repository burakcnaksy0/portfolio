import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Mail, Code2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const navigate   = useNavigate();
    const { setAuth, isAuthenticated } = useAuthStore();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => authApi.login(data),
    onSuccess: (res) => {
      const { accessToken, email, role } = res.data.data;
      setAuth({ email, role, accessToken }, accessToken);
      toast.success('Welcome back!');
      navigate('/admin', { replace: true });
    },
    onError: () => {},
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl mb-4" style={{ background: 'var(--accent-glow)' }}>
            <Code2 size={32} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Sign in to manage your portfolio</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-5" id="login-form">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="admin@portfolio.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('password')}
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full mt-2">
              {isPending
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : 'Sign In'
              }
            </button>
          </form>

          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-center text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                You already have an active session.
              </p>
              <button 
                onClick={() => navigate('/admin')} 
                type="button"
                className="w-full p-2.5 rounded-xl border font-medium transition-all duration-200 hover:border-primary-500 hover:text-primary-400"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Go to Dashboard &rarr;
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-sm transition-colors hover:text-primary-400" 
            style={{ color: 'var(--text-muted)' }}
          >
            &larr; Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
