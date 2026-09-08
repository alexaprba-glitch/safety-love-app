import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronRight, ChevronLeft, Trophy, Star, ArrowLeft, Check, X, Lightbulb, FileText, Shield } from 'lucide-react';

function saveGameStats(gameId, won) {
  const stats = JSON.parse(localStorage.getItem('safetyLove_gameStats') || '{"played":0,"won":0,"stars":0}');
  stats.played = (stats.played || 0) + 1;
  if (won) stats.won = (stats.won || 0) + 1;
  stats.stars = (stats.stars || 0) + (won ? 3 : 1);
  localStorage.setItem('safetyLove_gameStats', JSON.stringify(stats));
}

const QUESTIONS = [
  { q: '¿Cuál es una señal de que alguien está manipulando emocionalmente?', options: ['Te hace sentir culpable constantemente', 'Te escucha cuando hablas', 'Te da espacio cuando lo necesitas', 'Celebra tus logros'], answer: 0, explanation: 'Hacerte sentir culpable sin razón es una táctica de manipulación emocional.' },
  { q: '¿Qué emoción se siente cuando algo nos da miedo pero también nos emociona?', options: ['Ansiedad', 'Euforia', 'Nostalgia', 'Empatía'], answer: 1, explanation: 'La euforia combina emoción y nerviosismo ante algo esperado.' },
  { q: '¿Cuál de estas es una forma saludable de manejar el estrés?', options: ['Ignorar el problema', 'Hablar con alguien de confianza', 'Culparse a uno mismo', 'Aislarse de los demás'], answer: 1, explanation: 'Hablar con alguien de confianza ayuda a procesar emociones de forma saludable.' },
  { q: '¿Qué es la empatía?', options: ['Sentir lástima por alguien', 'Ponerse en el lugar del otro', 'Ignorar los sentimientos ajenos', 'Sentir miedo'], answer: 1, explanation: 'La empatía es la capacidad de comprender y sentir lo que otra persona experimenta.' },
  { q: '¿Cuál es un signo de autoestima saludable?', options: ['Compararse constantemente con otros', 'Aceptarse con defectos y virtudes', 'Necesitar aprobación constante', 'Evitar los desafíos'], answer: 1, explanation: 'Acceptarse tal como uno es, reconociendo áreas de mejora, es señal de autoestima saludable.' },
  { q: '¿Qué hacer cuando un amigo está triste?', options: ['Decirle que se anime', 'Escucharlo sin juzgar', 'Cambiar de tema', 'Ignorarlo hasta que se le pase'], answer: 1, explanation: 'Escuchar sin juzgar es una de las mejores formas de apoyar a alguien.' },
  { q: '¿Cuál es una señal de relación tóxica?', options: ['Respetar los límites', 'Controlar con quién hablas', 'Apoyar los sueños del otro', 'Comunicarse abiertamente'], answer: 1, explanation: 'Controlar las relaciones sociales es una señal de manipulación y control.' },
  { q: '¿Qué es la regulación emocional?', options: ['No sentir emociones', 'Controlar cómo expresamos lo que sentimos', 'Reprimir todo', 'Vivir en ira constante'], answer: 1, explanation: 'La regulación emocional es gestionar y expresar nuestras emociones de forma saludable.' },
  { q: '¿Cuál es un efecto positivo de practicar gratitud?', options: ['Aumenta la ansiedad', 'Mejora el estado de ánimo', 'Reduce la memoria', 'Aumenta el estrés'], answer: 1, explanation: 'La gratitud está asociada con mayor bienestar y satisfacción con la vida.' },
  { q: '¿Qué es el autocuidado?', options: ['Ser egoísta', 'Atender nuestras necesidades físicas y emocionales', 'Ignorar a los demás', 'No trabajar nunca'], answer: 1, explanation: 'El autocuidado es vital para mantener un equilibrio emocional saludable.' },
  { q: '¿Cuál es una forma de manejar la ansiedad?', options: ['Evitar todo lo que da miedo', 'Respiración profunda y mindfulnes', 'Dormir todo el día', 'Comer en exceso'], answer: 1, explanation: 'La respiración profunda y la atención plena son técnicas efectivas contra la ansiedad.' },
  { q: '¿Qué es la resiliencia emocional?', options: ['No sentir dolor', 'Recuperarse de dificultades', 'Ignorar problemas', 'Ser invulnerable'], answer: 1, explanation: 'La resiliencia es la capacidad de adaptarse y recuperarse ante la adversidad.' },
  { q: '¿Cuál es una señal de confianza en una relación?', options: ['Revisar el teléfono del otro', 'Sentirte seguro de ser tú mismo', 'Controlar las salidas', 'Exigir explicaciones constantes'], answer: 1, explanation: 'La confianza permite ser vulnerable y auténtico sin miedo al juicio.' },
  { q: '¿Qué es la asertividad?', options: ['Ser agresivo', 'Expresar necesidades respetando a otros', 'No decir nada', 'Gritar para ser escuchado'], answer: 1, explanation: 'La asertividad es comunicar pensamientos y sentimientos de forma clara y respetuosa.' },
  { q: '¿Cuál es un beneficio del ejercicio para la salud mental?', options: ['Aumenta el estrés', 'Libera endorfinas', 'Reduce la memoria', 'Causa insomnio'], answer: 1, explanation: 'El ejercicio libera endorfinas que mejoran el estado de ánimo naturalmente.' },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizEmocional({ darkMode = false, onBack }) {
  const dm = darkMode;
  const [gameState, setGameState] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
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
    const shuffled = shuffleArray(QUESTIONS).slice(0, totalQuestions);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setGameState('playing');
  }, []);

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const correct = questions[currentIndex].answer === idx;
    if (correct) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { ...questions[currentIndex], userAnswer: idx, correct }]);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      const won = score >= 8;
      saveGameStats('quiz-emocional', won);
      setGameState('summary');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentIndex - 1]?.userAnswer ?? null);
      setShowExplanation(answers[currentIndex - 1] !== undefined);
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
    if (pct >= 90) return '¡Increíble! Tienes un gran conocimiento sobre emociones y bienestar.';
    if (pct >= 70) return '¡Muy bien! Entiendes bastante sobre inteligencia emocional.';
    if (pct >= 50) return 'Buen intento. Sigue aprendiendo sobre emociones y salud mental.';
    return 'Es un buen comienzo. Cada pregunta te ayuda a entender mejor tus emociones.';
  };

  if (gameState === 'menu') {
    return (
      <div style={{ minHeight: '100%', background: dm ? '#060B18' : '#F5F0E8', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes quizFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes quizPulse { 0%,100%{box-shadow:0 0 0 0 rgba(244,63,158,0.15)} 50%{box-shadow:0 0 0 20px rgba(244,63,158,0)} }
          .quiz-float { animation: quizFloat 4s ease-in-out infinite; }
          .quiz-pulse { animation: quizPulse 3s ease-in-out infinite; }
          @media (max-width: 768px) {
            .quiz-hero { flex-direction: column !important; text-align: center !important; gap: 32px !important; }
            .quiz-hero-text { max-width: 100% !important; }
            .quiz-info-grid { grid-template-columns: 1fr !important; }
            .quiz-info-divider { display: none !important; }
          }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 24px 60px' }}>
          <div style={{ width: '100%', maxWidth: '880px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', height: '42px', padding: '0 20px',
                  borderRadius: '999px', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  color: dm ? '#94A3B8' : '#64748B', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'; e.currentTarget.style.color = dm ? '#94A3B8' : '#64748B'; }}
              >
                <ArrowLeft size={16} strokeWidth={2.2} /> Volver
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', background: dm ? 'rgba(251,191,36,0.1)' : '#FFFBEB', border: `1px solid ${dm ? 'rgba(251,191,36,0.2)' : '#FDE68A'}` }}>
                <Star size={15} style={{ color: '#F59E0B' }} fill="currentColor" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: dm ? '#FBBF24' : '#D97706' }}>0</span>
              </div>
            </div>

            <div style={{
              background: dm ? '#111A2E' : '#FFFFFF', borderRadius: '24px', padding: '48px 52px',
              border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, boxShadow: dm ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <div className="quiz-hero" style={{ display: 'flex', alignItems: 'center', gap: '48px', marginBottom: '36px' }}>
                <div className="quiz-hero-text" style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#F43F9E', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Pon a prueba tu inteligencia emocional
                  </p>
                  <h1 style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '14px', color: dm ? '#F8FAFC' : '#0F172A' }}>
                    Quiz <span style={{ color: '#F43F9E' }}>Emocional</span>
                  </h1>
                  <p style={{ fontSize: '16px', color: dm ? '#94A3B8' : '#64748B', lineHeight: 1.7, maxWidth: '460px' }}>
                    Responde con honestidad y descubre qué tan bien comprendes tus emociones y relaciones.
                  </p>
                </div>

                <div className="quiz-float" style={{ flexShrink: 0, width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.08) 0%, transparent 70%)' }} />
                  <div style={{
                    width: '140px', height: '140px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: dm ? 'linear-gradient(135deg, rgba(244,63,158,0.12), rgba(244,63,158,0.06))' : 'linear-gradient(135deg, #FFF1F2, #FCE7F3)', border: `1px solid ${dm ? 'rgba(244,63,158,0.15)' : '#FBCFE8'}`,
                  }}>
                    <span style={{ fontSize: '64px', lineHeight: 1 }}>🧠</span>
                  </div>
                </div>
              </div>

              <div
                className="quiz-info-grid"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0',
                  borderRadius: '18px', padding: '28px 32px', marginBottom: '32px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, alignItems: 'center',
                }}
              >
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <FileText size={20} style={{ color: dm ? '#94A3B8' : '#64748B' }} />
                  </div>
                  <p style={{ fontSize: '36px', fontWeight: 800, color: dm ? '#F8FAFC' : '#0F172A', lineHeight: 1, marginBottom: '4px' }}>{totalQuestions}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: dm ? '#CBD5E1' : '#475569', marginBottom: '2px' }}>Preguntas</p>
                  <p style={{ fontSize: '12px', color: dm ? '#64748B' : '#94A3B8' }}>Desafía tu intuición</p>
                </div>

                <div className="quiz-info-divider" style={{ width: '1px', height: '72px', background: dm ? 'rgba(255,255,255,0.06)' : '#E2E8F0', margin: '0 8px' }} />

                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dm ? '#94A3B8' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: dm ? '#F8FAFC' : '#0F172A', lineHeight: 1.2, marginBottom: '4px' }}>Sin tiempo límite</p>
                  <p style={{ fontSize: '13px', color: dm ? '#CBD5E1' : '#475569', marginBottom: '2px' }}>Juega a tu ritmo</p>
                  <p style={{ fontSize: '12px', color: dm ? '#64748B' : '#94A3B8' }}>Sin presión, sin apuros</p>
                </div>
              </div>

              <button
                onClick={startGame}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #F43F9E, #E11D6D)',
                  color: '#FFFFFF', fontSize: '17px', fontWeight: 800, border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244,63,158,0.3)', marginBottom: '24px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,63,158,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,63,158,0.3)'; }}
              >
                Jugar <ChevronRight size={22} strokeWidth={2.5} />
              </button>

              <div style={{
                borderRadius: '16px', padding: '18px 22px', background: dm ? 'rgba(244,63,158,0.06)' : '#FFF1F2', border: `1px solid ${dm ? 'rgba(244,63,158,0.12)' : '#FECDD3'}`,
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: dm ? 'rgba(244,63,158,0.1)' : '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Shield size={18} style={{ color: '#F43F9E' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: dm ? '#F8FAFC' : '#0F172A', marginBottom: '4px' }}>Juega con conciencia</p>
                  <p style={{ fontSize: '13px', color: dm ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                    Recuerda: cada emoción cuenta. Confía en ti, en tus límites y en lo que te hace bien.
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
    const q = questions[currentIndex];
    const progress = ((currentIndex) / totalQuestions) * 100;
    const isCorrect = selectedAnswer !== null && q.answer === selectedAnswer;

    return (
      <div style={{ minHeight: '100%', background: dm ? '#060B18' : '#F5F0E8', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '80px', left: '40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.06), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '60px', right: '40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 24px 60px' }}>
          <div style={{ width: '100%', maxWidth: '780px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', height: '42px', padding: '0 20px',
                  borderRadius: '999px', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  color: dm ? '#94A3B8' : '#64748B', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'; e.currentTarget.style.color = dm ? '#94A3B8' : '#64748B'; }}
              >
                <ArrowLeft size={16} strokeWidth={2.2} /> Volver
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', background: dm ? 'rgba(251,191,36,0.1)' : '#FFFBEB', border: `1px solid ${dm ? 'rgba(251,191,36,0.2)' : '#FDE68A'}` }}>
                <Star size={14} style={{ color: '#F59E0B' }} fill="currentColor" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: dm ? '#FBBF24' : '#D97706' }}>{score}</span>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#64748B' : '#94A3B8' }}>
                  Pregunta {currentIndex + 1} de {totalQuestions}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: dm ? '#64748B' : '#94A3B8' }}>
                  ⭐ {score} correctas
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #F43F9E, #E83D8A)' }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: dm ? '#111A2E' : '#FFFFFF', borderRadius: '20px', padding: '32px 36px', marginBottom: '24px',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, boxShadow: dm ? '0 2px 12px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', background: dm ? 'rgba(244,63,158,0.1)' : '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800, color: '#F43F9E',
                  }}>
                    {currentIndex + 1}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: dm ? '#64748B' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Pregunta</span>
                </div>
                <p style={{ fontSize: '19px', fontWeight: 700, lineHeight: 1.6, color: dm ? '#F8FAFC' : '#0F172A', margin: 0 }}>
                  {q.q}
                </p>
              </motion.div>
            </AnimatePresence>

            {selectedAnswer === null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {q.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px', width: '100%',
                      padding: '20px 24px', borderRadius: '16px', background: dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                      border: `1.5px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.background = dm ? 'rgba(244,63,158,0.06)' : '#FFF1F2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'; e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF'; }}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${dm ? '#475569' : '#CBD5E1'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      transition: 'all 0.15s',
                    }} />
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: dm ? '#E2E8F0' : '#1E293B', lineHeight: 1.5 }}>{opt}</span>
                    <ChevronRight size={16} style={{ color: dm ? '#475569' : '#CBD5E1', flexShrink: 0 }} />
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {q.options.map((opt, idx) => {
                    const isSelected = idx === selectedAnswer;
                    const isAnswer = idx === q.answer;

                    let bg = '#FFFFFF';
                    let border = '#E2E8F0';
                    let circleBg = 'transparent';
                    let circleBorder = '#CBD5E1';
                    let icon = null;

                    if (isSelected && isAnswer) {
                      bg = '#F0FDF4'; border = '#86EFAC'; circleBg = '#22C55E'; circleBorder = '#22C55E';
                      icon = <Check size={12} style={{ color: '#FFFFFF' }} />;
                    } else if (isSelected && !isAnswer) {
                      bg = '#FEF2F2'; border = '#FCA5A5'; circleBg = '#EF4444'; circleBorder = '#EF4444';
                      icon = <X size={12} style={{ color: '#FFFFFF' }} />;
                    } else if (isAnswer) {
                      bg = '#F0FDF4'; border = '#86EFAC'; circleBg = '#22C55E'; circleBorder = '#22C55E';
                      icon = <Check size={12} style={{ color: '#FFFFFF' }} />;
                    }

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px',
                          borderRadius: '16px', background: bg, border: `1.5px solid ${border}`,
                          opacity: isSelected || isAnswer ? 1 : 0.5, transition: 'all 0.2s',
                        }}
                      >
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%', background: circleBg,
                          border: `2px solid ${circleBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {icon}
                        </div>
                        <span style={{ flex: 1, fontSize: '15px', fontWeight: 500, color: dm ? '#E2E8F0' : '#1E293B', lineHeight: 1.5 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  style={{
                    borderRadius: '16px', padding: '20px 24px', marginBottom: '28px', background: dm ? 'rgba(139,92,246,0.06)' : '#F5F3FF',
                    border: `1px solid ${dm ? 'rgba(139,92,246,0.15)' : '#E9D5FF'}`, display: 'flex', alignItems: 'flex-start', gap: '14px',
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: dm ? 'rgba(139,92,246,0.1)' : '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Lightbulb size={18} style={{ color: '#7C3AED' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', marginBottom: '4px' }}>Consejo emocional</p>
                    <p style={{ fontSize: '13px', color: dm ? '#94A3B8' : '#64748B', lineHeight: 1.6, margin: 0 }}>{q.explanation}</p>
                  </div>
                </motion.div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <button
                    onClick={prevQuestion}
                    disabled={currentIndex === 0}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 24px',
                      borderRadius: '14px', fontSize: '14px', fontWeight: 600, border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
                      background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF', color: dm ? '#94A3B8' : '#64748B', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentIndex === 0 ? 0.4 : 1, transition: 'all 0.2s',
                    }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>

                  <button
                    onClick={nextQuestion}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 28px',
                      borderRadius: '14px', background: 'linear-gradient(135deg, #F43F9E, #E83D8A)',
                      color: '#FFFFFF', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(244,63,158,0.25)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,158,0.35)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,63,158,0.25)'; }}
                  >
                    {currentIndex + 1 >= totalQuestions ? 'Ver resultados' : 'Siguiente'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isPerfect = score === totalQuestions;
  const showTrophyAnim = score >= 8;
  return (
    <div style={{ minHeight: '100%', background: dm ? '#060B18' : '#F5F0E8', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '80px', left: '40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.06), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '60px', right: '40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05), transparent 70%)', pointerEvents: 'none' }} />

      {showTrophy && showTrophyAnim && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          }}>
          <div style={{ textAlign: 'center' }}>
            <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: '120px', marginBottom: '16px' }}>🏆</motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{isPerfect ? '¡PERFECTO!' : '¡Excelente!'}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginTop: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{score}/{totalQuestions} Correctas</motion.p>
          </div>
        </motion.div>
      )}

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: '780px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', height: '42px', padding: '0 20px',
              borderRadius: '999px', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, background: dm ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              color: dm ? '#94A3B8' : '#64748B', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              marginBottom: '28px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F43F9E'; e.currentTarget.style.color = '#F43F9E'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'; e.currentTarget.style.color = dm ? '#94A3B8' : '#64748B'; }}
          >
            <ArrowLeft size={16} strokeWidth={2.2} /> Volver
          </button>

          <div style={{
            background: dm ? '#111A2E' : '#FFFFFF', borderRadius: '24px', padding: '48px 52px', textAlign: 'center',
            border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, boxShadow: dm ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{getEmoji()}</div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: dm ? '#F8FAFC' : '#0F172A', marginBottom: '12px', letterSpacing: '-0.02em' }}>¡Juego terminado!</h2>

            <div style={{ borderRadius: '18px', padding: '28px', marginBottom: '32px', background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: '36px', fontWeight: 900, color: '#F43F9E', margin: 0 }}>{score}/{totalQuestions}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: dm ? '#64748B' : '#94A3B8', marginTop: '4px' }}>Correctas</p>
                </div>
                <div>
                  <p style={{ fontSize: '36px', fontWeight: 900, color: '#22C55E', margin: 0 }}>{Math.round((score / totalQuestions) * 100)}%</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: dm ? '#64748B' : '#94A3B8', marginTop: '4px' }}>Precisión</p>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: dm ? '#94A3B8' : '#64748B', marginBottom: '32px', lineHeight: 1.6 }}>{getMessage()}</p>

            <div style={{ textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {answers.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                  borderRadius: '14px', fontSize: '13px', background: a.correct ? (dm ? 'rgba(34,197,94,0.08)' : '#F0FDF4') : (dm ? 'rgba(239,68,68,0.08)' : '#FEF2F2'),
                }}>
                  <span style={{ fontSize: '16px' }}>{a.correct ? '✅' : '❌'}</span>
                  <span style={{ fontWeight: 500, color: dm ? '#E2E8F0' : '#1E293B' }}>{a.q.slice(0, 50)}...</span>
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              style={{
                width: '100%', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #F43F9E, #E83D8A)', color: '#FFFFFF',
                fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(244,63,158,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(244,63,158,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,63,158,0.3)'; }}
            >
              <RotateCcw size={18} /> Jugar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
