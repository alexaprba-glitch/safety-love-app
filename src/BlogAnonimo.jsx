import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Globe, Lock, Smile, ChevronDown, Image as ImageIcon, Flag,
  Share2, MoreHorizontal, Send, X, Check, Users, BookOpen, MessageSquare, ThumbsUp,
  ArrowRight, Leaf, Star, Pen
} from 'lucide-react';
import { getUser } from './services/auth';
import { getPosts, createPost, addComment } from './services/posts';

export default function BlogAnonimo({ darkMode = false }) {
  const dm = darkMode;
  const [postText, setPostText] = useState('');
  const [category, setCategory] = useState('Relaciones');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentDraft, setCommentDraft] = useState({ text: '', imageUrl: null });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportItem, setReportItem] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [sortBy, setSortBy] = useState('Más recientes');
  const [userId, setUserId] = useState(null);

  const filters = ['Todos', 'Relaciones', 'Consejos', 'Superación', 'Ansiedad', 'Autoestima', 'Apoyo'];
  const anecdoteCategories = ['Relaciones', 'Consejos', 'Superación', 'Ansiedad', 'Autoestima', 'Apoyo'];

  useEffect(() => {
    getUser().then(user => setUserId(user?.id || null)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dbPosts = await getPosts({ limit: 50 });
        if (cancelled || !dbPosts) return;
        const formatted = dbPosts.map(p => ({
          id: p.id,
          author: p.is_anonymous ? 'Anónimo' : (p.author_name || 'Tú'),
          time: new Date(p.created_at).toLocaleString('es'),
          title: '',
          body: p.content,
          tag: p.category || 'General',
          tags: [p.category || 'General'],
          likes: p.reactions?.likes || 0,
          comments: [],
          apoyos: p.reactions?.apoyos || 0,
          liked: false,
          saved: false,
          isAnonymous: p.is_anonymous,
          image_url: p.image_url,
          avatar_initials: p.avatar_initials,
          avatar_color: p.avatar_color,
          user_id: p.user_id,
        }));
        setPosts(formatted);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const [posts, setPosts] = useState([
    {
      id: 1, author: 'Corazón Tranquilo', time: 'Hace 2 horas',
      title: 'Me ayudó hablarle en voz alta',
      body: 'Aunque me costó mucho abrirme, sentir que alguien podría escuchar sin juzgarme me devolvió un poco de paz. Gracias por crear este espacio.',
      tag: 'Relaciones', tags: ['Relaciones', 'Apoyo'], likes: 24,
      comments: [
        { id: 101, author: 'Sofía', time: 'Hace 15 min', text: 'Gracias por compartirlo, me siento identificada.', likes: 4, liked: false, isOwn: false },
        { id: 102, author: 'Tú', time: 'Hace 8 min', text: 'Te entiendo mucho y me alegra que te sientas escuchada.', likes: 2, liked: true, isOwn: true }
      ],
      apoyos: 8, liked: false, saved: false
    },
    {
      id: 2, author: 'Luna Serena', time: 'Hace 5 horas',
      title: 'Aprendí a poner límites sin sentir culpa',
      body: 'No es egoísmo poner un límite, es cuidarte. Hoy estoy intentándolo con más calma, y eso ya es un gran paso.',
      tag: 'Superación', tags: ['Superación', 'Consejos'], likes: 18,
      comments: [
        { id: 201, author: 'Ana', time: 'Hace 3 min', text: 'Eso se siente tan bien de leer.', likes: 3, liked: false, isOwn: false }
      ],
      apoyos: 8, liked: false, saved: false
    },
    {
      id: 3, author: 'Esperanza', time: 'Hace 8 horas',
      title: '¿Cómo superar la ansiedad sin cerrarte?',
      body: 'A veces la ansiedad se siente como ruido constante. Lo que me está funcionando es respirar, escribir y recordar que no tengo que resolver todo hoy.',
      tag: 'Ansiedad', tags: ['Ansiedad', 'Relaciones'], likes: 31,
      comments: [], apoyos: 8, liked: false, saved: false
    }
  ]);

  const toggleLike = (id) => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post));
  };

  const handleAddComment = async () => {
    if (!selectedPost) return;
    const cleanText = commentDraft.text.trim();
    if (!cleanText && !commentDraft.imageUrl) return;
    const newComment = { id: Date.now(), author: 'Tú', time: 'Ahora', text: cleanText || 'Imagen', image: commentDraft.imageUrl || null, likes: 0, liked: false, isOwn: true };
    setPosts(prev => prev.map(post => post.id === selectedPost.id ? { ...post, comments: [...(post.comments || []), newComment] } : post));
    setSelectedPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev);
    setCommentDraft({ text: '', imageUrl: null });

    if (userId && selectedPost.id) {
      try {
        await addComment({ postId: selectedPost.id, userId, authorName: 'Tú', content: cleanText || 'Imagen' });
      } catch {}
    }
  };

  const handleCommentImageSelected = (file) => {
    if (!file) return;
    setCommentDraft(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
  };

  const toggleCommentLike = (commentId) => {
    setPosts(prev => prev.map(post => {
      if (!post.comments || !Array.isArray(post.comments)) return post;
      return { ...post, comments: post.comments.map(comment => comment.id === commentId ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } : comment) };
    }));
    if (selectedPost) {
      setSelectedPost(prev => prev ? { ...prev, comments: (prev.comments || []).map(comment => comment.id === commentId ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } : comment) } : prev);
    }
  };

  const deleteComment = (commentId) => {
    setPosts(prev => prev.map(post => {
      if (!post.comments || !Array.isArray(post.comments)) return post;
      return { ...post, comments: post.comments.filter(comment => comment.id !== commentId) };
    }));
    if (selectedPost) {
      setSelectedPost(prev => prev ? { ...prev, comments: (prev.comments || []).filter(comment => comment.id !== commentId) } : prev);
    }
  };

  const reportReasons = [
    'Contenido ofensivo o vulgares',
    'Acoso o intimidación',
    'Información falsa',
    'Spam o publicidad',
    'Contenido que incita al odio',
    'Otro motivo'
  ];

  const openReportPost = (post) => {
    setReportTarget('post');
    setReportItem(post);
    setReportReason('');
    setReportSent(false);
    setShowReportModal(true);
  };

  const openReportComment = (comment, post) => {
    setReportTarget('comment');
    setReportItem({ comment, post });
    setReportReason('');
    setReportSent(false);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (!reportReason) return;
    setReportSent(true);
  };

  const handleImageSelected = (file) => {
    if (!file) return;
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const publishPost = async () => {
    const text = postText.trim();
    if (!text && !imagePreviewUrl) return;
    const palette = ['bg-pink-100 text-pink-500', 'bg-blue-100 text-blue-500', 'bg-green-100 text-green-500', 'bg-yellow-100 text-yellow-500', 'bg-purple-100 text-purple-500', 'bg-amber-100 text-amber-500'];
    const name = isAnonymous ? '' : 'Tú';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    const colorCls = palette[Math.abs(hash) % palette.length];
    const initials = name ? name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : null;

    const tempId = Date.now();
    const newPost = {
      id: tempId, author: isAnonymous ? 'Anónimo' : 'Tú', time: 'Ahora', title: '', body: text,
      tag: category, tags: [category], likes: 0, comments: [], apoyos: 0, liked: false, saved: false,
      isAnonymous, image_url: imagePreviewUrl || null,
      avatar_initials: !isAnonymous ? initials : null, avatar_color: !isAnonymous ? colorCls : null
    };
    setPosts(prev => [newPost, ...prev]);
    setPostText('');
    setImagePreviewUrl(null);

    if (userId) {
      try {
        const saved = await createPost({
          userId,
          content: text,
          category,
          isAnonymous,
          avatarInitials: !isAnonymous ? initials : null,
          avatarColor: !isAnonymous ? colorCls : null,
        });
        setPosts(prev => prev.map(p => p.id === tempId ? { ...p, id: saved.id } : p));
      } catch {}
    }
  };

  const filteredPosts = activeFilter === 'Todos' ? posts : posts.filter(post => post.tag === activeFilter || (post.tags && post.tags.includes(activeFilter)));

  const renderAvatar = (post, size = 'normal') => {
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-[13px]';
    if (!post) return <div className={`${sizeClasses} flex-shrink-0`} />;
    const initials = post?.avatar_initials || (post?.author ? post.author.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : null);
    const colorCls = post?.avatar_color || 'bg-pink-100 text-pink-600';
    if (post?.isAnonymous) {
      return (
        <div className={`${sizeClasses} rounded-full flex items-center justify-center flex-shrink-0`}
          style={{ background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', color: dm ? '#64748B' : '#94A3B8' }}>
          <svg className={size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" />
          </svg>
        </div>
      );
    }
    const avatarImage = post?.avatar_url || post?.photo || null;
    if (avatarImage) {
      return (
        <div className={`${sizeClasses} rounded-full overflow-hidden flex-shrink-0`}>
          <img src={avatarImage} alt={post.author || 'Usuario'} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={`${sizeClasses} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${colorCls}`}>
        {initials || 'U'}
      </div>
    );
  };

  const cardBg = dm ? '#111A2D' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2';
  const cardShadow = dm ? '0 10px 30px rgba(0,0,0,0.15)' : '0 4px 24px rgba(15,23,42,0.04)';
  const pink = '#F83B91';

  return (
    <div className="h-full overflow-y-auto custom-scrollbar" style={{ background: dm ? '#070D1C' : '#F5F0E8' }}>
      <div className="px-6 sm:px-10 lg:px-16 py-10 lg:py-12">
        <div className="w-full mx-auto" style={{ maxWidth: '1300px', padding: '0 16px' }}>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]" style={{ gap: '24px' }}>

            {/* ═══════════════ MAIN FEED ═══════════════ */}
            <main className="min-w-0 flex flex-col" style={{ gap: '24px' }}>

              {/* ── COMPOSER CARD ── */}
              <div
                className="rounded-[28px] border overflow-hidden"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  padding: '32px',
                }}
              >
                <div className="flex items-start" style={{ gap: '20px' }}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: dm ? 'rgba(248,59,145,0.12)' : '#FFF0F6' }}
                  >
                    <svg className="w-6 h-6" style={{ color: pink }} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-poppins font-extrabold leading-tight"
                      style={{ fontSize: '26px', color: dm ? '#F8FAFC' : '#172033', letterSpacing: '-0.02em' }}
                    >
                      ¿Qué hay en tu corazón hoy?
                    </h2>
                    <p className="mt-1.5" style={{ fontSize: '16px', color: dm ? '#64748B' : '#7C8AA5' }}>
                      Compártelo anónimamente…
                    </p>
                  </div>
                </div>

                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={isAnonymous ? "Escribe lo que necesitas sacar de tu corazón…" : "¿Qué hay en tu corazón hoy? Compártelo con todos..."}
                  className="w-full rounded-[20px] px-5 py-4 outline-none resize-none leading-[1.7] border transition-all duration-200 mt-6"
                  style={{
                    minHeight: '150px',
                    background: dm ? '#0D1525' : '#FAFAFC',
                    color: dm ? '#F8FAFC' : '#172033',
                    borderColor: dm ? 'rgba(255,255,255,0.08)' : '#EEF0F5',
                    caretColor: pink,
                    fontSize: '16px',
                    padding: '20px',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = pink; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(248,59,145,0.08)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#EEF0F5'; e.currentTarget.style.boxShadow = 'none'; }}
                />

                {imagePreviewUrl && (
                  <div className="mt-4 relative inline-block">
                    <img src={imagePreviewUrl} alt="preview" className="w-20 h-14 object-cover rounded-xl" style={{ border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'}` }} />
                    <button onClick={() => setImagePreviewUrl(null)} className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-[#1E293B] text-white text-[11px] hover:bg-[#334155] transition">✕</button>
                  </div>
                )}

                {/* Controls row */}
                <div className="mt-6 flex items-center justify-between" style={{ gap: '16px' }}>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <button type="button" className="p-3 rounded-[14px] transition-all duration-200"
                      style={{ color: dm ? '#64748B' : '#94A3B8' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#FFF5FA'; e.currentTarget.style.color = pink; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? '#64748B' : '#94A3B8'; }}
                      aria-label="emoji">
                      <Smile size={20} />
                    </button>
                    <input id="post-image-input" type="file" accept="image/*" onChange={(e) => handleImageSelected(e.target.files[0])} className="hidden" />
                    <label htmlFor="post-image-input" className="p-3 rounded-[14px] cursor-pointer transition-all duration-200"
                      style={{ color: dm ? '#64748B' : '#94A3B8' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#FFF5FA'; e.currentTarget.style.color = pink; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? '#64748B' : '#94A3B8'; }}>
                      <ImageIcon size={20} />
                    </label>
                  </div>

                  <div className="flex items-center" style={{ gap: '14px' }}>
                    <button onClick={() => setIsAnonymous(true)} aria-pressed={isAnonymous}
                      className="flex items-center rounded-full font-semibold transition-all duration-200"
                      style={{
                        background: isAnonymous ? 'rgba(248,59,145,0.12)' : 'transparent',
                        border: isAnonymous ? '1px solid rgba(248,59,145,0.45)' : `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'}`,
                        color: isAnonymous ? pink : dm ? '#64748B' : '#94A3B8',
                        padding: '0 22px',
                        height: '44px',
                        fontSize: '13px',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => { if (!isAnonymous) e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.15)' : '#D0D5DD'; }}
                      onMouseLeave={(e) => { if (!isAnonymous) e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'; }}>
                      <Lock size={14} />
                      <span>Anónimo</span>
                    </button>
                    <button onClick={() => setIsAnonymous(false)} aria-pressed={!isAnonymous}
                      className="flex items-center rounded-full font-semibold transition-all duration-200"
                      style={{
                        background: !isAnonymous ? 'rgba(248,59,145,0.12)' : 'transparent',
                        border: !isAnonymous ? '1px solid rgba(248,59,145,0.45)' : `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'}`,
                        color: !isAnonymous ? pink : dm ? '#64748B' : '#94A3B8',
                        padding: '0 22px',
                        height: '44px',
                        fontSize: '13px',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => { if (!isAnonymous) e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.15)' : '#D0D5DD'; }}
                      onMouseLeave={(e) => { if (!isAnonymous) e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'; }}>
                      <Globe size={14} />
                      <span>Público</span>
                    </button>
                    <button onClick={publishPost}
                      className="rounded-[16px] text-white font-bold transition-all duration-200 active:scale-[0.97]"
                      style={{
                        background: pink,
                        boxShadow: '0 4px 18px rgba(248,59,145,0.28)',
                        padding: '0 28px',
                        height: '50px',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(248,59,145,0.4)'; e.currentTarget.style.background = '#E02D7C'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(248,59,145,0.28)'; e.currentTarget.style.background = pink; }}>
                      Publicar
                    </button>
                  </div>
                </div>

                {/* Category chips (show when text is present) */}
                {postText.trim() !== '' && (
                  <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F3F6'}` }}>
                    <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: dm ? '#475569' : '#94A3B8' }}>
                      Categoría
                    </div>
                    <div className="flex flex-wrap" style={{ gap: '10px' }}>
                      {anecdoteCategories.map((item) => (
                        <button key={item} type="button" onClick={() => setCategory(item)}
                          className="rounded-full font-semibold transition-all duration-200"
                          style={{
                            background: category === item ? 'rgba(248,59,145,0.12)' : dm ? 'rgba(255,255,255,0.04)' : '#F8F9FB',
                            border: category === item ? '1px solid rgba(248,59,145,0.45)' : `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#E8ECF2'}`,
                            color: category === item ? pink : dm ? '#64748B' : '#94A3B8',
                            padding: '0 18px',
                            height: '40px',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── FILTER PILLS + SORT ── */}
              <div className="flex items-center justify-between flex-wrap" style={{ gap: '12px' }}>
                <div className="flex flex-wrap" style={{ gap: '10px' }}>
                  {filters.map((filter) => (
                    <button key={filter} onClick={() => setActiveFilter(filter)}
                      className="rounded-full font-semibold transition-all duration-200"
                      style={{
                        background: activeFilter === filter ? 'rgba(248,59,145,0.12)' : dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                        border: activeFilter === filter ? '1px solid rgba(248,59,145,0.45)' : `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2'}`,
                        color: activeFilter === filter ? pink : dm ? '#64748B' : '#94A3B8',
                        boxShadow: activeFilter === filter ? '0 2px 10px rgba(248,59,145,0.15)' : 'none',
                        padding: '0 20px',
                        height: '40px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => {
                        if (activeFilter !== filter) {
                          e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.15)' : '#D0D5DD';
                          e.currentTarget.style.color = pink;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeFilter !== filter) {
                          e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E8ECF2';
                          e.currentTarget.style.color = dm ? '#64748B' : '#94A3B8';
                        }
                      }}>
                      {filter}
                    </button>
                  ))}
                </div>
                <button className="flex items-center font-semibold transition-all duration-150 rounded-full"
                  style={{ color: dm ? '#475569' : '#94A3B8', padding: '0 20px', height: '40px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = pink; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; }}>
                  {sortBy} <ChevronDown size={14} />
                </button>
              </div>

              {/* ── FEED LIST ── */}
              <div className="flex flex-col" style={{ gap: '20px' }}>
                {filteredPosts.length === 0 ? (
                  /* ── EMPTY STATE ── */
                  <div
                    className="rounded-[24px] border text-center flex flex-col items-center justify-center"
                    style={{
                      background: cardBg,
                      borderColor: cardBorder,
                      boxShadow: cardShadow,
                      padding: '48px 40px',
                      minHeight: '380px',
                    }}
                  >
                    {/* Illustration */}
                    <div className="relative mb-8">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ background: dm ? 'rgba(248,59,145,0.1)' : '#FFF0F6' }}
                      >
                        <MessageSquare size={40} style={{ color: dm ? 'rgba(248,59,145,0.5)' : 'rgba(244,63,158,0.4)' }} strokeWidth={1.5} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full" style={{ background: 'rgba(248,59,145,0.3)' }} />
                      <div className="absolute top-6 -left-2 w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(167,139,250,0.3)' }} />
                      <div className="absolute -bottom-1 right-2 w-3 h-3 rounded-full" style={{ background: 'rgba(96,165,250,0.25)' }} />
                    </div>

                    <h3
                      className="font-poppins font-extrabold leading-tight"
                      style={{ fontSize: '22px', color: dm ? '#F8FAFC' : '#172033', marginBottom: '8px' }}
                    >
                      Todavía no hay publicaciones aquí.
                    </h3>
                    <p style={{ fontSize: '16px', color: dm ? '#475569' : '#64748B', marginBottom: '24px' }}>
                      Sé la primera persona en compartir algo.
                    </p>
                    <button onClick={() => { setPostText(''); document.querySelector('textarea')?.focus(); }}
                      className="rounded-[16px] text-white font-bold transition-all duration-200 active:scale-[0.97]"
                      style={{
                        background: pink,
                        boxShadow: '0 4px 18px rgba(248,59,145,0.28)',
                        padding: '0 28px',
                        height: '50px',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(248,59,145,0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(248,59,145,0.28)'; }}>
                      <Pen size={16} />
                      Crear publicación
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post, index) => (
                    <motion.article key={post.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.06 }}
                      className="rounded-[22px] border transition-all duration-200"
                      style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow, padding: '28px 28px 24px' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = dm ? '0 14px 40px rgba(0,0,0,0.2)' : '0 10px 36px rgba(15,23,42,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = cardShadow; }}>

                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center" style={{ gap: '14px' }}>
                          {renderAvatar(post)}
                          <div>
                            <span className="font-bold" style={{ fontSize: '15px', color: dm ? '#F8FAFC' : '#172033' }}>{post.author}</span>
                            <div style={{ fontSize: '13px', color: dm ? '#475569' : '#94A3B8', marginTop: '2px' }}>{post.time}</div>
                          </div>
                        </div>
                        <button className="p-2.5 rounded-[10px] transition-all duration-150"
                          style={{ color: dm ? '#475569' : '#94A3B8' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {/* Title */}
                      {post.title && (
                        <h3 className="font-bold mt-4 mb-2" style={{ fontSize: '18px', color: dm ? '#F8FAFC' : '#172033' }}>{post.title}</h3>
                      )}

                      {/* Body */}
                      <p className="mt-3 leading-[1.65]" style={{ fontSize: '15px', color: dm ? '#CBD5E1' : '#64748B' }}>{post.body}</p>

                      {/* Image */}
                      {post.image_url && (
                        <img src={post.image_url} alt="Imagen" className="mt-4 w-full max-h-56 rounded-[16px] object-cover cursor-pointer hover:opacity-90 transition" />
                      )}

                      {/* Metrics */}
                      <div className="mt-5 flex items-center" style={{ gap: '24px', fontSize: '14px', color: dm ? '#475569' : '#94A3B8' }}>
                        <button onClick={() => toggleLike(post.id)} className="inline-flex items-center transition-all duration-150"
                          style={{ gap: '6px', color: post.liked ? pink : dm ? '#475569' : '#94A3B8' }}>
                          <Heart size={15} fill={post.liked ? 'currentColor' : 'none'} />
                          {post.likes}
                        </button>
                        <span className="inline-flex items-center" style={{ gap: '6px' }}>
                          <MessageCircle size={15} />
                          {Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)}
                        </span>
                        <span className="inline-flex items-center" style={{ gap: '6px' }}>
                          <ThumbsUp size={15} />
                          {post.apoyos || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center justify-end" style={{ gap: '6px' }}>
                        <button className="flex items-center rounded-[10px] font-medium transition-all duration-150"
                          style={{ color: dm ? '#64748B' : '#94A3B8', padding: '8px 16px', fontSize: '13px', gap: '8px' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.06)' : '#FFF5FA'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}>
                          <Share2 size={15} />
                        </button>
                        <button onClick={() => openReportPost(post)}
                          className="flex items-center rounded-[10px] font-medium transition-all duration-150"
                          style={{ color: dm ? '#64748B' : '#94A3B8', padding: '8px 16px', fontSize: '13px', gap: '8px' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.06)' : '#FFF5FA'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}>
                          <Flag size={15} />
                        </button>
                      </div>
                    </motion.article>
                  ))
                )}
              </div>

              {/* Ver más */}
              {filteredPosts.length > 0 && (
                <div className="flex justify-center mt-2 mb-2">
                  <button className="flex items-center font-semibold transition-all duration-150 rounded-full"
                    style={{ color: dm ? '#475569' : '#94A3B8', padding: '16px 40px', fontSize: '14px', gap: '8px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.06)' : '#FFF5FA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                    <span>Ver más publicaciones</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </main>

            {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
            <aside className="flex flex-col xl:sticky xl:top-8 xl:self-start" style={{ gap: '20px' }}>

              {/* CARD 1 — No estás solo */}
              <div
                className="rounded-[24px] border relative overflow-hidden transition-all duration-200"
                style={{
                  background: dm ? 'linear-gradient(135deg, #111A2D 0%, #151F35 100%)' : cardBg,
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  padding: '28px',
                  minHeight: '180px',
                }}
              >
                <div className="absolute -top-3 -right-3 pointer-events-none" style={{ opacity: 0.5 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M40 70 C35 65, 10 50, 10 30 C10 18, 18 12, 26 16 C30 18, 36 24, 40 30 C44 24, 50 18, 54 16 C62 12, 70 18, 70 30 C70 50, 45 65, 40 70 Z" fill="#FFD6E8" stroke="#FF8FAB" strokeWidth="1" />
                  </svg>
                </div>
                <div className="absolute -top-2 right-10 w-8 h-8 rounded-full pointer-events-none" style={{ background: 'rgba(248,59,145,0.15)', filter: 'blur(8px)' }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: dm ? 'rgba(248,59,145,0.12)' : '#FFF0F6' }}>
                  <Heart size={20} style={{ color: pink }} fill={pink} strokeWidth={0} />
                </div>
                <h3 className="font-poppins font-bold leading-tight" style={{ fontSize: '21px', color: dm ? '#F8FAFC' : '#172033', marginBottom: '8px' }}>
                  No estás solo.
                </h3>
                <p className="leading-relaxed" style={{ fontSize: '15px', color: dm ? '#94A3B8' : '#64748B', lineHeight: '1.5' }}>
                  Tu historia puede ser la luz que alguien necesita hoy.
                </p>
              </div>

              {/* CARD 2 — Escribe con respeto y empatía */}
              <div
                className="rounded-[24px] border transition-all duration-200"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  padding: '28px',
                }}
              >
                <div className="flex items-center" style={{ gap: '14px', marginBottom: '24px' }}>
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ background: dm ? 'rgba(167,139,250,0.1)' : '#F5F3FF' }}>
                    <BookOpen size={18} className="text-[#A78BFA]" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-poppins font-bold" style={{ fontSize: '16px', color: dm ? '#F8FAFC' : '#172033' }}>
                    Escribe con respeto y empatía
                  </h4>
                </div>
                <div className="flex flex-col" style={{ gap: '16px' }}>
                  {[
                    'Comparte tu experiencia de forma positiva.',
                    'Evita juzgar o criticar a otros.',
                    'Recuerda que todos merecemos respeto.'
                  ].map((rule, i) => (
                    <div key={i} className="flex items-start" style={{ gap: '14px', fontSize: '14px', fontWeight: 500, color: dm ? '#94A3B8' : '#64748B' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: dm ? 'rgba(34,197,94,0.1)' : '#ECFDF5' }}>
                        <Check size={12} className="text-emerald-500" strokeWidth={3} />
                      </div>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3 — Nuestra comunidad */}
              <div
                className="rounded-[24px] border transition-all duration-200"
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  padding: '28px',
                }}
              >
                <div className="flex items-center" style={{ gap: '14px', marginBottom: '24px' }}>
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ background: dm ? 'rgba(96,165,250,0.1)' : '#EFF6FF' }}>
                    <Users size={18} className="text-blue-500" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-poppins font-bold" style={{ fontSize: '16px', color: dm ? '#F8FAFC' : '#172033' }}>Nuestra comunidad</h4>
                </div>
                <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                  {[
                    { icon: BookOpen, label: 'Publicaciones hoy', value: '128', color: pink, bg: dm ? 'rgba(248,59,145,0.1)' : '#FFF5FA' },
                    { icon: Users, label: 'Personas conectadas', value: '342', color: '#A78BFA', bg: dm ? 'rgba(167,139,250,0.1)' : '#F5F3FF' },
                    { icon: MessageSquare, label: 'Comentarios hoy', value: '587', color: '#60A5FA', bg: dm ? 'rgba(96,165,250,0.1)' : '#EFF6FF' },
                    { icon: Heart, label: 'Apoyos dados', value: '1.2k', color: '#34D399', bg: dm ? 'rgba(34,197,94,0.1)' : '#ECFDF5' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center rounded-[16px]"
                      style={{ background: stat.bg, padding: '18px 12px' }}
                    >
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-2.5"
                        style={{ background: dm ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }}>
                        <stat.icon size={18} style={{ color: stat.color }} strokeWidth={2} />
                      </div>
                      <div className="font-extrabold leading-tight" style={{ fontSize: '24px', color: dm ? '#F8FAFC' : '#172033' }}>{stat.value}</div>
                      <div className="mt-1 font-medium leading-tight" style={{ fontSize: '12px', color: dm ? '#475569' : '#94A3B8' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frase inspiradora */}
              <div className="text-center" style={{ padding: '16px 16px 8px' }}>
                <p className="italic leading-relaxed" style={{ fontSize: '15px', color: dm ? '#475569' : '#94A3B8' }}>
                  <span style={{ color: pink, fontSize: '18px', marginRight: '4px' }}>"</span>
                  Pequeñas palabras pueden hacer una gran diferencia.
                  <span style={{ color: pink, fontSize: '18px', marginLeft: '4px' }}>"</span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ═══════════════ COMMENTS MODAL ═══════════════ */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[6px] z-50 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <div className="w-full max-w-[560px] rounded-[20px] shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
            style={{
              background: dm ? '#101A2D' : '#FFFFFF',
              border: dm ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EEF0F5',
            }}
            onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between"
              style={{ borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'}` }}>
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-[16px] font-bold leading-snug" style={{ color: dm ? '#F8FAFC' : '#172033' }}>{selectedPost.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-[12px]" style={{ color: dm ? '#475569' : '#94A3B8' }}>
                  <span>{selectedPost.author}</span>
                  <span>·</span>
                  <span>{selectedPost.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-all duration-150"
                style={{ color: dm ? '#475569' : '#94A3B8' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-[14px] leading-[1.65]" style={{ color: dm ? '#CBD5E1' : '#64748B' }}>{selectedPost.body}</p>
              {selectedPost.image_url && (
                <img src={selectedPost.image_url} alt="" className="mt-4 w-full max-h-52 rounded-[16px] object-cover" />
              )}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{ background: dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA', color: dm ? '#F83B91' : '#F43F9E' }}>#{tag}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-6 text-[13px] pb-4"
                style={{ color: dm ? '#475569' : '#94A3B8', borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'}` }}>
                <span className="inline-flex items-center gap-1.5"><Heart size={14} className="text-[#F83B91]" fill="currentColor" /> {selectedPost.likes}</span>
                <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} /> {Array.isArray(selectedPost.comments) ? selectedPost.comments.length : (selectedPost.comments || 0)}</span>
              </div>

              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-[0.1em] font-semibold mb-4" style={{ color: dm ? '#475569' : '#94A3B8' }}>Comentarios</div>
                {(Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0) ? (
                  <div className="flex flex-col gap-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
                          style={{ background: dm ? 'rgba(255,255,255,0.05)' : '#F8F9FB', color: dm ? '#64748B' : '#94A3B8' }}>
                          {comment.author ? comment.author.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold" style={{ color: dm ? '#F8FAFC' : '#172033' }}>{comment.author}</span>
                            <span className="text-[11px]" style={{ color: dm ? '#475569' : '#94A3B8' }}>{comment.time}</span>
                            {comment.isOwn && (
                              <button onClick={() => deleteComment(comment.id)} className="ml-auto text-[11px] transition-all duration-150"
                                style={{ color: dm ? '#475569' : '#94A3B8' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#FB7185'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; }}>Eliminar</button>
                            )}
                          </div>
                          {comment.text && <p className="mt-1 text-[14px] leading-[1.55]" style={{ color: dm ? '#CBD5E1' : '#64748B' }}>{comment.text}</p>}
                          {comment.image && <img src={comment.image} alt="" className="mt-2 max-h-28 rounded-xl object-cover" />}
                          <div className="mt-2 flex items-center gap-3">
                            <button onClick={() => toggleCommentLike(comment.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium transition-all duration-150"
                              style={{ color: comment.liked ? '#F83B91' : dm ? '#475569' : '#94A3B8' }}>
                              <Heart size={11} fill={comment.liked ? 'currentColor' : 'none'} strokeWidth={2} />
                              {comment.likes}
                            </button>
                            {!comment.isOwn && (
                              <button onClick={() => openReportComment(comment, selectedPost)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium transition-all duration-150"
                                style={{ color: dm ? '#475569' : '#94A3B8' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#F83B91'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; }}>
                                <Flag size={10} />
                                Reportar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-[13px]" style={{ color: dm ? '#475569' : '#94A3B8' }}>Sé el primero en comentar.</p>
                )}
              </div>
            </div>

            <div className="px-5 py-4" style={{ borderTop: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'}` }}>
              <div className="flex items-end gap-3">
                <textarea
                  value={commentDraft.text}
                  onChange={(e) => setCommentDraft(prev => ({ ...prev, text: e.target.value }))}
                  rows={1}
                  placeholder="Escribe un comentario..."
                  className="flex-1 resize-none rounded-[14px] px-4 py-3 text-[14px] outline-none border transition-all duration-200"
                  style={{
                    background: dm ? 'rgba(255,255,255,0.03)' : '#FAFAFC',
                    color: dm ? '#F8FAFC' : '#172033',
                    borderColor: dm ? 'rgba(255,255,255,0.08)' : '#EEF0F5',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#F83B91'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#EEF0F5'; }}
                />
                <button onClick={handleAddComment}
                  className="shrink-0 h-13 px-8 rounded-[14px] text-white text-[13px] font-semibold transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ background: '#F83B91' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#E02D7C'; }}
                  onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#F83B91'; }}
                  disabled={!commentDraft.text.trim() && !commentDraft.imageUrl}>
                  <Send size={16} />
                </button>
              </div>
              {commentDraft.imageUrl && (
                <div className="relative mt-3 inline-block">
                  <img src={commentDraft.imageUrl} alt="" className="max-h-20 rounded-xl object-cover" />
                  <button onClick={() => setCommentDraft(prev => ({ ...prev, imageUrl: null }))} className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full text-white text-[10px]"
                    style={{ background: dm ? '#1E293B' : '#1E293B' }}>✕</button>
                </div>
              )}
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium transition-all duration-150"
                style={{ color: dm ? '#475569' : '#94A3B8' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F83B91'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; }}>
                <ImageIcon size={14} />
                Imagen
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCommentImageSelected(e.target.files?.[0])} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ REPORT MODAL ═══════════════ */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[6px] z-[60] flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="w-full max-w-[440px] rounded-[20px] shadow-2xl overflow-hidden"
            style={{
              background: dm ? '#101A2D' : '#FFFFFF',
              border: dm ? '1px solid rgba(255,255,255,0.08)' : '1px solid #EEF0F5',
            }}
            onClick={(e) => e.stopPropagation()}>
            {!reportSent ? (
              <>
                <div className="px-6 pt-5 pb-4"
                  style={{ borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'}` }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-bold" style={{ color: dm ? '#F8FAFC' : '#172033' }}>
                      Reportar {reportTarget === 'post' ? 'publicación' : 'comentario'}
                    </h3>
                    <button onClick={() => setShowReportModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full transition-all duration-150"
                      style={{ color: dm ? '#475569' : '#94A3B8' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#F83B91'; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>×</button>
                  </div>
                  <p className="text-[13px] mt-1.5" style={{ color: dm ? '#475569' : '#94A3B8' }}>
                    Selecciona el motivo del reporte
                  </p>
                </div>

                <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {reportReasons.map((reason) => (
                      <button key={reason} onClick={() => setReportReason(reason)}
                        className="w-full text-left px-7 py-4.5 rounded-[14px] text-[14px] font-medium transition-all duration-150"
                        style={{
                          background: reportReason === reason ? (dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA') : dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                          border: reportReason === reason ? '1px solid rgba(248,59,145,0.3)' : '1px solid transparent',
                          color: reportReason === reason ? '#F83B91' : dm ? '#CBD5E1' : '#64748B',
                        }}
                        onMouseEnter={(e) => { if (reportReason !== reason) e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#F8F9FB'; }}
                        onMouseLeave={(e) => { if (reportReason !== reason) e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC'; }}>
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 flex gap-3"
                  style={{ borderTop: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'}` }}>
                  <button onClick={() => setShowReportModal(false)}
                    className="flex-1 h-14 rounded-[14px] text-[14px] font-semibold transition-all duration-150"
                    style={{
                      background: dm ? 'rgba(255,255,255,0.03)' : '#F8F9FB',
                      color: dm ? '#CBD5E1' : '#64748B',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.06)' : '#EEF0F5'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#F8F9FB'; }}>
                    Cancelar
                  </button>
                  <button onClick={submitReport} disabled={!reportReason}
                    className="flex-1 h-14 rounded-[14px] text-white text-[14px] font-semibold transition-all duration-150 disabled:opacity-25"
                    style={{ background: '#F83B91', boxShadow: '0 4px 16px rgba(248,59,145,0.25)' }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#E02D7C'; }}
                    onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#F83B91'; }}>
                    Enviar reporte
                  </button>
                </div>
              </>
            ) : (
              <div className="px-6 py-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: dm ? 'rgba(34,197,94,0.1)' : '#ECFDF5' }}>
                  <Check size={24} className="text-emerald-500" />
                </div>
                <h3 className="text-[17px] font-bold mb-1.5" style={{ color: dm ? '#F8FAFC' : '#172033' }}>Reporte enviado</h3>
                <p className="text-[13px] mb-5" style={{ color: dm ? '#475569' : '#94A3B8' }}>Gracias por ayudarnos a mantener la comunidad segura.</p>
                <button onClick={() => setShowReportModal(false)}
                  className="px-9 py-4 rounded-full text-[13px] font-semibold transition-all duration-150"
                  style={{ background: dm ? 'rgba(255,255,255,0.05)' : '#F8F9FB', color: dm ? '#CBD5E1' : '#64748B' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.08)' : '#EEF0F5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#F8F9FB'; }}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
