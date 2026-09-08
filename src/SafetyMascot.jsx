import React from 'react';
import { getMascotById, DEFAULT_MASCOT_ID } from './mascotData';

const SIZES = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 92,
  xl: 140,
};

const OUTFITS = {
  bow: { color: '#F472B6', label: 'Lazo' },
  cap: { color: '#60A5FA', label: 'Boina' },
  glasses: { color: '#172033', label: 'Lentes' },
  flower: { color: '#F472B6', label: 'Flor' },
};

function SleepEyes({ cx1, cy1, cx2, cy2 }) {
  return (
    <g className="mascot-eyes-idle">
      <path d={`M${cx1 - 6} ${cy1} Q${cx1} ${cy1 + 4} ${cx1 + 6} ${cy1}`} stroke="#172033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={`M${cx2 - 6} ${cy2} Q${cx2} ${cy2 + 4} ${cx2 + 6} ${cy2}`} stroke="#172033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

function AwakeEyes({ cx1, cy1, cx2, cy2 }) {
  return (
    <g className="mascot-eyes-idle">
      <ellipse cx={cx1} cy={cy1} rx="7" ry="8" fill="#172033" />
      <ellipse cx={cx2} cy={cy2} rx="7" ry="8" fill="#172033" />
      <circle cx={cx1 + 3} cy={cy1 - 4} r="2.5" fill="#FFFFFF" />
      <circle cx={cx2 + 3} cy={cy2 - 4} r="2.5" fill="#FFFFFF" />
      <circle cx={cx1 - 2} cy={cy1 + 2} r="1.2" fill="#FFFFFF" opacity="0.6" />
      <circle cx={cx2 - 2} cy={cy2 + 2} r="1.2" fill="#FFFFFF" opacity="0.6" />
    </g>
  );
}

function BowOutfit({ hx, hy }) {
  return (
    <g transform={`translate(${hx}, ${hy - 18})`}>
      <ellipse cx="-14" cy="0" rx="12" ry="8" fill="#F472B6" opacity="0.9" />
      <ellipse cx="14" cy="0" rx="12" ry="8" fill="#F472B6" opacity="0.9" />
      <ellipse cx="-10" cy="-2" rx="6" ry="5" fill="#F9A8D4" opacity="0.6" />
      <ellipse cx="10" cy="-2" rx="6" ry="5" fill="#F9A8D4" opacity="0.6" />
      <circle cx="0" cy="0" r="5" fill="#EC4899" />
      <circle cx="0" cy="0" r="2.5" fill="#F9A8D4" opacity="0.7" />
      <path d="M0 5 Q-3 10 -1 14" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M0 5 Q3 10 1 14" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>
  );
}

function CapOutfit({ hx, hy }) {
  return (
    <g>
      <ellipse cx={hx} cy={hy - 16} rx="38" ry="10" fill="#60A5FA" opacity="0.85" />
      <path d={`M${hx - 38} ${hy - 16} Q${hx - 38} ${hy - 46} ${hx} ${hy - 50} Q${hx + 38} ${hy - 46} ${hx + 38} ${hy - 16}`} fill="#60A5FA" opacity="0.85" />
      <path d={`M${hx - 30} ${hy - 22} Q${hx - 30} ${hy - 40} ${hx} ${hy - 42} Q${hx + 30} ${hy - 40} ${hx + 30} ${hy - 22}`} fill="#93C5FD" opacity="0.35" />
      <ellipse cx={hx + 20} cy={hy - 18} rx="20" ry="5" fill="#3B82F6" opacity="0.55" />
      <circle cx={hx} cy={hy - 50} r="4" fill="#FFFFFF" opacity="0.8" />
    </g>
  );
}

function GlassesOutfit({ hx, hy }) {
  const gy = hy + 4;
  return (
    <g>
      <rect x={hx - 32} y={gy - 8} width="22" height="16" rx="7" fill="rgba(15,23,42,0.85)" />
      <rect x={hx + 10} y={gy - 8} width="22" height="16" rx="7" fill="rgba(15,23,42,0.85)" />
      <rect x={hx - 30} y={gy - 6} width="18" height="12" rx="5" fill="rgba(15,23,42,0.5)" />
      <rect x={hx + 12} y={gy - 6} width="18" height="12" rx="5" fill="rgba(15,23,42,0.5)" />
      <line x1={hx - 10} y1={gy} x2={hx + 10} y2={gy} stroke="rgba(15,23,42,0.85)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={hx - 32} y1={gy - 2} x2={hx - 40} y2={gy - 6} stroke="rgba(15,23,42,0.7)" strokeWidth="2" strokeLinecap="round" />
      <line x1={hx + 32} y1={gy - 2} x2={hx + 40} y2={gy - 6} stroke="rgba(15,23,42,0.7)" strokeWidth="2" strokeLinecap="round" />
      <rect x={hx - 28} y={gy - 4} width="14" height="8" rx="4" fill="rgba(100,160,255,0.15)" />
      <rect x={hx + 14} y={gy - 4} width="14" height="8" rx="4" fill="rgba(100,160,255,0.15)" />
    </g>
  );
}

function FlowerOutfit({ hx, hy }) {
  return (
    <g transform={`translate(${hx + 36}, ${hy - 10})`}>
      <circle cx="0" cy="-6" r="6" fill="#F9A8D4" opacity="0.85" />
      <circle cx="6" cy="0" r="6" fill="#F9A8D4" opacity="0.85" />
      <circle cx="4" cy="8" r="6" fill="#F9A8D4" opacity="0.85" />
      <circle cx="-4" cy="8" r="6" fill="#F9A8D4" opacity="0.85" />
      <circle cx="-6" cy="0" r="6" fill="#F9A8D4" opacity="0.85" />
      <circle cx="0" cy="1" r="4.5" fill="#FBBF24" />
      <circle cx="0" cy="1" r="2" fill="#F59E0B" opacity="0.6" />
      <line x1="0" y1="14" x2="0" y2="22" stroke="#6B8E5B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M0 18 Q-4 16 -6 19" stroke="#6B8E5B" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>
  );
}

const OUTFIT_COMPONENTS = {
  bow: BowOutfit,
  cap: CapOutfit,
  glasses: GlassesOutfit,
  flower: FlowerOutfit,
};

function OutfitOverlay({ outfit, headX = 100, headY = 88 }) {
  if (!outfit || !OUTFIT_COMPONENTS[outfit]) return null;
  const Comp = OUTFIT_COMPONENTS[outfit];
  return <Comp hx={headX} hy={headY} />;
}

function CatMascot({ colors, sleeping, outfit }) {
  const bodyColor = colors.primary;
  const bellyColor = colors.accent;
  const darkColor = colors.secondary;

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra suave bajo el cuerpo */}
      <ellipse cx="100" cy="190" rx="50" ry="5" fill={darkColor} opacity="0.12" />

      {/* ═══ PATAS TRASERAS ═══ */}
      <ellipse cx="58" cy="172" rx="22" ry="13" fill={bodyColor} />
      <ellipse cx="142" cy="172" rx="22" ry="13" fill={bodyColor} />
      {/* Dedos de patas */}
      <ellipse cx="40" cy="178" rx="10" ry="6" fill={darkColor} opacity="0.4" />
      <ellipse cx="55" cy="180" rx="8" ry="5" fill={darkColor} opacity="0.35" />
      <ellipse cx="160" cy="178" rx="10" ry="6" fill={darkColor} opacity="0.4" />
      <ellipse cx="145" cy="180" rx="8" ry="5" fill={darkColor} opacity="0.35" />

      {/* ═══ CUERPO ═══ */}
      <ellipse cx="100" cy="148" rx="52" ry="40" fill={bodyColor} />

      {/* Vientre claro */}
      <ellipse cx="100" cy="154" rx="36" ry="28" fill={bellyColor} opacity="0.55" />

      {/* ═══ BRAZOS ═══ */}
      {/* Brazo izquierdo */}
      <ellipse cx="48" cy="138" rx="16" ry="11" fill={bodyColor} transform="rotate(-25, 48, 138)" />
      <ellipse cx="36" cy="144" rx="9" ry="7" fill={darkColor} opacity="0.45" />
      {/* Brazo derecho */}
      <ellipse cx="152" cy="138" rx="16" ry="11" fill={bodyColor} transform="rotate(25, 152, 138)" />
      <ellipse cx="164" cy="144" rx="9" ry="7" fill={darkColor} opacity="0.45" />

      {/* ═══ CABEZA ═══ */}
      <ellipse cx="100" cy="88" rx="56" ry="50" fill={bodyColor} />

      {/* ═══ OJOS PROTUBERANTES DE RANA ═══ */}
      <circle cx="68" cy="48" r="22" fill={bodyColor} />
      <circle cx="132" cy="48" r="22" fill={bodyColor} />

      {sleeping ? (
        <g>
          <path d="M56 48 Q68 56 80 48" stroke="#172033" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M120 48 Q132 56 144 48" stroke="#172033" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="68" cy="48" rx="9" ry="10" fill="#172033" />
          <circle cx="71" cy="44" r="3.2" fill="#FFFFFF" />
          <circle cx="65" cy="51" r="1.6" fill="#FFFFFF" opacity="0.5" />
          <ellipse cx="132" cy="48" rx="9" ry="10" fill="#172033" />
          <circle cx="135" cy="44" r="3.2" fill="#FFFFFF" />
          <circle cx="129" cy="51" r="1.6" fill="#FFFFFF" opacity="0.5" />
        </g>
      )}

      {/* ═══ MEJILLAS ═══ */}
      <ellipse cx="54" cy="92" rx="9" ry="5" fill="#FFB6C8" opacity="0.5" />
      <ellipse cx="146" cy="92" rx="9" ry="5" fill="#FFB6C8" opacity="0.5" />

      {/* ═══ NARIZ ═══ */}
      <circle cx="92" cy="82" r="2.2" fill={darkColor} opacity="0.4" />
      <circle cx="108" cy="82" r="2.2" fill={darkColor} opacity="0.4" />

      {/* ═══ BOCA ═══ */}
      {sleeping ? (
        <path d="M82 96 Q100 104 118 96" stroke="#172033" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M80 92 Q100 110 120 92" stroke="#172033" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      )}

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={100} headY={68} />
    </svg>
  );
}

function BunnyMascot({ colors, sleeping, outfit }) {
  const bodyColor = colors.primary;
  const bellyColor = colors.accent;
  const darkColor = colors.secondary;

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ═══════════════════════════════════════════════════════════════
          CONEJO KAWAII - DISEÑO COMPLETO DESDE CERO
          Proporciones: Orejas 25% | Cabeza 40% | Cuerpo 35%
         ═══════════════════════════════════════════════════════════════ */}

      {/* Sombra suave en el suelo */}
      <ellipse cx="100" cy="190" rx="40" ry="5" fill={darkColor} opacity="0.12" />

      {/* ═══ OREJAS ULTRA-LARGAS (25% = 50px de altura) ═══ */}
      {/* Oreja izquierda - muy alta y visible */}
      <path
        d="M62 100 C62 100, 56 60, 54 40 C52 20, 58 4, 66 4 C74 4, 80 20, 78 40 C76 60, 72 80, 72 100"
        fill={bodyColor}
      />
      <path
        d="M64 95 C64 95, 60 62, 58 44 C56 26, 60 12, 66 12 C72 12, 76 26, 74 44 C72 62, 68 80, 68 95"
        fill="#FFB6C8"
        opacity="0.5"
      />

      {/* Oreja derecha - muy alta y visible */}
      <path
        d="M128 100 C128 100, 124 80, 122 60 C120 40, 126 4, 134 4 C142 4, 148 20, 146 40 C144 60, 138 100, 138 100"
        fill={bodyColor}
      />
      <path
        d="M132 95 C132 95, 128 80, 126 62 C124 44, 128 12, 134 12 C140 12, 144 26, 142 44 C140 62, 136 80, 136 95"
        fill="#FFB6C8"
        opacity="0.5"
      />

      {/* ═══ CUERPO PEQUEÑO (35% = 70px) ═══ */}
      <ellipse cx="100" cy="158" rx="42" ry="32" fill={bodyColor} />

      {/* Barriga lavanda */}
      <ellipse cx="100" cy="162" rx="28" ry="22" fill={bellyColor} opacity="0.5" />

      {/* ═══ COLA ═══ */}
      <circle cx="140" cy="168" r="8" fill={bodyColor} />
      <circle cx="141" cy="167" r="5" fill="#FFFFFF" opacity="0.5" />

      {/* ═══ PATAS TRASERAS ═══ */}
      <ellipse cx="66" cy="180" rx="16" ry="9" fill={bodyColor} />
      <ellipse cx="134" cy="180" rx="16" ry="9" fill={bodyColor} />
      <ellipse cx="56" cy="183" rx="7" ry="4.5" fill={darkColor} opacity="0.35" />
      <ellipse cx="68" cy="185" rx="5" ry="3.5" fill={darkColor} opacity="0.3" />
      <ellipse cx="144" cy="183" rx="7" ry="4.5" fill={darkColor} opacity="0.35" />
      <ellipse cx="132" cy="185" rx="5" ry="3.5" fill={darkColor} opacity="0.3" />

      {/* ═══ BRAZOS/PAZOS DELANTEROS ═══ */}
      <ellipse cx="58" cy="150" rx="10" ry="14" fill={bodyColor} transform="rotate(-10, 58, 150)" />
      <ellipse cx="55" cy="158" rx="6" ry="5" fill={darkColor} opacity="0.35" />
      <ellipse cx="142" cy="150" rx="10" ry="14" fill={bodyColor} transform="rotate(10, 142, 150)" />
      <ellipse cx="145" cy="158" rx="6" ry="5" fill={darkColor} opacity="0.35" />

      {/* ═══ CABEZA GRANDE (40% = 80px) ═══ */}
      <ellipse cx="100" cy="105" rx="52" ry="48" fill={bodyColor} />

      {/* ═══ OJOS GRANDES Y REDONDOS ═══ */}
      {sleeping ? (
        <g>
          <path d="M76 102 Q84 112 92 102" stroke="#172033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M108 102 Q116 112 124 102" stroke="#172033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="80" cy="100" rx="7.5" ry="9" fill="#172033" />
          <ellipse cx="120" cy="100" rx="7.5" ry="9" fill="#172033" />
          <circle cx="83" cy="96" r="2.8" fill="#FFFFFF" />
          <circle cx="123" cy="96" r="2.8" fill="#FFFFFF" />
          <circle cx="78" cy="103" r="1.4" fill="#FFFFFF" opacity="0.5" />
          <circle cx="118" cy="103" r="1.4" fill="#FFFFFF" opacity="0.5" />
        </g>
      )}

      {/* ═══ NARIZ PEQUEÑA ROSA ═══ */}
      <ellipse cx="100" cy="110" rx="3" ry="2.2" fill="#FFB6C8" opacity="0.75" />

      {/* ═══ BOCA PEQUEÑA ═══ */}
      {sleeping ? (
        <path d="M94 116 Q100 120 106 116" stroke="#172033" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M93 114 Q100 122 107 114" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      )}

      {/* ═══ MEJILLAS ROSA SUTILES ═══ */}
      <ellipse cx="64" cy="108" rx="7" ry="4" fill="#FFB6C8" opacity="0.45" />
      <ellipse cx="136" cy="108" rx="7" ry="4" fill="#FFB6C8" opacity="0.45" />

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={100} headY={80} />
    </svg>
  );
}

function BearMascot({ colors, sleeping, outfit }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="150" rx="50" ry="42" fill={colors.primary} />
      <ellipse cx="78" cy="180" rx="15" ry="9" fill={colors.primary} />
      <ellipse cx="122" cy="180" rx="15" ry="9" fill={colors.primary} />
      <ellipse cx="52" cy="152" rx="12" ry="16" fill={colors.primary} transform="rotate(-10, 52, 152)" />
      <ellipse cx="148" cy="152" rx="12" ry="16" fill={colors.primary} transform="rotate(10, 148, 152)" />
      <circle cx="100" cy="88" r="54" fill={colors.primary} />
      <circle cx="62" cy="48" r="18" fill={colors.primary} />
      <circle cx="138" cy="48" r="18" fill={colors.primary} />
      <circle cx="62" cy="48" r="12" fill={colors.accent} opacity="0.5" />
      <circle cx="138" cy="48" r="12" fill={colors.accent} opacity="0.5" />
      <circle cx="100" cy="88" r="50" fill="#FFFFFF" />
      {sleeping ? <SleepEyes cx1={82} cy1={86} cx2={118} cy2={86} /> : (
        <g className="mascot-eyes-idle">
          <ellipse cx="82" cy="86" rx="6" ry="7" fill="#172033" />
          <ellipse cx="118" cy="86" rx="6" ry="7" fill="#172033" />
          <circle cx="84" cy="83" r="2" fill="#FFFFFF" />
          <circle cx="120" cy="83" r="2" fill="#FFFFFF" />
        </g>
      )}
      <ellipse cx="100" cy="98" rx="6" ry="4" fill={colors.secondary} opacity="0.5" />
      {sleeping ? (
        <path d="M94 104 Q100 106 106 104" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M94 104 Q100 108 106 104" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      )}
      <OutfitOverlay outfit={outfit} headX={100} headY={88} />
      <ellipse cx="70" cy="100" rx="8" ry="5" fill={colors.accent} opacity="0.5" />
      <ellipse cx="130" cy="100" rx="8" ry="5" fill={colors.accent} opacity="0.5" />
    </svg>
  );
}

function FoxMascot({ colors, sleeping, outfit }) {
  const bodyColor = colors.primary;
  const creamColor = colors.accent;
  const orangeColor = colors.secondary;

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ═══════════════════════════════════════════════════════════════
          LUMI - ZORRITO LUMINOSO - DISEÑO DEFINITIVO
         ═══════════════════════════════════════════════════════════════ */}

      {/* Efecto luminoso sutil - destellos */}
      <circle cx="162" cy="105" r="5" fill="#FFFFFF" opacity="0.18" />
      <circle cx="172" cy="95" r="2.5" fill="#FFFFFF" opacity="0.12" />
      <circle cx="155" cy="92" r="2" fill="#FFFFFF" opacity="0.14" />

      {/* ═══ COLA GRANDE Y ESPONJOSA ═══ */}
      <path
        d="M115 155 C125 148, 145 132, 155 118 C165 104, 168 90, 160 86 C152 82, 140 88, 136 104 C132 120, 120 145, 115 155"
        fill={bodyColor}
      />
      {/* Punta blanca de la cola */}
      <path
        d="M160 86 C156 80, 148 78, 144 82 C140 86, 142 96, 150 104 C158 112, 166 108, 168 100 C170 92, 164 84, 160 86"
        fill="#FFFFFF"
        opacity="0.92"
      />

      {/* ═══ SOMBRA ═══ */}
      <ellipse cx="90" cy="190" rx="38" ry="4" fill={orangeColor} opacity="0.1" />

      {/* ═══ PATAS ═══ */}
      <ellipse cx="64" cy="178" rx="14" ry="9" fill={bodyColor} />
      <ellipse cx="116" cy="178" rx="14" ry="9" fill={bodyColor} />
      <ellipse cx="54" cy="182" rx="6.5" ry="4" fill={orangeColor} opacity="0.4" />
      <ellipse cx="68" cy="183" rx="5" ry="3.5" fill={orangeColor} opacity="0.35" />
      <ellipse cx="126" cy="182" rx="6.5" ry="4" fill={orangeColor} opacity="0.4" />
      <ellipse cx="112" cy="183" rx="5" ry="3.5" fill={orangeColor} opacity="0.35" />

      {/* ═══ CUERPO ═══ */}
      <ellipse cx="90" cy="152" rx="40" ry="32" fill={bodyColor} />

      {/* Pecho crema */}
      <ellipse cx="90" cy="157" rx="26" ry="22" fill={creamColor} opacity="0.65" />

      {/* ═══ BRAZOS ═══ */}
      <ellipse cx="50" cy="146" rx="10" ry="12" fill={bodyColor} transform="rotate(-12, 50, 146)" />
      <ellipse cx="47" cy="154" rx="5.5" ry="4.5" fill={orangeColor} opacity="0.4" />
      <ellipse cx="130" cy="148" rx="10" ry="12" fill={bodyColor} transform="rotate(12, 130, 148)" />
      <ellipse cx="133" cy="156" rx="5.5" ry="4.5" fill={orangeColor} opacity="0.4" />

      {/* ═══ CABEZA ═══ */}
      <ellipse cx="90" cy="86" rx="50" ry="46" fill={bodyColor} />

      {/* ═══ OREJAS DE ZORRO - NATURALES Y PROPORCIONADAS ═══ */}
      {/* Oreja izquierda - forma ancha en la base, redondeada en la punta */}
      <path
        d="M48 68 C48 68, 42 48, 44 34 C46 20, 56 14, 62 16 C68 18, 72 30, 74 44 C76 58, 74 68, 74 68"
        fill={bodyColor}
      />
      <path
        d="M52 64 C52 64, 48 48, 50 38 C52 28, 58 22, 62 24 C66 26, 68 36, 70 48 C72 60, 68 64, 68 64"
        fill={creamColor}
        opacity="0.5"
      />

      {/* Oreja derecha - forma ancha en la base, redondeada en la punta */}
      <path
        d="M112 68 C112 68, 108 58, 106 44 C104 30, 108 18, 114 16 C120 14, 130 20, 132 34 C134 48, 130 68, 130 68"
        fill={bodyColor}
      />
      <path
        d="M114 64 C114 64, 112 52, 110 42 C108 32, 112 24, 116 22 C120 20, 126 26, 128 38 C130 50, 126 64, 126 64"
        fill={creamColor}
        opacity="0.5"
      />

      {/* ═══ HOCICO DE ZORRO ═══ */}
      <ellipse cx="90" cy="100" rx="22" ry="16" fill={creamColor} opacity="0.75" />

      {/* ═══ OJOS ═══ */}
      {sleeping ? (
        <g>
          <path d="M66 82 Q76 92 86 82" stroke="#172033" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M94 82 Q104 92 114 82" stroke="#172033" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="74" cy="80" rx="6.5" ry="7.5" fill="#172033" />
          <ellipse cx="106" cy="80" rx="6.5" ry="7.5" fill="#172033" />
          <circle cx="77" cy="76" r="2.5" fill="#FFFFFF" />
          <circle cx="109" cy="76" r="2.5" fill="#FFFFFF" />
          <circle cx="72" cy="83" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="104" cy="83" r="1.2" fill="#FFFFFF" opacity="0.5" />
        </g>
      )}

      {/* ═══ NARIZ ═══ */}
      <ellipse cx="90" cy="96" rx="3" ry="2.2" fill="#172033" opacity="0.8" />

      {/* ═══ BOCA ═══ */}
      {sleeping ? (
        <path d="M84 104 Q90 108 96 104" stroke="#172033" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M82 102 Q90 112 98 102" stroke="#172033" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      )}

      {/* ═══ MEJILLAS ═══ */}
      <ellipse cx="56" cy="92" rx="6" ry="3.5" fill="#FFB6C8" opacity="0.4" />
      <ellipse cx="124" cy="92" rx="6" ry="3.5" fill="#FFB6C8" opacity="0.4" />

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={90} headY={86} />
    </svg>
  );
}

function PandaMascot({ colors, sleeping, outfit }) {
  const white = '#F8F7F2';
  const black = '#1B2233';
  const darkGray = '#303747';

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ═══════════════════════════════════════════════════════════════
          PANDA RECONFORTANTE - DISEÑO DESDE CERO
         ═══════════════════════════════════════════════════════════════ */}

      {/* Sombra */}
      <ellipse cx="100" cy="190" rx="40" ry="4" fill={darkGray} opacity="0.12" />

      {/* ═══ PATAS ═══ */}
      <ellipse cx="64" cy="178" rx="18" ry="11" fill={black} />
      <ellipse cx="136" cy="178" rx="18" ry="11" fill={black} />
      <ellipse cx="64" cy="182" rx="10" ry="6" fill={darkGray} opacity="0.3" />
      <ellipse cx="136" cy="182" rx="10" ry="6" fill={darkGray} opacity="0.3" />

      {/* ═══ CUERPO ═══ */}
      <ellipse cx="100" cy="150" rx="44" ry="36" fill={black} />

      {/* Barriga blanca */}
      <ellipse cx="100" cy="155" rx="30" ry="26" fill={white} opacity="0.85" />

      {/* ═══ BRAZOS ═══ */}
      <ellipse cx="52" cy="146" rx="14" ry="18" fill={black} transform="rotate(-10, 52, 146)" />
      <ellipse cx="148" cy="146" rx="14" ry="18" fill={black} transform="rotate(10, 148, 146)" />

      {/* ═══ CABEZA ═══ */}
      <ellipse cx="100" cy="86" rx="54" ry="50" fill={white} />

      {/* ═══ OREJAS REDONDAS NEGRAS ═══ */}
      <circle cx="52" cy="42" r="18" fill={black} />
      <circle cx="148" cy="42" r="18" fill={black} />

      {/* ═══ MANCHAS NEGRAS ALREDEDOR DE LOS OJOS ═══ */}
      {/* Mancha izquierda */}
      <ellipse cx="74" cy="82" rx="16" ry="14" fill={black} transform="rotate(-8, 74, 82)" />
      {/* Mancha derecha */}
      <ellipse cx="126" cy="82" rx="16" ry="14" fill={black} transform="rotate(8, 126, 82)" />

      {/* ═══ OJOS ═══ */}
      {sleeping ? (
        <g>
          <path d="M64 82 Q74 90 84 82" stroke={white} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M116 82 Q126 90 136 82" stroke={white} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="74" cy="80" rx="6" ry="7" fill={white} />
          <ellipse cx="126" cy="80" rx="6" ry="7" fill={white} />
          <ellipse cx="74" cy="80" rx="4.5" ry="5.5" fill={black} />
          <ellipse cx="126" cy="80" rx="4.5" ry="5.5" fill={black} />
          <circle cx="76" cy="77" r="2" fill={white} />
          <circle cx="128" cy="77" r="2" fill={white} />
        </g>
      )}

      {/* ═══ NARIZ ═══ */}
      <ellipse cx="100" cy="94" rx="4" ry="3" fill={black} />

      {/* ═══ BOCA ═══ */}
      {sleeping ? (
        <path d="M94 100 Q100 104 106 100" stroke={black} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M92 98 Q100 106 108 98" stroke={black} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* ═══ MEJILLAS ROSA ═══ */}
      <ellipse cx="60" cy="96" rx="7" ry="4" fill="#FFB6C8" opacity="0.4" />
      <ellipse cx="140" cy="96" rx="7" ry="4" fill="#FFB6C8" opacity="0.4" />

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={100} headY={86} />
    </svg>
  );
}

function KoalaMascot({ colors, sleeping, outfit }) {
  const bodyColor = colors.primary;
  const bellyColor = colors.accent;
  const grayColor = colors.secondary;

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ═══════════════════════════════════════════════════════════════
          KOKO - KOALA DULCE - DISEÑO DESDE CERO
         ═══════════════════════════════════════════════════════════════ */}

      {/* Sombra */}
      <ellipse cx="100" cy="190" rx="38" ry="4" fill={grayColor} opacity="0.1" />

      {/* ═══ OREJAS GRANDES Y REDONDAS DE KOALA ═══ */}
      {/* Oreja izquierda */}
      <circle cx="40" cy="62" r="26" fill={bodyColor} />
      <circle cx="40" cy="62" r="18" fill={grayColor} opacity="0.35" />
      {/* Oreja derecha */}
      <circle cx="160" cy="62" r="26" fill={bodyColor} />
      <circle cx="160" cy="62" r="18" fill={grayColor} opacity="0.35" />

      {/* ═══ PATAS ═══ */}
      <ellipse cx="66" cy="178" rx="16" ry="10" fill={bodyColor} />
      <ellipse cx="134" cy="178" rx="16" ry="10" fill={bodyColor} />
      <ellipse cx="66" cy="182" rx="9" ry="5.5" fill={grayColor} opacity="0.3" />
      <ellipse cx="134" cy="182" rx="9" ry="5.5" fill={grayColor} opacity="0.3" />

      {/* ═══ CUERPO ═══ */}
      <ellipse cx="100" cy="152" rx="42" ry="34" fill={bodyColor} />

      {/* Barriga clara */}
      <ellipse cx="100" cy="158" rx="28" ry="24" fill={bellyColor} opacity="0.6" />

      {/* ═══ BRAZOS ═══ */}
      <ellipse cx="54" cy="148" rx="12" ry="16" fill={bodyColor} transform="rotate(-8, 54, 148)" />
      <ellipse cx="146" cy="148" rx="12" ry="16" fill={bodyColor} transform="rotate(8, 146, 148)" />

      {/* ═══ CABEZA ═══ */}
      <ellipse cx="100" cy="84" rx="52" ry="48" fill={bodyColor} />

      {/* ═══ CARA CLARA ═══ */}
      <ellipse cx="100" cy="92" rx="34" ry="28" fill={bellyColor} opacity="0.45" />

      {/* ═══ OJOS GRANDES ═══ */}
      {sleeping ? (
        <g>
          <path d="M74 84 Q84 94 94 84" stroke="#172033" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M106 84 Q116 94 126 84" stroke="#172033" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="82" cy="82" rx="6.5" ry="7.5" fill="#172033" />
          <ellipse cx="118" cy="82" rx="6.5" ry="7.5" fill="#172033" />
          <circle cx="85" cy="78" r="2.5" fill="#FFFFFF" />
          <circle cx="121" cy="78" r="2.5" fill="#FFFFFF" />
          <circle cx="80" cy="85" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="116" cy="85" r="1.2" fill="#FFFFFF" opacity="0.5" />
        </g>
      )}

      {/* ═══ NARIZ GRANDE Y OVALADA DE KOALA ═══ */}
      <ellipse cx="100" cy="96" rx="8" ry="5.5" fill="#172033" opacity="0.85" />

      {/* ═══ BOCA ═══ */}
      {sleeping ? (
        <path d="M94 106 Q100 110 106 106" stroke="#172033" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M92 104 Q100 112 108 104" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      )}

      {/* ═══ MEJILLAS ═══ */}
      <ellipse cx="62" cy="96" rx="7" ry="4" fill="#FFB6C8" opacity="0.38" />
      <ellipse cx="138" cy="96" rx="7" ry="4" fill="#FFB6C8" opacity="0.38" />

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={100} headY={84} />
    </svg>
  );
}

function PenguinMascot({ colors, sleeping, outfit }) {
  const bodyColor = colors.primary;
  const bellyColor = colors.accent;
  const darkColor = colors.secondary;

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ═══════════════════════════════════════════════════════════════
          PIPO - PINGÜINO ALEGRE - DISEÑO DESDE CERO
         ═══════════════════════════════════════════════════════════════ */}

      {/* Sombra */}
      <ellipse cx="100" cy="190" rx="36" ry="4" fill={darkColor} opacity="0.12" />

      {/* ═══ PATAS NARANJAS ═══ */}
      <ellipse cx="78" cy="180" rx="14" ry="8" fill="#F4A261" />
      <ellipse cx="122" cy="180" rx="14" ry="8" fill="#F4A261" />

      {/* ═══ CUERPO PRINCIPAL (azul marino) ═══ */}
      <ellipse cx="100" cy="145" rx="46" ry="40" fill={bodyColor} />

      {/* Barriga blanca */}
      <ellipse cx="100" cy="150" rx="32" ry="30" fill={bellyColor} opacity="0.9" />

      {/* ═══ ALAS ═══ */}
      <ellipse cx="52" cy="140" rx="12" ry="22" fill={bodyColor} transform="rotate(-12, 52, 140)" />
      <ellipse cx="148" cy="140" rx="12" ry="22" fill={bodyColor} transform="rotate(12, 148, 140)" />

      {/* ═══ CABEZA (parte azul) ═══ */}
      <ellipse cx="100" cy="78" rx="50" ry="46" fill={bodyColor} />

      {/* ═══ CARA BLANCA ═══ */}
      <ellipse cx="100" cy="86" rx="34" ry="30" fill={bellyColor} opacity="0.9" />

      {/* ═══ OJOS ═══ */}
      {sleeping ? (
        <g>
          <path d="M78 82 Q88 92 98 82" stroke="#172033" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M102 82 Q112 92 122 82" stroke="#172033" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g className="mascot-eyes-idle">
          <ellipse cx="86" cy="80" rx="6.5" ry="7.5" fill="#172033" />
          <ellipse cx="114" cy="80" rx="6.5" ry="7.5" fill="#172033" />
          <circle cx="89" cy="76" r="2.5" fill="#FFFFFF" />
          <circle cx="117" cy="76" r="2.5" fill="#FFFFFF" />
          <circle cx="84" cy="83" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="112" cy="83" r="1.2" fill="#FFFFFF" opacity="0.5" />
        </g>
      )}

      {/* ═══ PICO NARANJA ═══ */}
      <path d="M92 92 L100 100 L108 92 Z" fill="#F4A261" />

      {/* ═══ MEJILLAS ═══ */}
      <ellipse cx="68" cy="90" rx="6" ry="3.5" fill="#FFB6C8" opacity="0.4" />
      <ellipse cx="132" cy="90" rx="6" ry="3.5" fill="#FFB6C8" opacity="0.4" />

      {/* ═══ OUTFIT (despues de cabeza) ═══ */}
      <OutfitOverlay outfit={outfit} headX={100} headY={78} />
    </svg>
  );
}

function GenericMascot({ colors, emoji, sleeping, outfit }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="150" rx="48" ry="40" fill={colors.primary} />
      <ellipse cx="78" cy="180" rx="14" ry="9" fill={colors.primary} />
      <ellipse cx="122" cy="180" rx="14" ry="9" fill={colors.primary} />
      <circle cx="100" cy="88" r="52" fill="#FFFFFF" />
      {sleeping ? <SleepEyes cx1={82} cy1={86} cx2={118} cy2={86} /> : (
        <g className="mascot-eyes-idle">
          <ellipse cx="82" cy="86" rx="6" ry="7" fill="#172033" />
          <ellipse cx="118" cy="86" rx="6" ry="7" fill="#172033" />
          <circle cx="84" cy="83" r="2" fill="#FFFFFF" />
          <circle cx="120" cy="83" r="2" fill="#FFFFFF" />
        </g>
      )}
      <ellipse cx="100" cy="98" rx="4" ry="3" fill={colors.secondary} opacity="0.6" />
      {sleeping ? (
        <path d="M95 103 Q100 105 105 103" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M95 103 Q100 107 105 103" stroke="#172033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      )}
      <OutfitOverlay outfit={outfit} headX={100} headY={88} />
      <ellipse cx="70" cy="98" rx="7" ry="4" fill={colors.accent} opacity="0.5" />
      <ellipse cx="130" cy="98" rx="7" ry="4" fill={colors.accent} opacity="0.5" />
      <text x="100" y="145" textAnchor="middle" fontSize="40" fill={colors.secondary}>{emoji}</text>
    </svg>
  );
}

const MASCOT_COMPONENTS = {
  'michi-menta': CatMascot,
  'nube': BunnyMascot,
  'milo': BearMascot,
  'lumi': FoxMascot,
  'panda': PandaMascot,
  'koko': KoalaMascot,
  'pipo': PenguinMascot,
};

export { OUTFITS };

export default function SafetyMascot({ size = 'md', mascotId, sleeping = false, outfit = null, className = '' }) {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES.md);
  const mascot = getMascotById(mascotId || DEFAULT_MASCOT_ID);
  const MascotComponent = MASCOT_COMPONENTS[mascot.id] || GenericMascot;

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: px, height: px }}>
      <MascotComponent colors={mascot.colors} emoji={mascot.emoji} sleeping={sleeping} outfit={outfit} />
    </div>
  );
}
