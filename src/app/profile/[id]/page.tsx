'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { getDynamicProfileDefaults } from '@/lib/profileHelpers';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Messaging state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [msgError, setMsgError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resolve current user id from localStorage
    try {
      const raw = localStorage.getItem('soch_user');
      if (raw) {
        const u = JSON.parse(raw);
        setCurrentUserId(u.id || null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    api.getProfileById(params.id)
      .then((data) => {
        const roleCat = (data.role_category as any) || 'developer';
        const defaults = getDynamicProfileDefaults(roleCat);

        const rawSkills = Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === 'string' && data.skills
          ? data.skills.split(',').map((s: string) => s.trim())
          : [];

        setProfile({
          ...data,
          skills: rawSkills.length ? rawSkills : defaults.skills,
          role: data.role || (roleCat.charAt(0).toUpperCase() + roleCat.slice(1)),
          bio: data.bio || defaults.bio,
          location: data.location || 'Global',
          initials: data.initials || 'AN',
        });
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  // Load messages when chat opens
  useEffect(() => {
    if (!isChatOpen) return;
    
    // Require auth
    const token = typeof window !== 'undefined' ? localStorage.getItem('soch_token') : null;
    if (!token) {
      router.push(`/login?redirect=/profile/${params.id}`);
      return;
    }

    setLoadingMsgs(true);
    setMsgError('');
    api.getConversation(params.id)
      .then((data) => {
        setMessages(data);
        // Mark as read
        data.filter((m: Message) => !m.is_read && m.receiver_id === currentUserId)
          .forEach((m: Message) => api.markMessageRead(m.id).catch(() => {}));
      })
      .catch(() => setMsgError('Could not load messages. Please try again.'))
      .finally(() => setLoadingMsgs(false));
  }, [isChatOpen, params.id, currentUserId, router]);

  // Scroll to bottom
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleMessageClick = () => {
    setIsChatOpen(true);
  };

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content || sending) return;

    setSending(true);
    setInputValue('');
    try {
      const newMsg = await api.sendMessage(params.id, content);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err: any) {
      setInputValue(content);
      setMsgError(err?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnProfile = currentUserId && currentUserId === params.id;

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
        <Link href="/people" className="text-emerald-600 font-semibold hover:underline">
          &larr; Back to People
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="mb-6">
        <Link
          href="/people"
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1.5"
        >
          &larr; Back to community
        </Link>
      </div>

      {/* Profile Header Hero */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <Avatar initials={profile.initials} size="xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {profile.role}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                📍 {profile.location}
              </span>
            </div>
          </div>

          {/* Message button */}
          {!isOwnProfile && (
            <button
              onClick={handleMessageClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z"
                />
              </svg>
              Message
            </button>
          )}
        </div>

        {/* Bio & Skills */}
        <div className="pt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            About &amp; Philosophy
          </span>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
            {profile.bio}
          </p>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Core Skills &amp; Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[500px] max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar initials={profile.initials} size="sm" className="bg-white/20" />
              <div>
                <h3 className="text-sm font-bold">{profile.name}</h3>
                <p className="text-[10px] text-slate-300 opacity-80">Direct Message</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/60 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            {loadingMsgs ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-2" />
                <span className="text-xs">Loading...</span>
              </div>
            ) : msgError ? (
              <div className="text-center text-sm text-rose-500 font-medium py-8">{msgError}</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-12">
                <span className="text-3xl mb-2 block">👋</span>
                Say hello to {profile.name}!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-slate-900 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className={`text-[9px] mt-1 ${isMine ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                          {formatTimestamp(msg.created_at)}
                          {isMine && <span className="ml-1">{msg.is_read ? '✓✓' : '✓'}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400 max-h-24 bg-slate-50"
                rows={1}
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || sending}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-1 pl-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
