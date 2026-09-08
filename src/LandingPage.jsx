import React, { useState, useEffect, useRef } from 'react';
import { Heart, ArrowRight, Menu, X, Shield, Star, MessageCircle, BookOpen, Brain, Gamepad2, Calendar, Bell, Sparkles, Users, Eye, TrendingUp, PenLine, Check, BookHeart, Handshake, Lightbulb, Quote, Globe, Pen, Moon, Sun } from 'lucide-react';
import SafetyMascot from './SafetyMascot';

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, className = '', delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const NAV_LINKS = [
  { label: 'Inicio', id: 'hero' },
  { label: 'Cómo funciona', id: 'como-funciona' },
  { label: 'Funciones', id: 'funciones' },
];

const STEPS = [
  { icon: PenLine, title: 'Registra', desc: 'Escribe cómo te sientes cada día de forma rápida y sencilla.' },
  { icon: Eye, title: 'Comprende', desc: 'Descubre patrones emocionales y aprende sobre ti.' },
  { icon: Users, title: 'Conecta', desc: 'Comparte anónimamente y apóyate de una comunidad que te entiende.' },
  { icon: TrendingUp, title: 'Crece', desc: 'Desarrolla hábitos saludables y mejora tus relaciones.' },
];

const FUNCIONES = [
  { icon: BookOpen, title: 'Diario personal', desc: 'Escribe, desahógate y descubre lo que realmente sientes.', color: '#FFF0F6', iconColor: '#FF3F83' },
  { icon: Brain, title: 'Chat con IA', desc: 'Pregunta, reflexiona y recibe apoyo cuando lo necesites.', color: '#F3E8FF', iconColor: '#9333EA' },
  { icon: Handshake, title: 'Relaciones', desc: 'Aprende a comunicarte mejor, pon límites y construye vínculos más sanos.', color: '#ECFDF5', iconColor: '#10B981' },
  { icon: Quote, title: 'Testimonios', desc: 'Historias reales que te inspirarán y te harán sentir menos solo/a.', color: '#FFF7ED', iconColor: '#F59E0B' },
  { icon: Gamepad2, title: 'Herramientas extra', desc: 'Retos, recordatorios y más para que tu bienestar sea una prioridad.', color: '#F0F9FF', iconColor: '#3B82F6' },
];

const TESTIMONIOS = [
  { name: 'Valeria M.', text: 'Safety Love me ayudó a entender mejor lo que sentía y a ver las cosas desde otra perspectiva. Es mi espacio seguro.', avatar: 'V', color: '#FF3F83', stars: 5 },
  { name: 'Andrés R.', text: 'La IA de la app es increíble, siempre sabe decir lo que necesito escuchar en el momento justo.', avatar: 'A', color: '#9333EA', stars: 5 },
  { name: 'Camila S.', text: 'He aprendido a poner límites y a tener relaciones más sanas. Me siento en paz conmigo misma.', avatar: 'C', color: '#10B981', stars: 5 },
];

const BENEFICIOS = [
  { icon: Heart, text: 'Comprende mejor tus emociones' },
  { icon: Sparkles, text: 'Recibe apoyo con IA' },
  { icon: Handshake, text: 'Mejora tus relaciones' },
  { icon: TrendingUp, text: 'Construye hábitos positivos' },
  { icon: Shield, text: 'Espacio seguro y privado' },
];

export default function LandingPage({ onEnterApp }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('safetyLoveLandingDark') === 'true'; } catch { return false; }
  });
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('safetyLoveLandingDark', darkMode); } catch {}
  }, [darkMode]);

  const scrollTo = (id) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-['Inter',sans-serif] overflow-x-hidden" style={{ background: darkMode ? '#060B18' : '#FFFFFF', color: darkMode ? '#F8FAFC' : '#0F172A' }}>

      <style>{`
        .ll { transition: color 200ms ease; }
        .ll:hover { color: #FF3F83 !important; }
        .fc:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(255,63,131,0.08); }
        .fc { transition: all 300ms cubic-bezier(0.22,1,0.36,1); }
        @keyframes lf { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .f1 { animation: lf 6s ease-in-out infinite; }
        .f2 { animation: lf 6s ease-in-out infinite 1.2s; }
        .f3 { animation: lf 6s ease-in-out infinite 2.4s; }
        .f4 { animation: lf 6s ease-in-out infinite 3.6s; }
        .f5 { animation: lf 6s ease-in-out infinite 0.6s; }
        @media (max-width: 1023px) { #hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300" style={{
        background: scrolled ? (darkMode ? 'rgba(6,11,24,0.88)' : 'rgba(255,255,255,0.88)') : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        borderBottom: scrolled ? (darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)') : '1px solid transparent',
      }}>
        <nav className="max-w-[1320px] mx-auto flex items-center h-[76px]" style={{ padding: '0 40px' }}>
          {/* LEFT — Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/logo.png" alt="SafetyLove" className="w-28 h-28 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-[26px] tracking-tight leading-tight" style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>Safety Love</span>
              <span className="text-[14px] font-medium leading-tight" style={{ color: '#94A3B8' }}>Tu bienestar emocional importa</span>
            </div>
          </a>

          {/* CENTER — Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1" style={{ gap: '36px' }}>
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="ll font-medium text-[14px]" style={{ color: darkMode ? '#CBD5E1' : '#64748B' }}>
                {l.label}
              </button>
            ))}
          </div>

          {/* RIGHT — Controls */}
          <div className="hidden lg:flex items-center shrink-0" style={{ gap: '16px' }}>
            <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200" style={{ color: darkMode ? '#CBD5E1' : '#64748B', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div style={{ width: '1px', height: '24px', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', flexShrink: 0 }} />
            <button onClick={() => onEnterApp?.('login')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                height: '48px', paddingLeft: '20px', paddingRight: '22px',
                borderRadius: '999px', cursor: 'pointer',
                background: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(139,92,246,0.18)',
                color: darkMode ? '#CBD5E1' : '#475569',
                fontWeight: 600, fontSize: '14px',
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.04)',
                transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.14)' : 'rgba(139,92,246,0.3)'; e.currentTarget.querySelector('.login-arrow').style.transform = 'translateX(3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = darkMode ? '0 1px 4px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = darkMode ? '1px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(139,92,246,0.18)'; e.currentTarget.querySelector('.login-arrow').style.transform = 'translateX(0)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            >
              <span style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#CBD5E1' : '#1E293B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              </span>
              Iniciar sesión
              <span className="login-arrow" style={{
                transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', alignItems: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#64748B' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </span>
            </button>
            <div style={{ width: '1px', height: '24px', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', flexShrink: 0 }} />
            <button onClick={() => onEnterApp?.('signup')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                height: '52px', paddingLeft: '26px', paddingRight: '26px',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ff4f9a, #f72575)',
                color: 'white', fontWeight: 700, fontSize: '14px',
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                letterSpacing: '-0.01em',
                boxShadow: '0 2px 16px rgba(247,37,117,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
                transition: 'all 220ms cubic-bezier(0.4,0,0.2,1)',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(247,37,117,0.35), inset 0 1px 0 rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.querySelector('.crea-arrow').style.transform = 'translateX(3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(247,37,117,0.25), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.querySelector('.crea-arrow').style.transform = 'translateX(0)'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            >
              <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)', borderRadius: '999px 999px 0 0', pointerEvents: 'none' }} />
              Crear cuenta
              <span className="crea-arrow" style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200" style={{ color: darkMode ? '#CBD5E1' : '#64748B', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition" style={{ color: darkMode ? '#CBD5E1' : '#64748B' }} aria-label="Menú">
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {mobileMenu && (
          <div className="lg:hidden border-t px-6 py-6 space-y-3 shadow-lg" style={{ background: darkMode ? '#111A2E' : '#FFFFFF', borderColor: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }}>
            {NAV_LINKS.map((l, i) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-[15px] font-medium py-2.5 transition" style={{ color: darkMode ? '#CBD5E1' : '#475569' }}>
                {l.label}
              </button>
            ))}
            <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }}>
              <button onClick={() => { setMobileMenu(false); onEnterApp?.('login'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', height: '48px', padding: '0 24px',
                  borderRadius: '999px', cursor: 'pointer',
                  background: darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(139,92,246,0.18)',
                  color: darkMode ? '#CBD5E1' : '#475569',
                  fontWeight: 600, fontSize: '14px',
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                  boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.15)' : '0 1px 6px rgba(0,0,0,0.04)',
                }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: darkMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#A78BFA' : '#7C3AED'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </span>
                Iniciar sesión
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#64748B' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button onClick={() => { setMobileMenu(false); onEnterApp?.('signup'); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', height: '48px', padding: '0 24px',
                  borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ff4f9a, #f72575)',
                  color: 'white', fontWeight: 700, fontSize: '14px',
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                  boxShadow: '0 2px 16px rgba(247,37,117,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
                  position: 'relative', overflow: 'hidden',
                }}>
                <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)', borderRadius: '999px 999px 0 0', pointerEvents: 'none' }} />
                Crear cuenta
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════ */}
        <section id="hero" style={{ position: 'relative', overflow: 'hidden', background: darkMode ? 'linear-gradient(180deg, #060B18 0%, #0A1020 50%, #0E1528 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #FFFCFE 50%, #FFF8FB 100%)', paddingTop: '130px', paddingBottom: '80px', minHeight: '700px' }}>

          {/* Pink halo behind dashboard */}
          <div style={{ position: 'absolute', top: '15%', right: '8%', width: '600px', height: '600px', borderRadius: '50%', opacity: 0.15, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,63,131,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', opacity: 0.06, pointerEvents: 'none', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
          {/* Decorative dots */}
          <div style={{ position: 'absolute', top: '18%', right: '20%', width: '8px', height: '8px', borderRadius: '50%', opacity: darkMode ? 0.15 : 0.25, pointerEvents: 'none', background: '#FF3F83' }} />
          <div style={{ position: 'absolute', top: '28%', right: '16%', width: '6px', height: '6px', borderRadius: '50%', opacity: darkMode ? 0.12 : 0.20, pointerEvents: 'none', background: '#FF3F83' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '12%', width: '6px', height: '6px', borderRadius: '50%', opacity: darkMode ? 0.12 : 0.20, pointerEvents: 'none', background: '#A78BFA' }} />

          <div style={{ margin: '0 auto', width: '100%', maxWidth: '1400px', paddingLeft: '64px', paddingRight: '64px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '0.45fr 0.55fr', gap: '64px', alignItems: 'center', minHeight: '520px' }}>

              {/* ─── Left Column ─── */}
              <div style={{ textAlign: 'left' }}>
                {/* Title */}
                <FadeIn delay={80}>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: 'clamp(42px, 5vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em', color: darkMode ? '#F8FAFC' : '#0F172A', marginBottom: '30px', maxWidth: '540px' }}>
                    Un espacio<br />seguro<br />
                    <span style={{ color: '#FF3F83' }}>para ser tú.</span>
                  </h1>
                </FadeIn>

                {/* Description */}
                <FadeIn delay={160}>
                  <p style={{ color: darkMode ? '#94A3B8' : '#64748B', fontSize: '18px', lineHeight: 1.65, maxWidth: '540px', marginBottom: '32px' }}>
                    Safety Love es tu compañera en el camino hacia una mejor versión de ti. Aquí podrás expresar lo que sientes, recibir apoyo emocional, organizar tu vida y construir relaciones más sanas.
                  </p>
                </FadeIn>

                {/* Buttons */}
                <FadeIn delay={240}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {/* Primary — Comenzar ahora */}
                    <button onClick={() => onEnterApp?.()} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      fontWeight: 600, color: 'white', fontSize: '16px',
                      background: 'linear-gradient(135deg, #FF3F83 0%, #FF6FA3 100%)',
                      height: '58px', paddingLeft: '12px', paddingRight: '32px',
                      borderRadius: '999px', border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,63,131,0.30), 0 1px 3px rgba(255,63,131,0.15)',
                      transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,63,131,0.40), 0 2px 6px rgba(255,63,131,0.18)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,63,131,0.30), 0 1px 3px rgba(255,63,131,0.15)'; }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)'; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    >
                      <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Heart size={15} color="white" fill="white" />
                      </span>
                      Comenzar ahora
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </FadeIn>

                {/* Social Proof */}
                <FadeIn delay={320}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '-8px' }}>
                      {['#FF3F83','#A78BFA','#38BDF8','#34D399','#F59E0B'].map((c,i) => (
                        <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, background: c, border: darkMode ? '2px solid #060B18' : '2px solid white', zIndex: 5-i, fontSize: '10px', marginLeft: i > 0 ? '-8px' : 0 }}>
                          {['M','L','A','S','V'][i]}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#FF3F83', fontSize: '13px' }}>+9K</span>
                      <span style={{ fontWeight: 500, color: '#94A3B8', fontSize: '13px' }}>Más de <strong style={{ color: darkMode ? '#CBD5E1' : '#475569' }}>10,000 personas</strong><br />ya confían en Safety Love</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* ─── Right Column — Phone Mockup + Floating Cards ─── */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <FadeIn delay={200}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '560px', height: '720px' }}>

                    {/* ─── Phone Frame ─── */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '320px',
                      height: '650px',
                      background: '#1A1A2E',
                      borderRadius: '48px',
                      boxShadow: '0 40px 120px rgba(15,23,42,0.25), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
                      zIndex: 10,
                      overflow: 'hidden',
                    }}>
                      {/* Side buttons */}
                      <div style={{ position: 'absolute', left: '-2px', top: '140px', width: '3px', height: '40px', background: '#2A2A3E', borderRadius: '2px 0 0 2px' }} />
                      <div style={{ position: 'absolute', left: '-2px', top: '200px', width: '3px', height: '70px', background: '#2A2A3E', borderRadius: '2px 0 0 2px' }} />

                      {/* Screen */}
                      <div style={{
                        position: 'absolute',
                        inset: '8px',
                        borderRadius: '40px',
                        overflow: 'hidden',
                        background: darkMode ? '#111A2E' : '#F5F0E8',
                      }}>
                        {/* Status bar */}
                        <div style={{
                          height: '48px',
                          background: darkMode ? 'linear-gradient(180deg, #1A1A2E 0%, #111A2E 100%)' : 'linear-gradient(180deg, #F5F0E8 0%, #F5F0E8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}>
                          {/* Notch */}
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '28px',
                            background: '#1A1A2E',
                            borderRadius: '0 0 20px 20px',
                          }}>
                            {/* Camera */}
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '18px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#2A2A3E',
                              border: '2px solid #1A1A2E',
                            }} />
                          </div>
                        </div>

                        {/* App Content — Blog Anónimo Mobile */}
                        <div style={{ height: 'calc(100% - 48px)', overflow: 'hidden', background: darkMode ? '#0A1020' : '#F5F0E8' }}>
                          {/* Blog Header */}
                          <div style={{ padding: '14px 18px 10px', background: darkMode ? '#0A1020' : '#F5F0E8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FF3F83', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Globe size={12} color="white" />
                                </div>
                                <span style={{ fontWeight: 700, color: darkMode ? '#F8FAFC' : '#0F172A', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>Blog Anónimo</span>
                              </div>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: darkMode ? '#1A1A2E' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                <Pen size={12} color="#FF3F83" />
                              </div>
                            </div>
                            {/* Filter tabs */}
                            <div style={{ display: 'flex', gap: '6px', overflowX: 'hidden' }}>
                              {['Todos','Relaciones','Consejos','Superación'].map((f,i) => (
                                <div key={i} style={{
                                  padding: '5px 12px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap',
                                  background: i===0 ? '#FF3F83' : (darkMode ? '#1A1A2E' : '#FFFFFF'), color: i===0 ? '#FFFFFF' : '#64748B',
                                  border: i===0 ? 'none' : (darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'),
                                }}>{f}</div>
                              ))}
                            </div>
                          </div>

                          {/* Posts */}
                          <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Post 1 */}
                            <div style={{ background: darkMode ? '#1A1A2E' : '#FFFFFF', borderRadius: '14px', padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>CT</span>
                                </div>
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: '11px', color: darkMode ? '#F8FAFC' : '#0F172A', margin: 0 }}>Corazón Tranquilo</p>
                                  <p style={{ fontSize: '9px', color: '#94A3B8', margin: 0 }}>Hace 2 horas</p>
                                </div>
                              </div>
                              <p style={{ fontSize: '12px', color: darkMode ? '#CBD5E1' : '#334155', lineHeight: 1.5, margin: '0 0 10px', fontWeight: 500 }}>Me ayudó hablarle en voz alta</p>
                              <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5, margin: '0 0 10px' }}>Aunque me costó mucho abrirme, sentir que alguien podría escuchar sin juzgarme me devolvió un poco de paz.</p>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 600, background: darkMode ? 'rgba(255,63,131,0.15)' : '#FFF0F6', color: '#FF3F83' }}>Relaciones</span>
                                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 600, background: darkMode ? 'rgba(16,185,129,0.15)' : '#ECFDF5', color: '#10B981' }}>Apoyo</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9', paddingTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Heart size={12} color="#FF3F83" fill="#FF3F83" />
                                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#FF3F83' }}>24</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MessageCircle size={12} color="#94A3B8" />
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>2</span>
                                </div>
                              </div>
                            </div>

                            {/* Post 2 */}
                            <div style={{ background: darkMode ? '#1A1A2E' : '#FFFFFF', borderRadius: '14px', padding: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #C3B1E1, #9333EA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>LS</span>
                                </div>
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: '11px', color: darkMode ? '#F8FAFC' : '#0F172A', margin: 0 }}>Luna Serena</p>
                                  <p style={{ fontSize: '9px', color: '#94A3B8', margin: 0 }}>Hace 5 horas</p>
                                </div>
                              </div>
                              <p style={{ fontSize: '12px', color: darkMode ? '#CBD5E1' : '#334155', lineHeight: 1.5, margin: '0 0 10px', fontWeight: 500 }}>Aprendí a poner límites sin sentir culpa</p>
                              <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5, margin: '0 0 10px' }}>No es egoísmo poner un límite, es cuidarte. Hoy estoy intentándolo con más calma.</p>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 600, background: darkMode ? 'rgba(147,51,234,0.15)' : '#F3E8FF', color: '#9333EA' }}>Superación</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9', paddingTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Heart size={12} color="#94A3B8" />
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>18</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MessageCircle size={12} color="#94A3B8" />
                                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: '4px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.3)',
                        zIndex: 11,
                      }} />
                    </div>

                    {/* ─── Mascot — below phone ─── */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-30%)',
                      zIndex: 20,
                    }} className="hidden lg:block">
                      <SafetyMascot size="lg" mascotId="michi-menta" />
                    </div>

                    {/* Pink halo glow behind phone */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '380px',
                      height: '380px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,63,131,0.08) 0%, transparent 70%)',
                      zIndex: 5,
                      pointerEvents: 'none',
                    }} />

                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CÓMO FUNCIONA
        ════════════════════════════════════════════ */}
        <section id="como-funciona" style={{ background: darkMode ? 'linear-gradient(180deg, #0A1020 0%, #0E1528 100%)' : 'linear-gradient(180deg, #FAFBFE 0%, #FFF0F6 100%)', padding: '120px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {/* Header */}
            <FadeIn>
              <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF3F83', marginBottom: '16px' }}>Cómo funciona</p>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.15, marginBottom: '20px' }}>
                  <span style={{ color: darkMode ? '#F8FAFC' : '#111827' }}>Pequeños pasos,</span><br />
                  <span style={{ color: '#FF3B7A', position: 'relative', display: 'inline-block' }}>
                    grandes cambios.
                    <span style={{ position: 'absolute', top: '-10px', right: '-20px', fontSize: '18px', color: '#FF3B7A', opacity: 0.6 }}>✦</span>
                  </span>
                </h2>
                <p style={{ fontSize: '17px', lineHeight: 1.7, color: darkMode ? '#94A3B8' : '#64748B', maxWidth: '480px', margin: '0 auto' }}>
                  Un camino simple para tu bienestar emocional.<br />Estamos contigo en cada paso.
                </p>
              </div>
            </FadeIn>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {STEPS.map((s, i) => {
                const colors = [
                  { bg: darkMode ? 'rgba(255,63,131,0.18)' : '#FFE0EC', color: '#FF3B7A', bottom: Heart },
                  { bg: darkMode ? 'rgba(147,51,234,0.18)' : '#E8DEFF', color: '#9333EA', bottom: Brain },
                  { bg: darkMode ? 'rgba(16,185,129,0.18)' : '#D1FAE5', color: '#10B981', bottom: Heart },
                  { bg: darkMode ? 'rgba(245,158,11,0.18)' : '#FDE68A', color: '#F59E0B', bottom: Star },
                ];
                const c = colors[i];
                return (
                    <FadeIn key={i} delay={i * 100}>
                      <div style={{
                        background: darkMode ? '#111A2E' : '#FFFFFF', borderRadius: '24px',
                        padding: '40px 28px 32px',
                        border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                        boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)',
                        cursor: 'pointer', position: 'relative',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = darkMode ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#E2E8F0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'; }}
                      >
                        {/* Icon circle — overlapping top */}
                        <div style={{
                          width: '72px', height: '72px', borderRadius: '50%',
                          background: c.bg, border: `2px solid ${c.color}30`,
                          boxShadow: `0 4px 16px ${c.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginTop: '-60px', marginBottom: '24px', position: 'relative', zIndex: 2,
                        }}>
                          <s.icon size={30} style={{ color: c.color }} />
                        </div>

                        {/* Number badge */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '36px', height: '28px', borderRadius: '8px',
                          background: c.bg, marginBottom: '16px',
                        }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: c.color }}>0{i + 1}</span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontWeight: 700, fontSize: '18px', color: darkMode ? '#F8FAFC' : '#111827', marginBottom: '12px' }}>{s.title}</h3>

                        {/* Description */}
                        <p style={{ fontSize: '14px', lineHeight: 1.65, color: darkMode ? '#94A3B8' : '#64748B', margin: '0 0 24px', minHeight: '60px' }}>{s.desc}</p>

                        {/* Bottom icon */}
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '12px',
                          background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <c.bottom size={18} style={{ color: c.color }} />
                        </div>
                      </div>
                    </FadeIn>
                );
              })}
            </div>
          </div>

          <style>{`
            @media (max-width: 1024px) {
              #como-funciona .mascot-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 640px) {
              #como-funciona .mascot-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* ════════════════════════════════════════════
            TU BIENESTAR
        ════════════════════════════════════════════ */}
        <section style={{ background: darkMode ? '#060B18' : '#FFFFFF', padding: '120px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

              {/* Mascot Column */}
              <FadeIn>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      borderRadius: '32px', padding: '48px 40px',
                      background: darkMode ? 'linear-gradient(135deg, rgba(255,63,131,0.1) 0%, rgba(245,240,255,0.08) 50%, rgba(236,253,245,0.08) 100%)' : 'linear-gradient(135deg, #FFF0F6 0%, #F5F0FF 50%, #ECFDF5 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', minHeight: '360px',
                    }}>
                      {/* Decorative elements */}
                      <div style={{ position: 'absolute', top: '24px', left: '28px', fontSize: '20px', opacity: 0.4 }}>♡</div>
                      <div style={{ position: 'absolute', bottom: '28px', right: '24px', fontSize: '18px', opacity: 0.3 }}>✦</div>
                      <div style={{ position: 'absolute', top: '40%', left: '12px', fontSize: '14px', opacity: 0.25 }}>♡</div>
                      <SafetyMascot size={240} mascotId="michi-menta" />
                    </div>
                    {/* Badge */}
                    <div style={{
                      position: 'absolute', top: '-14px', right: '-14px',
                      background: darkMode ? '#111A2E' : '#FFFFFF', borderRadius: '16px', padding: '10px 18px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <img src="/logo.png" alt="SafetyLove" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                      <span style={{ fontWeight: 700, fontSize: '13px', color: darkMode ? '#F8FAFC' : '#0F172A' }}>Safety Love</span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Text Column */}
              <FadeIn delay={100}>
                <div>
                  <h2 style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
                    fontSize: 'clamp(32px, 3.5vw, 44px)', lineHeight: 1.15,
                    marginBottom: '24px',
                  }}>
                    <span style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>Tu </span>
                    <span style={{ color: '#FF3F83' }}>bienestar</span>
                    <span style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}> es una prioridad.</span>
                  </h2>
                  <p style={{ fontSize: '17px', lineHeight: 1.7, color: darkMode ? '#94A3B8' : '#64748B', marginBottom: '40px', maxWidth: '440px' }}>
                    No tienes que hacerlo solo/a.<br />En Safety Love estamos para ti, siempre.
                  </p>

                  {/* Benefits List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { icon: Heart, text: 'Comprende mejor tus emociones', bg: darkMode ? 'rgba(255,63,131,0.12)' : '#FFF0F6', color: '#FF3F83' },
                      { icon: Sparkles, text: 'Recibe apoyo con IA', bg: darkMode ? 'rgba(147,51,234,0.12)' : '#F3E8FF', color: '#9333EA' },
                      { icon: Handshake, text: 'Mejora tus relaciones', bg: darkMode ? 'rgba(16,185,129,0.12)' : '#ECFDF5', color: '#10B981' },
                      { icon: TrendingUp, text: 'Construye hábitos positivos', bg: darkMode ? 'rgba(245,158,11,0.12)' : '#FFF7ED', color: '#F59E0B' },
                    ].map((b, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '16px 20px', borderRadius: '16px',
                        background: darkMode ? '#111A2E' : '#FAFBFE', border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                        transition: 'all 0.2s',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? '#1A2040' : '#F5F0FF'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#E9D5FF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = darkMode ? '#111A2E' : '#FAFBFE'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'; }}
                      >
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <b.icon size={18} style={{ color: b.color }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: darkMode ? '#CBD5E1' : '#334155' }}>{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) {
              #como-funciona + section + section > div > div { grid-template-columns: 1fr !important; gap: 48px !important; }
            }
          `}</style>
        </section>

        {/* ════════════════════════════════════════════
            FUNCIONES
        ════════════════════════════════════════════ */}
        <section id="funciones" style={{ background: darkMode ? 'linear-gradient(180deg, #0E1528 0%, #060B18 100%)' : 'linear-gradient(180deg, #FFF0F6 0%, #FFFCFE 100%)', padding: '120px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {/* Title */}
            <FadeIn>
              <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF3F83', marginBottom: '16px' }}>Funciones</p>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1.15, color: darkMode ? '#F8FAFC' : '#0F172A', marginBottom: '8px' }}>
                  Todo lo que necesitas,<br />
                  <span style={{ color: '#FF3F83', position: 'relative', display: 'inline-block' }}>
                    en un solo lugar.
                    <span style={{ position: 'absolute', top: '-8px', right: '-24px', fontSize: '16px', color: '#FF3F83', opacity: 0.7 }}>✦</span>
                  </span>
                </h2>
              </div>
            </FadeIn>

            {/* Cards Grid — 3 + 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
              {FUNCIONES.slice(0, 3).map((f, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div style={{
                    background: darkMode ? '#111A2E' : '#FFFFFF', borderRadius: '24px', padding: '32px 28px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                    boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)',
                    cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    position: 'relative', overflow: 'hidden',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = darkMode ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#E2E8F0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: darkMode ? `${f.iconColor}18` : f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <f.icon size={24} style={{ color: f.iconColor }} />
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: darkMode ? `${f.iconColor}18` : f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s' }}>
                        <ArrowRight size={16} style={{ color: f.iconColor, transition: 'transform 0.25s' }} />
                      </div>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '17px', color: darkMode ? '#F8FAFC' : '#0F172A', marginBottom: '10px' }}>{f.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.65, color: darkMode ? '#94A3B8' : '#64748B', margin: 0 }}>{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '820px', margin: '0 auto' }}>
              {FUNCIONES.slice(3, 5).map((f, i) => (
                <FadeIn key={i} delay={(i + 3) * 80}>
                  <div style={{
                    background: darkMode ? '#111A2E' : '#FFFFFF', borderRadius: '24px', padding: '32px 28px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9',
                    boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)',
                    cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = darkMode ? '0 12px 32px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.12)' : '#E2E8F0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = darkMode ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: darkMode ? `${f.iconColor}18` : f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <f.icon size={24} style={{ color: f.iconColor }} />
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: darkMode ? `${f.iconColor}18` : f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={16} style={{ color: f.iconColor }} />
                      </div>
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '17px', color: darkMode ? '#F8FAFC' : '#0F172A', marginBottom: '10px' }}>{f.title}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.65, color: darkMode ? '#94A3B8' : '#64748B', margin: 0 }}>{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <style>{`
            @media (max-width: 1024px) {
              #funciones > div > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 640px) {
              #funciones > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
              #funciones > div > div:nth-child(3) { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

      </main>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="safety-footer" style={{ background: darkMode ? '#0A1020' : '#FFFCFE', borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #EAECF0' }}>
        <div className="safety-footer-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 64px 24px' }}>
          <div className="safety-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '64px', marginBottom: '48px' }}>

            {/* Brand */}
            <div className="safety-footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="SafetyLove" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                <span style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#F8FAFC' : '#101828', fontFamily: "'Poppins', sans-serif" }}>Safety Love</span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#FF3F83', marginBottom: '8px' }}>Tu bienestar emocional importa.</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: darkMode ? '#94A3B8' : '#667085', maxWidth: '280px' }}>Tu compañera para comprender tus emociones, fortalecer tus relaciones y crecer cada día.</p>
            </div>

            {/* Navegación */}
            <div className="safety-footer-column">
              <p className="safety-footer-title" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: darkMode ? '#F8FAFC' : '#101828', marginBottom: '20px' }}>Navegación</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {NAV_LINKS.map(l => (
                  <button key={l.id} onClick={() => scrollTo(l.id)} className="safety-footer-link" style={{ fontSize: '14px', color: darkMode ? '#94A3B8' : '#667085', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF3F83'}
                    onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94A3B8' : '#667085'}
                  >{l.label}</button>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="safety-footer-column">
              <p className="safety-footer-title" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: darkMode ? '#F8FAFC' : '#101828', marginBottom: '20px' }}>Legal</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['Privacidad', 'Términos y condiciones', 'Política de cookies'].map(l => (
                  <button key={l} className="safety-footer-link" style={{ fontSize: '14px', color: darkMode ? '#94A3B8' : '#667085', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF3F83'}
                    onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94A3B8' : '#667085'}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Ayuda */}
            <div className="safety-footer-column">
              <p className="safety-footer-title" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: darkMode ? '#F8FAFC' : '#101828', marginBottom: '20px' }}>¿Necesitas ayuda?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['Contáctanos', 'Centro de ayuda', 'Soporte'].map(l => (
                  <button key={l} className="safety-footer-link" style={{ fontSize: '14px', color: darkMode ? '#94A3B8' : '#667085', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF3F83'}
                    onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94A3B8' : '#667085'}
                  >{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #EAECF0', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: darkMode ? '#94A3B8' : '#667085' }}>© 2026 Safety Love. Todos los derechos reservados.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={13} color="#FF3F83" fill="#FF3F83" />
              <span style={{ fontSize: '13px', color: darkMode ? '#94A3B8' : '#667085' }}>Hecho con amor para tu bienestar</span>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .safety-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
          }
          @media (max-width: 640px) {
            .safety-footer-container { padding: 40px 24px 20px !important; }
            .safety-footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </footer>
    </div>
  );
}
