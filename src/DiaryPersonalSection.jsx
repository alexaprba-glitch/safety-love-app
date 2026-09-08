import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { addEmergencyRequest } from './emergencyStore';
import {
  Heart, ChevronRight, Plus, Lock, BookOpen, Edit3, Image as ImageIcon, Tag,
  Pencil, Trash2, X, Shield, ArrowRight
} from 'lucide-react';

function DiaryPersonalSection({ darkMode, onToast, userName }) {
  const dm = darkMode;
  const [editorContent, setEditorContent] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyPhase, setEmergencyPhase] = useState('button');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showEditCard, setShowEditCard] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const recentCardRef = useRef(null);

  const formatDiaryDate = (d) => {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
  };

  const saveEntry = () => {
    const text = editorContent.trim();
    if (!text) return;
    const newEntry = {
      icon: <Edit3 size={20} strokeWidth={2} />,
      color: 'text-pink-500',
      bg: 'bg-pink-100',
      date: formatDiaryDate(new Date()),
      text,
    };
    setSavedEntries(prev => [newEntry, ...prev]);
    setEditorContent('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3200);
    setTimeout(() => { recentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    onToast('Anécdota guardada con éxito');
  };

  const openEditCard = (index) => {
    setEditingIndex(index);
    setEditingText(savedEntries[index].text);
    setShowEditCard(true);
  };

  const saveEditedEntry = () => {
    const text = editingText.trim();
    if (!text || editingIndex === null) return;
    setSavedEntries(prev => prev.map((e, i) => i === editingIndex ? { ...e, text } : e));
    setShowEditCard(false);
    setEditingIndex(null);
    setEditingText('');
    onToast('Anécdota editada con éxito');
  };

  const deleteEntry = (index) => {
    setSavedEntries(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) { setShowEditCard(false); setEditingIndex(null); }
    onToast('Anécdota eliminada');
  };

  const bg = dm ? '#070D1C' : '#F5F0E8';
  const cardBg = dm ? '#0F1A2E' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = dm ? '#F1F5F9' : '#0F172A';
  const textSecondary = dm ? '#64748B' : '#94A3B8';
  const textTertiary = dm ? '#475569' : '#CBD5E1';
  const hoverBg = dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC';
  const inputBg = dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC';

  return (
    <div style={{ height: '100%', fontFamily: "'Inter', sans-serif", background: bg, color: textPrimary }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '40px 48px' }}>

        {/* ═══ HEADER ═══ */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '32px', gap: '16px', flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{
              fontSize: '42px', fontWeight: 800, letterSpacing: '-0.02em',
              color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.1
            }}>
              Diario personal
            </h1>
            <p style={{
              fontSize: '17px', fontWeight: 500, color: textSecondary,
              marginTop: '10px', maxWidth: '440px', lineHeight: 1.5
            }}>
              Tu espacio para escribir, reflexionar y soltar lo que llevas dentro.
            </p>
          </div>
          <button onClick={() => { addEmergencyRequest(userName || 'Estudiante'); setShowEmergencyModal(true); setEmergencyPhase('breaking'); setTimeout(() => setEmergencyPhase('sent'), 2500); }} style={{
            height: '44px', padding: '0 20px', borderRadius: '22px',
            border: 'none', cursor: 'pointer',
            background: dm ? 'rgba(239,68,68,0.1)' : '#FFF5F7',
            color: dm ? '#F87171' : '#EF4444',
            fontSize: '14px', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 200ms ease', flexShrink: 0, fontFamily: 'inherit'
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(239,68,68,0.18)' : '#FFE4E6'}
            onMouseLeave={(e) => e.currentTarget.style.background = dm ? 'rgba(239,68,68,0.1)' : '#FFF5F7'}
          >
            <Shield size={16} strokeWidth={2.5} />
            Emergencia
          </button>
        </header>

        {/* ═══ BANNER MOTIVACIONAL ═══ */}
        <div style={{
          borderRadius: '20px', border: `1px solid ${dm ? 'rgba(236,72,153,0.12)' : 'rgba(236,72,153,0.15)'}`,
          padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '20px',
          background: dm ? 'linear-gradient(135deg, rgba(236,72,153,0.04), rgba(167,139,250,0.04))' : 'linear-gradient(135deg, #FFF5FA, #FFF0FC)',
          marginBottom: '32px', position: 'relative', overflow: 'hidden',
          minHeight: '80px',
          boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: dm ? 'rgba(236,72,153,0.12)' : 'rgba(236,72,153,0.08)',
            flexShrink: 0, boxShadow: '0 2px 10px rgba(236,72,153,0.1)'
          }}>
            <Heart size={22} style={{ color: '#EC4899' }} strokeWidth={2} />
          </div>
          <p style={{
            fontSize: '16px', fontWeight: 500, color: dm ? '#CBD5E1' : '#64748B',
            lineHeight: 1.6, zIndex: 1, margin: 0
          }}>
            Escribir es una forma de ordenar lo que sentimos y comprender lo que vivimos.
          </p>
          <svg style={{ width: '130px', height: '130px', position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, pointerEvents: 'none' }} viewBox="0 0 120 120" fill="none">
            <path d="M90 100 Q50 70, 30 30" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M80 80 Q50 60, 55 40 Q75 50, 80 80 Z" fill="#F9A8D4" opacity="0.7" />
            <path d="M60 60 Q30 40, 35 20 Q55 30, 60 60 Z" fill="#F472B6" opacity="0.6" />
            <path d="M100 70 Q70 50, 75 30 Q95 40, 100 70 Z" fill="#FCE7F3" opacity="0.8" />
            <circle cx="90" cy="25" r="3" fill="#F9A8D4" opacity="0.5" />
            <circle cx="25" cy="85" r="4" fill="#F9A8D4" opacity="0.4" />
          </svg>
        </div>

        {/* ═══ GRID PRINCIPAL ═══ */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.65fr 1fr',
          gap: '24px', alignItems: 'start'
        }} className="diary-grid">
          <style>{`
            @media (max-width: 900px) { .diary-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          {/* ═══ COLUMNA IZQUIERDA ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── NUEVA ANÉCDOTA ── */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '24px', display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '22px 28px', borderBottom: `1px solid ${cardBorder}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA'
                  }}>
                    <Edit3 size={19} style={{ color: '#EC4899' }} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: textPrimary }}>Nueva anécdota</span>
                </div>
                <button onClick={() => setEditorContent('')} style={{
                  height: '42px', padding: '0 18px', borderRadius: '14px',
                  border: 'none', cursor: 'pointer',
                  background: dm ? 'rgba(236,72,153,0.12)' : '#FFF5FA',
                  color: dm ? '#F472B6' : '#EC4899',
                  fontSize: '14px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 200ms ease', fontFamily: 'inherit'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.2)' : '#FFE4F0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.12)' : '#FFF5FA'}
                >
                  <Plus size={16} strokeWidth={3} /> Nueva
                </button>
              </div>

              {/* Question + Textarea */}
              <div style={{ padding: '24px 28px' }}>
                <p style={{
                  fontSize: '16px', fontWeight: 600, color: dm ? '#94A3B8' : '#64748B',
                  margin: '0 0 16px'
                }}>¿Qué quieres escribir hoy?</p>
                <div style={{
                  borderRadius: '18px', border: `1.5px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  background: dm ? 'rgba(255,255,255,0.02)' : '#FAFBFC',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  position: 'relative'
                }}>
                  <textarea
                    style={{
                      width: '100%', minHeight: '320px', padding: '22px 24px',
                      border: 'none', borderRadius: '18px', outline: 'none',
                      resize: 'none', fontSize: '16px', lineHeight: 1.8,
                      fontWeight: 500, background: 'transparent',
                      color: textPrimary, fontFamily: "'Inter', sans-serif",
                      boxSizing: 'border-box'
                    }}
                    placeholder="Escribe tu anécdota aquí..."
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value.slice(0, 1000))}
                    onFocus={(e) => {
                      e.currentTarget.parentElement.style.borderColor = dm ? 'rgba(236,72,153,0.3)' : 'rgba(236,72,153,0.25)';
                      e.currentTarget.parentElement.style.boxShadow = dm ? '0 0 0 3px rgba(236,72,153,0.06)' : '0 0 0 4px rgba(236,72,153,0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.parentElement.style.borderColor = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
                      e.currentTarget.parentElement.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{
                    position: 'absolute', bottom: '14px', right: '20px',
                    fontSize: '13px', fontWeight: 600, color: textTertiary
                  }}>
                    {editorContent.length} / 1000
                  </div>
                </div>
              </div>

              {/* Toolbar + Save */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '18px 28px', borderTop: `1px solid ${cardBorder}`,
                gap: '16px', flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { icon: <ImageIcon size={15} strokeWidth={2} />, label: 'Imagen' },
                    { icon: <Tag size={15} strokeWidth={2} />, label: 'Etiqueta' },
                    { icon: <Lock size={15} strokeWidth={2} />, label: 'Privado' },
                  ].map(btn => (
                    <button key={btn.label} style={{
                      height: '38px', padding: '0 16px', borderRadius: '12px',
                      border: `1px solid ${cardBorder}`, cursor: 'pointer',
                      background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                      color: dm ? '#94A3B8' : '#64748B',
                      fontSize: '13px', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '7px',
                      transition: 'all 150ms ease', fontFamily: 'inherit'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPrimary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC'; e.currentTarget.style.color = dm ? '#94A3B8' : '#64748B'; }}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
                <div>
                  {editorContent.trim()
                    ? <button onClick={saveEntry} style={{
                        height: '42px', padding: '0 22px', borderRadius: '14px',
                        border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #EC4899, #DB2777)',
                        color: '#fff', fontSize: '14px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 16px rgba(236,72,153,0.25)',
                        transition: 'all 200ms ease', fontFamily: 'inherit'
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.35)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.25)'; }}
                      >
                        Guardar <Heart size={13} fill="white" strokeWidth={0} />
                      </button>
                    : <span style={{ fontSize: '13px', fontWeight: 600, color: textTertiary }}>✓ Guarda cuando estés listo</span>
                  }
                </div>
              </div>
            </div>

            {/* ── LUGAR SEGURO ── */}
            <div style={{
              borderRadius: '22px', border: `1px solid ${dm ? 'rgba(167,139,250,0.12)' : 'rgba(167,139,250,0.15)'}`,
              padding: '26px 30px', display: 'flex', alignItems: 'center', gap: '20px',
              background: dm ? 'linear-gradient(135deg, rgba(167,139,250,0.04), rgba(236,72,153,0.03))' : 'linear-gradient(135deg, #F5F0FF, #FFF5FA)',
              position: 'relative', overflow: 'hidden', minHeight: '90px',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dm ? 'rgba(167,139,250,0.12)' : 'rgba(167,139,250,0.08)',
                flexShrink: 0
              }}>
                <Heart size={22} style={{ color: '#A78BFA' }} strokeWidth={2} fill="#A78BFA" />
              </div>
              <div style={{ zIndex: 1 }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: '0 0 4px' }}>Este es tu lugar seguro.</p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, margin: 0, lineHeight: 1.5 }}>Escribe sin miedo, sé honesto/a contigo mismo/a.</p>
              </div>
              <svg style={{ width: '140px', height: '140px', position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 120 120" fill="none">
                <path d="M90 100 Q50 70, 30 30" stroke="#E9D5FF" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M80 80 Q50 60, 55 40 Q75 50, 80 80 Z" fill="#D8B4FE" opacity="0.7" />
                <path d="M60 60 Q30 40, 35 20 Q55 30, 60 60 Z" fill="#C084FC" opacity="0.6" />
                <path d="M100 70 Q70 50, 75 30 Q95 40, 100 70 Z" fill="#F3E8FF" opacity="0.8" />
                <circle cx="90" cy="25" r="3" fill="#D8B4FE" opacity="0.5" />
                <circle cx="25" cy="85" r="4" fill="#D8B4FE" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* ═══ COLUMNA DERECHA ═══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} ref={recentCardRef}>

            {/* ── ANÉCDOTAS RECIENTES ── */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '22px', display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '22px 26px', borderBottom: `1px solid ${cardBorder}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA'
                  }}>
                    <BookOpen size={19} style={{ color: '#EC4899' }} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: textPrimary }}>Anécdotas recientes</span>
                </div>
                <button style={{
                  fontSize: '14px', fontWeight: 600, color: dm ? '#F472B6' : '#EC4899',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 12px', borderRadius: '10px', transition: 'all 150ms ease',
                  fontFamily: 'inherit'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Ver todas →
                </button>
              </div>
              <div style={{ padding: '24px 26px' }}>
                {savedEntries.length === 0 ? (
                  <div style={{ padding: '48px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: dm ? 'rgba(255,255,255,0.04)' : '#FFF5FA',
                      marginBottom: '20px'
                    }}>
                      <BookOpen size={32} style={{ color: dm ? '#475569' : '#EC4899', opacity: dm ? 0.5 : 0.4 }} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 600, color: dm ? '#CBD5E1' : '#0F172A', margin: '0 0 6px' }}>
                      Aún no has escrito ninguna anécdota.
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, margin: '0 0 18px' }}>
                      Escribe la primera arriba
                    </p>
                    <button style={{
                      height: '40px', padding: '0 20px', borderRadius: '14px',
                      border: 'none', cursor: 'pointer',
                      background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                      color: dm ? '#F472B6' : '#EC4899',
                      fontSize: '13px', fontWeight: 700,
                      transition: 'all 150ms ease', fontFamily: 'inherit'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.18)' : '#FFE4F0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA'}
                    >
                      Ver todas las anécdotas →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {savedEntries.slice(0, 5).map((entry, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '14px', alignItems: 'center',
                        padding: '16px', borderRadius: '16px', cursor: 'pointer',
                        border: justSaved && i === 0 ? `1px solid ${dm ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.1)'}` : '1px solid transparent',
                        background: justSaved && i === 0 ? (dm ? 'rgba(236,72,153,0.06)' : '#FFF5FA') : 'transparent',
                        transition: 'all 200ms ease'
                      }}
                        onMouseEnter={(e) => { if (!(justSaved && i === 0)) e.currentTarget.style.background = hoverBg; }}
                        onMouseLeave={(e) => { if (!(justSaved && i === 0)) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '14px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                          color: '#EC4899', flexShrink: 0
                        }}>
                          {entry.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: textSecondary }}>{entry.date}</span>
                            {justSaved && i === 0 && (
                              <span style={{
                                padding: '2px 8px', borderRadius: '8px',
                                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                background: '#EC4899', color: '#fff'
                              }}>Nueva</span>
                            )}
                          </div>
                          <p style={{
                            fontSize: '14px', fontWeight: 600, color: textPrimary,
                            margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>{entry.text}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0, transition: 'opacity 200ms ease' }}
                          className="entry-actions"
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        >
                          <button onClick={(e) => { e.stopPropagation(); openEditCard(i); }} title="Editar" style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            border: 'none', cursor: 'pointer', background: 'transparent',
                            color: textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 150ms ease'
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#EC4899'; e.currentTarget.style.background = hoverBg; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = textSecondary; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteEntry(i); }} title="Eliminar" style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            border: 'none', cursor: 'pointer', background: 'transparent',
                            color: textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 150ms ease'
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = textSecondary; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <ChevronRight size={16} style={{ color: textTertiary, flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── TU ESPACIO, TUS REGLAS ── */}
            <div style={{
              borderRadius: '20px', border: `1px solid ${dm ? 'rgba(52,211,153,0.12)' : 'rgba(52,211,153,0.15)'}`,
              padding: '22px 26px', display: 'flex', alignItems: 'center', gap: '18px',
              background: cardBg, minHeight: '88px',
              boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
              transition: 'all 200ms ease'
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dm ? 'rgba(52,211,153,0.1)' : 'rgba(52,211,153,0.08)',
                flexShrink: 0
              }}>
                <Shield size={20} style={{ color: '#34D399' }} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 3px' }}>Tu espacio, tus reglas</p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: textSecondary, margin: 0, lineHeight: 1.4 }}>Todo lo que escribes es privado y solo tú tienes acceso.</p>
              </div>
              <ArrowRight size={18} style={{ color: textTertiary, flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal Editar Anécdota ── */}
      {showEditCard && editingIndex !== null && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} onClick={() => setShowEditCard(false)} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: '480px',
            background: cardBg, color: textPrimary,
            borderRadius: '28px', padding: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '36px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, flex: 1, textAlign: 'center' }}>Editar anécdota</h3>
              <button onClick={() => setShowEditCard(false)} style={{
                width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: hoverBg, color: textSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = hoverBg}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: textSecondary, margin: '0 0 12px' }}>{savedEntries[editingIndex]?.date}</p>
            <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} rows={5} maxLength={1000}
              style={{
                width: '100%', padding: '16px 18px', borderRadius: '16px',
                border: `1.5px solid ${cardBorder}`, background: inputBg,
                fontSize: '15px', color: textPrimary, outline: 'none',
                resize: 'none', fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box', lineHeight: 1.6
              }}
            />
            <p style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: textTertiary, margin: '6px 0 16px' }}>{editingText.length} / 1000</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => deleteEntry(editingIndex)} style={{
                flex: 1, height: '48px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                transition: 'all 150ms ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              >
                Eliminar
              </button>
              <button onClick={saveEditedEntry} disabled={!editingText.trim()} style={{
                flex: 1, height: '48px', borderRadius: '14px', border: 'none', cursor: editingText.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 600, fontSize: '14px', fontFamily: 'inherit',
                background: editingText.trim() ? '#EC4899' : (dm ? 'rgba(255,255,255,0.06)' : '#E2E8F0'),
                color: editingText.trim() ? '#fff' : textTertiary,
                boxShadow: editingText.trim() ? '0 4px 16px rgba(236,72,153,0.25)' : 'none',
                transition: 'all 150ms ease'
              }}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxImg && createPortal(
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', cursor: 'pointer'
        }} onClick={() => setLightboxImg(null)}>
          <button onClick={() => setLightboxImg(null)} style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
          <img src={lightboxImg} alt="Imagen completa" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '16px', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()} />
        </div>, document.body
      )}

      {/* Emergency Modal */}
      {showEmergencyModal && createPortal(
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            background: cardBg, borderRadius: '28px', width: '100%', maxWidth: '400px',
            padding: '36px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
          }} onClick={(e) => e.stopPropagation()}>
            {emergencyPhase === 'breaking' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '24px' }}>
                  <div style={{ position: 'absolute', inset: 0, animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.3 }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ position: 'absolute', inset: 0, animation: 'bounce 1s infinite' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: dm ? '#F87171' : '#DC2626' }}>Enviando solicitud...</span>
                </div>
                <p style={{ fontSize: '13px', color: textSecondary, margin: 0 }}>Conectando con tu psicóloga</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(34,197,94,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <svg style={{ width: '40px', height: '40px', color: '#22C55E' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: textPrimary, margin: '0 0 10px' }}>Solicitud enviada</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: dm ? '#CBD5E1' : '#64748B', margin: '0 0 24px' }}>
                  Se ha enviado una solicitud a tu psicóloga.<br/>
                  <strong style={{ color: textPrimary }}>Por favor, mantén la calma.</strong>
                </p>
                <div style={{
                  width: '100%', borderRadius: '16px', padding: '16px',
                  background: inputBg, marginBottom: '24px'
                }}>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: textSecondary, margin: 0 }}>
                    Tu psicóloga recibió la notificación y se pondrá en contacto contigo pronto. Mientras tanto, respira profundo.
                  </p>
                </div>
                <button onClick={() => { setShowEmergencyModal(false); setEmergencyPhase('button'); }} style={{
                  width: '100%', height: '48px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #EC4899, #DB2777)',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(236,72,153,0.25)',
                  fontFamily: 'inherit', transition: 'all 200ms ease'
                }}>
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>, document.body
      )}

      <style>{`
        .entry-actions:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

export default DiaryPersonalSection;
