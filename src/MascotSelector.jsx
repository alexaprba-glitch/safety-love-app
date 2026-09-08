import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Heart } from 'lucide-react';
import SafetyMascot from './SafetyMascot';
import { MASCOTS } from './mascotData';

export default function MascotSelector({ isOpen, onClose, onSelect, currentMascotId, darkMode = false }) {
  const [selectedId, setSelectedId] = useState(currentMascotId);
  const gridRef = useRef(null);

  useEffect(() => {
    setSelectedId(currentMascotId);
  }, [currentMascotId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSave = () => {
    onSelect(selectedId);
    onClose();
  };

  const dark = darkMode;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Selecciona tu mascota"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col w-full overflow-hidden"
            style={{
              background: dark ? '#111827' : '#FFFFFF',
              width: 'min(96vw, 880px)',
              maxWidth: '96vw',
              borderRadius: '24px',
              boxShadow: dark
                ? '0 32px 100px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.3)'
                : '0 32px 100px rgba(15,23,42,0.15), 0 8px 32px rgba(15,23,42,0.06)',
              border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
              height: 'min(92vh, 780px)',
              maxHeight: '92vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── HEADER ── */}
            <div
              className="shrink-0 flex items-center justify-between"
              style={{ padding: '40px 36px 24px' }}
            >
              <div className="flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="SafetyLove"
                  style={{ width: '96px', height: '96px', objectFit: 'contain' }}
                />
                <div>
                  <h2
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: dark ? '#F1F5F9' : '#1E293B',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.2,
                    }}
                  >
                    Elige tu mascota
                  </h2>
                  <p
                    style={{
                      fontSize: '14px',
                      color: dark ? '#64748B' : '#94A3B8',
                      marginTop: '4px',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Escoge el compañero que te acompañará en Safety Love.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 flex items-center justify-center transition-all duration-200"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: dark ? 'rgba(255,255,255,0.04)' : '#F8F9FB',
                  border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  color: dark ? '#64748B' : '#94A3B8',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = dark ? 'rgba(255,77,141,0.12)' : 'rgba(255,77,141,0.06)';
                  e.currentTarget.style.color = '#FF4D8D';
                  e.currentTarget.style.borderColor = 'rgba(255,77,141,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#F8F9FB';
                  e.currentTarget.style.color = dark ? '#64748B' : '#94A3B8';
                  e.currentTarget.style.borderColor = dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)';
                }}
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* ── GRID (scrollable) ── */}
            <div
              ref={gridRef}
              className="flex-1 overflow-y-auto custom-scrollbar"
              style={{ padding: '0 36px 12px' }}
            >
              <style>{`
                @media (max-width: 768px) { .mascot-grid { grid-template-columns: repeat(2, 1fr) !important; } }
                @media (max-width: 480px) { .mascot-grid { grid-template-columns: 1fr !important; } }
              `}</style>
              <div
                className="mascot-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px',
                }}
              >
                {MASCOTS.map((mascot) => {
                  const isSelected = selectedId === mascot.id;
                  return (
                    <button
                      key={mascot.id}
                      onClick={() => setSelectedId(mascot.id)}
                      className="relative flex flex-col items-center text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D8D] focus-visible:ring-offset-2"
                      style={{
                        background: isSelected
                          ? (dark ? 'rgba(255,77,141,0.06)' : '#FFF8FB')
                          : (dark ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
                        border: isSelected
                          ? '2px solid #FF4D8D'
                          : (dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'),
                        borderRadius: '20px',
                        padding: '16px 12px 18px',
                        boxShadow: isSelected
                          ? '0 8px 28px rgba(255,77,141,0.12)'
                          : (dark ? '0 2px 12px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.03)'),
                        transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = dark ? '0 8px 28px rgba(0,0,0,0.25)' : '0 8px 28px rgba(0,0,0,0.07)';
                          e.currentTarget.style.borderColor = dark ? 'rgba(255,77,141,0.3)' : '#FFD6E8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = dark ? '0 2px 12px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.03)';
                          e.currentTarget.style.borderColor = dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)';
                        }
                      }}
                      aria-label={`Seleccionar ${mascot.name}`}
                      aria-pressed={isSelected}
                    >
                      {/* Badge de selección */}
                      {isSelected && (
                        <div
                          className="absolute z-10"
                          style={{
                            top: '10px',
                            right: '10px',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                            boxShadow: '0 3px 10px rgba(34,197,94,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      )}

                      {/* Imagen de la mascota */}
                      <div
                        className="flex items-center justify-center overflow-hidden"
                        style={{
                          width: '100%',
                          height: '150px',
                          borderRadius: '16px',
                          background: dark
                            ? `color-mix(in srgb, ${mascot.colors.accent} 20%, #1E293B)`
                            : mascot.colors.accent,
                          marginBottom: '14px',
                          transition: 'transform 220ms ease',
                        }}
                      >
                        <SafetyMascot size={130} mascotId={mascot.id} />
                      </div>

                      {/* Nombre */}
                      <p
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: dark ? '#F1F5F9' : '#1E293B',
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1.2,
                          marginBottom: '4px',
                        }}
                      >
                        {mascot.name}
                      </p>

                      {/* Descripción */}
                      <p
                        style={{
                          fontSize: '12px',
                          lineHeight: 1.4,
                          color: dark ? '#64748B' : '#94A3B8',
                          fontFamily: "'Inter', sans-serif",
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: '90%',
                        }}
                      >
                        {mascot.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div
              className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                padding: '20px 36px 28px',
                borderTop: dark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <p
                className="flex items-center gap-2"
                style={{
                  fontSize: '13px',
                  color: dark ? '#64748B' : '#94A3B8',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Heart size={14} color="#FF4D8D" fill="#FF4D8D" />
                Puedes cambiar de mascota cuando quieras.
              </p>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <button
                  onClick={onClose}
                  className="font-medium transition-all duration-200"
                  style={{
                    background: 'transparent',
                    color: dark ? '#94A3B8' : '#64748B',
                    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
                    padding: '0 24px',
                    fontSize: '14px',
                    height: '46px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
                    e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)';
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="font-semibold text-white transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #FF4D8D, #E11D6D)',
                    boxShadow: '0 4px 16px rgba(255,77,141,0.3)',
                    padding: '0 28px',
                    fontSize: '14px',
                    height: '46px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,77,141,0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,77,141,0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Elegir mascota
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
