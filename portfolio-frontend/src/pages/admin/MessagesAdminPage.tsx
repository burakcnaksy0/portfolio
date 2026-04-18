import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle, Circle, Filter } from 'lucide-react';
import { messageApi } from '@/api/message.api';
import type { Message } from '@/types';
import toast from 'react-hot-toast';

export function MessagesAdminPage() {
  const qc = useQueryClient();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected]     = useState<Message | null>(null);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [page, setPage]             = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['messages', { unreadOnly, page }],
    queryFn: () => messageApi.getAll({ page, size: 20, unreadOnly }),
  });
  const messages = data?.data?.data?.content ?? [];
  const total    = data?.data?.data?.totalPages ?? 0;

  const readMutation = useMutation({
    mutationFn: messageApi.markRead,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['messages'] }); toast.success('Marked as read'); },
  });

  const deleteMutation = useMutation({
    mutationFn: messageApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Deleted');
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
    },
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Messages</h1>
          <button
            onClick={() => { setUnreadOnly(!unreadOnly); setPage(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${unreadOnly ? 'border-primary-500 text-primary-400 bg-primary-500 bg-opacity-10' : 'btn-secondary'}`}
          >
            <Filter size={16} /> {unreadOnly ? 'Show All' : 'Unread Only'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading && [...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            {!isLoading && messages.length === 0 && (
              <div className="card py-12 text-center">
                <p style={{ color: 'var(--text-muted)' }}>No messages</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.read) readMutation.mutate(msg.id); }}
                className={`card p-4 cursor-pointer transition-all ${selected?.id === msg.id ? 'border-primary-500 bg-primary-500 bg-opacity-5' : ''} ${!msg.read ? 'border-primary-500 border-opacity-40' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                      <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{msg.name}</span>
                    </div>
                    <p className="text-xs truncate mt-1" style={{ color: 'var(--text-muted)' }}>{msg.subject || '(No subject)'}</p>
                    <p className="text-xs truncate mt-1" style={{ color: 'var(--text-secondary)' }}>{msg.body.slice(0, 60)}...</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 flex-shrink-0 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {total > 1 && (
              <div className="flex gap-2">
                {[...Array(total)].map((_,i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg text-sm ${page===i ? 'btn-primary' : 'btn-secondary'}`}>{i+1}</button>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card p-6 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected.subject || '(No subject)'}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-medium text-primary-400">{selected.name}</span>
                      <span>·</span>
                      <a href={`mailto:${selected.email}`} className="hover:text-primary-400 transition-colors">{selected.email}</a>
                      <span>·</span>
                      <span>{new Date(selected.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.read
                      ? <span className="flex items-center gap-1 text-xs text-accent-400"><CheckCircle size={14} /> Read</span>
                      : <span className="flex items-center gap-1 text-xs text-yellow-400"><Circle size={14} /> Unread</span>
                    }
                    <button onClick={() => setDeleteId(selected.id)} className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                  {selected.body}
                </div>
                <div className="mt-6">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary">
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center h-64 flex flex-col items-center justify-center">
                <p style={{ color: 'var(--text-muted)' }}>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 max-w-sm w-full text-center">
            <p className="mb-6 font-medium" style={{ color: 'var(--text-primary)' }}>Delete message?</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}
                className="btn-primary flex-1" style={{ background: '#ef4444' }}>Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
