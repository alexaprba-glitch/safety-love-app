import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';

const FONT = "'Poppins', 'Inter', sans-serif";

function FloatingHeart({ size = 20, x = 0, y = 0, delay = 0, color = '#EC4899' }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0.5],
        y: [0, -40],
      }}
      transition={{ duration: 1.4, delay, ease: 'easeOut' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.div>
  );
}

export default function LogoutScreen({ onComplete }) {
  const [phase, setPhase] = useState('idle');
  const [signingOut, setSigningOut] = useState(false);

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    setPhase('show');

    const fadeTimer = setTimeout(() => setPhase('fade'), 4000);
    const doneTimer = setTimeout(() => handleComplete(), 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [handleComplete]);

  useEffect(() => {
    if (!signingOut) {
      setSigningOut(true);
      supabase.auth.signOut().catch(() => {});
    }
  }, [signingOut]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        fontFamily: FONT,
        background: 'linear-gradient(160deg, #FFF9FB 0%, #FFFFFF 50%, #FFF5F7 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          bottom: '10%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(251,113,133,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Floating hearts */}
      <FloatingHeart size={16} x={-80} y={-60} delay={0.1} color="#F9A8D4" />
      <FloatingHeart size={12} x={70} y={-50} delay={0.2} color="#EC4899" />
      <FloatingHeart size={14} x={-50} y={50} delay={0.3} color="#FBCFE8" />
      <FloatingHeart size={10} x={80} y={40} delay={0.15} color="#F472B6" />

      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: phase === 'fade' ? 0 : 1,
              scale: phase === 'fade' ? 1.05 : 1,
              y: phase === 'fade' ? -20 : 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Heart icon */}
            <motion.div
              className="mb-6 flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #FDF2F8, #FCE7F3)',
                boxShadow: '0 8px 32px rgba(236,72,153,0.15), inset 0 2px 4px rgba(255,255,255,0.8)',
              }}
              animate={{
                boxShadow: [
                  '0 8px 32px rgba(236,72,153,0.15)',
                  '0 12px 40px rgba(236,72,153,0.3)',
                  '0 8px 32px rgba(236,72,153,0.15)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  fill="url(#heartGrad)"
                />
                <defs>
                  <linearGradient id="heartGrad" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Main text */}
            <motion.h2
              className="text-xl sm:text-2xl font-extrabold m-0 mb-2 text-center"
              style={{ color: '#1E293B', letterSpacing: '-0.01em', fontFamily: FONT }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              Hasta pronto
            </motion.h2>

            {/* Sub text */}
            <motion.p
              className="text-sm font-medium m-0 text-center"
              style={{ color: '#94A3B8', fontFamily: FONT }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Cerrando sesion de forma segura...
            </motion.p>

            {/* Loading dots */}
            <div className="flex gap-1.5 mt-5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ width: 6, height: 6, background: '#F9A8D4' }}
                  animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
