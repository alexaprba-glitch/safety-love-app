import React, { useState, useEffect } from 'react';
import { Phone, Video, ChevronRight, Calendar, Clock, User, Shield, Lock, XCircle, AlertTriangle, CalendarX2 } from 'lucide-react';
import { getSessionsForStudent, normalizeName, STUDENT_SESSIONS_EVENT } from './studentSessions';

const TYPE_COLORS = [
  { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
];

const MESES_CORTO = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

function parseSessionDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function describeSession(s) {
  const d = parseSessionDate(s.date);
  return {
    ...s,
    _date: d,
    dayLabel: d ? String(d.getDate()).padStart(2, '0') : '--',
    monthLabel: d ? MESES_CORTO[d.getMonth()] : '---',
    weekday: d ? d.toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^\w/, (c) => c.toUpperCase()) : '',
    dateDisplay: d ? d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : (s.date || ''),
  };
}

export default function PsicologoSection({ darkMode = false, userName = '' }) {
  const dm = darkMode;
  const [cancelledSessions, setCancelledSessions] = useState([]);
  // Sesiones reales agendadas por el psicólogo para este estudiante
  const [mySessions, setMySessions] = useState(() => getSessionsForStudent(userName));

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('safetyLove_cancelledSessions')) ?? [];
      setCancelledSessions(stored);
    } catch {}
  }, []);

  useEffect(() => {
    const reload = () => setMySessions(getSessionsForStudent(userName));
    reload();
    window.addEventListener(STUDENT_SESSIONS_EVENT, reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(STUDENT_SESSIONS_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, [userName]);

  const myName = normalizeName(userName);
  const visibleCancelled = myName
    ? cancelledSessions.filter((cs) => normalizeName(cs.name) === myName)
    : cancelledSessions;

  const today = startOfToday();
  const upcoming = mySessions
    .map(describeSession)
    .filter((s) => s._date && s._date >= today)
    .sort((a, b) => a._date - b._date);
  const past = mySessions
    .map(describeSession)
    .filter((s) => !s._date || s._date < today)
    .sort((a, b) => (b._date || 0) - (a._date || 0));
  const nextSession = upcoming[0] || null;
  const pendingSessions = upcoming.slice(1);
  const hasSessions = upcoming.length > 0 || past.length > 0;

  const dismissCancelled = (id) => {
    const updated = cancelledSessions.filter(s => s.id !== id);
    setCancelledSessions(updated);
    try { localStorage.setItem('safetyLove_cancelledSessions', JSON.stringify(updated)); } catch {}
  };

  const bg = dm ? '#070D1C' : '#F5F0E8';
  const cardBg = dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = dm ? '#F1F5F9' : '#0F172A';
  const textSecondary = dm ? '#64748B' : '#94A3B8';

  return (
    <div style={{ flex: 1, overflowY: 'auto', fontFamily: "'Inter', sans-serif", background: bg }} className="custom-scrollbar">
      <div style={{ padding: '44px 48px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

          {/* ═══ HEADER ═══ */}
          <header style={{ marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA', flexShrink: 0
            }}>
              <Phone size={26} style={{ color: '#EC4899' }} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{
                fontSize: '44px', fontWeight: 800, letterSpacing: '-0.02em',
                color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.1
              }}>Habla con tu psicólogo</h1>
              <p style={{
                fontSize: '17px', fontWeight: 500, color: textSecondary,
                marginTop: '6px', margin: '6px 0 0'
              }}>
                Revisa tus sesiones pendientes y mantente al día con tu bienestar.
              </p>
            </div>
          </header>

          {/* ═══ CANCELLED SESSION NOTIFICATIONS ═══ */}
          {visibleCancelled.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {visibleCancelled.map((cs) => (
                <div key={cs.id} style={{
                  borderRadius: '16px', border: `1px solid ${dm ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'}`,
                  padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px',
                  background: dm ? 'rgba(239,68,68,0.05)' : '#FEF2F2',
                  marginBottom: '12px', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dm ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
                    flexShrink: 0
                  }}>
                    <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: dm ? '#FCA5A5' : '#DC2626', margin: '0 0 4px' }}>
                      Sesión cancelada
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, margin: 0, lineHeight: 1.5 }}>
                      La sesión con <strong style={{ color: textPrimary }}>{cs.name}</strong> programada para el{' '}
                      <strong style={{ color: textPrimary }}>
                        {cs.date ? new Date(cs.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'fecha desconocida'}
                      </strong>{' '}
                      a las <strong style={{ color: textPrimary }}>{cs.time}</strong> fue cancelada por el psicólogo.
                    </p>
                  </div>
                  <button onClick={() => dismissCancelled(cs.id)} style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: 'transparent', color: dm ? '#475569' : '#9CA3AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 150ms ease', flexShrink: 0
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? '#475569' : '#9CA3AF'; }}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ═══ GRID: 2 COLUMNAS ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }} className="psicologo-grid">
            <style>{`
              @media (max-width: 1024px) { .psicologo-grid { grid-template-columns: 1fr !important; } }
            `}</style>

            {/* ═══ ESTADO VACÍO (sin sesiones agendadas) · a la derecha de Consejo/Contacto ═══ */}
            {!hasSessions && (
              <div style={{
                borderRadius: '24px', padding: '56px 32px', textAlign: 'center',
                background: cardBg, border: `2px dashed ${dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
                order: 1,
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '22px', margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                }}>
                  <CalendarX2 size={32} style={{ color: '#EC4899' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, margin: '0 0 8px' }}>
                  Aún no tienes sesiones programadas
                </h2>
                <p style={{ fontSize: '15px', fontWeight: 500, color: textSecondary, margin: 0, lineHeight: 1.6 }}>
                  Cuando tu psicólogo agende una sesión contigo desde su agenda,<br />aparecerá aquí automáticamente.
                </p>
              </div>
            )}

            {/* ═══ COLUMNA IZQUIERDA (oculta en estado vacío para ceder su celda) ═══ */}
            <div style={{ display: hasSessions ? 'flex' : 'none', flexDirection: 'column', gap: '28px' }}>

              {/* ── PRÓXIMA SESIÓN (solo si el psicólogo agendó) ── */}
              {nextSession && (
              <div style={{
                borderRadius: '24px', padding: '32px',
                background: cardBg, border: `1.5px solid ${dm ? 'rgba(233,213,255,0.15)' : 'rgba(244,63,158,0.12)'}`,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)', minHeight: '250px',
                transition: 'border-color 200ms ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = dm ? 'rgba(233,213,255,0.3)' : 'rgba(244,63,158,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = dm ? 'rgba(233,213,255,0.15)' : 'rgba(244,63,158,0.12)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EC4899', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#EC4899' }}>Próxima sesión</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                      flexShrink: 0, boxShadow: '0 2px 10px rgba(236,72,153,0.08)'
                    }}>
                      <User size={24} style={{ color: '#EC4899' }} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>Tu psicólogo</h3>
                      <p style={{ fontSize: '16px', fontWeight: 500, color: textSecondary, margin: 0 }}>{nextSession.type || 'Sesión programada'}</p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px',
                    padding: '16px 22px', borderRadius: '18px',
                    background: dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Calendar size={18} style={{ color: '#EC4899' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#EC4899' }}>{nextSession.weekday}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: textSecondary, marginTop: '2px' }}>{nextSession.dateDisplay}</div>
                      </div>
                    </div>
                    <div style={{ width: '1px', height: '36px', background: dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Clock size={18} style={{ color: '#EC4899' }} />
                      <div style={{ fontSize: '20px', fontWeight: 800, color: textPrimary }}>{nextSession.time}</div>
                    </div>
                  </div>
                </div>

                <button style={{
                  height: '54px', padding: '0 28px', borderRadius: '16px', border: 'none',
                  background: 'linear-gradient(135deg, #EC4899, #DB2777)',
                  color: '#fff', fontSize: '16px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 4px 16px rgba(236,72,153,0.25)',
                  transition: 'all 200ms ease', fontFamily: 'inherit'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.25)'; }}
                >
                  <Video size={18} />
                  Unirse a la sesión
                </button>
              </div>
              )}

              {/* ── SESIONES PENDIENTES ── */}
              {pendingSessions.length > 0 && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: textPrimary, margin: '0 0 22px' }}>Sesiones pendientes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingSessions.map((session, idx) => {
                    const palette = TYPE_COLORS[idx % TYPE_COLORS.length];
                    return (
                    <div key={session.id ?? idx} style={{
                      borderRadius: '20px', padding: '18px 20px',
                      display: 'flex', alignItems: 'center', gap: '18px',
                      background: cardBg, border: `1px solid ${cardBorder}`,
                      boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
                      transition: 'all 200ms ease', minHeight: '100px'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = cardBorder; }}
                    >
                      <div style={{
                        width: '68px', height: '68px', borderRadius: '18px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: palette.bg, color: palette.color,
                        fontWeight: 700, flexShrink: 0
                      }}>
                        <span style={{ fontSize: '26px', lineHeight: 1 }}>{session.dayLabel}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px', opacity: 0.8 }}>{session.monthLabel}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.type || 'Sesión programada'}</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, marginTop: '4px' }}>{session.weekday} · {session.dateDisplay}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: dm ? '#CBD5E1' : '#334155' }}>{session.dateDisplay}</div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: textSecondary, marginTop: '2px' }}>{session.time}</div>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center',
                          padding: '7px 14px', borderRadius: '999px',
                          fontSize: '12px', fontWeight: 700,
                          background: dm ? 'rgba(251,191,36,0.1)' : '#FFFBEB',
                          color: '#F59E0B'
                        }}>
                          Pendiente
                        </span>
                      </div>
                      <ChevronRight size={18} style={{ color: dm ? '#334155' : '#CBD5E1', flexShrink: 0 }} />
                    </div>
                    );
                  })}
                </div>
              </div>
              )}
            </div>

            {/* ═══ COLUMNA DERECHA ═══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ── SESIONES PASADAS (solo historial real) ── */}
              {past.length > 0 && (
              <div style={{
                borderRadius: '22px', padding: '26px',
                background: cardBg, border: `1px solid ${cardBorder}`,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, color: textPrimary, margin: 0 }}>Sesiones pasadas</h2>
                  <button style={{
                    fontSize: '14px', fontWeight: 600, color: '#EC4899', background: 'none',
                    border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '10px',
                    transition: 'all 150ms ease', fontFamily: 'inherit'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.06)' : '#FFF5FA'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    Ver todas →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {past.map((session, idx) => (
                    <div key={session.id ?? idx} style={{
                      borderRadius: '18px', padding: '16px 18px',
                      display: 'flex', alignItems: 'center', gap: '16px',
                      background: dm ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                      border: `1px solid ${dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`,
                      transition: 'all 150ms ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.02)' : '#F8FAFC'}
                    >
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '16px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: dm ? 'rgba(34,197,94,0.1)' : '#F0FDF4',
                        color: '#22C55E', fontWeight: 700, flexShrink: 0
                      }}>
                        <span style={{ fontSize: '22px', lineHeight: 1 }}>{session.dayLabel}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px', opacity: 0.8 }}>{session.monthLabel}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: dm ? '#94A3B8' : '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.type || 'Sesión'}</div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: dm ? '#475569' : '#94A3B8', marginTop: '3px' }}>{session.weekday} · {session.dateDisplay}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#475569' : '#94A3B8' }}>{session.dateDisplay}</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: dm ? '#334155' : '#CBD5E1', marginTop: '2px' }}>{session.time}</div>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '6px 12px', borderRadius: '999px',
                        fontSize: '11px', fontWeight: 700,
                        background: dm ? 'rgba(34,197,94,0.1)' : '#F0FDF4',
                        color: '#22C55E', flexShrink: 0
                      }}>
                        Completada
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* ── CONSEJO ── */}
              <div style={{
                borderRadius: '22px', padding: '26px',
                background: dm ? 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' : 'linear-gradient(135deg, #FFFBEB, #FFF7ED)',
                border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dm ? 'rgba(251,191,36,0.1)' : 'rgba(251,191,36,0.08)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '22px' }}>💡</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, margin: 0 }}>Consejo</h3>
                </div>
                <p style={{
                  fontSize: '16px', fontWeight: 500, lineHeight: 1.65,
                  color: dm ? '#94A3B8' : '#64748B', margin: 0
                }}>
                  Prepara tus preguntas antes de la sesión. Anotar lo que sientes te ayudará a aprovechar mejor el tiempo con tu psicóloga.
                </p>
                <svg style={{ width: '100px', height: '100px', position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.15, pointerEvents: 'none' }} viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="15" width="60" height="75" rx="6" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  <line x1="32" y1="35" x2="68" y2="35" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" />
                  <line x1="32" y1="48" x2="68" y2="48" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" />
                  <line x1="32" y1="61" x2="55" y2="61" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" />
                </svg>
              </div>

              {/* ── CONTACTO DE EMERGENCIA ── */}
              <div style={{
                borderRadius: '22px', overflow: 'hidden',
                background: cardBg, border: `1px solid ${cardBorder}`,
                boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
              }}>
                <div style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: dm ? 'rgba(59,130,246,0.1)' : '#EFF6FF',
                      flexShrink: 0
                    }}>
                      <Phone size={20} style={{ color: '#3B82F6' }} strokeWidth={2} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: textPrimary, margin: 0 }}>Contacto de emergencia</h3>
                  </div>
                  <p style={{
                    fontSize: '16px', fontWeight: 500, lineHeight: 1.6,
                    color: textSecondary, margin: 0
                  }}>
                    Si necesitas ayuda urgente, puedes contactar directamente a tu psicóloga.
                  </p>
                </div>
                <button style={{
                  width: '100%', height: '54px', border: 'none', borderTop: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                  background: dm ? 'rgba(59,130,246,0.06)' : '#EFF6FF',
                  color: '#3B82F6', fontSize: '16px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 150ms ease', fontFamily: 'inherit'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(59,130,246,0.12)' : '#DBEAFE'}
                  onMouseLeave={(e) => e.currentTarget.style.background = dm ? 'rgba(59,130,246,0.06)' : '#EFF6FF'}
                >
                  <Phone size={18} />
                  Llamar ahora
                </button>
              </div>
            </div>
          </div>

          {/* ═══ PRIVACY FOOTER ═══ */}
          <div style={{
            marginTop: '32px', padding: '18px 24px', borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: dm ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
            border: `1px solid ${dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`
          }}>
            <Lock size={14} style={{ color: dm ? '#475569' : '#94A3B8' }} />
            <p style={{ fontSize: '13px', fontWeight: 500, color: dm ? '#475569' : '#94A3B8', margin: 0 }}>
              Tu privacidad es importante. Todas las sesiones son confidenciales.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
