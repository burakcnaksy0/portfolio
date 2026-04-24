import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, subtitle, icon, align = 'left' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mb-16 ${align === 'center' ? 'text-center' : ''}`}
    >
      {/* Decorative floating element */}
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
            background: 'var(--accent-glow)',
          }}
        >
          {icon}
        </motion.div>
      )}

      <h1 className="section-title">
        <span className="gradient-text">{title}</span>
      </h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="section-subtitle mt-3"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`gradient-divider mt-6 max-w-32 ${align === 'center' ? 'mx-auto' : ''}`}
        style={{ transformOrigin: align === 'center' ? 'center' : 'left' }}
      />
    </motion.div>
  );
}
