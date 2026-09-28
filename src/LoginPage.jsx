import React, { useState, useEffect } from 'react';
import {
  Heart, Lock, User, Mail, Eye, EyeOff,
  ArrowRight, Check, Brain, BookOpen,
  ChevronRight, Search, AlertCircle, ArrowLeft
} from 'lucide-react';
import { signUp, signIn, getProfile } from './services/auth';
import { supabase } from './supabase';
import SafetyMascot from './SafetyMascot';
import SplashScreen from './SplashScreen';
import { toastError, toastSuccess } from './Toast';

const PINK = '#EC3B91';
const PINK_LIGHT = '#F9A8D4';
const PINK_BORDER = '#FBCFE8';
const PINK_BG = '#FFF5F9';
const GRAY_BORDER = '#E2E8F0';
const FONT = "'Poppins', 'Inter', sans-serif";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes phoneAppear { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
  @keyframes floatSlow { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.08); opacity: 0.25; } }
  @keyframes meshFloat { 0%,100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(15px, -20px) scale(1.05); } 66% { transform: translate(-10px, 10px) scale(0.97); } }
  @keyframes heartBeat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.12); } 30% { transform: scale(1); } 45% { transform: scale(1.06); } }
  @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px rgba(236,59,145,0.15), 0 0 60px rgba(236,59,145,0.05); } 50% { box-shadow: 0 0 30px rgba(236,59,145,0.25), 0 0 80px rgba(236,59,145,0.1); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes inputFocusGlow { from { box-shadow: 0 0 0 0 rgba(236,59,145,0); } to { box-shadow: 0 0 0 4px rgba(236,59,145,0.08); } }
  @keyframes buttonPress { 0% { transform: scale(1); } 50% { transform: scale(0.97); } 100% { transform: scale(1); } }
  .login-input { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
  .login-input:focus-within { border-color: ${PINK} !important; box-shadow: 0 0 0 4px rgba(236,59,145,0.08), 0 2px 8px rgba(236,59,145,0.06) !important; background: #FFFFFF !important; }
  .login-submit { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
  .login-submit:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(236,59,145,0.4), 0 0 0 0 rgba(236,59,145,0) !important; }
  .login-submit:active:not(:disabled) { transform: translateY(0px) scale(0.98) !important; }
  .login-google { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
  .login-google:hover { border-color: ${PINK} !important; background: ${PINK_BG} !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(236,59,145,0.08) !important; }
  .login-link { transition: all 0.2s ease !important; }
  .login-link:hover { color: #BE185D !important; }
  .login-back { transition: all 0.2s ease !important; }
  .login-back:hover { background: ${PINK_BG} !important; color: ${PINK} !important; }
`;

export default function LoginPage({ onLogin, onGoToLanding, isSignUp, onSignUp, onLoginRedirect }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focused, setFocused] = useState(null);
  const [role, setRole] = useState('user');
  const [showPsychSelection, setShowPsychSelection] = useState(false);
  const [selectedPsych, setSelectedPsych] = useState(null);
  const [psychSearch, setPsychSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [psychologists, setPsychologists] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeRole, setWelcomeRole] = useState(null);
  const [welcomePhase, setWelcomePhase] = useState(0);

  const validateEmail = (val) => {
    if (!val || !val.trim()) return 'El correo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Por favor ingresa un correo válido.';
    return '';
  };
  const validatePassword = (val) => {
    if (!val) return 'La contraseña es obligatoria.';
    if (val.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  };
  const validateFirstName = (val) => {
    if (!val || !val.trim()) return 'El nombre es obligatorio.';
    return '';
  };
  const validateLastName = (val) => {
    if (!val || !val.trim()) return 'El apellido es obligatorio.';
    return '';
  };
  const validateGrade = (val) => {
    if (!val) return 'Por favor selecciona tu grado.';
    return '';
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('profiles').select('id, name, email, avatar, specialty').in('role', ['psicologo', 'psychologist']);
      if (error) return;
      setPsychologists(data || []);
    })().catch(() => toastError('Error al cargar los psicólogos.'));
  }, [showPsychSelection]);

  useEffect(() => {
    if (!showWelcome) return;
    setWelcomePhase(1);
  }, [showWelcome]);

  const filteredPsychs = psychologists.filter(p =>
    (p.name || '').toLowerCase().includes(psychSearch.toLowerCase()) ||
    (p.specialty || '').toLowerCase().includes(psychSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    const errors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;

    if (isSignUp) {
      const fnErr = validateFirstName(firstName);
      const lnErr = validateLastName(lastName);
      if (fnErr) errors.firstName = fnErr;
      if (lnErr) errors.lastName = lnErr;
      if (role === 'user') {
        const grErr = validateGrade(grade);
        if (grErr) errors.grade = grErr;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(Object.values(errors)[0]);
      toastError(Object.values(errors)[0]);
      setLoading(false);
      return;
    }

    try {
      if (isSignUp && role === 'user') {
        localStorage.removeItem('loginStreakState');
        localStorage.removeItem('loginStreak');
        localStorage.removeItem('safetyLove_registeredDays');
        localStorage.removeItem('streak');
        localStorage.removeItem('safetyLove_pinLock');
        localStorage.removeItem('safetyLove_pin');
        setShowPsychSelection(true);
        setLoading(false);
        return;
      }
      if (isSignUp) {
        localStorage.removeItem('loginStreakState');
        localStorage.removeItem('loginStreak');
        localStorage.removeItem('safetyLove_registeredDays');
        localStorage.removeItem('streak');
        localStorage.removeItem('safetyLove_pinLock');
        localStorage.removeItem('safetyLove_pin');
        const fullName = `${firstName} ${lastName}`.trim();
        await signUp({ email, password, name: fullName || email.split('@')[0], role: role === 'psychologist' ? 'psicologo' : 'adolescente', grade: role === 'user' ? grade : undefined });
        if (onSignUp) onSignUp(role);
      } else {
        const data = await signIn({ email, password });
        const profile = await getProfile(data.user.id);
        const userRole = profile?.role === 'psicologo' ? 'psychologist' : 'user';
        setWelcomeRole(userRole);
        setShowWelcome(true);
      }
    } catch (err) {
      const msg = err?.message || '';
      let userMsg = '';
      if (msg.includes('already registered')) userMsg = 'Este correo ya está registrado. Intenta con otro.';
      else if (msg.includes('Invalid login')) userMsg = 'Correo o contraseña incorrectos. Verifica tus datos.';
      else if (msg.includes('Password should')) userMsg = 'La contraseña debe tener al menos 6 caracteres.';
      else if (msg.includes('network') || msg.includes('fetch')) userMsg = 'Error de conexión. Verifica tu internet.';
      else userMsg = 'Algo salió mal. Por favor intenta de nuevo.';
      setError(userMsg);
      toastError(userMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePsychSelect = async () => {
    if (!selectedPsych || !onSignUp) return;
    setError('');
    setLoading(true);
    try {
      localStorage.removeItem('loginStreakState');
      localStorage.removeItem('loginStreak');
      localStorage.removeItem('safetyLove_registeredDays');
      localStorage.removeItem('streak');
      localStorage.removeItem('safetyLove_pinLock');
      localStorage.removeItem('safetyLove_pin');
      const fullName = `${firstName} ${lastName}`.trim();
      await signUp({ email, password, name: fullName || email.split('@')[0], role: 'adolescente', psychologistId: selectedPsych.id, grade: grade || undefined });
      onSignUp(role, selectedPsych);
    } catch (err) {
      const msg = err?.message || '';
      let userMsg = '';
      if (msg.includes('already registered')) userMsg = 'Este correo ya está registrado.';
      else if (msg.includes('Password should')) userMsg = 'La contraseña debe tener al menos 6 caracteres.';
      else userMsg = 'No pudimos crear tu cuenta. Intenta de nuevo.';
      setError(userMsg);
      toastError(userMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ───────── Psych selection screen ───────── */
  if (showPsychSelection) {
    return (
      <div style={{
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px', fontFamily: FONT, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE8EE 30%, #FFF5F8 60%, #FFFBFD 100%)',
      }}>
        <style>{GLOBAL_STYLES}</style>
        {/* Mesh gradient blobs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,59,145,0.08) 0%, transparent 70%)', animation: 'meshFloat 12s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-8%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)', animation: 'meshFloat 15s ease-in-out infinite 3s', pointerEvents: 'none' }} />

        <div style={{
          width: '100%', maxWidth: '520px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
          borderRadius: '28px', boxShadow: '0 20px 60px rgba(236,59,145,0.08), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '1px solid rgba(236,59,145,0.06)', padding: 'clamp(28px,5vw,40px)',
          animation: 'phoneAppear 0.5s ease',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 16px',
              background: 'linear-gradient(145deg, #FDF2F8, #FCE7F3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(236,59,145,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '1px solid rgba(236,59,145,0.08)',
            }}>
              <Brain size={28} style={{ color: PINK }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Elige tu psicólogo</h1>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8', margin: 0 }}>Selecciona el profesional que mejor se adapte a ti.</p>
          </div>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', pointerEvents: 'none' }} />
            <input type="text" value={psychSearch} onChange={e => setPsychSearch(e.target.value)} placeholder="Buscar por nombre o especialidad..."
              className="login-input"
              style={{
                width: '100%', height: '48px', borderRadius: '14px',
                border: '1.5px solid #E2E8F0', padding: '0 18px 0 48px',
                fontSize: '14px', fontWeight: 500, color: '#1E293B',
                background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
              }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', maxHeight: '320px', overflowY: 'auto' }}>
            {filteredPsychs.length === 0 && <div style={{ textAlign: 'center', padding: '32px 20px', color: '#94A3B8', fontSize: '14px' }}>No hay psicólogos registrados aún.</div>}
            {filteredPsychs.map((p) => {
              const isSel = selectedPsych?.id === p.id;
              return (
                <button key={p.id} onClick={() => setSelectedPsych(p)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '16px',
                  border: isSel ? `2px solid ${PINK}` : '1.5px solid #E2E8F0',
                  background: isSel ? 'rgba(236,59,145,0.04)' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s ease',
                  backdropFilter: 'blur(8px)', fontFamily: FONT,
                }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSel ? `linear-gradient(135deg, ${PINK}, #EC4899)` : '#F1F5F9',
                    border: isSel ? 'none' : '1px solid #E2E8F0',
                    boxShadow: isSel ? '0 4px 12px rgba(236,59,145,0.2)' : 'none',
                  }}>
                    {p.avatar ? <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" /> : <span style={{ fontSize: '15px', fontWeight: 700, color: isSel ? '#fff' : '#94A3B8' }}>{(p.name || '?')[0].toUpperCase()}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || 'Sin nombre'}</p>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: isSel ? PINK : '#94A3B8', margin: '2px 0 0' }}>{p.specialty || 'Psicología general'}</p>
                  </div>
                  {isSel && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: PINK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(236,59,145,0.3)' }}><Check size={13} color="#fff" strokeWidth={3} /></div>}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowPsychSelection(false)} style={{
              flex: 1, height: '48px', borderRadius: '14px', border: '1.5px solid #E2E8F0',
              background: 'rgba(255,255,255,0.8)', color: '#64748B', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: FONT, backdropFilter: 'blur(8px)',
            }}>Volver</button>
            <button onClick={handlePsychSelect} disabled={!selectedPsych || loading} style={{
              flex: 1, height: '48px', borderRadius: '14px', border: 'none',
              background: selectedPsych && !loading ? `linear-gradient(135deg, ${PINK}, #D946A8)` : PINK_LIGHT,
              color: '#fff', fontSize: '14px', fontWeight: 700,
              cursor: selectedPsych && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: selectedPsych && !loading ? '0 4px 16px rgba(236,59,145,0.25)' : 'none',
              transition: 'all 0.25s ease', fontFamily: FONT,
            }}>
              {loading ? <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <>Continuar <ArrowRight size={16} strokeWidth={2.5} /></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ───────── Main login screen ───────── */
  return (
    <div style={{
      minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT, position: 'relative', overflow: 'hidden',
      padding: '40px 16px',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE8EE 25%, #FFF5F8 50%, #FFFBFD 75%, #FFFFFF 100%)',
    }}>
      <style>{GLOBAL_STYLES}</style>
      {/* ═══ SPLASH SCREEN — 4-PHASE ANIMATION SEQUENCE ═══ */}
      {showWelcome && (
        <SplashScreen onComplete={() => { if (onLogin && welcomeRole) onLogin(welcomeRole); }} duration={5000} />
      )}

      {/* ═══ MESH GRADIENT BACKGROUND ═══ */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,59,145,0.09) 0%, transparent 70%)', pointerEvents: 'none', animation: 'meshFloat 14s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-12%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)', pointerEvents: 'none', animation: 'meshFloat 18s ease-in-out infinite 4s' }} />
      <div style={{ position: 'absolute', top: '30%', right: '8%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,207,232,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'meshFloat 10s ease-in-out infinite 2s' }} />
      <div style={{ position: 'absolute', top: '55%', left: '3%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,59,145,0.05) 0%, transparent 70%)', pointerEvents: 'none', animation: 'meshFloat 12s ease-in-out infinite 1s' }} />

      {/* Floating hearts — soft bokeh */}
      {[
        { top: '8%', left: '6%', size: 28, delay: '0s', dur: '6s', op: 0.06 },
        { top: '15%', right: '10%', size: 18, delay: '1.2s', dur: '7s', op: 0.05 },
        { bottom: '20%', left: '10%', size: 22, delay: '0.8s', dur: '8s', op: 0.04 },
        { top: '55%', right: '5%', size: 14, delay: '2s', dur: '6.5s', op: 0.05 },
        { bottom: '12%', right: '18%', size: 20, delay: '0.5s', dur: '7.5s', op: 0.04 },
        { top: '38%', left: '2%', size: 12, delay: '3s', dur: '9s', op: 0.03 },
      ].map((h, i) => (
        <div key={i} style={{
          position: 'absolute', top: h.top, left: h.left, right: h.right, bottom: h.bottom,
          pointerEvents: 'none', animation: `float ${h.dur} ease-in-out infinite ${h.delay}`,
        }}>
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#EC3B91" opacity={h.op} />
          </svg>
        </div>
      ))}

      {/* Subtle curved lines */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '180px', pointerEvents: 'none', opacity: 0.035 }} viewBox="0 0 1440 180" fill="none">
        <path d="M0 110 Q 360 30, 720 90 T 1440 70" stroke="#EC3B91" strokeWidth="2" fill="none" />
        <path d="M0 145 Q 400 70, 800 125 T 1440 105" stroke="#EC3B91" strokeWidth="1.5" fill="none" />
      </svg>

      {/* ═══ PHONE CARD ═══ */}
      <div className="login-phone" style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: '32px',
        border: '1px solid rgba(236,59,145,0.08)',
        boxShadow: '0 20px 60px rgba(236,59,145,0.08), 0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
        animation: 'phoneAppear 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        {/* Notch */}
        <div style={{
          width: '120px', height: '28px', margin: '0 auto',
          background: '#F1F5F9', borderRadius: '0 0 16px 16px',
          position: 'relative', zIndex: 20,
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div style={{ width: '50px', height: '5px', borderRadius: '3px', background: '#CBD5E1', position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)' }} />
        </div>

        {/* Inner content */}
        <div style={{ padding: '28px 28px 32px' }}>

          {/* Back button */}
          {onGoToLanding && (
            <button onClick={onGoToLanding} className="login-back"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                color: '#94A3B8', fontSize: '12px', fontWeight: 500,
                padding: '6px 10px', borderRadius: '10px', marginBottom: '12px',
              }}>
              <ArrowLeft size={14} /> Volver
            </button>
          )}

          {/* ═══ HEADER ═══ */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            {/* Neumorphic floating heart */}
            <div style={{
              width: '140px', height: '140px', margin: '0 auto 18px',
              borderRadius: '32px',
              background: 'linear-gradient(145deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(236,59,145,0.15), 0 2px 8px rgba(236,59,145,0.08), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(236,59,145,0.05)',
              border: '1px solid rgba(236,59,145,0.1)',
              animation: 'heartBeat 3s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
              position: 'relative',
            }}>
              <img src="/logo.webp" alt="Safety Love" style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(236,59,145,0.3))' }} />
              {/* Subtle glow ring */}
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '26px',
                background: 'transparent',
                boxShadow: '0 0 20px rgba(236,59,145,0.1)',
                pointerEvents: 'none',
              }} />
            </div>

            <h1 style={{
              fontSize: '24px', fontWeight: 800, color: '#1E293B',
              margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '-0.02em',
            }}>
              {isSignUp ? '¡Bienvenido!' : 'Iniciar sesión'}
            </h1>
            <p style={{
              fontSize: '13px', fontWeight: 500, color: '#94A3B8',
              margin: 0, lineHeight: 1.5,
            }}>
              {isSignUp ? 'Crea tu cuenta para comenzar.' : 'Bienvenida de nuevo a Safety Love.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role selector (login & signup) */}
            {(
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { key: 'user', label: 'Estudiante', sub: 'Soy estudiante', icon: <User size={15} /> },
                    { key: 'psychologist', label: 'Psicólogo', sub: 'Soy profesional', icon: <span style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>Ψ</span> },
                  ].map(r => (
                    <button key={r.key} type="button" onClick={() => setRole(r.key)} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '12px 8px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.25s ease',
                      border: role === r.key ? `2px solid ${PINK}` : '1.5px solid #E2E8F0',
                      background: role === r.key ? 'rgba(236,59,145,0.04)' : 'rgba(255,255,255,0.6)',
                      height: '64px', backdropFilter: 'blur(8px)',
                      boxShadow: role === r.key ? '0 4px 12px rgba(236,59,145,0.08)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px', color: role === r.key ? PINK : '#A0AEC0' }}>
                        {r.icon}
                        <span style={{ fontWeight: 700, fontSize: '13px', color: role === r.key ? '#1E293B' : '#4A5568' }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: role === r.key ? PINK : '#A0AEC0', fontWeight: 500 }}>{r.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Signup name fields */}
            {isSignUp && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {[
                  { label: 'Nombres', key: 'firstName', value: firstName, setter: setFirstName, placeholder: 'Tu nombre' },
                  { label: 'Apellidos', key: 'lastName', value: lastName, setter: setLastName, placeholder: 'Tus apellidos' },
                ].map(({ label, key, value, setter, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>{label} <span style={{ color: PINK }}>*</span></label>
                    <div className="login-input" style={{
                      display: 'flex', alignItems: 'center', height: '44px', borderRadius: '14px',
                      border: fieldErrors[key] ? '1.5px solid #EF4444' : focused === key ? `1.5px solid ${PINK}` : '1.5px solid #E2E8F0',
                      padding: '0 12px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                      boxShadow: fieldErrors[key] ? '0 0 0 3px rgba(239,68,68,0.06)' : 'none',
                    }}>
                      <User size={14} style={{ color: fieldErrors[key] ? '#EF4444' : '#94A3B8', flexShrink: 0 }} />
                      <input type="text" value={value} onChange={e => { setter(e.target.value); if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: '' })); }}
                        onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                        placeholder={placeholder} required
                        style={{ flex: 1, height: '100%', marginLeft: '10px', fontSize: '13px', color: '#1E293B', background: 'transparent', outline: 'none', border: 'none', fontFamily: 'inherit' }} />
                    </div>
                    {fieldErrors[key] && <p style={{ fontSize: '10px', color: '#EF4444', margin: '3px 0 0', fontWeight: 500 }}>{fieldErrors[key]}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Grade (signup student) */}
            {isSignUp && role === 'user' && (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>Grado <span style={{ color: PINK }}>*</span></label>
                <div className="login-input" style={{
                  display: 'flex', alignItems: 'center', height: '44px', borderRadius: '14px',
                  border: fieldErrors.grade ? '1.5px solid #EF4444' : focused === 'grade' ? `1.5px solid ${PINK}` : '1.5px solid #E2E8F0',
                  padding: '0 12px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                  boxShadow: fieldErrors.grade ? '0 0 0 3px rgba(239,68,68,0.06)' : 'none',
                }}>
                  <BookOpen size={14} style={{ color: fieldErrors.grade ? '#EF4444' : '#94A3B8', flexShrink: 0 }} />
                  <select value={grade} onChange={e => { setGrade(e.target.value); if (fieldErrors.grade) setFieldErrors(prev => ({ ...prev, grade: '' })); }}
                    onFocus={() => setFocused('grade')} onBlur={() => setFocused(null)} required
                    style={{ flex: 1, height: '100%', marginLeft: '10px', fontSize: '13px', color: grade ? '#1E293B' : '#94A3B8', background: 'transparent', outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', border: 'none' }}>
                    <option value="" disabled>Selecciona tu grado</option>
                    <option value="6">6° Primaria</option>
                    <option value="7">7° Secundaria</option>
                    <option value="8">8° Secundaria</option>
                    <option value="9">9° Secundaria</option>
                    <option value="10">10° Bachillerato</option>
                    <option value="11">11° Bachillerato</option>
                  </select>
                  <ChevronRight size={14} style={{ color: '#94A3B8', flexShrink: 0, transform: 'rotate(90deg)' }} />
                </div>
                {fieldErrors.grade && <p style={{ fontSize: '10px', color: '#EF4444', margin: '3px 0 0', fontWeight: 500 }}>{fieldErrors.grade}</p>}
              </div>
            )}

            {/* ═══ EMAIL ═══ */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Correo electrónico <span style={{ color: PINK }}>*</span>
              </label>
              <div className="login-input" style={{
                display: 'flex', alignItems: 'center', height: '50px', borderRadius: '16px',
                border: fieldErrors.email ? '1.5px solid #EF4444' : focused === 'email' ? `1.5px solid ${PINK}` : '1.5px solid #E2E8F0',
                padding: '0 16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                boxShadow: fieldErrors.email ? '0 0 0 3px rgba(239,68,68,0.06)' : 'none',
              }}>
                <Mail size={17} style={{ color: fieldErrors.email ? '#EF4444' : '#94A3B8', flexShrink: 0 }} />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' })); }}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  placeholder="tu@correo.com" required
                  style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '14px', color: '#1E293B', background: 'transparent', outline: 'none', border: 'none', fontFamily: 'inherit' }} />
              </div>
              {fieldErrors.email && <p style={{ fontSize: '10px', color: '#EF4444', margin: '3px 0 0', fontWeight: 500 }}>{fieldErrors.email}</p>}
            </div>

            {/* ═══ PASSWORD ═══ */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Contraseña <span style={{ color: PINK }}>*</span>
              </label>
              <div className="login-input" style={{
                display: 'flex', alignItems: 'center', height: '50px', borderRadius: '16px',
                border: fieldErrors.password ? '1.5px solid #EF4444' : focused === 'password' ? `1.5px solid ${PINK}` : '1.5px solid #E2E8F0',
                padding: '0 16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                boxShadow: fieldErrors.password ? '0 0 0 3px rgba(239,68,68,0.06)' : 'none',
              }}>
                <Lock size={17} style={{ color: fieldErrors.password ? '#EF4444' : '#94A3B8', flexShrink: 0 }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' })); }}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  placeholder="Tu contraseña" required
                  style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '14px', color: '#1E293B', background: 'transparent', outline: 'none', border: 'none', fontFamily: 'inherit' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', borderRadius: '8px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = PINK}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && <p style={{ fontSize: '10px', color: '#EF4444', margin: '3px 0 0', fontWeight: 500 }}>{fieldErrors.password}</p>}
            </div>

            {/* Forgot password */}
            {!isSignUp && (
              <div style={{ textAlign: 'right', marginBottom: '22px' }}>
                <button type="button" className="login-link" style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 600, color: PINK, cursor: 'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '14px',
                borderRadius: '14px', background: 'rgba(254,242,242,0.8)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(254,202,202,0.5)',
                animation: 'phoneAppear 0.3s ease',
              }}>
                <AlertCircle size={15} style={{ color: '#EF4444', flexShrink: 0 }} />
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* ═══ SUBMIT BUTTON ═══ */}
            <button type="submit" disabled={loading} className="login-submit"
              style={{
                width: '100%', height: '52px', borderRadius: '16px', border: 'none',
                background: loading ? PINK_LIGHT : `linear-gradient(135deg, #EC3B91 0%, #D946A8 50%, #C026D3 100%)`,
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(236,59,145,0.3), 0 0 0 0 rgba(236,59,145,0)',
                fontFamily: 'inherit', letterSpacing: '0.01em',
                position: 'relative', overflow: 'hidden',
              }}>
              {/* Shimmer overlay */}
              {!loading && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                  <ArrowRight size={18} strokeWidth={2.5} />
                </span>
              )}
            </button>

            {/* ═══ DIVIDER + GOOGLE ═══ */}
            {!isSignUp && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)' }} />
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>o</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)' }} />
                </div>
                <button type="button" className="login-google"
                  style={{
                    width: '100%', height: '48px', borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                    color: '#334155', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    fontFamily: 'inherit',
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>
              </>
            )}

            {/* Create / Login link */}
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '22px', marginBottom: 0 }}>
              {isSignUp ? (
                <>¿Ya tienes una cuenta?{' '}<button onClick={onLoginRedirect} className="login-link" style={{ background: 'none', border: 'none', fontWeight: 700, color: PINK, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' }}>Inicia sesión</button></>
              ) : (
                <>¿No tienes una cuenta?{' '}<button onClick={onSignUp} className="login-link" style={{ background: 'none', border: 'none', fontWeight: 700, color: PINK, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px' }}>Crear cuenta</button></>
              )}
            </p>
          </form>
        </div>

        {/* Phone bottom bar */}
        <div style={{ width: '100px', height: '4px', borderRadius: '2px', background: '#E2E8F0', margin: '0 auto 12px' }} />
      </div>

      {/* Safety Love brand */}
      <div style={{ textAlign: 'center', marginTop: '28px', position: 'relative', zIndex: 10, animation: 'phoneAppear 0.8s ease 0.2s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <Heart size={16} color={PINK} fill={PINK} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: PINK, letterSpacing: '0.04em' }}>Safety Love</span>
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, margin: 0 }}>Tu bienestar también es una forma de amor.</p>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .login-phone { max-width: 95vw !important; border-radius: 28px !important; }
        }
        @media (max-width: 380px) {
          .login-phone { border-radius: 24px !important; }
        }
      `}</style>
    </div>
  );
}
