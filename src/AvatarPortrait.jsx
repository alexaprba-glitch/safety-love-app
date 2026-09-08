import React, { useEffect, useState } from 'react';

const DEFAULT_AVATAR = {
  skin: '#f0b68a',
  face: 'oval',
  eyes: 'round',
  brows: 'soft',
  mouth: 'smile',
  hairStyle: 'long',
  hairColor: '#1a1010',
  shirtStyle: 'offshoulder',
  shirtColor: '#c9b8a0',
  pantsStyle: 'shorts',
  pantsColor: '#3b5068',
  shoeColor: '#1f2937',
  glasses: false,
  collar: false,
  bracelets: false,
  backpack: false,
  flower: false,
};

export function loadAvatarConfig() {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('safetyLoveAvatar');
      if (raw) return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
    }
  } catch (e) {}
  return DEFAULT_AVATAR;
}

function Hair({ style, color }) {
  const dome = <path d="M 70 46 A 30 30 0 0 1 130 46 Z" fill={color} />;
  const fringe = <rect x="87" y="36" width="26" height="8" rx="5" fill={color} />;
  const sides = (
    <>
      <rect x="68" y="44" width="10" height="18" rx="7" fill={color} />
      <rect x="122" y="44" width="10" height="18" rx="7" fill={color} />
    </>
  );
  if (style === 'none') return null;
  if (style === 'long') {
    return (
      <>
        <rect x="60" y="38" width="22" height="72" rx="12" fill={color} />
        <rect x="118" y="38" width="22" height="72" rx="12" fill={color} />
        {dome}
        {fringe}
        {sides}
      </>
    );
  }
  if (style === 'bun') {
    return (
      <>
        <circle cx="100" cy="20" r="11" fill={color} />
        {dome}
        {fringe}
        {sides}
      </>
    );
  }
  if (style === 'curls') {
    return (
      <>
        {[[86, 38, 8], [114, 38, 8], [100, 31, 9], [92, 42, 6], [108, 42, 6]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={color} />
        ))}
        {dome}
        {fringe}
        {sides}
      </>
    );
  }
  return (
    <>
      {dome}
      {fringe}
      {sides}
    </>
  );
}

function Face({ c }) {
  const browColor = '#4a3b32';
  const scale =
    c.face === 'oval'
      ? 'translate(100 49.4) scale(0.86 1.1) translate(-100 -49.4)'
      : c.face === 'square'
        ? 'translate(100 49.4) scale(1.12 0.95) translate(-100 -49.4)'
        : '';

  const eyes =
    c.eyes === 'happy' ? (
      <>
        <path d="M 83 50 A 5.5 5.5 0 0 1 94 50" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 106 50 A 5.5 5.5 0 0 1 117 50" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    ) : c.eyes === 'sleepy' ? (
      <>
        <line x1="84" y1="48.5" x2="93" y2="48.5" stroke="#1a1f2c" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="107" y1="48.5" x2="116" y2="48.5" stroke="#1a1f2c" strokeWidth="2.6" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="88.3" cy="48" r="4.2" fill="#1a1f2c" />
        <circle cx="111.7" cy="48" r="4.2" fill="#1a1f2c" />
      </>
    );

  const brows =
    c.brows === 'angry' ? (
      <>
        <line x1="85" y1="39" x2="93" y2="43" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="115" y1="39" x2="107" y2="43" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" />
      </>
    ) : c.brows === 'straight' ? (
      <>
        <line x1="85" y1="41" x2="93" y2="41" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" />
        <line x1="107" y1="41" x2="115" y2="41" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M 85 42 Q 89 39 93 42" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M 107 42 Q 111 39 115 42" stroke={browColor} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </>
    );

  const mouth =
    c.mouth === 'open' ? (
      <ellipse cx="100" cy="61" rx="6" ry="8" fill="#8c4a3f" />
    ) : c.mouth === 'neutral' ? (
      <line x1="92" y1="62" x2="108" y2="62" stroke="#b3524a" strokeWidth="2.6" strokeLinecap="round" />
    ) : (
      <path d="M 91 62 A 9 9 0 0 0 109 62" stroke="#b3524a" strokeWidth="3" strokeLinecap="round" fill="none" />
    );

  return (
    <g transform={scale}>
      {c.hairStyle === 'long' && (
        <>
          <rect x="60" y="38" width="22" height="72" rx="12" fill={c.hairColor} />
          <rect x="118" y="38" width="22" height="72" rx="12" fill={c.hairColor} />
        </>
      )}
      <circle cx="70.6" cy="49.4" r="6" fill={c.skin} />
      <circle cx="129.4" cy="49.4" r="6" fill={c.skin} />
      <circle cx="100" cy="49.4" r="30" fill={c.skin} />
      {eyes}
      {brows}
      {mouth}
      <Hair style={c.hairStyle} color={c.hairColor} />
      {c.flower && (
        <>
          <circle cx="121" cy="11" r="6.5" fill="#F9A8D4" />
          <circle cx="121" cy="11" r="3.2" fill="#FDE68A" />
        </>
      )}
      {c.glasses && (
        <>
          <circle cx="88.3" cy="48" r="6.5" stroke="#2b2b2b" strokeWidth="2.4" fill="rgba(0,0,0,0.05)" />
          <circle cx="111.7" cy="48" r="6.5" stroke="#2b2b2b" strokeWidth="2.4" fill="rgba(0,0,0,0.05)" />
          <line x1="94.8" y1="48" x2="105.2" y2="48" stroke="#2b2b2b" strokeWidth="2.4" />
          <line x1="81.8" y1="47" x2="76" y2="45" stroke="#2b2b2b" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="118.2" y1="47" x2="124" y2="45" stroke="#2b2b2b" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

export default function AvatarPortrait({ config, variant = 'full', className = '' }) {
  const [cfg, setCfg] = useState(config || DEFAULT_AVATAR);

  useEffect(() => {
    setCfg(config || loadAvatarConfig());
  }, [config]);

  // Listen to global avatar-saved events so instances update immediately across the app
  useEffect(() => {
    const handler = () => {
      try {
        setCfg(loadAvatarConfig());
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('safetyLoveAvatarSaved', handler);
    return () => window.removeEventListener('safetyLoveAvatarSaved', handler);
  }, []);

  const c = config || cfg;
  const viewBox = variant === 'head' ? '0 10 200 190' : '0 0 200 260';

  return (
    <svg viewBox={viewBox} className={className} aria-label="Avatar" role="img">
      <ellipse cx="100" cy="252" rx="42" ry="5" fill="rgba(0,0,0,0.10)" />

      {c.backpack && <rect x="76" y="88" width="48" height="50" rx="14" fill="#60A5FA" />}

      {c.pantsStyle === 'skirt' ? (
        <>
          <rect x="77" y="139" width="16" height="100" rx="7" fill={c.skin} />
          <rect x="107" y="139" width="16" height="100" rx="7" fill={c.skin} />
        </>
      ) : c.pantsStyle === 'shorts' ? (
        <>
          <rect x="77" y="138" width="16" height="57" rx="7" fill={c.pantsColor} />
          <rect x="107" y="138" width="16" height="57" rx="7" fill={c.pantsColor} />
          <rect x="79" y="193" width="14" height="46" rx="7" fill={c.skin} />
          <rect x="107" y="193" width="14" height="46" rx="7" fill={c.skin} />
        </>
      ) : (
        <>
          <rect x="77" y="139" width="16" height="100" rx="7" fill={c.pantsColor} />
          <rect x="107" y="139" width="16" height="100" rx="7" fill={c.pantsColor} />
        </>
      )}

      <rect x="78" y="243" width="14" height="11" rx="4" fill={c.shoeColor} />
      <rect x="108" y="243" width="14" height="11" rx="4" fill={c.shoeColor} />

      <rect x="74" y="132" width="52" height="20" rx="10" fill={c.pantsStyle === 'skirt' ? c.skin : c.pantsColor} />

      {c.pantsStyle === 'skirt' && <path d="M 78 142 L 66 220 L 134 220 L 122 142 Z" fill={c.pantsColor} />}

      <rect x="80" y="62" width="40" height="94" rx="18" fill={c.shirtColor} />

      {c.shirtStyle === 'offshoulder' && (
        <>
          <rect x="78" y="68" width="44" height="6" rx="3" fill={c.shirtColor} />
          <circle cx="82" cy="68" r="3" fill={c.skin} />
          <circle cx="118" cy="68" r="3" fill={c.skin} />
        </>
      )}

      {c.shirtStyle === 'hoodie' && (
        <>
          <rect x="88" y="56" width="24" height="22" rx="11" fill={c.shirtColor} />
          <rect x="88" y="140" width="24" height="18" rx="8" fill="#FFFFFF" />
        </>
      )}

      {c.shirtStyle === 'jacket' && (
        <>
          <ellipse cx="100" cy="74" rx="18" ry="6" fill={c.shirtColor} opacity="0.9" />
          <path d="M 92 74 Q 88 90, 84 110" stroke={c.shirtColor} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 108 74 Q 112 88, 116 105" stroke={c.shirtColor} strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}

      {c.backpack && (
        <>
          <rect x="84" y="96" width="5" height="40" rx="2.5" fill="#93C5FD" />
          <rect x="111" y="96" width="5" height="40" rx="2.5" fill="#93C5FD" />
        </>
      )}

      <line x1="70" y1="112" x2="61" y2="139" stroke={c.shirtColor} strokeWidth="13" strokeLinecap="round" />
      <line x1="130" y1="112" x2="139" y2="139" stroke={c.shirtColor} strokeWidth="13" strokeLinecap="round" />

      <circle cx="60" cy="141" r="7" fill={c.skin} />
      <circle cx="140" cy="141" r="7" fill={c.skin} />

      {c.bracelets && (
        <>
          <circle cx="60" cy="137" r="8" stroke="#EC4899" strokeWidth="3" fill="none" />
          <circle cx="140" cy="137" r="8" stroke="#EC4899" strokeWidth="3" fill="none" />
        </>
      )}

      <rect x="94" y="64" width="12" height="14" rx="4" fill={c.skin} />

      {c.collar && <ellipse cx="100" cy="76" rx="15" ry="5" stroke="#F59E0B" strokeWidth="3.5" fill="none" />}

      <Face c={c} />
    </svg>
  );
}
