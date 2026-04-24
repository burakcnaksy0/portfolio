import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { blogApi } from '@/api/blog.api';
import { PageTransition } from '@/components/ui/PageTransition';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const post = data?.data?.data;

  if (isLoading) return (
    <div className="container-custom py-16 max-w-3xl">
      <div className="skeleton h-6 w-32 mb-8 rounded-lg" />
      <div className="skeleton h-10 w-3/4 mb-4 rounded-lg" />
      <div className="skeleton h-72 rounded-2xl mb-8" />
      <div className="space-y-3">
        {[...Array(8)].map((_,i) => <div key={i} className="skeleton h-4 rounded" style={{ width: `${70+Math.random()*30}%` }} />)}
      </div>
    </div>
  );

  if (isError || !post) return (
    <div className="container-custom py-16 text-center">
      <p style={{ color: 'var(--text-muted)' }}>Post not found.</p>
      <Link to="/blog" className="btn-primary mt-6 inline-flex">Back to Blog</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="container-custom py-16 max-w-3xl">
        <article>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/blog" className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all hover:gap-3"
              style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </motion.div>

          {/* Cover image */}
          {post.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden mb-10 h-72 relative"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            >
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>
          )}

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {post.tags.map((tag) => <span key={tag.id} className="badge">{tag.name}</span>)}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight"
          >
            <span className="gradient-text">{post.title}</span>
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 text-sm mb-12 pb-6"
            style={{ color: 'var(--text-muted)' }}
          >
            <div className="flex items-center gap-1.5">
              <Calendar size={14} style={{ color: 'var(--accent)' }} />
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={14} style={{ color: 'var(--accent)' }} />
              <span>{post.viewCount} views</span>
            </div>
          </motion.div>

          {/* Gradient divider */}
          <div className="gradient-divider mb-12" />

          {/* Summary */}
          {post.summary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-xl leading-relaxed mb-10 font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {post.summary}
            </motion.p>
          )}

          {/* Markdown Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose-custom"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </article>
      </div>
    </PageTransition>
  );
}
