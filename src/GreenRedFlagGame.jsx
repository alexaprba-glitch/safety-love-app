import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, RotateCcw, Trophy, Star, ChevronRight, Lightbulb, ArrowLeft, Clock, FileText, Shield } from 'lucide-react';

function saveGameStats(gameId, won) {
  const stats = JSON.parse(localStorage.getItem('safetyLove_gameStats') || '{"played":0,"won":0,"stars":0}');
  stats.played = (stats.played || 0) + 1;
  if (won) stats.won = (stats.won || 0) + 1;
  stats.stars = (stats.stars || 0) + (won ? 3 : 1);
  localStorage.setItem('safetyLove_gameStats', JSON.stringify(stats));
}

const SITUATIONS = [
  { text: 'Tu pareja revisa tu teléfono sin tu permiso.', answer: 'red', explanation: 'Es una falta de confianza y respeto a tu privacidad.' },
  { text: 'Alguien te dice "te quiero" y también lo demuestra con acciones.', answer: 'green', explanation: 'Las palabras y acciones alineadas son una señal de amor genuino.' },
  { text: 'Tu pareja te hace sentir culpable por ver a tus amigos.', answer: 'red', explanation: 'El control social es una forma de manipulación emocional.' },
  { text: 'Alguien te escucha cuando estás triste sin juzgarte.', answer: 'green', explanation: 'El apoyo emocional sin juicio es una señal de empatía.' },
  { text: 'Tu pareja te grita o te insulta en una discusión.', answer: 'red', explanation: 'El respeto debe mantenerse incluso en los desacuerdos.' },
  { text: 'Alguien respeta cuando dices "no" sin insistir.', answer: 'green', explanation: 'El respeto a los límites es fundamental en cualquier relación.' },
  { text: 'Tu pareja te compará constantemente con otras personas.', answer: 'red', explanation: 'Las comparaciones erosionan la autoestima y generan inseguridad.' },
  { text: 'Alguien celebra tus logros y se alegra por tu éxito.', answer: 'green', explanation: 'Una persona sana se siente orgullosa de ti.' },
  { text: 'Tu pareja te aísla de tu familia.', answer: 'red', explanation: 'El aislamiento familiar es una señal de control abusivo.' },
  { text: 'Alguien te da espacio cuando lo necesitas.', answer: 'green', explanation: 'Respetar el espacio personal muestra madurez emocional.' },
  { text: 'Tu pareja te sigue a lugares sin que lo sepas.', answer: 'red', explanation: 'El seguimiento es una forma de vigilancia y control.' },
  { text: 'Alguien te apoya en tus metas y sueños.', answer: 'green', explanation: 'El apoyo mutuo fortalece la relación.' },
  { text: 'Tu pareja usa el chantaje emocional para conseguir cosas.', answer: 'red', explanation: 'El chantaje emocional es una forma de manipulación.' },
  { text: 'Alguien admite cuando se equivoca y pide perdón.', answer: 'green', explanation: 'La humildad y la disculpa genuina son señales de madurez.' },
  { text: 'Tu pareja controla cómo te vistes o te vistas.', answer: 'red', explanation: 'Nadie debería dictar tu libertad de expresión.' },
  { text: 'Alguien te recuerda lo valioso que eres cuando te sientes mal.', answer: 'green', explanation: 'El apoyo en momentos difíciles es una señal de amor real.' },
  { text: 'Tu pareja miente sobre cosas importantes repetidamente.', answer: 'red', explanation: 'La mentira constante destruye la confianza.' },
  { text: 'Alguien comparte tus valores y respetan tus creencias.', answer: 'green', explanation: 'El respeto por las diferencias fortalece la conexión.' },
  { text: 'Tu pareja te amenaza con dejarte si no haces lo que quiere.', answer: 'red', explanation: 'Las amenazas son una forma de control y manipulación.' },
  { text: 'Alguien te sorprende con gestos sencillos pero significativos.', answer: 'green', explanation: 'Los detalles muestran que alguien piensa en ti.' },
  { text: 'Tu pareja se enoja cuando no le respondes el teléfono al instante.', answer: 'red', explanation: 'El control de la comunicación es una señal de dependencia insegura.' },
  { text: 'Alguien te hace reír y te ayuda a ver el lado positivo.', answer: 'green', explanation: 'La alegría compartida fortalece los vínculos.' },
  { text: 'Tu pareja te obliga a ver a sus amigos aunque no quieras.', answer: 'red', explanation: 'La imposición no es amor, es control.' },
  { text: 'Alguien te da espacio para ser tú mismo sin intentar cambiarte.', answer: 'green', explanation: 'El amor genuino acepta a la persona tal como es.' },
  { text: 'Tu pareja humilla frente a otras personas.', answer: 'red', explanation: 'La humillación pública es una forma de abuso emocional.' },
  { text: 'Alguien comunica sus sentimientos de forma honesta.', answer: 'green', explanation: 'La comunicación abierta es la base de toda relación sana.' },
  { text: 'Tu pareja te esconde cosas importantes o secretive.', answer: 'red', explanation: 'La falta de transparencia genera desconfianza.' },
  { text: 'Alguien te respeta y valora tu opinión aunque sea diferente.', answer: 'green', explanation: 'El respeto a las diferencias es señal de una relación madura.' },
  { text: 'Tu pareja usa tu información personal en tu contra.', answer: 'red', explanation: 'Usar vulnerabilidades como arma es una forma de abuso.' },
  { text: 'Alguien te hace sentir seguro/a y en paz.', answer: 'green', explanation: 'La seguridad emocional es fundamental en el amor.' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GreenRedFlagGame({ darkMode = false, onBack }) {
  const dm = darkMode;
  const [gameState, setGameState] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showTrophy, setShowTrophy] = useState(false);

  const totalQuestions = 10;

  useEffect(() => {
    if (gameState === 'summary' && score >= 8) {
      setShowTrophy(true);
      const timer = setTimeout(() => setShowTrophy(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, score]);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(SITUATIONS).slice(0, totalQuestions);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setGameState('playing');
  }, []);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    const correct = questions[currentIndex].answer === answer;
    const newStreak = correct ? streak + 1 : 0;
    if (correct) setScore(prev => prev + 1);
    setStreak(newStreak);
    if (newStreak > bestStreak) setBestStreak(newStreak);
    setAnswers(prev => [...prev, { ...questions[currentIndex], userAnswer: answer, correct }]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      const won = score >= 8;
      saveGameStats('green-red-flag', won);
      setGameState('summary');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const getEmoji = () => {
    const pct = (score / totalQuestions) * 100;
    if (pct >= 90) return '🏆';
    if (pct >= 70) return '🌟';
    if (pct >= 50) return '👍';
    return '💪';
  };

  const getMessage = () => {
    const pct = (score / totalQuestions) * 100;
    if (pct >= 90) return '¡Increíble! Tienes un ojo muy entrenado para detectar banderas.';
    if (pct >= 70) return '¡Muy bien! Conoces bastante sobre relaciones saludables.';
    if (pct >= 50) return 'Buen intento. Sigue aprendiendo sobre señales saludables.';
    return 'Es un buen comienzo. Aprender sobre green flags y red flags te ayudará en tus relaciones.';
  };

  const d = {
    cardBg: dm ? '#1E293B' : '#FFFFFF',
    cardBorder: dm ? 'rgba(255,255,255,0.06)' : 'rgba(244,63,158,0.08)',
    cardShadow: dm ? '0 20px 60px rgba(0,0,0,0.3)' : '0 20px 60px rgba(23,32,51,0.06)',
    titleColor: dm ? '#F1F5F9' : '#172033',
    subtitleColor: dm ? '#94A3B8' : '#64748B',
    statsBg: dm ? 'rgba(255,255,255,0.04)' : '#FAFAFC',
    statsBorder: dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF',
    questionColor: dm ? '#F1F5F9' : '#172033',
    situationBg: dm ? 'rgba(255,77,141,0.04)' : '#FFFCFD',
    situationBorder: dm ? 'rgba(255,77,141,0.12)' : '#FCE7F3',
    situationTextColor: dm ? '#E2E8F0' : '#172033',
    greenBg: dm ? 'rgba(34,197,94,0.06)' : '#F7FFFB',
    greenBorder: dm ? 'rgba(34,197,94,0.25)' : '#86E0B8',
    redBg: dm ? 'rgba(244,63,94,0.06)' : '#FFF8F9',
    redBorder: dm ? 'rgba(244,63,94,0.25)' : '#FDA4AF',
    mutedBg: dm ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
    mutedBorder: dm ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
    learnBg: dm ? 'rgba(124,58,237,0.06)' : '#FAF7FF',
    learnBorder: dm ? 'rgba(124,58,237,0.2)' : '#DDD6FE',
    headerColor: dm ? '#CBD5E1' : '#334155',
    scoreBg: dm ? 'rgba(255,77,141,0.1)' : '#FFF1F7',
    scoreColor: dm ? '#F1F5F9' : '#172033',
  };

  // Menu
  if (gameState === 'menu') {
    return (
      <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#060B18]' : 'bg-[#F5F0E8]'}`}>
        {/* Decorative glows */}
        <div className="absolute pointer-events-none" style={{ top: '5%', left: '8%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04), transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '8%', right: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.04), transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ top: '40%', right: '20%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.03), transparent 70%)' }} />

        <style>{`
          @keyframes grf-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes grf-glow { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.04)} }
          @keyframes grf-star { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.3)} }
          .grf-float { animation: grf-float 4s ease-in-out infinite; }
          .grf-glow { animation: grf-glow 5s ease-in-out infinite; }
          .grf-star { animation: grf-star 3s ease-in-out infinite; }
          @media (max-width: 768px) { .grf-hero-row { flex-direction: column !important; text-align: center !important; gap: 28px !important; } .grf-hero-text { max-width: 100% !important; } .grf-info-grid { grid-template-columns: 1fr !important; } .grf-info-divider { display: none !important; } }
        `}</style>

        <div className="relative z-10 flex items-start justify-center min-h-[calc(100vh-180px)] p-8 md:p-10" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
          <div className="w-full max-w-[1080px]">

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
                borderRadius: '32px',
                padding: '44px 48px',
                background: dm ? '#111A2E' : '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                overflow: 'visible',
              }}
            >
              {/* ── HERO ── */}
              <div className="grf-hero-row flex items-center" style={{ gap: '40px', marginBottom: '32px' }}>
                <div className="grf-hero-text flex-1" style={{ minWidth: 0 }}>
                  <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '14px' }}>
                    <span style={{ color: '#22C55E' }}>Green Flag</span>
                    <span style={{ color: '#F8FAFC' }}> o </span>
                    <span style={{ color: '#F43F9E' }}>Red Flag</span>
                  </h1>
                  <p style={{ fontSize: '18px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '560px' }}>
                    Identifica si las situaciones son señales saludables o señales de alerta en una relación.
                  </p>
                </div>

                {/* Traffic Light Illustration */}
                <div className="relative shrink-0 grf-float" style={{ width: '180px', height: '200px' }}>
                  {/* Glow behind */}
                  <div className="absolute grf-glow" style={{ inset: '-30px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(244,63,158,0.06) 50%, transparent 70%)' }} />
                  {/* Particles */}
                  {[
                    { x: '-10%', y: '10%', d: 0, c: '#22C55E' },
                    { x: '85%', y: '5%', d: 1.2, c: '#FBBF24' },
                    { x: '90%', y: '80%', d: 0.6, c: '#F43F9E' },
                    { x: '-5%', y: '75%', d: 1.8, c: '#3B82F6' },
                  ].map((p, i) => (
                    <div key={i} className="absolute grf-star" style={{ left: p.x, top: p.y, width: '6px', height: '6px', borderRadius: '50%', background: p.c, animationDelay: `${p.d}s` }} />
                  ))}
                  {/* Traffic light body */}
                  <div className="relative flex flex-col items-center" style={{ width: '140px', margin: '0 auto' }}>
                    {/* Pole top */}
                    <div style={{ width: '60px', height: '16px', background: 'linear-gradient(180deg, #2A3650, #1E293B)', borderRadius: '8px 8px 0 0' }} />
                    {/* Light housing */}
                    <div style={{
                      width: '100px',
                      padding: '24px 0',
                      background: 'linear-gradient(180deg, #1E293B, #15203A)',
                      borderRadius: '20px',
                      border: '2px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'radial-gradient(circle, #EF4444 30%, #991B1B 100%)', boxShadow: '0 0 20px rgba(239,68,68,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)' }} />
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'radial-gradient(circle, #FBBF24 30%, #92400E 100%)', boxShadow: '0 0 20px rgba(251,191,36,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)' }} />
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'radial-gradient(circle, #22C55E 30%, #166534 100%)', boxShadow: '0 0 20px rgba(34,197,94,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                    {/* Pole bottom */}
                    <div style={{ width: '20px', height: '40px', background: 'linear-gradient(180deg, #1E293B, #15203A)', borderRadius: '0 0 4px 4px' }} />
                    {/* Base */}
                    <div style={{ width: '80px', height: '10px', background: 'linear-gradient(180deg, #1E293B, #15203A)', borderRadius: '0 0 6px 6px' }} />
                  </div>
                </div>
              </div>

              {/* ── INFO CARD ── */}
              <div
                className="grf-info-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '0',
                  borderRadius: '24px',
                  padding: '32px',
                  marginBottom: '28px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1E7EF'}`,
                  minHeight: '130px',
                  alignItems: 'center',
                }}
              >
                {/* Block 1: Questions */}
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(34,197,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <FileText size={24} style={{ color: '#22C55E' }} />
                  </div>
                  <p style={{ fontSize: '48px', fontWeight: 800, color: '#0F172A', lineHeight: 1, marginBottom: '6px' }}>{totalQuestions}</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Preguntas</p>
                  <p style={{ fontSize: '14px', color: '#475569' }}>Desafía tu intuición</p>
                </div>

                {/* Divider */}
                <div className="grf-info-divider" style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.08)', margin: '0 8px' }} />

                {/* Block 2: No time limit */}
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(59,130,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Clock size={24} style={{ color: '#3B82F6' }} />
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, marginBottom: '6px' }}>Sin tiempo límite</p>
                  <p style={{ fontSize: '15px', color: '#1E293B', marginBottom: '2px' }}>Juega a tu ritmo</p>
                  <p style={{ fontSize: '14px', color: '#475569' }}>Sin presión, sin apuros</p>
                </div>
              </div>

              {/* ── PLAY BUTTON ── */}
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center transition-all duration-200"
                style={{
                  height: '68px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #F43F9E, #E11D6D)',
                  color: '#FFFFFF',
                  fontSize: '19px',
                  fontWeight: 800,
                  gap: '10px',
                  boxShadow: '0 10px 32px rgba(244,63,158,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '24px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(244,63,158,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(244,63,158,0.3)'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Jugar <ChevronRight size={22} strokeWidth={2.5} />
              </button>

              {/* ── WELLNESS MESSAGE ── */}
              <div
                style={{
                  borderRadius: '20px',
                  padding: '20px 24px',
                  background: dm ? 'rgba(244,63,158,0.04)' : '#FFF8FA',
                  border: '1px solid rgba(244,63,158,0.12)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(244,63,158,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Shield size={18} style={{ color: '#F43F9E' }} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', marginBottom: '4px' }}>❤️ Juega con conciencia</p>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                    Recuerda: cada relación es diferente. Confía en ti, en tus límites y en lo que te hace bien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  if (gameState === 'playing') {
    const q = questions[currentIndex];

    return (
      <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pink-200/10 blur-2xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-purple-200/10 blur-2xl" />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-6 md:p-10">
          <div className="w-full max-w-[1050px]">
            <div className="rounded-[28px] p-8 md:p-12" style={{ background: d.cardBg, boxShadow: d.cardShadow, border: `1px solid ${d.cardBorder}`, minHeight: '750px' }}>

              {/* Header */}
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
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: d.scoreBg }}>
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="text-[13px] font-bold" style={{ color: d.scoreColor }}>{score}</span>
                </div>
              </div>

              {/* Traffic Light */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF1F7] to-[#F3E8FF] flex items-center justify-center">
                  <span className="text-5xl">🚦</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[38px] md:text-[44px] font-extrabold text-center tracking-tight mb-5">
                <span className="text-emerald-500">Green Flag</span>
                <span style={{ color: d.titleColor }}> o </span>
                <span className="text-rose-500">Red Flag</span>
              </h1>

              {/* Progress */}
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: '40px',
                      background: i <= currentIndex ? '#F43F9E' : (dm ? 'rgba(255,255,255,0.08)' : '#FCE7F3'),
                    }}
                  />
                ))}
              </div>

              {/* Question */}
              <h2 className="text-[30px] md:text-[34px] font-bold text-center mb-8" style={{ color: d.questionColor }}>
                ¿Esta situación es saludable?
              </h2>

              {/* Situation Card */}
              <div className="rounded-[24px] border p-8 md:p-10 mb-8" style={{ background: d.situationBg, borderColor: d.situationBorder, minHeight: '150px' }}>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center relative">
                    <span className="absolute -top-6 -left-4 text-[60px] text-[#F43F9E]/20 font-serif leading-none">"</span>
                    <p className="text-[24px] font-semibold leading-relaxed relative z-10 px-8" style={{ color: d.situationTextColor }}>
                      {q.text}
                    </p>
                    <span className="absolute -bottom-8 -right-2 text-[60px] text-[#F43F9E]/20 font-serif leading-none">"</span>
                  </div>
                </div>
              </div>

              {/* ¿Qué opinas? */}
              <p className="text-[20px] md:text-[22px] font-semibold text-center mb-6" style={{ color: d.subtitleColor }}>
                ¿Qué opinas?
              </p>

              {/* Answer Cards */}
              {!selectedAnswer ? (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <button onClick={() => handleAnswer('green')}
                    className="rounded-[24px] border-2 p-8 text-center transition-all duration-200 cursor-pointer group"
                    style={{ background: d.greenBg, borderColor: d.greenBorder, minHeight: '230px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(34,197,94,0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🟢</span>
                    </div>
                    <h3 className="text-[22px] font-extrabold text-[#16A34A] mb-2">GREEN FLAG</h3>
                    <p className="text-[17px]" style={{ color: d.subtitleColor }}>Señal saludable</p>
                  </button>

                  <button onClick={() => handleAnswer('red')}
                    className="rounded-[24px] border-2 p-8 text-center transition-all duration-200 cursor-pointer group"
                    style={{ background: d.redBg, borderColor: d.redBorder, minHeight: '230px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(244,63,94,0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#FFE4E6] flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔴</span>
                    </div>
                    <h3 className="text-[22px] font-extrabold text-[#E11D48] mb-2">RED FLAG</h3>
                    <p className="text-[17px]" style={{ color: d.subtitleColor }}>Señal de alerta</p>
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="rounded-[24px] border-2 p-8 text-center transition-all duration-200"
                      style={{
                        background: selectedAnswer === 'green' ? d.greenBg : d.mutedBg,
                        borderColor: selectedAnswer === 'green' ? '#16A34A' : d.mutedBorder,
                        borderWidth: selectedAnswer === 'green' ? '3px' : '2px',
                        minHeight: '230px',
                        opacity: selectedAnswer !== 'green' && q.answer !== 'green' ? 0.5 : 1,
                      }}>
                      <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🟢</span>
                      </div>
                      <h3 className="text-[22px] font-extrabold text-[#16A34A] mb-2">GREEN FLAG</h3>
                      <p className="text-[17px]" style={{ color: d.subtitleColor }}>Señal saludable</p>
                    </div>

                    <div className="rounded-[24px] border-2 p-8 text-center transition-all duration-200"
                      style={{
                        background: selectedAnswer === 'red' ? d.redBg : d.mutedBg,
                        borderColor: selectedAnswer === 'red' ? '#E11D48' : d.mutedBorder,
                        borderWidth: selectedAnswer === 'red' ? '3px' : '2px',
                        minHeight: '230px',
                        opacity: selectedAnswer !== 'red' && q.answer !== 'red' ? 0.5 : 1,
                      }}>
                      <div className="w-16 h-16 rounded-full bg-[#FFE4E6] flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🔴</span>
                      </div>
                      <h3 className="text-[22px] font-extrabold text-[#E11D48] mb-2">RED FLAG</h3>
                      <p className="text-[17px]" style={{ color: d.subtitleColor }}>Señal de alerta</p>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className={`rounded-[20px] p-6 mb-6 border ${
                    q.answer === selectedAnswer
                      ? dm ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                      : dm ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[24px]">{q.answer === selectedAnswer ? '🎉' : '⚠️'}</span>
                      <span className={`text-[18px] font-bold ${q.answer === selectedAnswer ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {q.answer === selectedAnswer ? '¡Muy bien!' : 'Observa esta señal con más atención.'}
                      </span>
                    </div>
                    <p className={`text-[15px] leading-relaxed ${q.answer === selectedAnswer ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {q.explanation}
                    </p>
                  </div>

                  {/* Aprende */}
                  <div className="rounded-[24px] border p-7 flex items-center gap-6 mb-6" style={{ background: d.learnBg, borderColor: d.learnBorder }}>
                    <div className="w-14 h-14 rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                      <Lightbulb size={24} className="text-[#7C3AED]" />
                    </div>
                    <div>
                      <h3 className="text-[22px] font-bold text-[#7C3AED] mb-1">Aprende</h3>
                      <p className="text-[16px] leading-relaxed" style={{ color: d.subtitleColor }}>
                        Reconoce las señales de una relación saludable.
                      </p>
                    </div>
                  </div>

                  <button onClick={nextQuestion}
                    className="w-full h-16 rounded-[16px] bg-gradient-to-r from-[#F43F9E] to-[#E83D8A] text-white text-[16px] font-bold hover:from-[#E83D8A] hover:to-[#D42F7A] transition-all duration-200 shadow-[0_4px_20px_rgba(244,63,158,0.3)] hover:shadow-[0_6px_28px_rgba(244,63,158,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]">
                    {currentIndex + 1 >= totalQuestions ? 'Ver resultados' : 'Siguiente'} <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Summary
  const isPerfect = score === totalQuestions;
  return (
    <div className={`min-h-full relative overflow-hidden ${dm ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pink-200/10 blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-purple-200/10 blur-2xl" />

      {showTrophy && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[120px] mb-4">🏆</motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-[28px] font-black text-amber-400 drop-shadow-lg">{isPerfect ? '¡PERFECTO!' : '¡Excelente!'}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-[18px] font-bold text-white drop-shadow-lg mt-2">{score}/{totalQuestions} Correctas</motion.p>
          </div>
        </motion.div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-6 md:p-10">
        <div className="w-full max-w-[1050px]">
          {/* ── BACK BUTTON ── */}
          <button
            onClick={onBack}
            className="flex items-center transition-all duration-200 mb-6"
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

          <div className="rounded-[28px] p-8 md:p-12 text-center" style={{ background: d.cardBg, boxShadow: d.cardShadow, border: `1px solid ${d.cardBorder}` }}>
            <div className="text-[64px] mb-4">{getEmoji()}</div>
            <h2 className="text-[28px] font-extrabold mb-3 tracking-tight" style={{ color: d.titleColor }}>¡Juego terminado!</h2>

            <div className="rounded-[20px] p-6 mb-8" style={{ background: d.statsBg, border: `1px solid ${d.statsBorder}` }}>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-[36px] font-extrabold text-[#F43F9E]">{score}/{totalQuestions}</p>
                  <p className="text-[12px] font-semibold" style={{ color: d.subtitleColor }}>Correctas</p>
                </div>
                <div>
                  <p className="text-[36px] font-extrabold text-orange-500">🔥 {bestStreak}</p>
                  <p className="text-[12px] font-semibold" style={{ color: d.subtitleColor }}>Mejor racha</p>
                </div>
                <div>
                  <p className="text-[36px] font-extrabold text-emerald-500">{Math.round((score / totalQuestions) * 100)}%</p>
                  <p className="text-[12px] font-semibold" style={{ color: d.subtitleColor }}>Precisión</p>
                </div>
              </div>
            </div>

            <p className="text-[14px] mb-8" style={{ color: d.subtitleColor }}>{getMessage()}</p>

            <div className="text-left mb-8 space-y-2">
              {answers.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-[14px] text-[13px] ${a.correct ? (dm ? 'bg-emerald-500/10' : 'bg-emerald-50') : (dm ? 'bg-rose-500/10' : 'bg-rose-50')}`}>
                  <span className="text-[16px]">{a.correct ? '✅' : '❌'}</span>
                  <span className="font-medium" style={{ color: d.titleColor }}>{a.text.slice(0, 50)}...</span>
                  <span className="ml-auto">{a.answer === 'green' ? '🟢' : '🔴'}</span>
                </div>
              ))}
            </div>

            <button onClick={startGame}
              className="w-full h-16 rounded-[16px] bg-gradient-to-r from-[#F43F9E] to-[#E83D8A] text-white text-[16px] font-bold hover:from-[#E83D8A] hover:to-[#D42F7A] transition-all duration-200 shadow-[0_4px_20px_rgba(244,63,158,0.3)] hover:shadow-[0_6px_28px_rgba(244,63,158,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]">
              <RotateCcw size={18} /> Jugar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
