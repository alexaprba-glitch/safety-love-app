import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function AnimatedChicken() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ left: '50%', top: '70%' });

  useEffect(() => {
    let hideTimer = null;

    const showAt = (x, y) => {
      // place with slight offset so it looks above the clicked element
      setPos({ left: `${x}px`, top: `${Math.max(60, y - 40)}px` });
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 1500);
    };

    const onCustom = (e) => {
      const detail = (e && e.detail) || {};
      if (detail && typeof detail.x === 'number' && typeof detail.y === 'number') {
        showAt(detail.x, detail.y);
      } else {
        // center-bottom fallback
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight * 0.78;
        showAt(cx, cy);
      }
    };

    const onDocClick = (e) => {
      try {
        const el = e.target;
        // find a button or element with text 'Alimentar' (span, p, button, etc.)
        const btn = el.closest && el.closest('button,div,a');
        const text = (btn && btn.textContent) || el.textContent || '';
        if (text && text.trim().toLowerCase().includes('aliment')) {
          const rect = (btn && btn.getBoundingClientRect && btn.getBoundingClientRect());
          const x = rect ? (rect.left + rect.width / 2) : e.clientX;
          const y = rect ? rect.top : e.clientY;
          showAt(x, y);
        }
      } catch (err) {
        onCustom({ detail: null });
      }
    };

    window.addEventListener('safetyLove:feed', onCustom);
    document.addEventListener('click', onDocClick);

    return () => {
      window.removeEventListener('safetyLove:feed', onCustom);
      document.removeEventListener('click', onDocClick);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div aria-hidden className={`pointer-events-none fixed z-[9999] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}>
      <div className="w-28 h-28 flex items-center justify-center rounded-full bg-white/90 shadow-xl animate-bounce" style={{ padding: 8 }}>
        {/* Simple chicken SVG */}
        <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#FFF4E6" />
          <path d="M22 36c0-6 6-14 14-14s14 8 14 14c0 6-6 10-14 10S22 42 22 36z" fill="#FFD166" />
          <circle cx="28" cy="30" r="3" fill="#1F2937" />
          <circle cx="36" cy="30" r="3" fill="#1F2937" />
          <path d="M34 36c0 1.8-1.1 3-2.5 3S29 37.8 29 36" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 28c2-1 4-3 6-2" stroke="#FF6B6B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 40c-3 0-4 3-4 3s2 1 5 1" stroke="#E76F51" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
    , document.body
  );
}
