import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, X, Clock, Heart, Star, Play, Pause,
  ChevronLeft, ChevronRight, Smile, TriangleAlert,
} from 'lucide-react';
import SafetyMascot from './SafetyMascot';

const ITEM_TYPES = [
  { emoji: '🍏', points: 6, isGood: true, feedback: '¡Gran elección! La manzana te llena de energía.' },
  { emoji: '🍓', points: 9, isGood: true, feedback: '¡Delicioso! Las fresas son ricas en antioxidantes.' },
  { emoji: '🥑', points: 7, isGood: true, feedback: '¡Excelente! Grasas saludables para tu día.' },
  { emoji: '🍩', points: -8, isGood: false, feedback: '¡Cuidado! Los dulces en exceso reducen tu energía.' },
  { emoji: '🧁', points: -8, isGood: false, feedback: '¡Ojo! Intenta moderar los azúcares procesados.' },
  { emoji: '❌', points: -15, isGood: false, costsLife: true, feedback: '¡La X te quitó una vida! Evita los hábitos negativos.' },
];

const GAME_SECONDS = 30;
const START_LIVES = 2;

export default function MiniJuegoBienestar({ darkMode = false, mascotId = null, onFinish = null, onExit = null }) {
  const dm = darkMode;
  const canvasRef = useRef(null);
  const arenaRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const finishedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timer, setTimer] = useState(GAME_SECONDS);
  const [feedback, setFeedback] = useState({
    mood: 'idle',
    title: '¡Cuida tu bienestar!',
    desc: 'Recoge frutas y alimentos saludables para mantener alegre a tu mascota.',
  });

  const G = useRef({
    score: 0,
    lives: START_LIVES,
    timer: GAME_SECONDS,
    isPlaying: false,
    petX: 100,
    items: [],
    keys: { left: false, right: false },
    spawnCounter: 0,
    w: 300,
    h: 256,
  });

  const setFeedbackMood = (mood, title, desc) => setFeedback({ mood, title, desc });

  const finish = useCallback((reason, lost = false) => {
    const g = G.current;
    g.isPlaying = false;
    setIsPlaying(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!finishedRef.current) {
      finishedRef.current = true;
      if (onFinish) onFinish({ score: g.score, reason, lost });
    }
  }, [onFinish]);

  const endGame = useCallback((message, lost = false) => {
    setFeedbackMood('idle', 'Resumen de la partida', `${message} Puntaje final: ${G.current.score} puntos.`);
    finish('ended', lost);
  }, [finish]);

  // ── La mascota elegida se renderiza como SVG sobre el canvas ──
  const [petXPct, setPetXPct] = useState(50);
  const lastPctRef = useRef(50);

  const handleCatch = useCallback((itemData) => {
    const g = G.current;
    g.score = Math.max(0, g.score + itemData.points);
    setScore(g.score);

    if (!itemData.isGood) {
      // Solo la X quita vidas; los dulces solo restan puntos
      if (itemData.costsLife) {
        g.lives -= 1;
        setLives(g.lives);
        if (g.lives <= 0) {
          endGame('¡Juego terminado! Inténtalo de nuevo.', true);
          return;
        }
      }
    }

    if (itemData.isGood) {
      setFeedbackMood('good', '¡Buena elección!', itemData.feedback);
    } else {
      setFeedbackMood('bad', '¡Ten cuidado!', itemData.feedback);
    }
  }, [endGame]);

  // ── Bucle principal ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const arena = arenaRef.current;
      if (!arena) return;
      const rect = arena.getBoundingClientRect();
      const w = Math.max(200, rect.width);
      const h = Math.max(200, rect.height);
      canvas.width = w;
      canvas.height = h;
      const g = G.current;
      g.w = w;
      g.h = h;
      g.petX = Math.min(Math.max(g.petX, 10), w - 54);
    };
    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro && arenaRef.current) ro.observe(arenaRef.current);
    window.addEventListener('resize', resize);

    const loop = () => {
      const g = G.current;
      ctx.clearRect(0, 0, g.w, g.h);

      // Colinas
      ctx.fillStyle = dm ? '#14332A' : '#A7F3D0';
      ctx.beginPath();
      ctx.ellipse(g.w / 2, g.h + 60, g.w * 0.7, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dm ? '#1A3D2A' : '#6EE7B7';
      ctx.beginPath();
      ctx.ellipse(g.w / 2 + 50, g.h + 40, g.w * 0.6, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mover mascota (y reflejar su posición en el overlay React)
      if (g.keys.left) g.petX = Math.max(10, g.petX - 6);
      if (g.keys.right) g.petX = Math.min(g.w - 54, g.petX + 6);
      const pct = ((g.petX + 22) / g.w) * 100;
      if (Math.abs(pct - lastPctRef.current) > 0.4) {
        lastPctRef.current = pct;
        setPetXPct(pct);
      }

      if (g.isPlaying) {
        g.spawnCounter += 1;
        if (g.spawnCounter % 55 === 0) {
          const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
          g.items.push({
            x: Math.random() * (g.w - 30) + 15,
            y: -20,
            speed: 2.1 + Math.random() * 1.6,
            data: type,
          });
        }

        for (let i = g.items.length - 1; i >= 0; i -= 1) {
          const item = g.items[i];
          item.y += item.speed;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 4;
          ctx.font = '26px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.data.emoji, item.x, item.y);
          ctx.restore();

          const petTop = g.h - 55;
          if (
            item.y + 12 >= petTop &&
            item.y - 12 <= petTop + 44 &&
            item.x >= g.petX - 5 &&
            item.x <= g.petX + 49
          ) {
            handleCatch(item.data);
            g.items.splice(i, 1);
            if (!G.current.isPlaying) break;
            continue;
          }

          if (item.y > g.h + 20) g.items.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onKeyDown = (e) => {
      if (!G.current.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') G.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') G.current.keys.right = true;
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') G.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') G.current.keys.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dm, handleCatch]);

  const startGame = () => {
    const g = G.current;
    g.isPlaying = true;
    g.score = 0;
    g.lives = START_LIVES;
    g.timer = GAME_SECONDS;
    g.items = [];
    g.spawnCounter = 0;
    g.petX = g.w / 2 - 22;
    setScore(0);
    setLives(START_LIVES);
    setTimer(GAME_SECONDS);
    setIsPlaying(true);
    finishedRef.current = false;
    setFeedbackMood('idle', '¡A jugar!', 'Mueve a tu mascota y atrapa lo saludable.');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      g.timer -= 1;
      setTimer(g.timer);
      if (g.timer <= 0) endGame('¡Tiempo agotado! ¡Excelente trabajo!');
    }, 1000);
  };

  const toggleGame = () => {
    if (G.current.isPlaying) {
      G.current.isPlaying = false;
      setIsPlaying(false);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setFeedbackMood('idle', 'Juego pausado', 'Pulsa continuar cuando quieras seguir.');
    } else if (G.current.timer < GAME_SECONDS || G.current.score > 0 || finishedRef.current) {
      // continuar / reiniciar tras pausa o fin
      startGame();
    } else {
      startGame();
    }
  };

  const holdMove = (dir) => ({
    onMouseDown: () => { G.current.keys[dir] = true; },
    onMouseUp: () => { G.current.keys[dir] = false; },
    onMouseLeave: () => { G.current.keys[dir] = false; },
    onTouchStart: (e) => { e.preventDefault(); G.current.keys[dir] = true; },
    onTouchEnd: () => { G.current.keys[dir] = false; },
  });

  const handleClose = () => {
    const g = G.current;
    g.isPlaying = false;
    setIsPlaying(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    // Salir sin terminar la partida no otorga estrellas
    if (onExit) onExit();
  };

  const cardBg = dm ? '#111A2E' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const titleColor = dm ? '#F1F5F9' : '#2B2D42';
  const subColor = dm ? '#94A3B8' : '#64748B';

  const feedbackStyles =
    feedback.mood === 'good'
      ? { box: dm ? 'rgba(16,185,129,0.1)' : '#ECFDF5', border: 'rgba(16,185,129,0.2)', iconBg: '#D1FAE5', iconColor: '#059669', Icon: Smile }
      : feedback.mood === 'bad'
        ? { box: dm ? 'rgba(245,158,11,0.1)' : '#FFFBEB', border: 'rgba(245,158,11,0.25)', iconBg: '#FEF3C7', iconColor: '#D97706', Icon: TriangleAlert }
        : { box: dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC', border: dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0', iconBg: '#FCE7F3', iconColor: '#EC4899', Icon: Heart };

  return (
    <div className="w-full" style={{ maxWidth: '576px', borderRadius: '24px', background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: dm ? '0 24px 80px rgba(0,0,0,0.4)' : '0 24px 80px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) { .mj-controls-row { flex-direction: column !important; align-items: stretch !important; } .mj-stats-row { flex-wrap: wrap !important; } }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between relative" style={{ padding: '24px 24px 16px' }}>
        <div>
          <div className="inline-flex items-center" style={{ gap: '6px', padding: '4px 12px', borderRadius: '999px', background: dm ? 'rgba(236,72,153,0.1)' : '#FDF2F8', border: '1px solid rgba(236,72,153,0.15)', color: '#EC4899', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Sparkles size={11} />
            <span>Mascota Safety Love</span>
            <Sparkles size={11} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: titleColor, letterSpacing: '-0.02em', margin: '10px 0 4px', fontFamily: "'Poppins', sans-serif" }}>
            Mini-juego de Bienestar
          </h2>
          <p style={{ fontSize: '12px', color: subColor, fontWeight: 500 }}>
            Cuida de tu mascota y mejora tu bienestar día a día.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center transition-all duration-200 active:scale-95"
          style={{ gap: '6px', padding: '6px 12px', borderRadius: '999px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', color: dm ? '#94A3B8' : '#64748B', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          <X size={14} />
          <span>Cerrar</span>
        </button>
      </div>

      {/* Stats */}
      <div className="mj-stats-row flex items-center justify-center" style={{ gap: '12px', padding: '0 24px 16px' }}>
        <div className="flex items-center" style={{ gap: '8px', padding: '6px 16px', borderRadius: '16px', background: dm ? 'rgba(236,72,153,0.1)' : '#FDF2F8', border: '1px solid rgba(236,72,153,0.15)', color: '#EC4899', fontSize: '14px', fontWeight: 700 }}>
          <Clock size={16} />
          <span>{timer}s</span>
        </div>
        <div className="flex items-center" style={{ gap: '8px', padding: '6px 16px', borderRadius: '16px', background: dm ? 'rgba(244,63,94,0.1)' : '#FFF1F2', border: '1px solid rgba(244,63,94,0.15)', color: '#F43F5E', fontSize: '14px', fontWeight: 700 }}>
          <Heart size={16} fill="currentColor" />
          <span>{lives}</span>
        </div>
        <div className="flex items-center" style={{ gap: '8px', padding: '6px 16px', borderRadius: '16px', background: dm ? 'rgba(245,158,11,0.1)' : '#FFFBEB', border: '1px solid rgba(245,158,11,0.2)', color: '#D97706', fontSize: '14px', fontWeight: 700 }}>
          <Star size={16} fill="currentColor" />
          <span>{score}</span>
        </div>
      </div>

      {/* Arena */}
      <div style={{ padding: '0 24px' }}>
        <div
          ref={arenaRef}
          className="relative w-full overflow-hidden"
          style={{
            height: '256px',
            borderRadius: '24px',
            background: dm
              ? 'linear-gradient(180deg, #1A2744 0%, #14332A 70%, #1A3D2A 100%)'
              : 'linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 55%, #D1FAE5 100%)',
            border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.25)'}`,
          }}
        >
          <div className="absolute pointer-events-none" style={{ top: '16px', left: '24px', width: '64px', height: '24px', background: 'rgba(255,255,255,0.7)', borderRadius: '999px', filter: 'blur(1px)' }} />
          <div className="absolute pointer-events-none" style={{ top: '32px', right: '48px', width: '80px', height: '28px', background: 'rgba(255,255,255,0.7)', borderRadius: '999px', filter: 'blur(1px)' }} />
          <div className="absolute pointer-events-none" style={{ top: '48px', left: '33%', width: '56px', height: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '999px', filter: 'blur(1px)' }} />

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }} />

          {/* Mascota elegida en Inicio (duerme cuando no se juega) */}
          <div className="pointer-events-none" style={{ position: 'absolute', left: `${petXPct}%`, bottom: '8px', transform: 'translateX(-50%)', zIndex: 15, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.12))' }}>
            <SafetyMascot size="md" mascotId={mascotId} sleeping={!isPlaying} />
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="mj-controls-row flex items-center justify-between" style={{ gap: '12px', padding: '16px 24px' }}>
        <button
          onClick={toggleGame}
          className="transition-all active:scale-95"
          style={{ flex: 1, padding: '12px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #FF6B8B, #FF477E)', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,139,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? 'Pausar juego' : 'Iniciar juego'}</span>
        </button>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <button
            {...holdMove('left')}
            className="transition-all active:scale-95"
            style={{ padding: '12px 16px', borderRadius: '16px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', color: dm ? '#94A3B8' : '#475569', fontWeight: 700, fontSize: '12px', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', userSelect: 'none' }}
          >
            <ChevronLeft size={14} />
            <span>Mover</span>
          </button>
          <button
            {...holdMove('right')}
            className="transition-all active:scale-95"
            style={{ padding: '12px 16px', borderRadius: '16px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', color: dm ? '#94A3B8' : '#475569', fontWeight: 700, fontSize: '12px', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', userSelect: 'none' }}
          >
            <span>Mover</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div style={{ padding: '0 24px 24px' }}>
        <div className="flex items-center transition-all" style={{ gap: '12px', padding: '14px', borderRadius: '16px', background: feedbackStyles.box, border: `1px solid ${feedbackStyles.border}` }}>
          <div className="flex items-center justify-center shrink-0" style={{ width: '40px', height: '40px', borderRadius: '12px', background: feedbackStyles.iconBg, color: feedbackStyles.iconColor }}>
            <feedbackStyles.Icon size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: titleColor }}>{feedback.title}</h4>
            <p style={{ fontSize: '11px', color: subColor, fontWeight: 500 }}>{feedback.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
