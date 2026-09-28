import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FONT = "'Poppins', 'Inter', sans-serif";

const PHASE_TIMINGS = {
  phase1: 1800,
  phase2: 1200,
  phase3: 1400,
  phase4: 600,
};

function KawaiiFrog({ size = 140 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="100" cy="120" rx="56" ry="50" fill="#A8E6A1" />
      <ellipse cx="100" cy="120" rx="56" ry="50" fill="url(#frogGrad)" />
      {/* Belly */}
      <ellipse cx="100" cy="130" rx="36" ry="30" fill="#D4F5D0" opacity="0.7" />
      {/* Left eye bump */}
      <circle cx="74" cy="82" r="22" fill="#A8E6A1" />
      <circle cx="74" cy="82" r="22" fill="url(#frogGrad2)" />
      {/* Right eye bump */}
      <circle cx="126" cy="82" r="22" fill="#A8E6A1" />
      <circle cx="126" cy="82" r="22" fill="url(#frogGrad2)" />
      {/* Left eye white */}
      <ellipse cx="74" cy="82" rx="14" ry="15" fill="#FFFFFF" />
      {/* Right eye white */}
      <ellipse cx="126" cy="82" rx="14" ry="15" fill="#FFFFFF" />
      {/* Left pupil */}
      <ellipse cx="76" cy="84" rx="7" ry="8" fill="#1A1A2E" />
      <circle cx="79" cy="80" r="3" fill="#FFFFFF" />
      <circle cx="73" cy="87" r="1.5" fill="#FFFFFF" opacity="0.5" />
      {/* Right pupil */}
      <ellipse cx="128" cy="84" rx="7" ry="8" fill="#1A1A2E" />
      <circle cx="131" cy="80" r="3" fill="#FFFFFF" />
      <circle cx="125" cy="87" r="1.5" fill="#FFFFFF" opacity="0.5" />
      {/* Blush left */}
      <ellipse cx="58" cy="98" rx="10" ry="6" fill="#F9A8D4" opacity="0.45" />
      {/* Blush right */}
      <ellipse cx="142" cy="98" rx="10" ry="6" fill="#F9A8D4" opacity="0.45" />
      {/* Smile */}
      <path d="M88 104 Q100 116 112 104" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Nostrils */}
      <circle cx="94" cy="100" r="1.5" fill="#6BAF64" opacity="0.6" />
      <circle cx="106" cy="100" r="1.5" fill="#6BAF64" opacity="0.6" />
      {/* Left foot */}
      <ellipse cx="72" cy="166" rx="18" ry="8" fill="#8FD888" />
      <circle cx="58" cy="163" r="5" fill="#8FD888" />
      <circle cx="66" cy="159" r="5" fill="#8FD888" />
      {/* Right foot */}
      <ellipse cx="128" cy="166" rx="18" ry="8" fill="#8FD888" />
      <circle cx="142" cy="163" r="5" fill="#8FD888" />
      <circle cx="134" cy="159" r="5" fill="#8FD888" />
      {/* Left arm */}
      <path d="M52 130 Q36 140 44 152" stroke="#8FD888" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M148 130 Q164 140 156 152" stroke="#8FD888" strokeWidth="6" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="frogGrad" x1="60" y1="70" x2="140" y2="170">
          <stop offset="0%" stopColor="#B8F0B2" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#78CC70" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="frogGrad2" x1="55" y1="60" x2="95" y2="105">
          <stop offset="0%" stopColor="#C4F5BE" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8AD884" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Heart3D({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartGrad" x1="10" y1="10" x2="54" y2="54">
          <stop offset="0%" stopColor="#FBB6CE" />
          <stop offset="40%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC3B91" />
        </linearGradient>
        <linearGradient id="heartShine" x1="16" y1="12" x2="32" y2="28">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="heartShadow" x="-4" y="-2" width="72" height="72">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#EC3B91" floodOpacity="0.35" />
        </filter>
      </defs>
      <path
        d="M32 56 C14 40 4 30 4 20 C4 12 10 6 18 6 C23 6 28 9 32 14 C36 9 41 6 46 6 C54 6 60 12 60 20 C60 30 50 40 32 56Z"
        fill="url(#heartGrad)"
        filter="url(#heartShadow)"
      />
      {/* Glazed highlight */}
      <path
        d="M32 52 C16 38 8 29 8 21 C8 14 13 9 19 9 C23 9 27 11 30 15 L32 18 L34 15 C37 11 41 9 45 9 C51 9 56 14 56 21 C56 29 48 38 32 52Z"
        fill="url(#heartGrad)"
      />
      <ellipse cx="22" cy="18" rx="10" ry="8" fill="url(#heartShine)" transform="rotate(-20 22 18)" />
      <ellipse cx="20" cy="16" rx="5" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-25 20 16)" />
    </svg>
  );
}

function FloatingDots() {
  return (
    <div className="flex gap-2 mt-5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full bg-pink-400"
          style={{ width: 7, height: 7 }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ProgressSegmentBar({ progress }) {
  const segments = 20;
  return (
    <div className="flex gap-[3px] mt-6">
      {Array.from({ length: segments }).map((_, i) => {
        const filled = (i / segments) * 100 < progress;
        return (
          <motion.div
            key={i}
            className="h-[5px] rounded-full flex-1"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: 1,
              scaleX: 1,
              backgroundColor: filled
                ? i < segments * 0.5
                  ? `rgb(${236 + (i / segments) * 20}, ${59 + (i / segments) * 100}, ${145 - (i / segments) * 50})`
                  : `rgb(${100 + (i / segments) * 34}, ${200 - (i / segments) * 30}, ${172 + (i / segments) * 30})`
                : '#F1F5F9',
            }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          />
        );
      })}
    </div>
  );
}

function SparkleParticles({ visible }) {
  const particles = [
    { x: -80, y: -90, size: 6, delay: 0, color: '#F9A8D4' },
    { x: 70, y: -80, size: 5, delay: 0.15, color: '#EC3B91' },
    { x: -60, y: 60, size: 4, delay: 0.3, color: '#86EFAC' },
    { x: 80, y: 50, size: 5, delay: 0.1, color: '#FBCFE8' },
    { x: 0, y: -100, size: 4, delay: 0.2, color: '#BBF7D0' },
    { x: -90, y: -10, size: 3, delay: 0.25, color: '#F9A8D4' },
    { x: 90, y: -20, size: 4, delay: 0.35, color: '#FCA5A5' },
  ];

  return (
    <AnimatePresence>
      {visible && particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: '50%',
            top: '40%',
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0, 1.2, 0.3],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  );
}

export default function SplashScreen({ onComplete, duration = 5000 }) {
  const [phase, setPhase] = useState(1);
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timers = [];
    let elapsed = 0;

    timers.push(setTimeout(() => setPhase(2), PHASE_TIMINGS.phase1));
    timers.push(setTimeout(() => setPhase(3), PHASE_TIMINGS.phase1 + PHASE_TIMINGS.phase2));
    timers.push(setTimeout(() => setPhase(4), PHASE_TIMINGS.phase1 + PHASE_TIMINGS.phase2 + PHASE_TIMINGS.phase3));
    timers.push(setTimeout(() => handleComplete(), duration));

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / (duration - 600)) * 100, 100);
      setProgress(pct);
    }, 50);

    timers.push(progressInterval);

    return () => {
      timers.forEach((t) => clearInterval(t));
      timers.forEach((t) => clearTimeout(t));
    };
  }, [duration, handleComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ fontFamily: FONT }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ─── Animated Background ─── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            phase >= 2
              ? 'linear-gradient(160deg, #F0FDF4 0%, #FFF1F2 40%, #FFFBFD 70%, #FFFFFF 100%)'
              : 'linear-gradient(160deg, #FFF9FB 0%, #FFFFFF 50%, #FFFBFD 100%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />

      {/* ─── Ambient Blobs ─── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          top: '12%',
          left: '8%',
          background: 'radial-gradient(circle, rgba(236,59,145,0.07) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          bottom: '10%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(134,239,172,0.07) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.25, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          top: '55%',
          right: '12%',
          background: 'radial-gradient(circle, rgba(251,207,232,0.1) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ─── Floating Bokeh Hearts ─── */}
      {[
        { top: '8%', left: '6%', size: 24, delay: 0, dur: 6, opacity: 0.05 },
        { top: '18%', right: '10%', size: 16, delay: 1.2, dur: 7, opacity: 0.04 },
        { bottom: '22%', left: '12%', size: 20, delay: 0.8, dur: 8, opacity: 0.035 },
        { top: '60%', right: '6%', size: 12, delay: 2, dur: 6.5, opacity: 0.04 },
        { bottom: '15%', right: '16%', size: 18, delay: 0.5, dur: 7.5, opacity: 0.035 },
      ].map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: h.top, left: h.left, right: h.right, bottom: h.bottom }}
          animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
          transition={{ duration: h.dur, repeat: Infinity, delay: h.delay, ease: 'easeInOut' }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill="#EC3B91"
              opacity={h.opacity}
            />
          </svg>
        </motion.div>
      ))}

      {/* ─── Sparkle Particles (Phase 2+) ─── */}
      <SparkleParticles visible={phase >= 2} />

      {/* ═══════════ PHASE 1: Heart Pulse + "Iniciando sesión..." ═══════════ */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{
                scale: [0.92, 1.08, 0.92],
                filter: [
                  'drop-shadow(0 4px 12px rgba(236,59,145,0.25))',
                  'drop-shadow(0 8px 24px rgba(236,59,145,0.45))',
                  'drop-shadow(0 4px 12px rgba(236,59,145,0.25))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-6"
            >
              <Heart3D size={80} />
            </motion.div>

            <motion.p
              className="text-sm font-semibold text-slate-400 m-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Iniciando sesion...
            </motion.p>

            <FloatingDots />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASES 2–4: Mascot + Welcome + Aura ═══════════ */}
      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* ─── Composition: Frog + Heart ─── */}
            <div className="relative mb-7">
              {/* Aura Ring (Phase 3) */}
              <AnimatePresence>
                {phase >= 3 && (
                  <>
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 210,
                        height: 210,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid rgba(236,59,145,0.12)',
                        background: 'radial-gradient(circle, rgba(236,59,145,0.04) 0%, transparent 70%)',
                      }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.06, 1], opacity: [0, 0.6, 0.4] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
                    />
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 250,
                        height: 250,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '1.5px solid rgba(134,239,172,0.15)',
                      }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: [1, 1.05, 1], opacity: [0, 0.5, 0.35] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, delay: 0.15, scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } }}
                    />
                    {/* Pulse rings */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: 170,
                          height: 170,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          border: '1px solid rgba(236,59,145,0.08)',
                        }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: [0.8, 1.5], opacity: [0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Small floating heart near mascot */}
              <motion.div
                className="absolute z-20"
                style={{ top: -6, right: -10 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 38,
                    height: 38,
                    background: 'linear-gradient(145deg, #FDF2F8, #FCE7F3)',
                    boxShadow: '0 4px 12px rgba(236,59,145,0.15), inset 0 1px 2px rgba(255,255,255,0.8)',
                    border: '1px solid rgba(236,59,145,0.1)',
                  }}
                  animate={{
                    scale: [1, 1.12, 1],
                    boxShadow: [
                      '0 4px 12px rgba(236,59,145,0.15)',
                      '0 6px 20px rgba(236,59,145,0.3)',
                      '0 4px 12px rgba(236,59,145,0.15)',
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart3D size={22} />
                </motion.div>
              </motion.div>

              {/* Frog Mascot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 12,
                  mass: 0.8,
                  duration: 0.8,
                }}
              >
                <KawaiiFrog size={140} />
              </motion.div>
            </div>

            {/* ─── Welcome Text ─── */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            >
              <h2
                className="text-[22px] font-extrabold text-slate-800 m-0 mb-1.5"
                style={{ letterSpacing: '-0.01em', fontFamily: FONT }}
              >
                Bienvenido a Safety Love{' '}
                <span className="text-[18px]">&#10084;&#65039;</span>
              </h2>
              <p
                className="text-[13px] font-medium text-slate-400 m-0"
                style={{ fontFamily: FONT }}
              >
                Preparando tu espacio seguro...
              </p>
            </motion.div>

            {/* ─── Progress Bar (Phase 3) ─── */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  className="w-[220px] mt-7"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProgressSegmentBar progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 4: Flash Burst + Transition ═══════════ */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, y: -60, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Flash overlay */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 320,
                height: 320,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(236,59,145,0.2) 0%, rgba(134,239,172,0.1) 40%, transparent 70%)',
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.4], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Phase Indicator Dots ─── */}
      <div className="absolute bottom-10 flex gap-2">
        {[1, 2, 3].map((p) => (
          <motion.div
            key={p}
            className="h-[6px] rounded-full"
            animate={{
              width: phase === p ? 22 : 6,
              backgroundColor: phase >= p ? '#EC3B91' : '#E2E8F0',
              opacity: phase < 4 ? 0.6 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        ))}
      </div>
    </motion.div>
  );
}
