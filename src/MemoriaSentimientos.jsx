import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronRight, Star, Clock, ArrowLeft, Layers, Users, Trophy, Brain, Shield } from 'lucide-react';
import SafetyMascot from './SafetyMascot';

const EMOTIONS = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😡', label: 'Enojado' },
  { emoji: '😨', label: 'Asustado' },
  { emoji: '😮', label: 'Sorprendido' },
  { emoji: '🥰', label: 'Enamorado' },
  { emoji: '😌', label: 'Tranquilo' },
  { emoji: '🤔', label: 'Confundido' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function saveGameStats(gameId, won) {
  const stats = JSON.parse(localStorage.getItem('safetyLove_gameStats') || '{"played":0,"won":0,"stars":0}');
  stats.played = (stats.played || 0) + 1;
  if (won) stats.won = (stats.won || 0) + 1;
  stats.stars = (stats.stars || 0) + (won ? 3 : 1);
  localStorage.setItem('safetyLove_gameStats', JSON.stringify(stats));
}

export default function MemoriaSentimientos({ darkMode = false, onBack }) {
  const dm = darkMode;
  const [gameState, setGameState] = useState('menu');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('safetyLove_memoria_best');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentMascotId, setCurrentMascotId] = useState(() => {
    try { return localStorage.getItem('safetyLoveMascot') || 'michi-menta'; } catch { return 'michi-menta'; }
  });
  const [showTrophy, setShowTrophy] = useState(false);
  const score = matched.length;

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const startGame = useCallback(() => {
    const selected = shuffleArray(EMOTIONS).slice(0, 6);
    const pairs = [...selected, ...selected].map((e, i) => ({ ...e, id: i }));
    setCards(shuffleArray(pairs));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimer(0);
    setGameState('playing');
  }, []);

  const handleFlip = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].label)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      if (cards[newFlipped[0]].label === cards[newFlipped[1]].label) {
        const newMatched = [...matched, cards[newFlipped[0]].label];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === 6) {
          const won = moves <= 15;
          saveGameStats('memoria', won);
          setTimeout(() => {
            if (!bestTime || timer < bestTime) {
              setBestTime(timer);
              localStorage.setItem('safetyLove_memoria_best', timer.toString());
            }
            setShowTrophy(true);
            setGameState('summary');
            setTimeout(() => setShowTrophy(false), 3000);
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (gameState === 'menu') {
    return (
      <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#060B18]' : 'bg-[#F5F0E8]'}`}>
        {/* Decorative glows */}
        <div className="absolute pointer-events-none" style={{ top: '6%', left: '4%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '6%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.035), transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '60%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.03), transparent 70%)', transform: 'translate(-50%, -50%)' }} />

        <style>{`
          @keyframes ms-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes ms-glow { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.05)} }
          @keyframes ms-star { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.3)} }
          @keyframes ms-card-shine { 0%{transform:rotateY(0deg)} 50%{transform:rotateY(8deg)} 100%{transform:rotateY(0deg)} }
          .ms-float { animation: ms-float 4s ease-in-out infinite; }
          .ms-glow { animation: ms-glow 5s ease-in-out infinite; }
          .ms-star { animation: ms-star 3.5s ease-in-out infinite; }
          .ms-card-shine { animation: ms-card-shine 6s ease-in-out infinite; }
          @media (max-width: 768px) { .ms-hero-row { flex-direction: column !important; text-align: center !important; gap: 24px !important; } .ms-hero-text { max-width: 100% !important; } .ms-stats-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        <div className="relative z-10 flex items-start justify-center min-h-[calc(100vh-180px)] p-8 md:p-10" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
          <div className="w-full max-w-[1100px]">

            {/* ── BACK BUTTON ── */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 transition-all duration-200"
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                background: dm ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#D4C8B8'}`,
                color: dm ? '#CBD5E1' : '#475569',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '48px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#D4C8B8'; e.currentTarget.style.color = dm ? '#CBD5E1' : '#475569'; }}
            >
              <ArrowLeft size={16} strokeWidth={2.2} />
              Volver
            </button>

            {/* ── MAIN PANEL ── */}
            <div
              className="relative"
              style={{
                borderRadius: '28px',
                padding: '44px 48px',
                background: dm ? '#111A2E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                overflow: 'visible',
              }}
            >
              {/* ── HERO ── */}
              <div className="ms-hero-row flex items-center" style={{ gap: '44px', marginBottom: '36px' }}>
                {/* Card Illustration */}
                <div className="relative shrink-0 ms-float" style={{ width: '200px', height: '200px' }}>
                  {/* Glow behind */}
                  <div className="absolute ms-glow" style={{ inset: '-28px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)' }} />
                  {/* Particles */}
                  {[
                    { x: '-6%', y: '10%', d: 0, c: '#A78BFA' },
                    { x: '90%', y: '5%', d: 1.3, c: '#F43F9E' },
                    { x: '88%', y: '85%', d: 0.8, c: '#06B6D4' },
                    { x: '-2%', y: '80%', d: 2, c: '#3B82F6' },
                  ].map((p, i) => (
                    <div key={i} className="absolute ms-star" style={{ left: p.x, top: p.y, width: '5px', height: '5px', borderRadius: '50%', background: p.c, animationDelay: `${p.d}s` }} />
                  ))}
                  {/* Card stack */}
                  <div className="relative flex items-center justify-center" style={{ width: '180px', height: '180px', margin: '0 auto' }}>
                    {/* Back card */}
                    <div className="absolute ms-card-shine" style={{
                      width: '120px', height: '150px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.12))',
                      border: '1px solid rgba(168,85,247,0.15)',
                      transform: 'rotate(-12deg) translateX(-16px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }} />
                    {/* Front card */}
                    <div className="relative" style={{
                      width: '130px', height: '160px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(244,63,158,0.12), rgba(168,85,247,0.10))',
                      border: '1px solid rgba(244,63,158,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                      transform: 'rotate(4deg)',
                    }}>
                      <span style={{ fontSize: '64px' }}>🃏</span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="ms-hero-text flex-1" style={{ minWidth: 0 }}>
                  <h1 style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: '12px' }}>
                    <span style={{ color: dm ? '#F8FAFC' : '#1E293B' }}>Memoria </span>
                    <span style={{ background: 'linear-gradient(135deg, #F43F9E, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sentimientos</span>
                  </h1>
                  <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '520px' }}>
                    Encuentra las parejas de emociones. Voltea las tarjetas y recuerda dónde está cada emoción.
                  </p>
                </div>
              </div>

              {/* ── STATS ── */}
              <div className="ms-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
                {/* Cards */}
                <div style={{
                  borderRadius: '20px',
                  padding: '24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168,85,247,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Layers size={22} style={{ color: '#A78BFA' }} />
                  </div>
                  <p style={{ fontSize: '36px', fontWeight: 800, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1, marginBottom: '4px' }}>12</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: dm ? '#CBD5E1' : '#475569', marginBottom: '2px' }}>Tarjetas</p>
                  <p style={{ fontSize: '13px', color: dm ? '#64748B' : '#64748B' }}>Encuentra todas las parejas</p>
                </div>

                {/* Pairs */}
                <div style={{
                  borderRadius: '20px',
                  padding: '24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6,182,212,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Users size={22} style={{ color: '#06B6D4' }} />
                  </div>
                  <p style={{ fontSize: '36px', fontWeight: 800, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1, marginBottom: '4px' }}>6</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: dm ? '#CBD5E1' : '#475569', marginBottom: '2px' }}>Parejas</p>
                  <p style={{ fontSize: '13px', color: dm ? '#64748B' : '#64748B' }}>Completa todas las combinaciones</p>
                </div>

                {/* Best Time */}
                <div style={{
                  borderRadius: '20px',
                  padding: '24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(251,191,36,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Trophy size={22} style={{ color: '#FBBF24' }} />
                  </div>
                  <p style={{ fontSize: '36px', fontWeight: 800, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1, marginBottom: '4px' }}>
                    {bestTime ? formatTime(bestTime) : '0:21'}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: dm ? '#CBD5E1' : '#475569', marginBottom: '2px' }}>Mejor tiempo</p>
                  <p style={{ fontSize: '13px', color: dm ? '#64748B' : '#64748B' }}>{bestTime ? '¡Intenta superarlo!' : '¡Intenta superarlo!'}</p>
                </div>
              </div>

              {/* ── PLAY BUTTON ── */}
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center transition-all duration-200"
                style={{
                  height: '64px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #F43F9E, #A78BFA, #06B6D4)',
                  color: '#FFFFFF',
                  fontSize: '19px',
                  fontWeight: 800,
                  gap: '10px',
                  boxShadow: '0 10px 32px rgba(168,85,247,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '28px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(168,85,247,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(168,85,247,0.25)'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Jugar <ChevronRight size={22} strokeWidth={2.5} />
              </button>

              {/* ── INFO CARD ── */}
              <div
                style={{
                  borderRadius: '18px',
                  padding: '20px 24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168,85,247,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Brain size={18} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: dm ? '#F8FAFC' : '#F8FAFC', marginBottom: '4px' }}>Entrena tu mente y tus emociones</p>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                    Este juego te ayuda a mejorar tu memoria, atención y conexión con tus sentimientos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#060B18]' : 'bg-[#F5F0E8]'}`}>
        {/* Decorative glows */}
        <div className="absolute pointer-events-none" style={{ top: '6%', left: '4%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.04), transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '6%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.03), transparent 70%)' }} />

        <style>{`
          @keyframes ms-card-idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
          @keyframes ms-progress-glow { 0%,100%{box-shadow:0 0 8px rgba(168,85,247,0.3)} 50%{box-shadow:0 0 16px rgba(168,85,247,0.5)} }
          .ms-card-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(168,85,247,0.2) !important; border-color: rgba(168,85,247,0.35) !important; }
          .ms-card-matched { border-color: rgba(34,197,94,0.4) !important; }
          .ms-progress-fill { animation: ms-progress-glow 2s ease-in-out infinite; }
          @media (max-width: 768px) { .ms-board-grid { grid-template-columns: repeat(3, 1fr) !important; } .ms-stats-row { grid-template-columns: 1fr !important; } }
        `}</style>

        <div className="relative z-10 flex items-start justify-center min-h-[calc(100vh-180px)] p-8 md:p-10" style={{ paddingTop: '28px', paddingBottom: '48px' }}>
          <div className="w-full max-w-[1100px]">

            {/* ── HEADER ROW ── */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onBack}
                className="flex items-center transition-all duration-200"
                style={{
                  height: '40px', padding: '0 18px', borderRadius: '999px',
                  border: dm ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  color: dm ? '#94A3B8' : '#475569',
                  fontSize: '14px', fontWeight: 600, gap: '8px', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = dm ? '#94A3B8' : '#475569'; }}
              >
                <ArrowLeft size={16} strokeWidth={2.2} /> Volver
              </button>
              <div className="flex items-center" style={{ gap: '8px', padding: '8px 16px', borderRadius: '999px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.12)' }}>
                <Star size={15} style={{ color: '#FBBF24' }} fill="currentColor" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#FBBF24' }}>{score}</span>
              </div>
            </div>

            {/* ── MAIN PANEL ── */}
            <div
              className="relative"
              style={{
                borderRadius: '28px',
                padding: '40px 44px',
                background: dm ? '#111A2E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
              }}
            >
              {/* ── MASCOT + TITLE ── */}
              <div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
                {/* Mascot */}
                <div className="relative" style={{ marginBottom: '16px' }}>
                  <div className="absolute inset-[-14px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)' }} />
                  <div className="relative flex items-center justify-center" style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.10)' }}>
                    <SafetyMascot size="sm" mascotId={currentMascotId} />
                  </div>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '8px', textAlign: 'center' }}>
                  <span style={{ color: dm ? '#F8FAFC' : '#1E293B' }}>MEMORIA </span>
                  <span style={{ background: 'linear-gradient(135deg, #F43F9E, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SENTIMIENTOS</span>
                </h1>
                <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.5, textAlign: 'center', maxWidth: '480px' }}>
                  Encuentra todas las parejas de emociones
                </p>
              </div>

              {/* ── STATS ROW ── */}
              <div className="ms-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {/* Movimientos */}
                <div style={{
                  borderRadius: '18px',
                  padding: '20px 24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(244,63,158,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '22px' }}>🎯</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: dm ? '#64748B' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Movimientos</p>
                    <p style={{ fontSize: '32px', fontWeight: 800, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1 }}>{moves}</p>
                  </div>
                </div>

                {/* Tiempo */}
                <div style={{
                  borderRadius: '18px',
                  padding: '20px 24px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={22} style={{ color: '#3B82F6' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: dm ? '#64748B' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Tiempo</p>
                    <p style={{ fontSize: '32px', fontWeight: 800, color: dm ? '#F8FAFC' : '#1E293B', lineHeight: 1 }}>{formatTime(timer)}</p>
                  </div>
                </div>
              </div>

              {/* ── CARD BOARD ── */}
              <div className="ms-board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {cards.map((card, idx) => {
                  const isFlipped = flipped.includes(idx) || matched.includes(card.label);
                  const isMatched = matched.includes(card.label);
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleFlip(idx)}
                      whileTap={{ scale: 0.95 }}
                      className={`ms-card-hover relative transition-all duration-200 ${isMatched ? 'ms-card-matched' : ''}`}
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: '20px',
                        border: `2px solid ${isMatched ? 'rgba(34,197,94,0.4)' : isFlipped ? 'rgba(168,85,247,0.4)' : dm ? 'rgba(255,255,255,0.08)' : '#D4C8B8'}`,
                        background: isMatched
                          ? dm ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)'
                          : isFlipped
                            ? dm ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.08)'
                            : dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: isMatched
                          ? '0 4px 16px rgba(34,197,94,0.1)'
                          : isFlipped
                            ? '0 4px 16px rgba(168,85,247,0.1)'
                            : dm ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      {isFlipped ? (
                        <motion.span
                          initial={{ rotateY: 180, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          transition={{ duration: 0.35 }}
                          style={{ fontSize: '48px', lineHeight: 1 }}
                        >
                          {card.emoji}
                        </motion.span>
                      ) : (
                        <span style={{ fontSize: '32px', color: dm ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.12)', fontWeight: 700 }}>?</span>
                      )}

                      {/* Subtle pattern for face-down cards */}
                      {!isFlipped && !isMatched && (
                        <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '18px', overflow: 'hidden', opacity: dm ? 0.06 : 0.03 }}>
                          <div style={{ position: 'absolute', top: '10%', left: '15%', fontSize: '18px' }}>♥</div>
                          <div style={{ position: 'absolute', top: '55%', right: '12%', fontSize: '14px' }}>★</div>
                          <div style={{ position: 'absolute', bottom: '12%', left: '50%', fontSize: '16px' }}>♥</div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* ── PROGRESS ── */}
              <div style={{
                borderRadius: '18px',
                padding: '20px 24px',
                background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#D4C8B8'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>🃏</span>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: dm ? '#94A3B8' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parejas encontradas</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#F43F9E' }}>{matched.length} de 6</p>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(matched.length / 6) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="ms-progress-fill"
                    style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #F43F9E, #A78BFA)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#060B18]' : 'bg-[#F5F0E8]'}`}>
      {/* Decorative glows */}
      <div className="absolute pointer-events-none" style={{ top: '6%', left: '4%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.04), transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '6%', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.03), transparent 70%)' }} />

      {showTrophy && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[120px] mb-4">🏆</motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-[28px] font-black text-amber-400 drop-shadow-lg">{moves <= 10 ? '¡PERFECTO!' : '¡Excelente!'}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-[18px] font-bold text-white drop-shadow-lg mt-2">{moves} movimientos</motion.p>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 flex items-start justify-center min-h-[calc(100vh-180px)] p-8 md:p-10" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
        <div className="w-full max-w-[700px]">
          {/* ── BACK BUTTON ── */}
          <button
            onClick={onBack}
            className="flex items-center transition-all duration-200 mb-8"
            style={{
              height: '40px', padding: '0 18px', borderRadius: '999px',
              border: dm ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              color: dm ? '#94A3B8' : '#475569',
              fontSize: '14px', fontWeight: 600, gap: '8px', cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = dm ? '#94A3B8' : '#475569'; }}
          >
            <ArrowLeft size={16} strokeWidth={2.2} /> Volver
          </button>

          {/* ── RESULTS PANEL ── */}
          <div
            className="relative"
            style={{
              borderRadius: '28px',
              padding: '44px 48px',
              background: dm ? '#111A2E' : '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
          >
            {/* Emoji */}
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>

            {/* Title */}
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>¡Completado!</h2>
            <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '28px' }}>
              {moves <= 10 ? '¡Memoria increíble! Eres un genio de las emociones.' :
               moves <= 15 ? '¡Muy bien! Tu memoria funciona excelente.' :
               'Buen trabajo. Practicar más mejorará tu memoria.'}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={{ borderRadius: '18px', padding: '20px', background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF'}` }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#F43F9E', lineHeight: 1, marginBottom: '4px' }}>{moves}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#64748B' : '#64748B' }}>Movimientos</p>
              </div>
              <div style={{ borderRadius: '18px', padding: '20px', background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF'}` }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#A78BFA', lineHeight: 1, marginBottom: '4px' }}>{formatTime(timer)}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#64748B' : '#64748B' }}>Tiempo</p>
              </div>
              <div style={{ borderRadius: '18px', padding: '20px', background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF'}` }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#FBBF24', lineHeight: 1, marginBottom: '4px' }}>
                  {bestTime && timer <= bestTime ? '🏆' : '⭐'}
                </p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#64748B' : '#64748B' }}>
                  {bestTime && timer <= bestTime ? '¡Nuevo récord!' : 'Mejor: ' + formatTime(bestTime || timer)}
                </p>
              </div>
            </div>

            {/* Play Again Button */}
            <button onClick={startGame}
              className="w-full flex items-center justify-center transition-all duration-200"
              style={{
                height: '62px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #F43F9E, #A78BFA, #06B6D4)',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 800,
                gap: '10px',
                boxShadow: '0 10px 32px rgba(168,85,247,0.25)',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(168,85,247,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(168,85,247,0.25)'; }}
            >
              <RotateCcw size={20} /> Jugar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
