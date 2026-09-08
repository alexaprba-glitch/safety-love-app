import React, { useState, useRef, useEffect } from 'react';
import { Mic, SquarePen, Trash2, MessageCircle, History, Send, ArrowLeft, Plus, Settings, User } from 'lucide-react';
import twemoji from 'twemoji';
import SafetyMascot from './SafetyMascot';
import { getUser } from './services/auth';
import { getChatSessions, createChatSession, updateChatSession, deleteChatSession, getChatMessages, addChatMessage } from './services/chat';

const QUICK_TOPICS = [
  { emoji: '🧠', label: 'Reflexiones', desc: 'Momentos para pensar y crecer', color: '#8B5CF6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.12)', iconBg: 'rgba(139,92,246,0.10)', bgLight: '#F3EEFF', borderLight: 'rgba(139,92,246,0.3)', labelColor: '#1E293B', labelColorDark: '#E2E8F0', arrowColor: '#8B5CF6' },
  { emoji: '🌱', label: 'Consejos', desc: 'Tips para tu bienestar diario', color: '#10B981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.12)', iconBg: 'rgba(16,185,129,0.10)', bgLight: '#E6F9F0', borderLight: 'rgba(16,185,129,0.3)', labelColor: '#1E293B', labelColorDark: '#E2E8F0', arrowColor: '#10B981' },
  { emoji: '🫂', label: 'Desahogarme', desc: 'Un espacio sin juicios', color: '#3B82F6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.12)', iconBg: 'rgba(59,130,246,0.10)', bgLight: '#E8F2FF', borderLight: 'rgba(59,130,246,0.3)', labelColor: '#1E293B', labelColorDark: '#E2E8F0', arrowColor: '#3B82F6' },
  { emoji: '🧘', label: 'Respirar', desc: 'Ejercicios de calma', color: '#F97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.12)', iconBg: 'rgba(249,115,22,0.10)', bgLight: '#FFF0E0', borderLight: 'rgba(249,115,22,0.3)', labelColor: '#1E293B', labelColorDark: '#E2E8F0', arrowColor: '#F97316' },
];

const SUGGESTIONS = [
  { emoji: '💗', text: 'Cómo me siento' },
  { emoji: '😟', text: 'Algo que me preocupa' },
  { emoji: '💬', text: 'Necesito desahogarme' },
  { emoji: '👋', text: 'Otro tema' },
];

export default function ChatIA({ darkMode = false, userPhotoUrl = null }) {
  const dm = darkMode;
  const initialMessages = [
    { id: 1, role: 'bot', text: 'Hola, estoy aqui para escucharte. \u00BFQue tienes en mente?' },
  ];

  const [chatMascotId, setChatMascotId] = useState(() => {
    try { return localStorage.getItem('safetyLoveMascot') || 'michi-menta'; } catch { return 'michi-menta'; }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('safetyLoveMascot') || 'michi-menta';
        if (stored !== chatMascotId) setChatMascotId(stored);
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, [chatMascotId]);

  const [chatSessions, setChatSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('chatia_history')) ?? []; } catch { return []; }
  });
  const [activeSession, setActiveSession] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    getUser().then(user => { userIdRef.current = user?.id || null; }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userIdRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const sessions = await getChatSessions(userIdRef.current);
        if (cancelled) return;
        const formatted = sessions.map(s => ({
          id: s.id,
          title: s.title,
          preview: s.preview || '',
          date: new Date(s.updated_at || s.created_at).toLocaleString('es'),
          _supabase: true,
        }));
        setChatSessions(formatted);
        try { localStorage.setItem('chatia_history', JSON.stringify(formatted)); } catch {}
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (rootRef.current) {
      twemoji.parse(rootRef.current, { folder: 'svg', ext: '.svg', base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' });
    }
  }, [messages, typing]);

  const saveSession = async (msgs) => {
    const firstUser = msgs.find((m) => m.role === 'user');
    const title = firstUser ? firstUser.text.slice(0, 40) : 'Chat sin mensaje';
    const preview = msgs.length > 1 ? msgs[msgs.length - 1].text.slice(0, 60) : '';
    const uid = userIdRef.current;

    if (uid && activeSession && typeof activeSession === 'number') {
      try {
        await updateChatSession(activeSession, { title, preview });
        for (const m of msgs) {
          await addChatMessage({ sessionId: activeSession, userId: uid, role: m.role === 'user' ? 'user' : 'bot', content: m.text });
        }
      } catch {}
    } else if (uid) {
      try {
        const session = await createChatSession(uid, title);
        for (const m of msgs) {
          await addChatMessage({ sessionId: session.id, userId: uid, role: m.role === 'user' ? 'user' : 'bot', content: m.text });
        }
        const newSessions = [
          { id: session.id, title, preview, date: new Date().toLocaleString('es'), _supabase: true },
          ...chatSessions.filter((s) => s.id !== activeSession),
        ];
        setChatSessions(newSessions);
        try { localStorage.setItem('chatia_history', JSON.stringify(newSessions)); } catch {}
        return;
      } catch {}
    }

    const newSessions = [
      { id: activeSession ?? Date.now(), title, preview, messages: msgs, date: new Date().toLocaleString('es') },
      ...chatSessions.filter((s) => s.id !== activeSession),
    ];
    setChatSessions(newSessions);
    try { localStorage.setItem('chatia_history', JSON.stringify(newSessions)); } catch {}
  };

  const startNewChat = async () => {
    if (messages.length > 1) await saveSession(messages);
    setActiveSession(null);
    setMessages(initialMessages);
  };

  const openSession = async (session) => {
    if (messages.length > 1) await saveSession(messages);
    setActiveSession(session.id);

    if (session._supabase && userIdRef.current) {
      try {
        const dbMessages = await getChatMessages(session.id);
        if (dbMessages && dbMessages.length > 0) {
          const formatted = dbMessages.map((m, i) => ({
            id: i + 1,
            role: m.role === 'user' ? 'user' : 'bot',
            text: m.content,
          }));
          setMessages(formatted);
          return;
        }
      } catch {}
    }

    setMessages(session.messages || initialMessages);
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    if (typeof id === 'number' && userIdRef.current) {
      try { await deleteChatSession(id); } catch {}
    }
    const updated = chatSessions.filter((s) => s.id !== id);
    setChatSessions(updated);
    try { localStorage.setItem('chatia_history', JSON.stringify(updated)); } catch {}
    if (activeSession === id) {
      setActiveSession(null);
      setMessages(initialMessages);
    }
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    const userMsg = { id: Date.now(), role: 'user', text: msg };
    const userMsgArr = [userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const apiMessages = [
        { role: 'system', content: 'Eres Safety Bot, una amiga emocional empática y cálida de una app llamada Safety Love. Tu objetivo es acompañar a los usuarios (principalmente adolescentes y jóvenes) en su bienestar emocional. Hablas en español, tono cercano y amable. Usa emojis con moderación (1-2 por mensaje máximo). Respuestas breves (2-4 oraciones). No das diagnósticos médicos ni reemplazas terapeuta. Si el usuario expresa ideación suicida o autolesión, responde con empatía y proporciona línea de ayuda: "Si estás en crisis, lláma al 800-291-0000 (Línea de la Vida) o escribe al 988". No juzgas, validas sentimientos, y ayudas a encontrar perspectiva.' },
        ...messages.slice(1).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: msg },
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: apiMessages,
          max_tokens: 256,
          temperature: 0.7,
        }),
      });

      const data = await res.json();

      let botReply = '';
      if (!res.ok || data.error) {
        const errMsg = data.error?.message || `Error ${res.status}`;
        botReply = `Error: ${errMsg}`;
      } else {
        botReply = data.choices?.[0]?.message?.content || 'No obtuve respuesta. Intenta de nuevo.';
      }
      const botMsg = { id: Date.now() + 1, role: 'bot', text: botReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { id: Date.now() + 1, role: 'bot', text: `Error de conexion: ${err.message}` };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const pink = '#F43F9E';

  return (
    <div ref={rootRef} className="flex h-full w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: dm ? '#060B18' : '#F5F0E8' }}>
      <style>{`
        img.emoji, img.twemoji { height: 1.1em; width: 1.1em; margin: 0 .05em 0 .1em; vertical-align: -0.15em; display: inline-block; }
        .ia-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .ia-scroll::-webkit-scrollbar-track { background: transparent; }
        .ia-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
        .ia-scroll::-webkit-scrollbar-thumb:hover { background: transparent; }
        @keyframes ia-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ia-glow { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.05)} }
        @keyframes ia-fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ia-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ia-star-pulse { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.2)} }
        .ia-anim-float { animation: ia-float 3s ease-in-out infinite; }
        .ia-anim-glow { animation: ia-glow 4s ease-in-out infinite; }
        .ia-anim-fadeIn { animation: ia-fadeIn 0.4s ease-out forwards; }
        .ia-star { animation: ia-star-pulse 4s ease-in-out infinite; }
        @media (max-width: 768px) { .ia-action-grid { grid-template-columns: 1fr !important; } .ia-hero-row { flex-direction: column !important; text-align: center !important; gap: 20px !important; } .ia-hero-text { max-width: 100% !important; } .ia-hero-mascot-wrap { width: 76px !important; height: 76px !important; } .ia-sidebar { display: none !important; } }
      `}</style>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative z-10">
        {/* Background particles */}
        {!dm && (
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.03), transparent 70%)' }} />
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(244,63,158,0.025), transparent 70%)' }} />
          </div>
        )}
        {dm && (
          <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.03), transparent 70%)' }} />
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(244,63,158,0.025), transparent 70%)' }} />
            {[
              { x: '8%', y: '15%', d: 0 }, { x: '85%', y: '8%', d: 1.5 }, { x: '45%', y: '5%', d: 0.8 },
              { x: '72%', y: '20%', d: 2 }, { x: '20%', y: '85%', d: 1 }, { x: '90%', y: '70%', d: 2.5 },
            ].map((s, i) => (
              <div key={i} className="absolute rounded-full bg-white ia-star" style={{ left: s.x, top: s.y, width: '3px', height: '3px', animationDelay: `${s.d}s` }} />
            ))}
          </div>
        )}

        {/* ═══ HEADER ═══ */}
        <header className="shrink-0 relative z-10" style={{ padding: '20px 32px', borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#E8E0D8'}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: '14px' }}>
              <div className="flex items-center justify-center" style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(244,63,158,0.08)' }}>
                <SafetyMascot size="sm" mascotId={chatMascotId} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1.2 }}>Safety Bot</h1>
                <div className="flex items-center" style={{ gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                  <span style={{ fontSize: '13px', color: dm ? '#64748B' : '#94A3B8', fontWeight: 500 }}>En línea</span>
                </div>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <button
                onClick={startNewChat}
                className="flex items-center gap-2 transition-all duration-200"
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F43F9E, #E11D6D)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(244,63,158,0.25)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,158,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,63,158,0.25)'; }}
              >
                <Plus size={18} strokeWidth={2.5} />
                Nuevo Chat
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 transition-all duration-200"
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: dm ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E8E0D8'}`,
                  color: dm ? '#CBD5E1' : '#475569',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E8E0D8'; e.currentTarget.style.color = dm ? '#CBD5E1' : '#475569'; }}
              >
                <History size={18} />
                Historial
              </button>
            </div>
          </div>
        </header>

        {/* ═══ HISTORY PANEL ═══ */}
        {showHistory && (
          <div className="shrink-0 overflow-y-auto ia-scroll" style={{ maxHeight: '300px', borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#E8E0D8'}`, background: dm ? 'rgba(0,0,0,0.2)' : '#FAFAF8' }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 32px 8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: dm ? '#475569' : '#64748B', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Historial de chats
              </p>
              <button onClick={() => setShowHistory(false)} style={{ color: dm ? '#475569' : '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            {chatSessions.length === 0 ? (
              <div className="text-center" style={{ padding: '32px 16px' }}>
                <MessageCircle size={28} strokeWidth={1.5} style={{ color: dm ? '#334155' : '#CBD5E1', margin: '0 auto 12px' }} />
                <p style={{ fontSize: '13px', color: dm ? '#475569' : '#94A3B8' }}>Sin conversaciones guardadas</p>
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: '4px', padding: '0 16px 16px' }}>
                {chatSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => { openSession(s); setShowHistory(false); }}
                    className="group flex items-center transition-all duration-200 cursor-pointer"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      gap: '12px',
                      background: activeSession === s.id ? (dm ? 'rgba(244,63,158,0.08)' : 'rgba(244,63,158,0.06)') : 'transparent',
                      border: activeSession === s.id ? `1px solid ${dm ? 'rgba(244,63,158,0.15)' : 'rgba(244,63,158,0.12)'}` : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => { if (activeSession !== s.id) e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#F5F0E8'; }}
                    onMouseLeave={(e) => { if (activeSession !== s.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center justify-center shrink-0" style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: activeSession === s.id ? 'rgba(244,63,158,0.12)' : (dm ? 'rgba(255,255,255,0.04)' : '#F5F0E8'),
                    }}>
                      <MessageCircle size={16} style={{ color: activeSession === s.id ? pink : (dm ? '#64748B' : '#94A3B8') }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: '14px', fontWeight: 500, color: activeSession === s.id ? (dm ? '#F8FAFC' : '#1E293B') : (dm ? '#CBD5E1' : '#475569') }} className="truncate">{s.title}</p>
                      <p style={{ fontSize: '12px', color: dm ? '#334155' : '#94A3B8', marginTop: '2px' }} className="truncate">{s.date}</p>
                    </div>
                    <button
                      onClick={(e) => deleteSession(s.id, e)}
                      className="flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{ width: '28px', height: '28px', borderRadius: '8px', color: dm ? '#475569' : '#94A3B8' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; }}
                      title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* ═══ CONTENT ═══ */}
          <div className="flex-1 flex flex-col min-h-0">
            {messages.length === 1 ? (
              /* ═══ WELCOME STATE ═══ */
              <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto ia-scroll" style={{ paddingTop: '8px', paddingBottom: '32px' }}>

                {/* ── HERO ── */}
                {/* ── CONTENT CENTERED ── */}
                <div className="w-full flex-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {/* ── ACTION CARDS ── */}
                  <div className="ia-action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px', maxWidth: '900px', width: '100%' }}>
                  {QUICK_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => send(t.label)}
                      className="group text-left transition-all duration-200"
                      style={{
                        borderRadius: '22px',
                        padding: '26px 24px',
                        background: dm ? t.bg : t.bgLight,
                        border: `1px solid ${dm ? t.border : t.borderLight}`,
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${t.color}12`; e.currentTarget.style.borderColor = `${t.color}25`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = dm ? t.border : t.borderLight; }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                        <div className="flex items-center justify-center transition-all duration-200 group-hover:scale-105" style={{ width: '52px', height: '52px', borderRadius: '16px', background: dm ? t.iconBg : `${t.color}25` }}>
                          <span style={{ fontSize: '24px' }}>{t.emoji}</span>
                        </div>
                        <span style={{ fontSize: '20px', color: t.arrowColor || t.color, opacity: 0.6 }}>→</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '19px', fontWeight: 700, color: dm ? t.labelColorDark : t.labelColor, display: 'block', marginBottom: '6px' }}>{t.label}</span>
                        <p style={{ fontSize: '14px', color: dm ? '#64748B' : '#475569', lineHeight: 1.4 }}>{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* ── SUGGESTIONS ── */}
                <div className="w-full" style={{ maxWidth: '900px' }}>
                  <div className="flex items-center" style={{ gap: '18px', marginBottom: '22px' }}>
                    <div style={{ flex: 1, height: '1px', background: dm ? 'linear-gradient(90deg, transparent, rgba(100,116,139,0.3))' : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1))' }} />
                    <p style={{ fontSize: '12px', fontWeight: 700, color: dm ? '#64748B' : '#64748B', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      &#10022; Puedes contarme sobre... &#10022;
                    </p>
                    <div style={{ flex: 1, height: '1px', background: dm ? 'linear-gradient(90deg, rgba(100,116,139,0.3), transparent)' : 'linear-gradient(90deg, rgba(0,0,0,0.1), transparent)' }} />
                  </div>
                  <div className="flex flex-wrap justify-center" style={{ gap: '14px' }}>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.text}
                        onClick={() => send(s.text)}
                        className="flex items-center transition-all duration-200"
                        style={{
                          borderRadius: '999px',
                          border: dm ? '1px solid rgba(100,116,139,0.2)' : '1px solid rgba(0,0,0,0.1)',
                          background: dm ? '#1E293B' : '#FFFFFF',
                          padding: '0 26px',
                          height: '50px',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: dm ? '#CBD5E1' : '#475569',
                          gap: '10px',
                          boxShadow: dm ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#F5F0E8'; e.currentTarget.style.borderColor = 'rgba(244,63,158,0.15)'; e.currentTarget.style.color = dm ? '#FFFFFF' : '#1E293B'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1E293B' : '#FFFFFF'; e.currentTarget.style.borderColor = dm ? 'rgba(100,116,139,0.2)' : 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = dm ? '#CBD5E1' : '#475569'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                      >
                        <span style={{ fontSize: '16px' }}>{s.emoji}</span>
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </main>
            ) : (
              /* ═══ CHAT MESSAGES ═══ */
              <main ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto ia-scroll" style={{ paddingBottom: '16px' }}>
                <div className="w-full" style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {/* Compact welcome */}
                  {messages.length === 2 && (
                    <div className="flex flex-col items-center" style={{ paddingTop: '8px', paddingBottom: '28px' }}>
                      <div className="relative" style={{ marginBottom: '16px' }}>
                        <div className="flex items-center justify-center" style={{ width: '80px', height: '80px', borderRadius: '22px', background: 'rgba(244,63,158,0.05)', border: '1px solid rgba(244,63,158,0.06)' }}>
                          <SafetyMascot size="md" mascotId={chatMascotId} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 700, color: dm ? '#F8FAFC' : '#1E293B', marginBottom: '4px' }}>Safety Bot</h2>
                      <p style={{ fontSize: '13px', color: dm ? '#475569' : '#64748B', textAlign: 'center' }}>Tu espacio seguro</p>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex flex-col" style={{ gap: '18px' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} className="ia-anim-fadeIn" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '12px', paddingLeft: msg.role === 'user' ? '48px' : '0', paddingRight: msg.role === 'user' ? '0' : '48px' }}>
                        {msg.role === 'bot' && (
                          <div className="shrink-0 flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '13px', background: dm ? 'rgba(244,63,158,0.06)' : '#FFF0F5', marginTop: '2px' }}>
                            <SafetyMascot size="sm" mascotId={chatMascotId} />
                          </div>
                        )}
                        <div style={{ maxWidth: '72%' }}>
                          <div
                            className="whitespace-pre-line"
                            style={{
                              fontSize: '15px',
                              lineHeight: 1.7,
                              borderRadius: msg.role === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                              padding: msg.role === 'user' ? '14px 20px' : '16px 22px',
                              background: msg.role === 'user' ? 'linear-gradient(135deg, #F43F9E, #E11D6D)' : (dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF'),
                              color: msg.role === 'user' ? '#FFFFFF' : (dm ? '#CBD5E1' : '#334155'),
                              border: msg.role === 'user' ? 'none' : (dm ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)'),
                              boxShadow: msg.role === 'user' ? '0 4px 16px rgba(244,63,158,0.2)' : (dm ? '0 2px 8px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.06)'),
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                        {msg.role === 'user' && (
                          <div className="shrink-0 flex items-center justify-center overflow-hidden" style={{ width: '40px', height: '40px', borderRadius: '13px', background: 'linear-gradient(135deg, #F43F9E, #E11D6D)', marginTop: '2px' }}>
                            {userPhotoUrl ? (
                              <img src={userPhotoUrl} alt="Tú" className="w-full h-full object-cover" />
                            ) : (
                              <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>Tú</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {typing && (
                      <div className="ia-anim-fadeIn" style={{ display: 'flex', gap: '12px' }}>
                        <div className="shrink-0 flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '13px', background: dm ? 'rgba(244,63,158,0.06)' : '#FFF0F5' }}>
                          <SafetyMascot size="sm" mascotId={chatMascotId} />
                        </div>
                        <div className="flex items-center" style={{ gap: '6px', borderRadius: '20px 20px 20px 8px', padding: '16px 22px', background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF', border: dm ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(244,63,158,0.4)', animation: 'ia-bounce 1s ease-in-out infinite', animationDelay: '0ms' }} />
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(244,63,158,0.4)', animation: 'ia-bounce 1s ease-in-out infinite', animationDelay: '150ms' }} />
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(244,63,158,0.4)', animation: 'ia-bounce 1s ease-in-out infinite', animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            )}
          </div>

          {/* ═══ INPUT BAR ═══ */}
          <div className="relative z-10 shrink-0" style={{ padding: '0 32px 24px 32px' }}>
            <div className="w-full">
              <div
                className="flex items-center transition-all duration-200"
                style={{
                  borderRadius: '24px',
                  border: dm ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E8E0D8',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  padding: '10px 12px 10px 26px',
                  minHeight: '76px',
                  boxShadow: dm ? '0 4px 24px rgba(0,0,0,0.15)' : '0 4px 24px rgba(0,0,0,0.06)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(244,63,158,0.2)'; e.currentTarget.style.boxShadow = dm ? '0 4px 24px rgba(0,0,0,0.15), 0 0 0 3px rgba(244,63,158,0.06)' : '0 4px 24px rgba(0,0,0,0.06), 0 0 0 3px rgba(244,63,158,0.06)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.06)' : '#E8E0D8'; e.currentTarget.style.boxShadow = dm ? '0 4px 24px rgba(0,0,0,0.15)' : '0 4px 24px rgba(0,0,0,0.06)'; }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Escribe cómo te sientes..."
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: '17px', color: dm ? '#E2E8F0' : '#1E293B', minHeight: '52px' }}
                />
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <button
                    className="flex items-center justify-center transition-all duration-200"
                    style={{ width: '50px', height: '50px', borderRadius: '16px', color: dm ? '#64748B' : '#94A3B8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.06)' : '#F5F0E8'; e.currentTarget.style.color = dm ? '#94A3B8' : '#475569'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? '#64748B' : '#94A3B8'; }}
                  >
                    <Mic size={22} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || typing}
                    className="flex items-center justify-center transition-all duration-200"
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      background: input.trim() && !typing ? 'linear-gradient(135deg, #F43F9E, #E11D6D)' : (dm ? 'rgba(255,255,255,0.04)' : '#F0EBE5'),
                      color: input.trim() && !typing ? '#FFFFFF' : (dm ? '#475569' : '#94A3B8'),
                      boxShadow: input.trim() && !typing ? '0 4px 20px rgba(244,63,158,0.3)' : 'none',
                      cursor: input.trim() && !typing ? 'pointer' : 'default',
                      opacity: input.trim() && !typing ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => { if (input.trim() && !typing) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(244,63,158,0.4)'; } }}
                    onMouseLeave={(e) => { if (input.trim() && !typing) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(244,63,158,0.3)'; } }}
                  >
                    <Send size={20} strokeWidth={2.2} style={{ marginLeft: '2px' }} />
                  </button>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '13px', color: dm ? '#475569' : '#94A3B8', marginTop: '14px', fontWeight: 500 }}>
                🔒 Este es un espacio seguro y confidencial ❤️
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
