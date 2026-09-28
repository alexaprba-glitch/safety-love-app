import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Save } from 'lucide-react';
import SafetyMascot from './SafetyMascot';

const ACCENT = '#2D6A4F';

// ── Ilustraciones flat de alta calidad ──
function ArtShadow() {
  return <ellipse cx="32" cy="57" rx="15" ry="3" fill="#0F172A" opacity="0.08" />;
}

function HangerArt() {
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <ArtShadow />
      <path d="M32 10 q0 -6 6 -6" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="4" r="2" fill="#94A3B8" />
      <path d="M10 28 L32 17 L54 28" stroke="#64748B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="24" width="8" height="4" rx="2" fill="#94A3B8" />
      <path d="M32 28 v6" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BowArt() {
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <ArtShadow />
      <path d="M28 36 L18 52 L25 51 L23 57 L32 42 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M36 36 L46 52 L39 51 L41 57 L32 42 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="19" cy="29" rx="14" ry="10.5" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
      <ellipse cx="45" cy="29" rx="14" ry="10.5" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
      <ellipse cx="19" cy="30" rx="8" ry="5" fill="#DB2777" opacity="0.3" />
      <ellipse cx="45" cy="30" rx="8" ry="5" fill="#DB2777" opacity="0.3" />
      <ellipse cx="15" cy="25" rx="5" ry="3" fill="#FBCFE8" opacity="0.9" transform="rotate(-18, 15, 25)" />
      <ellipse cx="49" cy="25" rx="5" ry="3" fill="#FBCFE8" opacity="0.9" transform="rotate(18, 49, 25)" />
      <circle cx="32" cy="30" r="7.5" fill="#DB2777" />
      <circle cx="32" cy="30" r="7.5" fill="none" stroke="#9D174D" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="3.5" fill="#F9A8D4" />
      <circle cx="30.5" cy="28.5" r="1.3" fill="#FFFFFF" />
    </svg>
  );
}

function BeretArt() {
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <ArtShadow />
      <ellipse cx="32" cy="44" rx="22" ry="5" fill="#1B2233" />
      <path d="M10 42 Q8 14 32 10 Q56 14 54 42 Q32 48 10 42 Z" fill="#2F3646" />
      <path d="M18 38 Q20 20 34 16 Q26 24 26 36 Z" fill="#4B5568" opacity="0.5" />
      <line x1="32" y1="10" x2="32" y2="5" stroke="#2F3646" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="4" r="2.4" fill="#2F3646" />
      <circle cx="20" cy="34" r="6" fill="#EAB308" />
      <circle cx="20" cy="34" r="6" fill="none" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="20" cy="34" r="2.2" fill="#FEF3C7" />
    </svg>
  );
}

function GlassesArt() {
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <ArtShadow />
      <line x1="8" y1="28" x2="4" y2="24" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="28" x2="60" y2="24" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="7" y="22" width="23" height="19" rx="8.5" fill="#1F2937" />
      <rect x="34" y="22" width="23" height="19" rx="8.5" fill="#1F2937" />
      <path d="M30 29 q2 -3 4 0" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M12 26 l9 9 M16 25 l6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M39 26 l9 9 M43 25 l6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <rect x="7" y="22" width="23" height="19" rx="8.5" fill="none" stroke="#0B1220" strokeWidth="1.5" />
      <rect x="34" y="22" width="23" height="19" rx="8.5" fill="none" stroke="#0B1220" strokeWidth="1.5" />
    </svg>
  );
}

function SakuraArt() {
  const petals = [0, 72, 144, 216, 288].map((a) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: 32 + 11.5 * Math.cos(rad), y: 28 + 11.5 * Math.sin(rad), r: a };
  });
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <ArtShadow />
      <line x1="32" y1="42" x2="32" y2="52" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 47 q-6 -1 -8 -5 q6 -1 8 5" fill="#86EFAC" stroke="#4D7C0F" strokeWidth="1.5" />
      {petals.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx="9" ry="7" transform={`rotate(${p.r + 90} ${p.x} ${p.y})`} fill="#FBCFE8" stroke="#F472B6" strokeWidth="2" />
      ))}
      <circle cx="32" cy="28" r="6.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="30" cy="26.5" r="1.4" fill="#F59E0B" />
      <circle cx="34" cy="26.5" r="1.4" fill="#F59E0B" />
      <path d="M32 28 q-1 1.5 0 3" stroke="#B45309" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const OPTIONS = [
  { id: null, label: 'Ninguno', Art: HangerArt },
  { id: 'bow', label: 'Lazo', Art: BowArt },
  { id: 'cap', label: 'Boina', Art: BeretArt },
  { id: 'glasses', label: 'Lentes', Art: GlassesArt },
  { id: 'flower', label: 'Flor', Art: SakuraArt },
];

// ── Tarjeta de accesorio ──
function AccessoryCard({ option, active, onSelect, darkMode }) {
  const { Art } = option;
  return (
    <button
      onClick={onSelect}
      className="relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-105 hover:-translate-y-0.5"
      style={{
        minHeight: '128px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: active
          ? (darkMode ? 'rgba(45,106,79,0.14)' : '#EFF7F1')
          : (darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF'),
        border: active
          ? `2px solid ${ACCENT}`
          : (darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)'),
        boxShadow: active
          ? '0 10px 24px rgba(45,106,79,0.18)'
          : (darkMode ? 'none' : '0 2px 8px rgba(15,23,42,0.05)'),
      }}
    >
      {active && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '50%',
            background: ACCENT, boxShadow: '0 2px 8px rgba(45,106,79,0.4)',
          }}
        >
          <Check size={13} style={{ color: '#fff' }} strokeWidth={3.5} />
        </span>
      )}
      <Art />
      <span
        className="text-[12px]"
        style={{ fontWeight: active ? 700 : 600, color: active ? ACCENT : (darkMode ? '#7C8DA6' : '#64748B') }}
      >
        {option.label}
      </span>
    </button>
  );
}

// ── Vista previa fija de Milo ──
function MiloPreview({ mascotId, outfit, mascotName, darkMode }) {
  const label = (OPTIONS.find((o) => o.id === outfit) || OPTIONS[0]).label;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-4 shrink-0"
      style={{
        width: '168px',
        background: darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
        border: darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.07)',
      }}
    >
      <p className="text-[10px] font-bold uppercase" style={{ letterSpacing: '0.08em', color: darkMode ? '#64748B' : '#94A3B8', marginBottom: '8px' }}>
        Vista previa
      </p>
      <SafetyMascot size={110} mascotId={mascotId} outfit={outfit} />
      <p className="text-[13px] text-center" style={{ fontWeight: 700, color: darkMode ? '#E2E8F0' : '#0F172A', marginTop: '8px' }}>
        {mascotName}
      </p>
      <p className="text-[11px] text-center" style={{ fontWeight: 600, color: ACCENT }}>
        {label}
      </p>
    </div>
  );
}

// ── Barra de acciones ──
function WardrobeActionBar({ dirty, onSave, onReset, darkMode }) {
  return (
    <div className="flex items-center justify-end gap-3" style={{ marginTop: '16px' }}>
      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] transition-all duration-200 ease-in-out hover:scale-[1.03] active:scale-95"
        style={{
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          background: 'transparent',
          border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.14)',
          color: darkMode ? '#94A3B8' : '#475569',
        }}
      >
        <RotateCcw size={14} />
        Restablecer
      </button>
      <button
        onClick={onSave}
        disabled={!dirty}
        className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] text-white transition-all duration-200 ease-in-out hover:scale-[1.03] hover:shadow-lg active:scale-95"
        style={{
          fontWeight: 700, cursor: dirty ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
          background: dirty ? ACCENT : (darkMode ? 'rgba(255,255,255,0.08)' : '#CBD5E1'),
          boxShadow: dirty ? '0 6px 18px rgba(45,106,79,0.35)' : 'none',
          opacity: dirty ? 1 : 0.7,
        }}
      >
        <Save size={14} />
        Guardar Cambios
      </button>
    </div>
  );
}

export default function MiloWardrobe({
  mascotId,
  mascotName = 'Milo',
  currentOutfit = null,
  darkMode = false,
  onSave = null,
}) {
  const [draft, setDraft] = useState(currentOutfit);

  useEffect(() => {
    setDraft(currentOutfit);
  }, [currentOutfit]);

  const dirty = draft !== currentOutfit;

  const handleSave = () => {
    if (!dirty) return;
    if (onSave) onSave(draft);
  };

  return (
    <div
      className="rounded-2xl"
      style={{
        marginTop: '24px',
        padding: '20px',
        background: darkMode ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
        border: darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.07)',
        boxShadow: darkMode ? '0 8px 28px rgba(0,0,0,0.3)' : '0 8px 28px rgba(15,23,42,0.06)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
        <p className="text-[12px] font-bold uppercase" style={{ letterSpacing: '0.08em', color: darkMode ? '#CBD5E1' : '#334155' }}>
          Vestidor de {mascotName}
        </p>
        <p className="text-[11px] font-semibold" style={{ color: darkMode ? '#64748B' : '#94A3B8' }}>
          {OPTIONS.length} accesorios
        </p>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <MiloPreview mascotId={mascotId} outfit={draft} mascotName={mascotName} darkMode={darkMode} />
        <div className="grid flex-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(104px, 1fr))', gap: '12px' }}>
          {OPTIONS.map((o) => (
            <AccessoryCard
              key={o.label}
              option={o}
              active={draft === o.id}
              onSelect={() => setDraft(o.id)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      <WardrobeActionBar
        dirty={dirty}
        onSave={handleSave}
        onReset={() => setDraft(currentOutfit)}
        darkMode={darkMode}
      />
    </div>
  );
}
