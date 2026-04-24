import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import { tagApi } from '@/api/tag.api';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function BlogPage() {
  const [search, setSearch]     = useState('');
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const [page, setPage]         = useState(0);

  const { data: tagsData }  = useQuery({ queryKey: ['tags'], queryFn: tagApi.getAll });
  const { data, isLoading } = useQuery({
    queryKey: ['blog', { search, tag: activeTag, page }],
    queryFn: () => blogApi.getPublished({ search: search || undefined, tag: activeTag, page, size: 10 }),
  });

  const tags     = tagsData?.data?.data ?? [];
  const posts    = data?.data?.data?.content ?? [];
  const total    = data?.data?.data?.totalPages ?? 0;

  return (
    <PageTransition>
      <div className="container-custom py-16">
        <SectionHeader
          title="Blog"
          subtitle="Thoughts on tech, development, and more"
          icon={<><BookOpen size={14} /><span className="text-sm font-medium">Articles</span></>}
        />

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="input-field pl-12"
          />
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTag(undefined); setPage(0); }}
            className={`badge cursor-pointer transition-all ${!activeTag ? 'ring-2 ring-primary-500 shadow-glow-sm' : 'opacity-60 hover:opacity-100'}`}
          >
            All
          </motion.button>
          {tags.map((tag) => (
            <motion.button
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTag(tag.slug); setPage(0); }}
              className={`badge cursor-pointer transition-all ${activeTag === tag.slug ? 'ring-2 ring-primary-500 shadow-glow-sm' : 'opacity-60 hover:opacity-100'}`}
            >
              {tag.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--accent)' }} />
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No posts found.</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <motion.div whileHover={{ x: 4 }} className="card p-6 flex gap-6 group">
                    {post.coverImageUrl && (
                      <div className="hidden md:block w-44 h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img src={post.coverImageUrl} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag.id} className="badge text-xs">{tag.name}</span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300"
                        style={{ color: 'var(--text-primary)' }}>{post.title}</h2>
                      {post.summary && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.summary}</p>
                      )}
                      <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                        <span>·</span>
                        <span>{post.viewCount} views</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-2 mt-14"
          >
            {[...Array(total)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${page===i ? 'btn-primary' : 'btn-secondary'}`}
              >
                {i + 1}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
