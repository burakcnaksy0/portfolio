import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { blogApi } from '@/api/blog.api';

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
      <div className="skeleton h-64 rounded-2xl mb-8" />
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
    <div className="container-custom py-16 max-w-3xl">
      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/blog" className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary-400 transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10 h-72">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => <span key={tag.id} className="badge">{tag.name}</span>)}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight"
          style={{ color: 'var(--text-primary)' }}>{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm mb-12 pb-6 border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={14} />
            <span>{post.viewCount} views</span>
          </div>
        </div>

        {/* Summary */}
        {post.summary && (
          <p className="text-xl leading-relaxed mb-10 font-medium" style={{ color: 'var(--text-secondary)' }}>
            {post.summary}
          </p>
        )}

        {/* Markdown Content */}
        <div className="prose-custom">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}
