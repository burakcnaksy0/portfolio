import { motion } from 'framer-motion';

interface FloatingShape {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

const shapes: FloatingShape[] = [
  { size: 300, x: '10%', y: '20%', delay: 0,  duration: 20, opacity: 0.04, color: 'var(--gradient-1)' },
  { size: 250, x: '70%', y: '10%', delay: 2,  duration: 25, opacity: 0.03, color: 'var(--gradient-2)' },
  { size: 200, x: '80%', y: '60%', delay: 4,  duration: 18, opacity: 0.04, color: 'var(--gradient-3)' },
  { size: 180, x: '20%', y: '70%', delay: 1,  duration: 22, opacity: 0.03, color: 'var(--gradient-1)' },
  { size: 150, x: '50%', y: '40%', delay: 3,  duration: 28, opacity: 0.02, color: 'var(--gradient-2)' },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: shape.color,
            opacity: shape.opacity,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, -30, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
