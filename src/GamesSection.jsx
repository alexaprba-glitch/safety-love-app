import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Trophy, Star, Clock, Users, Gamepad2, Flag, Brain, Heart, Puzzle, Sparkles, ArrowRight, Lock } from 'lucide-react';
import GreenRedFlagGame from './GreenRedFlagGame.jsx';
import QuizEmocional from './QuizEmocional.jsx';
import MemoriaSentimientos from './MemoriaSentimientos.jsx';

const GAMES = [
  {
    id: 'green-red-flag',
    title: 'Green Flag o Red Flag',
    desc: 'Identifica señales saludables y de alerta en relaciones.',
    icon: Flag,
    gradient: 'linear-gradient(135deg, #34D399, #14B8A6)',
    players: '1 jugador',
    difficulty: 'Fácil',
    time: '3 min',
    category: 'Relaciones',
  },
  {
    id: 'quiz-emocional',
    title: 'Quiz Emocional',
    desc: 'Pon a prueba tu inteligencia emocional con preguntas sobre tus sentimientos.',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #A78BFA, #818CF8)',
    players: '1 jugador',
    difficulty: 'Medio',
    time: '5 min',
    category: 'Emociones',
  },
  {
    id: 'memoria',
    title: 'Memoria Sentimientos',
    desc: 'Encuentra las parejas de emociones y sentimientos.',
    icon: Puzzle,
    gradient: 'linear-gradient(135deg, #60A5FA, #22D3EE)',
    players: '1 jugador',
    difficulty: 'Fácil',
    time: '4 min',
    category: 'Cognitivo',
  },
];

const COMING_SOON = [
  { icon: Heart, title: 'Adivinanza de Emociones', desc: 'Adivina la emoción por expresiones faciales.' },
  { icon: Sparkles, title: 'Colorea tu Estado', desc: 'Expresa tus sentimientos con colores.' },
  { icon: Users, title: 'Simulador de Conversaciones', desc: 'Practica conversaciones difíciles con empatía.' },
];

export default function GamesSection({ darkMode = false }) {
  const dm = darkMode;
  const [activeGame, setActiveGame] = useState(null);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('safetyLove_gameStats');
    return saved ? JSON.parse(saved) : { played: 0, won: 0, stars: 0 };
  });

  const refreshStats = () => {
    const saved = localStorage.getItem('safetyLove_gameStats');
    setStats(saved ? JSON.parse(saved) : { played: 0, won: 0, stars: 0 });
  };

  if (activeGame === 'green-red-flag') {
    return (
      <div style={{ position: 'relative' }}>
        <GreenRedFlagGame darkMode={darkMode} onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'quiz-emocional') {
    return (
      <div style={{ position: 'relative' }}>
        <QuizEmocional darkMode={darkMode} onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  if (activeGame === 'memoria') {
    return (
      <div style={{ position: 'relative' }}>
        <MemoriaSentimientos darkMode={darkMode} onBack={() => setActiveGame(null)} />
      </div>
    );
  }

  const featured = GAMES[0];
  const FeaturedIcon = featured.icon;

  const bg = dm ? '#070D1C' : '#F5F0E8';
  const cardBg = dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = dm ? '#F1F5F9' : '#0F172A';
  const textSecondary = dm ? '#64748B' : '#94A3B8';

  return (
    <div style={{ minHeight: '100%', fontFamily: "'Inter', sans-serif", background: bg }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '44px 48px' }} className="custom-scrollbar">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* ═══ HEADER ═══ */}
          <header style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA', flexShrink: 0
            }}>
              <Gamepad2 size={26} style={{ color: '#EC4899' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '44px', fontWeight: 800, letterSpacing: '-0.02em',
                color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.1
              }}>Juegos</h1>
              <p style={{
                fontSize: '17px', fontWeight: 500, color: textSecondary,
                marginTop: '6px', margin: '6px 0 0'
              }}>Diviértete mientras aprendes sobre bienestar emocional.</p>
            </div>
          </header>

          {/* ═══ STATS ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }} className="games-stats-grid">
            <style>{`
              @media (max-width: 768px) { .games-stats-grid { grid-template-columns: 1fr !important; } }
            `}</style>
            {[
              { icon: '🏅', label: 'Jugadas', value: stats.played, color: '#F59E0B', bg: dm ? 'rgba(245,158,11,0.1)' : '#FFFBEB' },
              { icon: '⭐', label: 'Estrellas', value: stats.stars, color: '#EC4899', bg: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA' },
              { icon: '🏆', label: 'Perfectas', value: stats.won, color: '#8B5CF6', bg: dm ? 'rgba(139,92,246,0.1)' : '#F5F3FF' },
            ].map((stat) => (
              <div key={stat.label} style={{
                borderRadius: '20px', padding: '24px',
                display: 'flex', alignItems: 'center', gap: '18px',
                background: cardBg, border: `1px solid ${cardBorder}`,
                boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                minHeight: '110px', transition: 'all 200ms ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: stat.bg, flexShrink: 0, fontSize: '28px'
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: textPrimary, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: textSecondary, marginTop: '6px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ FEATURED GAME ═══ */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: '32px' }}>
            <button onClick={() => setActiveGame(featured.id)} style={{
              width: '100%', textAlign: 'left', borderRadius: '28px',
              border: `1.5px solid ${dm ? 'rgba(52,211,153,0.15)' : 'rgba(52,211,153,0.12)'}`,
              padding: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: '32px', flexWrap: 'wrap',
              background: dm ? 'linear-gradient(135deg, rgba(52,211,153,0.04), rgba(20,184,166,0.02))' : 'linear-gradient(135deg, #F0FDF4, #F0FDFA)',
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
              minHeight: '280px', cursor: 'pointer', transition: 'all 250ms ease',
              fontFamily: 'inherit', position: 'relative', overflow: 'hidden'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,23,42,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(15,23,42,0.04)'; }}
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: dm ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)',
                    color: '#22C55E'
                  }}>Destacado</span>
                  <span style={{
                    padding: '6px 12px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em',
                    background: dm ? 'rgba(236,72,153,0.12)' : 'rgba(236,72,153,0.1)',
                    color: dm ? '#F472B6' : '#EC4899'
                  }}>{featured.category}</span>
                </div>
                <h2 style={{
                  fontSize: '28px', fontWeight: 800, color: textPrimary,
                  margin: '0 0 10px', fontFamily: "'Poppins', sans-serif"
                }}>{featured.title}</h2>
                <p style={{
                  fontSize: '16px', fontWeight: 500, color: textSecondary,
                  margin: '0 0 24px', lineHeight: 1.5
                }}>{featured.desc}</p>
                <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
                  {[
                    { icon: <Clock size={15} />, label: featured.time },
                    { icon: <Users size={15} />, label: featured.players },
                    { icon: null, label: featured.difficulty },
                  ].map((item, i) => (
                    <span key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '14px', fontWeight: 600, color: dm ? '#94A3B8' : '#64748B'
                    }}>
                      {item.icon} {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: featured.gradient, boxShadow: '0 8px 24px rgba(52,211,153,0.2)'
                }}>
                  <FeaturedIcon size={44} style={{ color: '#fff' }} strokeWidth={1.8} />
                </div>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '16px', fontWeight: 700, color: '#EC4899',
                  padding: '12px 24px', borderRadius: '14px',
                  background: dm ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                  transition: 'all 200ms ease'
                }}>
                  Jugar <ArrowRight size={16} />
                </span>
              </div>
            </button>
          </motion.div>

          {/* ═══ MORE GAMES ═══ */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Explora más juegos</h2>
              <button style={{
                fontSize: '14px', fontWeight: 600, color: '#EC4899',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                transition: 'all 150ms ease', fontFamily: 'inherit'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = dm ? 'rgba(236,72,153,0.06)' : '#FFF5FA'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="games-grid">
              <style>{`
                @media (max-width: 768px) { .games-grid { grid-template-columns: 1fr !important; } }
              `}</style>
              {GAMES.slice(1).map((game, index) => {
                const GameIcon = game.icon;
                return (
                  <motion.div key={game.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.06 }}>
                    <button onClick={() => setActiveGame(game.id)} style={{
                      width: '100%', textAlign: 'left', borderRadius: '22px',
                      border: `1px solid ${cardBorder}`,
                      padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px',
                      background: cardBg, boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                      cursor: 'pointer', transition: 'all 250ms ease', fontFamily: 'inherit',
                      minHeight: '180px'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(15,23,42,0.08)'; e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.04)'; e.currentTarget.style.borderColor = cardBorder; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                        <div style={{
                          width: '72px', height: '72px', borderRadius: '20px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: game.gradient, flexShrink: 0,
                          boxShadow: `0 4px 16px rgba(0,0,0,0.1)`
                        }}>
                          <GameIcon size={28} style={{ color: '#fff' }} strokeWidth={1.8} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '19px', fontWeight: 700, color: textPrimary, margin: '0 0 8px' }}>{game.title}</h3>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, margin: 0, lineHeight: 1.5 }}>{game.desc}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: dm ? '#94A3B8' : '#64748B' }}>
                            <Clock size={13} /> {game.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: dm ? '#94A3B8' : '#64748B' }}>
                            <Users size={13} /> {game.players}
                          </span>
                        </div>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '14px', fontWeight: 700, color: '#EC4899'
                        }}>
                          Jugar <ArrowRight size={14} />
                        </span>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ═══ COMING SOON ═══ */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: '0 0 24px', fontFamily: "'Poppins', sans-serif" }}>Próximamente</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="coming-soon-grid">
              <style>{`
                @media (max-width: 900px) { .coming-soon-grid { grid-template-columns: 1fr !important; } }
              `}</style>
              {COMING_SOON.map((game, i) => {
                const CsIcon = game.icon;
                return (
                  <div key={i} style={{
                    borderRadius: '22px', border: `1.5px dashed ${dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    padding: '28px', background: dm ? 'rgba(255,255,255,0.015)' : '#FAFBFC',
                    transition: 'all 200ms ease'
                  }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                      border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                      marginBottom: '18px', fontSize: '22px'
                    }}>
                      <CsIcon size={22} style={{ color: dm ? '#475569' : '#94A3B8' }} strokeWidth={1.8} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: dm ? '#CBD5E1' : '#334155', margin: '0 0 8px' }}>{game.title}</h3>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: dm ? '#475569' : '#94A3B8', margin: '0 0 20px', lineHeight: 1.5 }}>{game.desc}</p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '8px 14px', borderRadius: '999px',
                      fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                      color: dm ? '#475569' : '#94A3B8'
                    }}>
                      <Lock size={11} /> Próximamente
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
