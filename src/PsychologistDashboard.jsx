import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Users, Calendar, BarChart3, Heart,
  Settings, ChevronRight, TrendingUp,
  UserCheck, LogOut, AlertTriangle, MessageCircle, Siren, X, User, Mail, Camera, Pencil, Brain, PenTool
} from 'lucide-react';
import EstudiantesSection from './EstudiantesSection.jsx';
import AgendaSection from './AgendaSection.jsx';
import ConfiguracionStudentSection from './ConfiguracionStudentSection.jsx';
import BlogAnonimo from './BlogAnonimo.jsx';
import { listenToEmergencyUpdates, markAsRead, markAllRead, getRequests } from './emergencyStore';
import { getUser, getProfile, updateProfile } from './services/auth';
import { getAssignedStudents } from './services/psychologist';

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: <Home size={18} /> },
  { id: 'estudiantes', label: 'Mis estudiantes', icon: <Users size={18} /> },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
  { id: 'blog', label: 'Blog anónimo', icon: <MessageCircle size={18} /> },
  { id: 'config', label: 'Configuración', icon: <Settings size={18} /> },
];

const INITIAL_SESSIONS = [];

const FOLLOW_UPS_DEFAULT = [];

function MiniBarChart({ darkMode, registros = [0,0,0,0,0,0,0], sesiones = [0,0,0,0,0,0,0] }) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const yLabels = [0, 25, 50, 75, 100];
  const hasData = registros.some(v => v > 0) || sesiones.some(v => v > 0);

  const w = 520;
  const h = 200;
  const padL = 36;
  const padR = 12;
  const padT = 10;
  const padB = 28;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const toX = (i) => padL + (i / (days.length - 1)) * chartW;
  const toY = (v) => padT + chartH - (v / 100) * chartH;

  const makePath = (data) => data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  const labelColor = darkMode ? 'fill-slate-500' : 'fill-gray-400';

  if (!hasData) {
    return (
      <div className="w-full flex flex-col items-center justify-center" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="flex items-center justify-center mb-4" style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: darkMode ? 'rgba(244,63,158,0.08)' : 'rgba(244,63,158,0.06)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#F472B6' : '#F43F9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#64748B' : '#94A3B8', marginBottom: '4px' }}>Sin actividad aún</p>
        <p style={{ fontSize: '12px', fontWeight: 500, color: darkMode ? '#475569' : '#CBD5E1' }}>Los datos aparecerán cuando empiecen las sesiones</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 210 }}>
        {yLabels.map((v) => (
          <g key={v}>
            <line x1={padL} y1={toY(v)} x2={w - padR} y2={toY(v)} stroke={gridColor} strokeWidth="1" />
            <text x={padL - 6} y={toY(v) + 3.5} textAnchor="end" className={`text-[9px] ${labelColor} font-semibold`}>{v}</text>
          </g>
        ))}
        {days.map((day, i) => (
          <text key={day} x={toX(i)} y={h - 4} textAnchor="middle" className={`text-[10px] ${labelColor} font-semibold`}>{day}</text>
        ))}
        <path
          d={`${makePath(registros)} L${toX(6)},${toY(0)} L${toX(0)},${toY(0)} Z`}
          fill="url(#pinkGradDark)"
          opacity="0.15"
        />
        <path d={makePath(sesiones)} fill="none" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={makePath(registros)} fill="none" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {registros.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3.5" fill={darkMode ? '#1a2332' : 'white'} stroke="#F472B6" strokeWidth="2" />
        ))}
        {sesiones.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={darkMode ? '#1a2332' : 'white'} stroke="#C4B5FD" strokeWidth="2" />
        ))}
        <defs>
          <linearGradient id="pinkGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DonutChart({ darkMode, segments = [] }) {
  const hasData = segments.length > 0 && segments.some(s => s.pct > 0);

  if (!hasData) {
    return (
      <div className="w-full flex flex-col items-center justify-center" style={{ padding: '30px 0', textAlign: 'center' }}>
        <div className="flex items-center justify-center mb-4" style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: darkMode ? 'rgba(244,63,158,0.08)' : 'rgba(244,63,158,0.06)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#F472B6' : '#F43F9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#64748B' : '#94A3B8', marginBottom: '4px' }}>Sin datos aún</p>
        <p style={{ fontSize: '12px', fontWeight: 500, color: darkMode ? '#475569' : '#CBD5E1' }}>Los registros emocionales aparecerán aquí</p>
      </div>
    );
  }

  let cumulative = 0;
  const radius = 60;
  const cx = 80;
  const cy = 80;

  const arcs = segments.map((seg) => {
    const startAngle = (cumulative / 100) * 360 - 90;
    cumulative += seg.pct;
    const endAngle = (cumulative / 100) * 360 - 90;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = seg.pct > 50 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return (
      <path key={seg.label} d={d} fill={seg.color} stroke={darkMode ? '#0f1724' : 'white'} strokeWidth="2.5" />
    );
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-[150px] h-[150px] shrink-0">
        {arcs}
        <circle cx={cx} cy={cy} r="38" fill={darkMode ? '#111c2e' : 'white'} />
        <text x={cx} y={cy - 4} textAnchor="middle" className={`text-[12px] font-bold ${darkMode ? 'fill-slate-200' : 'fill-gray-700'}`}>100%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className={`text-[8px] ${darkMode ? 'fill-slate-500' : 'fill-gray-400'}`}>positivos</text>
      </svg>
      <div className="flex flex-col gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className={`text-[12px] font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{seg.label}</span>
            <span className={`text-[13px] font-bold ml-auto ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PsychologistDashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('inicio');
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('safetyLove_psychDarkMode') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    try { localStorage.setItem('safetyLove_psychDarkMode', darkMode); } catch {}
  }, [darkMode]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [profileEditField, setProfileEditField] = useState(null);
  const [profileEditValue, setProfileEditValue] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('safetyLove_psychName') || 'Psicólogo');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('safetyLove_psychEmail') || '');
  const [userSpecialty, setUserSpecialty] = useState('');
  const [upcomingSessions, setUpcomingSessions] = useState(INITIAL_SESSIONS);
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [assignedStudentCount, setAssignedStudentCount] = useState(0);
  const [followUps, setFollowUps] = useState(FOLLOW_UPS_DEFAULT);
  const [userBio, setUserBio] = useState('Cada pequeño paso cuenta.');

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (!user) return;
        const signupName = user.user_metadata?.name || '';
        const signupEmail = user.email || '';
        setUserName(signupName || 'Psicólogo');
        setUserEmail(signupEmail);
        localStorage.setItem('safetyLove_psychName', signupName || 'Psicólogo');
        localStorage.setItem('safetyLove_psychEmail', signupEmail);
        try {
          const profile = await getProfile(user.id);
          if (profile) {
            setUserSpecialty(profile.specialty || '');
            if (profile.avatar && profile.avatar.startsWith('http')) {
              setUserPhotoUrl(profile.avatar);
            }
          }
        } catch {}
        const students = await getAssignedStudents(user.id);
        setAssignedStudentCount(students?.length || 0);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    setEmergencyRequests(getRequests());
    const unsub = listenToEmergencyUpdates(setEmergencyRequests);
    return unsub;
  }, []);

  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} de ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const bg = darkMode ? '#070D1C' : '#F5F0E8';
  const cardBg = darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = darkMode ? '#F1F5F9' : '#1E293B';
  const textSecondary = darkMode ? '#64748B' : '#94A3B8';
  const textMuted = darkMode ? '#475569' : '#CBD5E1';

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 200ms ease',
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: bg, fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        h1, h2, h3, h4 { font-family: 'Poppins', sans-serif !important; }
        .psych-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .psych-nav-item { transition: all 180ms ease; }
        .psych-nav-item:hover { transform: scale(1.08); }
        .psych-link:hover { opacity: 0.8; }
      `}</style>

      {/* ═══ MOBILE MENU BUTTON ═══ */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[90] w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
        style={{ background: darkMode ? 'rgba(30,41,59,0.92)' : 'rgba(255,255,255,0.92)', color: darkMode ? '#CBD5E1' : '#475569', backdropFilter: 'blur(16px)' }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Home size={20} />}
      </button>

      {/* ═══ PROFILE MODAL ═══ */}
      {profileOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setProfileOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%', maxWidth: '960px', maxHeight: '88vh',
              overflowY: 'auto', borderRadius: '28px',
              background: darkMode ? '#0F172A' : '#FFFFFF',
              border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.25), 0 4px 20px rgba(0,0,0,0.1)',
              padding: '0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── CLOSE BUTTON ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 28px 0' }}>
              <button onClick={() => setProfileOpen(false)}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                  color: darkMode ? '#64748B' : '#94A3B8',
                  border: 'none', cursor: 'pointer', transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '8px 48px 48px' }}>

              {/* ── HEADER: AVATAR + INFO ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '32px',
                marginBottom: '32px', flexWrap: 'wrap'
              }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                    border: '3px solid #F472B6',
                    boxShadow: '0 8px 24px rgba(244,114,182,0.2)'
                  }}>
                    {userPhotoUrl ? (
                      <img src={userPhotoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={44} style={{ color: darkMode ? '#475569' : '#94A3B8' }} />
                    )}
                  </div>
                  <label style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: '#EC4899',
                    border: '3px solid ' + (darkMode ? '#0F172A' : '#FFFFFF'),
                    boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                    transition: 'all 200ms ease'
                  }}>
                    <Camera size={16} color="#fff" />
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { const r = new FileReader(); r.onload = async (ev) => { const dataUrl = ev.target.result; setUserPhotoUrl(dataUrl); try { const user = await getUser(); if (user) await updateProfile(user.id, { avatar: dataUrl }); } catch(e) { console.log('[Psych] Error guardando avatar:', e.message); } }; r.readAsDataURL(f); }
                    }} />
                  </label>
                </div>

                {/* Name + Bio + Email */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2 style={{
                    fontSize: '30px', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#0F172A',
                    lineHeight: 1.2, marginBottom: '8px', letterSpacing: '-0.02em',
                    fontFamily: "'Poppins', sans-serif",
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {userName}
                  </h2>
                  <p style={{
                    fontSize: '16px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8',
                    marginBottom: '10px', lineHeight: 1.4
                  }}>
                    {userBio || 'Cada pequeño paso cuenta.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} style={{ color: darkMode ? '#475569' : '#94A3B8' }} />
                    <span style={{
                      fontSize: '14px', fontWeight: 500,
                      color: darkMode ? '#475569' : '#94A3B8'
                    }}>{userEmail}</span>
                  </div>
                </div>
              </div>

              {/* ── STATS ── */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px', marginBottom: '32px'
              }}>
                {[
                  { value: String(assignedStudentCount), label: 'Estudiantes', color: '#EC4899', bg: darkMode ? 'rgba(236,72,153,0.1)' : '#FDF2F8', icon: '👩‍🎓' },
                  { value: String(upcomingSessions.length), label: 'Sesiones', color: '#F59E0B', bg: darkMode ? 'rgba(245,158,11,0.1)' : '#FFFBEB', icon: '📋' },
                  { value: '0', label: 'Años exp.', color: '#8B5CF6', bg: darkMode ? 'rgba(139,92,246,0.1)' : '#F5F3FF', icon: '📅' },
                ].map((s) => (
                  <div key={s.label} style={{
                    borderRadius: '20px', padding: '24px', textAlign: 'center',
                    background: s.bg,
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 200ms ease'
                  }}>
                    <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>{s.icon}</span>
                    <p style={{
                      fontSize: '32px', fontWeight: 800, color: s.color,
                      lineHeight: 1, fontFamily: "'Poppins', sans-serif"
                    }}>{s.value}</p>
                    <p style={{
                      fontSize: '14px', fontWeight: 600,
                      color: darkMode ? '#475569' : '#94A3B8', marginTop: '6px'
                    }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── DATA FIELDS ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {[
                  { icon: <User size={18} />, label: 'NOMBRE', value: userName, field: 'name' },
                  { icon: <Mail size={18} />, label: 'CORREO', value: userEmail, field: 'email' },
                  { icon: <PenTool size={18} />, label: 'BIO', value: userBio || 'No configurada', field: 'bio' },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderRadius: '18px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                    minHeight: '80px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
                        color: darkMode ? '#64748B' : '#64748B', flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                          color: darkMode ? '#475569' : '#94A3B8', marginBottom: '4px'
                        }}>{item.label}</p>
                        <p style={{
                          fontSize: '16px', fontWeight: 600,
                          color: darkMode ? '#E2E8F0' : '#1E293B',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{item.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileEditField(item.field);
                        setProfileEditValue(item.field === 'name' ? userName : item.field === 'email' ? userEmail : userBio);
                      }}
                      style={{
                        fontSize: '14px', fontWeight: 600, color: '#EC4899',
                        background: darkMode ? 'rgba(236,72,153,0.1)' : '#FDF2F8',
                        border: 'none', cursor: 'pointer', flexShrink: 0,
                        padding: '8px 18px', borderRadius: '12px',
                        transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.2)' : '#FCE7F3'}
                      onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.1)' : '#FDF2F8'}
                    >
                      Editar <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <button
                  onClick={() => { setProfileOpen(false); setActiveNav('config'); }}
                  style={{
                    height: '64px', borderRadius: '18px', border: 'none',
                    background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 16px rgba(236,72,153,0.3)',
                    transition: 'all 200ms ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.3)'; }}
                >
                  <Pencil size={18} /> Editar perfil
                </button>
                <button
                  onClick={() => { setProfileOpen(false); setActiveNav('config'); }}
                  style={{
                    height: '64px', borderRadius: '18px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    background: darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                    color: darkMode ? '#CBD5E1' : '#475569',
                    fontSize: '16px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 200ms ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9'}
                >
                  <Settings size={18} /> Ajustes
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ PROFILE EDIT MODAL ═══ */}
      {profileEditField && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onMouseDown={() => setProfileEditField(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-full max-w-[520px] rounded-[28px] shadow-2xl overflow-hidden ${darkMode ? 'bg-[#1E293B]' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col items-center pt-10 pb-6 px-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-pink-500 to-rose-500">
                <User size={28} color="#fff" />
              </div>
              <h3 className={`text-[22px] font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {profileEditField === 'name' ? 'Editar nombre' : profileEditField === 'email' ? 'Editar correo' : 'Editar bio'}
              </h3>
              <p className={`text-[13px] font-medium mt-2 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {profileEditField === 'name' ? 'Actualiza el nombre que se muestra en tu perfil.' : profileEditField === 'email' ? 'Actualiza tu correo electrónico.' : 'Actualiza tu biografía personal.'}
              </p>
            </div>

            {/* Input */}
            <div className="px-8 pb-3">
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-2 pl-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {profileEditField === 'name' ? 'Nombre' : profileEditField === 'email' ? 'Correo' : 'Bio'}
              </label>
              <div className="relative">
                {!profileEditValue && (
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {profileEditField === 'name' ? <User size={18} /> : profileEditField === 'email' ? <Mail size={18} /> : <PenTool size={18} />}
                  </div>
                )}
                <input
                  autoFocus
                  value={profileEditValue}
                  onChange={(e) => setProfileEditValue(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === 'Enter') { const val = profileEditValue.trim(); if (!val) return; if (profileEditField === 'name') { setUserName(val); localStorage.setItem('safetyLove_psychName', val); } else if (profileEditField === 'email') { setUserEmail(val); localStorage.setItem('safetyLove_psychEmail', val); } else { setUserBio(val); localStorage.setItem('safetyLove_userBio', val); } (async () => { try { const user = await getUser(); if (user) await updateProfile(user.id, { [profileEditField]: val }); } catch {} })(); setProfileEditField(null); } }}
                  className={`w-full h-[56px] pl-12 pr-5 rounded-2xl border text-[15px] font-medium outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,63,158,0.12)] ${darkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-gray-50 text-slate-800'}`}
                  placeholder=""
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 px-8 pb-8 pt-6">
              <button onClick={() => setProfileEditField(null)}
                className={`flex-1 h-[54px] rounded-2xl font-semibold text-[14px] transition-all duration-200 border ${darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10' : 'bg-gray-100 text-slate-600 hover:bg-gray-200 border-gray-200'}`}>
                Cancelar
              </button>
              <button onClick={async () => {
                const val = profileEditValue.trim();
                if (!val) return;
                if (profileEditField === 'name') { setUserName(val); localStorage.setItem('safetyLove_psychName', val); }
                else if (profileEditField === 'email') { setUserEmail(val); localStorage.setItem('safetyLove_psychEmail', val); }
                else { setUserBio(val); localStorage.setItem('safetyLove_userBio', val); }
                try {
                  const user = await getUser();
                  if (user) await updateProfile(user.id, { [profileEditField]: val });
                } catch {}
                setProfileEditField(null);
              }}
                className="flex-1 h-[54px] rounded-2xl font-semibold text-[14px] transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #F43F9E, #E11D6D)', color: '#fff', boxShadow: '0 4px 16px rgba(244,63,158,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,158,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,63,158,0.3)'; }}>
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ FLOATING DOCK NAV ═══ */}
      <nav
        className="fixed z-[80] hidden lg:flex flex-col items-center transition-all duration-200 ease-out"
        style={{
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '64px',
          padding: '8px 0',
          gap: '2px',
          borderRadius: '20px',
          background: darkMode ? 'rgba(15,23,36,0.92)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
          boxShadow: darkMode
            ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
        }}
      >
        <button
          onClick={() => setActiveNav('inicio')}
          className="flex items-center justify-center shrink-0 transition-all duration-180 overflow-hidden"
          style={{ width: '64px', height: '56px', borderRadius: '14px', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <img src="/logo.png" alt="SafetyLove" className="w-full h-full object-contain" />
        </button>

        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveNav(item.id)}
                className="psych-nav-item flex items-center justify-center shrink-0"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, #F43F9E, #E11D6D)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  boxShadow: isActive ? '0 2px 12px rgba(244,63,158,0.35)' : 'none',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'; e.currentTarget.style.color = darkMode ? '#F8FAFC' : '#1E293B'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; } }}
              >
                {item.icon}
              </button>
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50"
                style={{ background: '#1E293B', color: '#F8FAFC', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                {item.label}
              </div>
            </div>
          );
        })}

        <div className="h-px w-8 shrink-0" style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

        <div className="relative group">
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center justify-center shrink-0 transition-all duration-180 overflow-hidden"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: profileOpen ? 'linear-gradient(135deg, #F43F9E, #E11D6D)' : 'transparent',
              color: profileOpen ? '#FFFFFF' : '#94A3B8',
              boxShadow: profileOpen ? '0 2px 12px rgba(244,63,158,0.35)' : 'none',
            }}
            onMouseEnter={(e) => { if (!profileOpen) { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'; e.currentTarget.style.transform = 'scale(1.08)'; } }}
            onMouseLeave={(e) => { if (!profileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; } }}
          >
            <div className="w-7 h-7 rounded-[8px] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F472B6, #FB7185)' }}>
              {userPhotoUrl ? (
                <img src={userPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[11px] font-bold">{userName?.charAt(0) || 'D'}</span>
              )}
            </div>
          </button>
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 rounded-[6px] text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-180 z-50"
            style={{ background: '#1E293B', color: '#F8FAFC', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          >
            Perfil
          </div>
        </div>
      </nav>

      {/* ═══ MOBILE NAV ═══ */}
      {mobileMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav
            className="lg:hidden fixed z-[80] flex flex-col items-center transition-all duration-200 ease-out"
            style={{
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '64px',
              padding: '8px 0',
              gap: '4px',
              borderRadius: '20px',
              background: darkMode ? 'rgba(15,23,36,0.92)' : 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
            }}
          >
            <button
              onClick={() => { setActiveNav('inicio'); setMobileMenuOpen(false); }}
              className="flex items-center justify-center shrink-0 transition-all duration-180"
              style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'transparent', color: '#94A3B8' }}
            >
              <Heart size={20} />
            </button>
            <div className="h-px w-8 shrink-0" style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center shrink-0 transition-all duration-180"
                  style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: isActive ? 'linear-gradient(135deg, #F43F9E, #E11D6D)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    boxShadow: isActive ? '0 2px 12px rgba(244,63,158,0.35)' : 'none',
                  }}
                >
                  {item.icon}
                </button>
              );
            })}
            <div className="h-px w-8 shrink-0" style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />
            <button
              onClick={() => { setProfileOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-center shrink-0 transition-all duration-180 overflow-hidden"
              style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'transparent', color: '#94A3B8' }}
            >
              <div className="w-7 h-7 rounded-[8px] overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F472B6, #FB7185)' }}>
                {userPhotoUrl ? (
                  <img src={userPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[11px] font-bold">{userName?.charAt(0) || 'D'}</span>
                )}
              </div>
            </button>
          </nav>
        </>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 overflow-hidden" style={{ paddingLeft: '96px' }}>
        {activeNav === 'estudiantes' ? (
          <div className="h-full">
            <EstudiantesSection darkMode={darkMode} selectedStudentId={selectedStudentId} onStudentSelected={() => setSelectedStudentId(null)} />
          </div>
        ) : activeNav === 'agenda' ? (
          <div className="h-full">
            <AgendaSection darkMode={darkMode} onSessionCreated={(session) => setUpcomingSessions(prev => [...prev, session])} />
          </div>
        ) : activeNav === 'blog' ? (
          <div className="h-full">
            <BlogAnonimo darkMode={darkMode} />
          </div>
        ) : activeNav === 'config' ? (
          <div className={`h-full overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#070D1C]' : 'bg-[#FAFAFC]'}`}>
            <ConfiguracionStudentSection
              darkMode={darkMode}
              onToast={(msg) => { /* simple toast */ }}
              onDarkModeChange={setDarkMode}
              userPhotoUrl={userPhotoUrl}
              setUserPhotoUrl={setUserPhotoUrl}
              userName={userName}
              setUserName={setUserName}
              userBio={userBio}
              setUserBio={setUserBio}
              onLogout={onLogout}
            />
          </div>
        ) : (
        <div className="h-full overflow-y-auto" style={{ background: bg }}>
        <div className="flex justify-center">
        <div className="flex flex-col" style={{ maxWidth: '1100px', width: '100%', padding: '32px 40px', gap: '28px' }}>

          {/* ═══ HEADER ═══ */}
          <div className="flex items-start justify-between" style={{ gap: '16px' }}>
            <div>
              <h2 className="leading-tight" style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, fontFamily: "'Poppins', sans-serif" }}>
                ¡Buenos días, {userName}! <span className="inline-block">💕</span>
              </h2>
              <p className="mt-1.5" style={{ fontSize: '14px', color: textSecondary }}>
                Aquí tienes un resumen de tu acompañamiento de hoy.
              </p>
            </div>
            <div className="text-right shrink-0" style={{ paddingTop: '4px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: textSecondary }}>{dateStr}</p>
            </div>
          </div>

          {/* ═══ EMERGENCY ALERTS ═══ */}
          {emergencyRequests.length > 0 && (
            <div style={{
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(239,68,68,0.3)',
              background: darkMode ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.03)',
            }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse" style={{ background: '#EF4444' }}>
                    <Siren size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#EF4444' }}>Solicitudes de emergencia</h3>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#F87171' }}>{emergencyRequests.length} solicitud{emergencyRequests.length > 1 ? 'es' : ''} pendiente{emergencyRequests.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button onClick={() => markAllRead()} className="psych-link" style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', textDecoration: 'underline' }}>
                  Descartar todas
                </button>
              </div>
              <div className="flex flex-col" style={{ gap: '10px' }}>
                {emergencyRequests.map((req) => (
                  <div key={req.id} className="flex items-center" style={{
                    gap: '16px', padding: '14px 16px', borderRadius: '14px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: '1px solid rgba(239,68,68,0.15)',
                  }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>
                        {req.student} necesita ayuda
                      </p>
                      <p style={{ fontSize: '12px', color: textSecondary, fontWeight: 600, marginTop: '2px' }}>
                        {req.date} · {req.time}
                      </p>
                    </div>
                    <button onClick={() => markAsRead(req.id)} className="shrink-0" style={{
                      padding: '8px 16px', borderRadius: '10px', background: '#F43F9E', color: '#FFFFFF',
                      fontSize: '12px', fontWeight: 700, transition: 'all 150ms ease',
                    }}>
                      Atender
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ STATS CARDS ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '20px' }}>
            {[
              { value: String(assignedStudentCount), label: 'Estudiantes asignados', icon: <Users size={20} />, iconBg: darkMode ? 'rgba(244,63,158,0.12)' : '#FFF1F5', iconColor: '#F43F9E' },
              { value: String(upcomingSessions.length), label: 'Sesiones hoy', icon: <Calendar size={20} />, iconBg: darkMode ? 'rgba(59,130,246,0.12)' : '#EFF6FF', iconColor: '#3B82F6' },
              { value: String(followUps.length), label: 'Seguimientos recomendados', icon: <TrendingUp size={20} />, iconBg: darkMode ? 'rgba(139,92,246,0.12)' : '#F5F3FF', iconColor: '#8B5CF6' },
            ].map((stat) => (
              <div key={stat.label} className="psych-card" style={{
                ...cardStyle,
                display: 'flex', alignItems: 'center', gap: '16px',
                cursor: 'default',
              }}>
                <div className="shrink-0 flex items-center justify-center" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: stat.iconBg, color: stat.iconColor,
                }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 800, color: textPrimary, lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginTop: '4px' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ CHARTS ROW ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '20px' }}>

            {/* Weekly Activity */}
            <div className="psych-card" style={cardStyle}>
              <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>Resumen de actividad semanal</h3>
                <div className="flex items-center" style={{ gap: '16px' }}>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F472B6' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>Registros</span>
                  </div>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C4B5FD' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>Sesiones realizadas</span>
                  </div>
                </div>
              </div>
              <MiniBarChart darkMode={darkMode} />
            </div>

            {/* Emotional State */}
            <div className="psych-card" style={cardStyle}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '4px' }}>Estado emocional general</h3>
              <p style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginBottom: '20px' }}>Últimos 30 días</p>
              <DonutChart darkMode={darkMode} segments={[]} />
              <div style={{
                marginTop: '20px', padding: '14px 16px', borderRadius: '12px',
                background: darkMode ? 'rgba(244,63,158,0.06)' : 'rgba(244,63,158,0.04)',
                border: `1px solid ${darkMode ? 'rgba(244,63,158,0.15)' : 'rgba(244,63,158,0.1)'}`,
              }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, lineHeight: 1.6 }}>
                  📊 Los registros emocionales de tus estudiantes aparecerán aquí una vez que empiecen a usar la plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* ═══ BOTTOM ROW ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '20px' }}>

            {/* Upcoming Sessions */}
            <div className="psych-card" style={cardStyle}>
              <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>Sesiones próximas</h3>
                <button onClick={() => setActiveNav('agenda')} className="psych-link" style={{ fontSize: '12px', fontWeight: 700, color: '#F43F9E' }}>Ver agenda completa</button>
              </div>
              {upcomingSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center" style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div className="flex items-center justify-center" style={{
                    width: '56px', height: '56px', borderRadius: '50%', marginBottom: '16px',
                    background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                  }}>
                    <Calendar size={24} style={{ color: darkMode ? '#475569' : '#CBD5E1' }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: textSecondary, marginBottom: '4px' }}>No hay sesiones próximas</p>
                  <p style={{ fontSize: '12px', color: textMuted }}>Crea una sesión en la agenda para que aparezca aquí.</p>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  {upcomingSessions.map((s, i) => (
                    <div key={i} className="flex items-center" style={{
                      gap: '14px', padding: '12px', borderRadius: '12px',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div className="shrink-0 flex items-center justify-center" style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: s.color, color: '#FFFFFF', fontSize: '13px', fontWeight: 700,
                      }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '13px', fontWeight: 700, color: textPrimary }}>{s.name}</p>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>{s.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p style={{ fontSize: '12px', fontWeight: 700, color: textPrimary }}>{s.date}</p>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: textSecondary }}>{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Follow-ups */}
            <div className="psych-card" style={cardStyle}>
              <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>Seguimientos recomendados</h3>
                <button onClick={() => { setSelectedStudentId(null); setActiveNav('estudiantes'); }} className="psych-link" style={{ fontSize: '12px', fontWeight: 700, color: '#F43F9E' }}>Ver todas</button>
              </div>
              <div className="flex flex-col" style={{ gap: '10px' }}>
                {followUps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center" style={{ padding: '40px 0', textAlign: 'center' }}>
                    <div className="flex items-center justify-center" style={{
                      width: '56px', height: '56px', borderRadius: '50%', marginBottom: '16px',
                      background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                    }}>
                      <UserCheck size={24} style={{ color: darkMode ? '#475569' : '#CBD5E1' }} />
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: textSecondary, marginBottom: '4px' }}>Sin seguimientos pendientes</p>
                    <p style={{ fontSize: '12px', color: textMuted }}>Los seguimientos aparecerán cuando tengas estudiantes asignados.</p>
                  </div>
                ) : followUps.map((f, i) => (
                  <div key={i} className="flex items-start" style={{
                    gap: '14px', padding: '14px 16px', borderRadius: '14px',
                    border: `1px solid ${cardBorder}`,
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = darkMode ? 'rgba(244,63,158,0.3)' : 'rgba(244,63,158,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = cardBorder; }}
                  >
                    <div className="shrink-0 flex items-center justify-center" style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: f.hasAlert ? (darkMode ? 'rgba(239,68,68,0.12)' : '#FEF2F2') : (darkMode ? 'rgba(34,197,94,0.12)' : '#F0FDF4'),
                      color: f.hasAlert ? '#EF4444' : '#22C55E',
                    }}>
                      {f.hasAlert ? <AlertTriangle size={18} /> : <UserCheck size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 700, color: textPrimary }}>{f.name}</p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginTop: '2px', lineHeight: 1.5 }}>{f.note}</p>
                    </div>
                    <button onClick={() => { setSelectedStudentId(f.studentId); setActiveNav('estudiantes'); }} className="shrink-0" style={{
                      padding: '8px 16px', borderRadius: '10px', background: '#F43F9E', color: '#FFFFFF',
                      fontSize: '12px', fontWeight: 700, transition: 'all 150ms ease',
                    }}>
                      Revisar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        </div>
        </div>
        )}
      </main>
    </div>
  );
}
