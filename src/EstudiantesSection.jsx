import React, { useState, useEffect } from 'react';
import {
  Search, ChevronLeft, ChevronRight, ArrowLeft,
  Calendar, AlertTriangle, UserCheck, ChevronDown,
  BookOpen, FileText, StickyNote, Video, Users, Lightbulb, Sparkles
} from 'lucide-react';
import { getUser } from './services/auth';
import { getAssignedStudents } from './services/psychologist';

function AppleEmoji({ emoji, className = "w-5 h-5 inline-block align-middle" }) {
  if (!emoji) return null;
  const codePoints = Array.from(emoji).map(c => c.codePointAt(0).toString(16));
  return <img src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoints.join('-')}.png`} alt={emoji} className={className} />;
}

const FILTERS = ['Todos', 'En seguimiento', 'Requieren atención', 'Sin actividad reciente'];
const DETAIL_TABS = ['Resumen', 'Blog', 'Juegos'];

export default function EstudiantesSection({ darkMode = false, selectedStudentId = null, onStudentSelected = () => {} }) {
  const dm = darkMode;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('Resumen');
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (!user) { setLoading(false); return; }
        const assigned = await getAssignedStudents(user.id);
        if (!assigned) { setLoading(false); return; }
        const formatted = assigned.map((a) => {
          const profile = a.profiles;
          const name = profile?.name || 'Estudiante';
          const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return {
            id: a.student_id,
            name,
            course: profile?.email || '',
            age: '--',
            emotion: 'Sin datos',
            emotionEmoji: '😐',
            emotionColor: 'text-slate-400',
            emotionTime: 'Sin registros',
            lastSession: 'Sin sesiones',
            status: 'normal',
            statusLabel: 'Asignado',
            since: new Date(a.assigned_at).toLocaleDateString('es'),
            sessions: 0,
            registros: 0,
            notes: 0,
            nextSession: 'Sin programar',
            sessionType: '--',
            quickNote: 'Estudiante asignado recientemente.',
            initials,
            avatarBg: 'from-pink-400 to-purple-500'
          };
        });
        setStudents(formatted);
      } catch {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setSelectedStudent(student);
        onStudentSelected();
      }
    }
  }, [selectedStudentId, students]);

  const filtered = students.filter(s => {
    if (activeFilter === 'En seguimiento') return s.status === 'normal';
    if (activeFilter === 'Requieren atención') return s.status === 'alerta' || s.status === 'recomendado';
    if (activeFilter === 'Sin actividad reciente') return s.emotionTime.includes('días');
    return true;
  }).filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (status) => {
    if (status === 'normal') return '#34D399';
    if (status === 'recomendado') return '#FBBF24';
    return '#EF4444';
  };

  const statusBg = (status) => {
    if (status === 'normal') return 'rgba(52,211,153,0.1)';
    if (status === 'recomendado') return 'rgba(251,191,36,0.1)';
    return 'rgba(239,68,68,0.1)';
  };

  const bg = dm ? '#070D1C' : '#F5F0E8';
  const cardBg = dm ? '#0F1A2E' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = dm ? '#F1F5F9' : '#0F172A';
  const textSecondary = dm ? '#64748B' : '#94A3B8';
  const textMuted = dm ? '#475569' : '#CBD5E1';
  const pink = '#F43F9E';
  const inputBg = dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9';

  return (
    <div className="h-full overflow-y-auto custom-scrollbar" style={{ background: bg, fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .es2-search:focus { border-color: ${pink}66 !important; box-shadow: 0 0 0 3px ${pink}15 !important; }
        .es2-chip { transition: all 180ms ease; }
        .es2-chip:hover { transform: translateY(-1px); }
        .es2-card { transition: all 200ms ease; }
        .es2-card:hover { transform: translateY(-1px); }
        .es2-student { transition: all 200ms ease; cursor: pointer; }
        .es2-student:hover { background: ${dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC'} !important; }
        @media (max-width: 900px) {
          .es2-layout { flex-direction: column !important; }
          .es2-left, .es2-right { width: 100% !important; min-width: 0 !important; }
          .es2-right { min-height: 400px !important; }
        }
      `}</style>

      <div className="es2-layout flex" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px', gap: '24px', minHeight: '100%' }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="es2-left flex flex-col" style={{ width: '44%', minWidth: '340px', gap: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                fontSize: '32px', fontWeight: 800, color: textPrimary,
                fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0
              }}>
                Mis estudiantes
              </h1>
              <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, marginTop: '6px', margin: 0, paddingTop: '6px' }}>
                Consulta y da seguimiento a los estudiantes que tienes a tu cargo.
              </p>
            </div>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(244,63,158,0.08)',
              boxShadow: '0 0 20px rgba(244,63,158,0.06)',
            }}>
              <Users size={22} style={{ color: pink }} />
            </div>
          </div>

          {/* Search */}
          <div
            className="es2-search"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              height: '56px', borderRadius: '16px', padding: '0 20px',
              background: cardBg, border: `1.5px solid ${cardBorder}`,
              transition: 'all 200ms ease'
            }}
          >
            <Search size={18} style={{ color: textMuted, flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, height: '100%', background: 'transparent', border: 'none',
                outline: 'none', fontSize: '14px', fontWeight: 500,
                color: textPrimary, fontFamily: 'inherit'
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                width: '24px', height: '24px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: textMuted, fontSize: '12px', cursor: 'pointer', border: 'none'
              }}>✕</button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="es2-chip"
                  style={{
                    padding: '10px 18px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    background: active ? pink : 'transparent',
                    color: active ? '#fff' : textSecondary,
                    border: active ? 'none' : `1.5px solid ${dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: active ? `0 4px 14px ${pink}30` : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Count + Sort */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 2px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: pink, opacity: 0.6 }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: textSecondary }}>
                {filtered.length} estudiante{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 500, color: textMuted,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: '8px',
              transition: 'all 150ms ease'
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Ordenar por:
              <span style={{ fontWeight: 700, color: textSecondary }}>Últimos registros</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Student List */}
          <div style={{
            flex: 1, overflowY: 'auto', borderRadius: '20px', minHeight: 0,
            background: cardBg, border: `1px solid ${cardBorder}`,
            padding: '8px'
          }} className="custom-scrollbar">
            {loading ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '280px', gap: '16px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  border: `3px solid ${pink}30`, borderTopColor: pink,
                  animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontSize: '13px', fontWeight: 500, color: textMuted }}>Cargando estudiantes...</p>
              </div>
            ) : students.length === 0 ? (
              /* Empty State */
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '48px 24px', textAlign: 'center', position: 'relative'
              }}>
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '20%', left: '15%', width: '4px', height: '4px', borderRadius: '50%', background: pink, opacity: 0.2 }} />
                <div style={{ position: 'absolute', top: '35%', right: '12%', width: '3px', height: '3px', borderRadius: '50%', background: '#A78BFA', opacity: 0.2 }} />
                <div style={{ position: 'absolute', bottom: '25%', left: '20%', width: '5px', height: '5px', borderRadius: '50%', background: pink, opacity: 0.15 }} />
                <div style={{ position: 'absolute', top: '15%', right: '25%', width: '6px', height: '6px', borderRadius: '50%', background: '#A78BFA', opacity: 0.12 }} />

                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(244,63,158,0.06)`, marginBottom: '20px', position: 'relative'
                }}>
                  <Users size={30} style={{ color: `${pink}40` }} />
                  <Sparkles size={14} style={{ position: 'absolute', top: '-4px', right: '-4px', color: '#A78BFA', opacity: 0.5 }} />
                </div>
                <p style={{
                  fontSize: '17px', fontWeight: 700, color: textPrimary,
                  marginBottom: '8px', fontFamily: "'Poppins', sans-serif"
                }}>
                  Sin estudiantes asignados
                </p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: textMuted, maxWidth: '240px', lineHeight: 1.6 }}>
                  Cuando un estudiante te seleccione como psicólogo, aparecerá aquí.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '48px 24px', textAlign: 'center'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(244,63,158,0.06)`, marginBottom: '16px'
                }}>
                  <Search size={26} style={{ color: `${pink}40` }} />
                </div>
                <p style={{
                  fontSize: '16px', fontWeight: 700, color: textPrimary,
                  marginBottom: '6px', fontFamily: "'Poppins', sans-serif"
                }}>
                  Sin resultados
                </p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: textMuted, maxWidth: '220px', lineHeight: 1.6 }}>
                  No se encontraron estudiantes con ese nombre.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filtered.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="es2-student"
                      style={{
                        width: '100%', textAlign: 'left', borderRadius: '14px',
                        padding: '14px 16px', cursor: 'pointer',
                        background: isSelected ? `rgba(244,63,158,0.08)` : 'transparent',
                        border: isSelected ? `1.5px solid rgba(244,63,158,0.25)` : '1.5px solid transparent',
                        display: 'flex', alignItems: 'center', gap: '14px'
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '13px',
                        background: 'linear-gradient(135deg, #F472B6, #A855F7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '14px',
                        flexShrink: 0, boxShadow: '0 4px 12px rgba(244,63,158,0.2)'
                      }}>
                        {student.initials}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <p style={{
                            fontSize: '14px', fontWeight: 700, color: textPrimary,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>
                            {student.name}
                          </p>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: statusColor(student.status), flexShrink: 0, marginLeft: '8px'
                          }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Calendar size={11} style={{ color: textMuted }} />
                          <span style={{ fontSize: '12px', fontWeight: 500, color: textMuted }}>
                            Último registro: {student.lastSession}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 700,
                            color: statusColor(student.status)
                          }}>
                            {student.statusLabel}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="es2-right" style={{
          flex: 1, minWidth: 0, borderRadius: '20px',
          background: cardBg, border: `1px solid ${cardBorder}`,
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          {selectedStudent ? (
            <div style={{
              flex: 1, overflowY: 'auto', padding: '28px',
              display: 'flex', flexDirection: 'column', gap: '20px'
            }} className="custom-scrollbar">

              {/* Back */}
              <button onClick={() => setSelectedStudent(null)} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontSize: '13px', fontWeight: 600, color: textMuted,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: '10px',
                transition: 'all 180ms ease', alignSelf: 'flex-start'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = `${pink}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent'; }}
              >
                <ArrowLeft size={16} /> Volver a la lista
              </button>

              {/* Profile Header */}
              <div style={{
                borderRadius: '20px', padding: '24px',
                background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                border: `1px solid ${cardBorder}`,
                display: 'flex', flexDirection: 'column', gap: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #F472B6, #A855F7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '22px', flexShrink: 0,
                    boxShadow: '0 8px 24px rgba(244,63,158,0.25)',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {selectedStudent.initials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{
                      fontSize: '22px', fontWeight: 800, color: textPrimary,
                      fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em',
                      lineHeight: 1.2, marginBottom: '8px', margin: 0
                    }}>
                      {selectedStudent.name}
                    </h3>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 12px', borderRadius: '8px',
                      fontSize: '12px', fontWeight: 700, marginTop: '8px',
                      background: statusBg(selectedStudent.status),
                      color: statusColor(selectedStudent.status)
                    }}>
                      {selectedStudent.status === 'alerta' ? <AlertTriangle size={12} /> : <UserCheck size={12} />}
                      {selectedStudent.statusLabel}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{
                  display: 'flex', gap: '28px', flexWrap: 'wrap',
                  paddingTop: '14px', borderTop: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`
                }}>
                  {[
                    { label: 'Correo', value: selectedStudent.course || '--' },
                    { label: 'Edad', value: `${selectedStudent.age} años` },
                    { label: 'Desde', value: selectedStudent.since },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', margin: 0, paddingBottom: '4px' }}>{item.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{
                  display: 'flex', gap: '4px', padding: '4px',
                  borderRadius: '14px', background: dm ? 'rgba(255,255,255,0.03)' : '#F1F5F9'
                }}>
                  {DETAIL_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: '12px',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        background: activeTab === tab ? pink : 'transparent',
                        color: activeTab === tab ? '#fff' : textSecondary,
                        border: 'none', transition: 'all 180ms ease'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen Tab */}
              {activeTab === 'Resumen' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {[
                      { value: selectedStudent.sessions, label: 'Sesiones', icon: <Calendar size={18} />, color: '#3B82F6', bg: dm ? 'rgba(59,130,246,0.1)' : '#EFF6FF' },
                      { value: selectedStudent.registros, label: 'Registros', icon: <BookOpen size={18} />, color: pink, bg: dm ? 'rgba(244,63,158,0.1)' : '#FDF2F8' },
                      { value: selectedStudent.notes, label: 'Notas', icon: <FileText size={18} />, color: '#A855F7', bg: dm ? 'rgba(168,85,247,0.1)' : '#FAF5FF' },
                    ].map((s) => (
                      <div key={s.label} className="es2-card" style={{
                        borderRadius: '16px', padding: '18px', textAlign: 'center',
                        background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                        border: `1px solid ${cardBorder}`
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 10px', background: s.bg, color: s.color
                        }}>
                          {s.icon}
                        </div>
                        <p style={{
                          fontSize: '26px', fontWeight: 800, color: textPrimary,
                          lineHeight: 1, fontFamily: "'Poppins', sans-serif", margin: 0
                        }}>{s.value}</p>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: textMuted, marginTop: '6px', margin: 0, paddingTop: '6px' }}>
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Last Emotion */}
                  <div style={{
                    borderRadius: '16px', padding: '20px',
                    background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                    border: `1px solid ${cardBorder}`
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', margin: 0, paddingBottom: '14px' }}>
                      Último registro emocional
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                        }}>
                          <AppleEmoji emoji={selectedStudent.emotionEmoji} className="w-6 h-6 inline-block align-middle" />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0 }}>{selectedStudent.emotion}</p>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '2px', margin: 0, paddingTop: '2px' }}>{selectedStudent.emotionTime}</p>
                        </div>
                      </div>
                      <button style={{
                        fontSize: '12px', fontWeight: 600, color: pink,
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', borderRadius: '8px',
                        transition: 'all 150ms ease'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = `${pink}08`}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Ver detalle <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Next Session */}
                  <div style={{
                    borderRadius: '16px', padding: '20px',
                    background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                    border: `1px solid ${cardBorder}`
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', margin: 0, paddingBottom: '14px' }}>
                      Próxima sesión
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: dm ? 'rgba(59,130,246,0.1)' : '#EFF6FF', color: '#3B82F6'
                        }}>
                          <Video size={18} />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0 }}>{selectedStudent.nextSession}</p>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: textMuted, marginTop: '2px', margin: 0, paddingTop: '2px' }}>{selectedStudent.sessionType}</p>
                        </div>
                      </div>
                      <button style={{
                        fontSize: '12px', fontWeight: 600, color: pink,
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', borderRadius: '8px',
                        transition: 'all 150ms ease'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = `${pink}08`}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Ver sesión <span>→</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Notes */}
                  <div style={{
                    borderRadius: '16px', padding: '20px',
                    background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                    border: `1px solid ${cardBorder}`
                  }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', margin: 0, paddingBottom: '14px' }}>
                      Notas rápidas
                    </p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, background: dm ? 'rgba(251,191,36,0.1)' : '#FEF3C7', color: '#D97706'
                      }}>
                        <StickyNote size={14} />
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: textSecondary, lineHeight: 1.6, flex: 1, margin: 0 }}>
                        {selectedStudent.quickNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs */}
              {activeTab !== 'Resumen' && (
                <div style={{
                  borderRadius: '16px', padding: '48px 24px', textAlign: 'center',
                  background: dm ? 'rgba(255,255,255,0.02)' : '#FAFAFC',
                  border: `1px solid ${cardBorder}`
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px', background: `${pink}08`
                  }}>
                    <FileText size={24} style={{ color: pink }} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, marginBottom: '4px', margin: 0, paddingBottom: '4px' }}>{activeTab}</p>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: textMuted, margin: 0 }}>Sección en desarrollo próximamente.</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty Right Panel */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px', textAlign: 'center', position: 'relative'
            }}>
              {/* Decorative elements */}
              <div style={{ position: 'absolute', top: '18%', left: '20%', width: '4px', height: '4px', borderRadius: '50%', background: pink, opacity: 0.15 }} />
              <div style={{ position: 'absolute', top: '30%', right: '18%', width: '3px', height: '3px', borderRadius: '50%', background: '#A78BFA', opacity: 0.15 }} />
              <div style={{ position: 'absolute', bottom: '30%', left: '15%', width: '5px', height: '5px', borderRadius: '50%', background: pink, opacity: 0.1 }} />
              <div style={{ position: 'absolute', bottom: '20%', right: '22%', width: '4px', height: '4px', borderRadius: '50%', background: '#A78BFA', opacity: 0.12 }} />

              <div style={{
                width: '80px', height: '80px', borderRadius: '22px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${pink}08`, marginBottom: '24px', position: 'relative'
              }}>
                <UserCheck size={32} style={{ color: `${pink}40` }} />
                <Sparkles size={14} style={{ position: 'absolute', top: '-4px', right: '-4px', color: '#A78BFA', opacity: 0.5 }} />
              </div>
              <p style={{
                fontSize: '20px', fontWeight: 700, color: textPrimary,
                marginBottom: '10px', fontFamily: "'Poppins', sans-serif", margin: 0, paddingBottom: '10px'
              }}>
                Selecciona un estudiante
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: textMuted, maxWidth: '260px', lineHeight: 1.6, margin: 0 }}>
                Haz clic en un estudiante de la lista para ver su perfil y seguimiento.
              </p>

              {/* Tip Card */}
              <div style={{
                marginTop: '40px', padding: '16px 20px', borderRadius: '16px',
                background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                border: `1px solid ${cardBorder}`,
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                maxWidth: '340px', width: '100%'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${pink}10`
                }}>
                  <Lightbulb size={16} style={{ color: pink }} />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: textSecondary, lineHeight: 1.5, textAlign: 'left', margin: 0 }}>
                  <span style={{ color: pink, fontWeight: 700 }}>Tip:</span> Selecciona un estudiante para ver su información, notas, sesiones y evolución emocional.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
