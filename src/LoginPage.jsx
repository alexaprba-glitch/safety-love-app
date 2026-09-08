import React, { useState, useEffect } from 'react';
import {
  Heart, Lock, User, Mail, Eye, EyeOff,
  ArrowRight, Check, LogIn, Brain, BookOpen,
  ChevronRight, Search, AlertCircle, Shield
} from 'lucide-react';
import { signUp, signIn, getProfile } from './services/auth';
import { supabase } from './supabase';

export default function LoginPage({ onLogin, onGoToLanding, isSignUp, onSignUp, onLoginRedirect }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [age, setAge]               = useState('');
  const [grade, setGrade]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focused, setFocused]       = useState(null);
  const [role, setRole]             = useState('user');
  const [showPsychSelection, setShowPsychSelection] = useState(false);
  const [selectedPsych, setSelectedPsych] = useState(null);
  const [psychSearch, setPsychSearch] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [psychologists, setPsychologists] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, role');
      if (error) {
        console.log('[Login] Error cargando psicólogos:', error.message);
        return;
      }
      const psychs = (data || []).filter(p => p.role === 'psicologo' || p.role === 'psychologist');
      setPsychologists(psychs);
    })();
  }, []);

  useEffect(() => {
    if (!showPsychSelection) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, role');
      const psychs = (data || []).filter(p => p.role === 'psicologo' || p.role === 'psychologist');
      setPsychologists(psychs);
    })();
  }, [showPsychSelection]);

  const filteredPsychs = psychologists.filter(p =>
    (p.name || '').toLowerCase().includes(psychSearch.toLowerCase()) ||
    (p.specialty || '').toLowerCase().includes(psychSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
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
        await signUp({
          email,
          password,
          name: fullName || email.split('@')[0],
          role: role === 'psychologist' ? 'psicologo' : 'adolescente',
          grade: role === 'user' ? grade : undefined,
        });
        if (onSignUp) onSignUp(role);
      } else {
        const data = await signIn({ email, password });
        const profile = await getProfile(data.user.id);
        const userRole = profile?.role === 'psicologo' ? 'psychologist' : 'user';
        if (onLogin) onLogin(userRole);
      }
    } catch (err) {
      const msg = err?.message || 'Ocurrió un error. Intenta de nuevo.';
      if (msg.includes('already registered')) setError('Este correo ya está registrado.');
      else if (msg.includes('Invalid login')) setError('Correo o contraseña incorrectos.');
      else if (msg.includes('Password should')) setError('La contraseña debe tener al menos 6 caracteres.');
      else setError(msg);
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
      await signUp({
        email,
        password,
        name: fullName || email.split('@')[0],
        role: 'adolescente',
        psychologistId: selectedPsych.id,
        grade: grade || undefined,
      });
      onSignUp(role, selectedPsych);
    } catch (err) {
      const msg = err?.message || 'Ocurrió un error al crear la cuenta.';
      if (msg.includes('already registered')) setError('Este correo ya está registrado.');
      else if (msg.includes('Password should')) setError('La contraseña debe tener al menos 6 caracteres.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (showPsychSelection) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 overflow-y-auto" style={{ background: '#F5F0E8' }}>
        <div style={{
          width: '100%', maxWidth: '880px',
          background: '#FFFFFF', borderRadius: '28px',
          border: '1px solid #F3E8EE',
          boxShadow: '0 8px 40px rgba(245,47,145,0.06), 0 1px 3px rgba(0,0,0,0.04)',
          padding: '52px 52px 44px', overflow: 'hidden'
        }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 16px rgba(245,47,145,0.08)' }}>
            <Brain size={34} style={{ color: '#EC3B91' }} />
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#17243D', textAlign: 'center', lineHeight: 1.15, marginBottom: '12px', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.02em' }}>
            Elige tu psicólogo
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#718096', textAlign: 'center', lineHeight: 1.5, marginBottom: '32px' }}>
            Selecciona el profesional que mejor se adapte a tus necesidades.
          </p>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1', pointerEvents: 'none' }} />
            <input type="text" value={psychSearch} onChange={e => setPsychSearch(e.target.value)} placeholder="Buscar por nombre o especialidad..."
              style={{ width: '100%', height: '56px', borderRadius: '16px', border: '1.5px solid #E5E7EB', padding: '0 20px 0 52px', fontSize: '15px', fontWeight: 500, color: '#17243D', background: '#FAFBFC', outline: 'none', transition: 'all 200ms ease', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={(e) => { e.target.style.borderColor = '#EC3B91'; e.target.style.boxShadow = '0 0 0 4px rgba(236,59,145,0.08)'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAFBFC'; }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px', paddingRight: '4px' }}>
            {filteredPsychs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '44px 20px', color: '#718096', fontSize: '15px', fontWeight: 500 }}>No hay psicólogos registrados aún.</div>
            )}
            {filteredPsychs.map((p) => {
              const isSelected = selectedPsych?.id === p.id;
              return (
                <button key={p.id} onClick={() => setSelectedPsych(p)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 22px', borderRadius: '18px', border: isSelected ? '2px solid #EC3B91' : '1.5px solid #E5E7EB', background: isSelected ? '#FFF5FA' : '#FFFFFF', cursor: 'pointer', textAlign: 'left', transition: 'all 200ms ease' }}
                  onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#F9A8D4'; e.currentTarget.style.background = '#FFFBFD'; } }}
                  onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; } }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'linear-gradient(135deg, #EC3B91, #EC4899)' : '#F8FAFC', border: isSelected ? 'none' : '1.5px solid #E5E7EB' }}>
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '18px', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#718096' }}>{(p.name || '?')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#17243D', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name || 'Sin nombre'}</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? '#EC3B91' : '#718096' }}>{p.specialty || 'Psicología general'}</p>
                  </div>
                  {isSelected && (
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#EC3B91', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button onClick={() => setShowPsychSelection(false)}
              style={{ flex: 1, height: '52px', borderRadius: '14px', border: '1.5px solid #E5E7EB', background: '#FFFFFF', color: '#718096', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms ease', fontFamily: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
            >Volver</button>
            <button onClick={handlePsychSelect} disabled={!selectedPsych || loading}
              style={{ flex: 1, height: '52px', borderRadius: '14px', border: 'none', background: selectedPsych && !loading ? 'linear-gradient(135deg, #EC3B91, #EC4899)' : '#F9A8D4', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: selectedPsych && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: selectedPsych && !loading ? '0 4px 16px rgba(236,59,145,0.25)' : 'none', transition: 'all 200ms ease', fontFamily: 'inherit' }}
              onMouseEnter={(e) => { if (selectedPsych && !loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,59,145,0.35)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (selectedPsych && !loading) { e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,59,145,0.25)'; } }}
            >
              {loading ? <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <>Continuar <ArrowRight size={18} strokeWidth={2.5} /></>}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif", background: '#FFFFFF' }}>

      {/* ═══ LEFT PANEL ═══ */}
      <div className="w-full lg:w-[48%] flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF3F8 0%, #FFE8F0 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,59,145,0.08) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,59,145,0.06) 0%, transparent 70%)' }}></div>
        <div className="absolute top-[12%] right-[8%] pointer-events-none" style={{ color: '#EC3B91', opacity: 0.15, fontSize: '22px' }}>♥</div>
        <div className="absolute top-[28%] left-[6%] pointer-events-none" style={{ color: '#EC3B91', opacity: 0.10, fontSize: '14px' }}>✦</div>
        <div className="absolute bottom-[32%] right-[12%] pointer-events-none" style={{ color: '#EC3B91', opacity: 0.12, fontSize: '11px' }}>●</div>

        {/* Content */}
        <div className="relative z-10 px-10 lg:px-14 flex-1 flex flex-col justify-center pt-[15vh] pb-12">
          {/* Branding */}
          <div style={{ marginBottom: '40px', marginTop: '-520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <img src="/logo.png" alt="Safety Love" style={{ height: '80px', objectFit: 'contain' }} />
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#EC3B91', fontFamily: "'Poppins', sans-serif" }}>TuRefugio</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '24px' }}>
          </div>

          {/* Illustration */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none" style={{ top: '10%' }}>
            <img src="/login_illustration.png" alt="Illustration"
              className="w-full max-w-none h-auto object-contain object-bottom mix-blend-multiply"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <div style={{ display: 'none' }} className="w-full flex justify-end pb-0">
              <svg viewBox="0 0 400 220" className="w-full opacity-90" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="220" fill="#FFF0F5" rx="0"/>
                <ellipse cx="200" cy="208" rx="195" ry="14" fill="#FECDD3" opacity="0.45"/>
                <ellipse cx="22" cy="145" rx="26" ry="32" fill="#F9A8D4" opacity="0.55"/>
                <rect x="19" y="170" width="6" height="38" fill="#FBCFE8"/>
                <ellipse cx="62" cy="118" rx="40" ry="52" fill="#F9A8D4" opacity="0.7"/>
                <rect x="58" y="162" width="8" height="42" fill="#FBCFE8"/>
                <ellipse cx="32" cy="140" rx="18" ry="22" fill="#FCA5A5" opacity="0.45"/>
                <rect x="29" y="158" width="5" height="30" fill="#FBCFE8"/>
                <ellipse cx="338" cy="108" rx="46" ry="60" fill="#F9A8D4" opacity="0.7"/>
                <rect x="334" y="162" width="8" height="42" fill="#FBCFE8"/>
                <ellipse cx="375" cy="135" rx="26" ry="32" fill="#FCA5A5" opacity="0.5"/>
                <rect x="372" y="162" width="6" height="38" fill="#FBCFE8"/>
                <rect x="130" y="162" width="140" height="9" rx="4.5" fill="#FECDD3"/>
                <rect x="130" y="148" width="140" height="7" rx="3.5" fill="#FCA5A5" opacity="0.7"/>
                <rect x="136" y="170" width="7" height="26" rx="3" fill="#FECDD3"/>
                <rect x="257" y="170" width="7" height="26" rx="3" fill="#FECDD3"/>
                <rect x="152" y="130" width="28" height="35" rx="8" fill="#F9A8D4"/>
                <circle cx="166" cy="116" r="17" fill="#FECDD3"/>
                <ellipse cx="166" cy="106" rx="17" ry="12" fill="#881337"/>
                <rect x="149" y="106" width="8" height="24" rx="4" fill="#881337"/>
                <rect x="175" y="106" width="7" height="20" rx="3.5" fill="#881337"/>
                <circle cx="161" cy="118" r="1.8" fill="#BE185D" opacity="0.6"/>
                <circle cx="171" cy="118" r="1.8" fill="#BE185D" opacity="0.6"/>
                <path d="M161 124 Q166 128 171 124" stroke="#BE185D" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <rect x="154" y="163" width="10" height="28" rx="5" fill="#FECDD3"/>
                <rect x="168" y="163" width="10" height="28" rx="5" fill="#FECDD3"/>
                <ellipse cx="159" cy="191" rx="8" ry="5" fill="#4C1D95"/>
                <ellipse cx="173" cy="191" rx="8" ry="5" fill="#4C1D95"/>
                <rect x="138" y="138" width="14" height="22" rx="3" fill="#ffffff" stroke="#E879F9" strokeWidth="1.5"/>
                <rect x="140" y="141" width="10" height="14" rx="1.5" fill="#F0ABFC" opacity="0.6"/>
                <path d="M152 140 Q144 142 140 148" stroke="#FECDD3" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <rect x="215" y="128" width="32" height="38" rx="8" fill="#93C5FD"/>
                <circle cx="231" cy="113" r="18" fill="#FED7AA"/>
                <ellipse cx="231" cy="100" rx="17" ry="10" fill="#78350F"/>
                <ellipse cx="222" cy="107" rx="6" ry="5" fill="#78350F"/>
                <circle cx="225" cy="115" r="1.8" fill="#92400E" opacity="0.6"/>
                <circle cx="236" cy="115" r="1.8" fill="#92400E" opacity="0.6"/>
                <path d="M225 121 Q231 125 237 121" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <rect x="216" y="164" width="11" height="27" rx="5" fill="#FED7AA"/>
                <rect x="232" y="164" width="11" height="27" rx="5" fill="#FED7AA"/>
                <ellipse cx="221" cy="191" rx="9" ry="5" fill="#1e293b"/>
                <ellipse cx="237" cy="191" rx="9" ry="5" fill="#1e293b"/>
                <rect x="244" y="135" width="14" height="22" rx="3" fill="#ffffff" stroke="#E879F9" strokeWidth="1.5"/>
                <rect x="246" y="138" width="10" height="14" rx="1.5" fill="#F0ABFC" opacity="0.6"/>
                <path d="M247 138 Q250 140 253 140" stroke="#FED7AA" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <text x="188" y="88" fontSize="16" fill="#EC3B91" opacity="0.7">♥</text>
                <text x="208" y="75" fontSize="10" fill="#EC3B91" opacity="0.4">♥</text>
                <text x="175" y="78" fontSize="8" fill="#EC3B91" opacity="0.3">♥</text>
                <circle cx="120" cy="105" r="3" fill="#F9A8D4" opacity="0.5"/>
                <circle cx="285" cy="98" r="2.5" fill="#F9A8D4" opacity="0.4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="w-full lg:w-[52%] flex items-center justify-center px-6 sm:px-10 lg:px-20 py-12 lg:py-0 bg-white relative overflow-y-auto custom-scrollbar">
        {/* Back button */}
        {onGoToLanding && (
          <button onClick={onGoToLanding}
            style={{ position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '14px', fontWeight: 500, transition: 'color 200ms', padding: '8px', borderRadius: '8px' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#EC3B91'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
          >
            <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}

        {/* Decorative heart */}
        <div className="absolute top-[8%] right-[8%] pointer-events-none" style={{ opacity: 0.18 }}>
          <Heart className="w-10 h-10" style={{ color: '#EC3B91' }} fill="#FCE7F3" />
        </div>
        <div className="absolute bottom-[20%] right-[4%] pointer-events-none" style={{ opacity: 0.12 }}>
          <Heart className="w-6 h-6" style={{ color: '#EC3B91' }} fill="#FCE7F3" />
        </div>

        <div className="w-full max-w-[480px] relative z-10 mx-auto mt-16 lg:mt-0 custom-scrollbar" style={{ maxHeight: '100vh', overflowY: 'auto', paddingRight: '4px' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFF0F5, #FCE7F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 4px 16px rgba(236,59,145,0.08)' }}>
              <Heart size={24} style={{ color: '#EC3B91' }} fill="#EC3B91" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#17243D', lineHeight: 1.2, margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.02em' }}>
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#718096', margin: 0, textAlign: 'center' }}>
              {isSignUp ? 'Bienvenido, nos alegra tenerte aquí.' : 'Bienvenido de nuevo, nos alegra tenerte aquí.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button type="button" onClick={() => setRole('user')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '14px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 200ms ease',
                    border: role === 'user' ? '2px solid #EC3B91' : '1.5px solid #E5E7EB',
                    background: role === 'user' ? '#FFF5FA' : '#FFFFFF',
                    height: '64px'
                  }}
                  onMouseEnter={(e) => { if (role !== 'user') e.currentTarget.style.borderColor = '#F9A8D4'; }}
                  onMouseLeave={(e) => { if (role !== 'user') e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <User size={16} style={{ color: role === 'user' ? '#EC3B91' : '#A0AEC0' }} strokeWidth={2} />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: role === 'user' ? '#17243D' : '#4A5568' }}>Estudiante</span>
                  </div>
                  <span style={{ fontSize: '12px', color: role === 'user' ? '#EC3B91' : '#A0AEC0', fontWeight: 500 }}>Soy estudiante</span>
                </button>
                <button type="button" onClick={() => setRole('psychologist')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '14px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 200ms ease',
                    border: role === 'psychologist' ? '2px solid #EC3B91' : '1.5px solid #E5E7EB',
                    background: role === 'psychologist' ? '#FFF5FA' : '#FFFFFF',
                    height: '64px'
                  }}
                  onMouseEnter={(e) => { if (role !== 'psychologist') e.currentTarget.style.borderColor = '#F9A8D4'; }}
                  onMouseLeave={(e) => { if (role !== 'psychologist') e.currentTarget.style.borderColor = '#E5E7EB'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1, color: role === 'psychologist' ? '#EC3B91' : '#A0AEC0' }}>Ψ</span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: role === 'psychologist' ? '#17243D' : '#4A5568' }}>Psicólogo</span>
                  </div>
                  <span style={{ fontSize: '12px', color: role === 'psychologist' ? '#EC3B91' : '#A0AEC0', fontWeight: 500 }}>Soy profesional</span>
                </button>
              </div>
            </div>

            {/* Signup fields */}
            {isSignUp && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Nombres', key: 'firstName', value: firstName, setter: setFirstName, placeholder: 'Tu nombre' },
                  { label: 'Apellidos', key: 'lastName', value: lastName, setter: setLastName, placeholder: 'Tus apellidos' },
                ].map(({ label, key, value, setter, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17243D', marginBottom: '6px' }}>{label}</label>
                    <div style={{
                      display: 'flex', alignItems: 'center', height: '46px', borderRadius: '12px',
                      border: focused === key ? '1.5px solid #EC3B91' : '1.5px solid #E5E7EB',
                      padding: '0 14px', background: '#FFFFFF', transition: 'all 200ms ease',
                      boxShadow: focused === key ? '0 0 0 3px rgba(236,59,145,0.08)' : 'none'
                    }}>
                      <User size={16} style={{ color: '#A0AEC0', flexShrink: 0 }} />
                      <input type="text" value={value} onChange={e => setter(e.target.value)}
                        onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                        placeholder={placeholder} required
                        style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '14px', color: '#17243D', background: 'transparent', outline: 'none', border: 'none', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grade */}
            {isSignUp && role === 'user' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17243D', marginBottom: '6px' }}>Grado</label>
                <div style={{
                  display: 'flex', alignItems: 'center', height: '46px', borderRadius: '12px',
                  border: focused === 'grade' ? '1.5px solid #EC3B91' : '1.5px solid #E5E7EB',
                  padding: '0 14px', background: '#FFFFFF', transition: 'all 200ms ease',
                  boxShadow: focused === 'grade' ? '0 0 0 3px rgba(236,59,145,0.08)' : 'none'
                }}>
                  <BookOpen size={16} style={{ color: '#A0AEC0', flexShrink: 0 }} />
                  <select value={grade} onChange={e => setGrade(e.target.value)}
                    onFocus={() => setFocused('grade')} onBlur={() => setFocused(null)}
                    required
                    style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '14px', color: '#17243D', background: 'transparent', outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', border: 'none' }}>
                    <option value="" disabled>Selecciona tu grado</option>
                    <option value="6">6° Primaria</option>
                    <option value="7">7° Secundaria</option>
                    <option value="8">8° Secundaria</option>
                    <option value="9">9° Secundaria</option>
                    <option value="10">10° Bachillerato</option>
                    <option value="11">11° Bachillerato</option>
                  </select>
                  <ChevronRight size={16} style={{ color: '#A0AEC0', flexShrink: 0, transform: 'rotate(90deg)' }} />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17243D', marginBottom: '6px' }}>Correo electrónico</label>
              <div style={{
                display: 'flex', alignItems: 'center', height: '46px', borderRadius: '12px',
                border: focused === 'email' ? '1.5px solid #EC3B91' : '1.5px solid #E5E7EB',
                padding: '0 14px', background: '#FFFFFF', transition: 'all 200ms ease',
                boxShadow: focused === 'email' ? '0 0 0 3px rgba(236,59,145,0.08)' : 'none'
              }}>
                <Mail size={16} style={{ color: '#A0AEC0', flexShrink: 0 }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  placeholder="tu@correo.com" required
                  style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '14px', color: '#17243D', background: 'transparent', outline: 'none', border: 'none', fontFamily: 'inherit' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#17243D', marginBottom: '6px' }}>Contraseña</label>
              <div style={{
                display: 'flex', alignItems: 'center', height: '46px', borderRadius: '12px',
                border: focused === 'password' ? '1.5px solid #EC3B91' : '1.5px solid #E5E7EB',
                padding: '0 14px', background: '#FFFFFF', transition: 'all 200ms ease',
                boxShadow: focused === 'password' ? '0 0 0 3px rgba(236,59,145,0.08)' : 'none'
              }}>
                <Lock size={16} style={{ color: '#A0AEC0', flexShrink: 0 }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                  placeholder="••••••••" required
                  style={{ flex: 1, height: '100%', marginLeft: '12px', fontSize: '15px', color: '#17243D', background: 'transparent', outline: 'none', border: 'none', letterSpacing: '0.15em', fontFamily: 'inherit' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 200ms' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EC3B91'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A0AEC0'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            {!isSignUp && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ position: 'relative' }}>
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '5px', border: rememberMe ? 'none' : '1.5px solid #CBD5E1',
                      background: rememberMe ? '#EC3B91' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms ease'
                    }}>
                      {rememberMe && <Check size={12} strokeWidth={3} color="#fff" />}
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#4A5568', fontWeight: 500 }}>Recordarme</span>
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, color: '#EC3B91', cursor: 'pointer', transition: 'color 200ms' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D91F72'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#EC3B91'}
                >¿Olvidaste tu contraseña?</button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#DC2626', fontWeight: 600, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', height: '48px', borderRadius: '14px', border: 'none',
                background: loading ? '#F9A8D4' : 'linear-gradient(135deg, #EC3B91, #D946A8)',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(236,59,145,0.3)',
                transition: 'all 200ms ease', fontFamily: 'inherit', marginBottom: '0',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(236,59,145,0.4)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (!loading) { e.currentTarget.style.boxShadow = '0 4px 20px rgba(236,59,145,0.3)'; } }}
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </>
              )}
            </button>

            {/* Separator + Create account (login only) */}
            {!isSignUp && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                  <span style={{ fontSize: '13px', color: '#A0AEC0', fontWeight: 500 }}>o</span>
                  <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                </div>
                <button type="button" onClick={onSignUp}
                  style={{
                    width: '100%', height: '48px', borderRadius: '14px', border: '1.5px solid #EC3B91',
                    background: '#FFFFFF', color: '#EC3B91', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 200ms ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF5FA'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >Crear cuenta <ArrowRight size={16} strokeWidth={2.5} /></button>
              </>
            )}

            {/* Link to sign-in (signup only) */}
            {isSignUp && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', marginTop: '16px' }}>
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onLoginRedirect} style={{ background: 'none', border: 'none', fontWeight: 700, color: '#EC3B91', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>Inicia sesión</button>
              </p>
            )}

            {/* Security card */}
            {!isSignUp && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                marginTop: '24px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #FFF5FA, #FFF0F7)',
                border: '1px solid #F3E8EE'
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC3B91, #D946A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 10px rgba(236,59,145,0.2)' }}>
                  <Shield size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#17243D', margin: '0 0 2px' }}>Tu bienestar es nuestra prioridad.</p>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#718096', margin: 0 }}>Tus datos están seguros y protegidos.</p>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}