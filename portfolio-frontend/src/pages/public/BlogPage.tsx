import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { blogApi } from '@/api/blog.api';
import { tagApi } from '@/api/tag.api';

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
    <div className="container-custom py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Blog</h1>
        <p className="section-subtitle mb-10">Thoughts on tech, development, and more</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="input-field pl-12"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => { setActiveTag(undefined); setPage(0); }}
            className={`badge cursor-pointer ${!activeTag ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'}`}>
            All
          </button>
          {tags.map((tag) => (
            <button key={tag.id}
              onClick={() => { setActiveTag(tag.slug); setPage(0); }}
              className={`badge cursor-pointer ${activeTag === tag.slug ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'}`}>
              {tag.name}
            </button>
          ))}
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto mb-4 text-primary-400 opacity-50" />
            <p style={{ color: 'var(--text-muted)' }}>No posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="card p-6 flex gap-6 group">
                    {post.coverImageUrl && (
                      <div className="hidden md:block w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={post.coverImageUrl} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag.id} className="badge text-xs">{tag.name}</span>
                        ))}
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors"
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
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(total)].map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${page===i ? 'btn-primary' : 'btn-secondary'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
