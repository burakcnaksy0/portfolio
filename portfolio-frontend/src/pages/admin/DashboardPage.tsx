import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FolderGit2, BookOpen, CheckCircle, Briefcase, Award,
  MessageSquare, MailOpen, Tag
} from 'lucide-react';
import { dashboardApi } from '@/api/dashboard.api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const stats = data?.data?.data;

  const cards = stats ? [
    { label: 'Total Projects',     value: stats.totalProjects,     icon: FolderGit2, color: '#5a6aff' },
    { label: 'Blog Posts',         value: stats.totalBlogPosts,    icon: BookOpen,   color: '#10b981' },
    { label: 'Published',          value: stats.publishedBlogPosts,icon: CheckCircle,color: '#34d399' },
    { label: 'Experiences',        value: stats.totalExperiences,  icon: Briefcase,  color: '#f59e0b' },
    { label: 'Certificates',       value: stats.totalCertificates, icon: Award,      color: '#8b5cf6' },
    { label: 'Total Messages',     value: stats.totalMessages,     icon: MessageSquare, color: '#ec4899' },
    { label: 'Unread Messages',    value: stats.unreadMessages,    icon: MailOpen,   color: '#ef4444' },
    { label: 'Tags',               value: stats.totalTags,         icon: Tag,        color: '#06b6d4' },
  ] : [];

  const chartData = stats ? [
    { name: 'Projects',     value: Number(stats.totalProjects) },
    { name: 'Blog Posts',   value: Number(stats.totalBlogPosts) },
    { name: 'Experiences',  value: Number(stats.totalExperiences) },
    { name: 'Certificates', value: Number(stats.totalCertificates) },
    { name: 'Messages',     value: Number(stats.totalMessages) },
  ] : [];

  const COLORS = ['#5a6aff','#10b981','#f59e0b','#8b5cf6','#ec4899'];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>Welcome back! Here's your portfolio overview.</p>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {cards.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl" style={{ background: `${color}20` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bar Chart */}
        {stats && (
          <div className="card p-6">
            <h2 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Content Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-secondary)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
}
