import React, { useState, useEffect, Component } from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage.jsx'
import LoginPage from './LoginPage.jsx'
import DashboardEscritorio from './DashboardEscritorio.jsx'
import PsychologistDashboard from './PsychologistDashboard.jsx'
import { Lock } from 'lucide-react'

import './index.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught:', error, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif', background: '#FFF0F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💔</div>
            <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Algo salió mal</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>La app tuvo un error inesperado. Intenta recargar la página.</p>
            <button onClick={() => { this.setState({ error: null }); window.location.reload(); }} style={{ background: '#F43F9E', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 32px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Recargar
            </button>
            <pre style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '200px', overflow: 'auto' }}>
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PinLockScreen({ onUnlock, userEmail }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const savedPin = localStorage.getItem(`safetyLove_pin_${userEmail}`) || localStorage.getItem('safetyLove_pin');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === savedPin) {
      onUnlock();
    } else {
      setError('PIN incorrecto');
      setPin('');
    }
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    const savedStudentEmail = localStorage.getItem('safetyLove_userEmail');
    const savedPsychEmail = localStorage.getItem('safetyLove_psychEmail');
    if (recoveryEmail && (recoveryEmail === savedStudentEmail || recoveryEmail === savedPsychEmail)) {
      localStorage.removeItem(`safetyLove_pin_${userEmail}`);
      localStorage.removeItem(`safetyLove_pinLock_${userEmail}`);
      localStorage.removeItem('safetyLove_pin');
      localStorage.removeItem('safetyLove_pinLock');
      setRecoverySuccess(true);
    } else {
      setRecoveryError('Correo no registrado');
    }
  };

  if (recoverySuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #FFF5F7 0%, #FFFFFF 40%, #FFF0F5 100%)', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '28px', padding: '48px 40px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>PIN desactivado</h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>El bloqueo PIN fue desactivado. Puedes configurar uno nuevo desde Configuración.</p>
          <button onClick={onUnlock} style={{
            width: '100%', height: '50px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #F472B6, #EC4899)',
            color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 16px rgba(236,72,153,0.3)'
          }}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #FFF5F7 0%, #FFFFFF 40%, #FFF0F5 100%)', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '28px', padding: '48px 40px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #FDF2F8, #FCE7F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 16px rgba(244,63,158,0.1)' }}>
          <Lock size={28} style={{ color: '#EC4899' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Bloqueo PIN</h2>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '28px' }}>Ingresa tu PIN para continuar</p>

        {!showRecovery ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              placeholder="••••"
              maxLength={6}
              autoFocus
              style={{
                width: '100%', height: '54px', borderRadius: '14px', border: '2px solid #E5E7EB',
                padding: '0 16px', fontSize: '24px', fontWeight: 700, textAlign: 'center',
                letterSpacing: '0.3em', outline: 'none', marginBottom: '16px',
                fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#F472B6'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            {error && <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={pin.length < 4} style={{
              width: '100%', height: '50px', borderRadius: '14px', border: 'none',
              background: pin.length >= 4 ? 'linear-gradient(135deg, #F472B6, #EC4899)' : '#F9A8D4',
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: pin.length >= 4 ? 'pointer' : 'not-allowed',
              fontFamily: "'Poppins', sans-serif", boxShadow: pin.length >= 4 ? '0 4px 16px rgba(236,72,153,0.3)' : 'none'
            }}>
              Desbloquear
            </button>
            <button type="button" onClick={() => { setShowRecovery(true); setRecoveryError(''); setRecoveryEmail(''); }} style={{
              background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', marginTop: '16px', fontFamily: "'Poppins', sans-serif",
              textDecoration: 'underline'
            }}>
              ¿Olvidaste tu PIN?
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecovery}>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.5 }}>
              Ingresa el correo con el que te registraste para desactivar el bloqueo PIN.
            </p>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => { setRecoveryEmail(e.target.value); setRecoveryError(''); }}
              placeholder="tu@correo.com"
              autoFocus
              style={{
                width: '100%', height: '50px', borderRadius: '14px', border: '2px solid #E5E7EB',
                padding: '0 16px', fontSize: '15px', outline: 'none', marginBottom: '12px',
                fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#F472B6'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            {recoveryError && <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{recoveryError}</p>}
            <button type="submit" disabled={!recoveryEmail} style={{
              width: '100%', height: '50px', borderRadius: '14px', border: 'none',
              background: recoveryEmail ? 'linear-gradient(135deg, #F472B6, #EC4899)' : '#F9A8D4',
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: recoveryEmail ? 'pointer' : 'not-allowed',
              fontFamily: "'Poppins', sans-serif", boxShadow: recoveryEmail ? '0 4px 16px rgba(236,72,153,0.3)' : 'none'
            }}>
              Desactivar PIN
            </button>
            <button type="button" onClick={() => setShowRecovery(false)} style={{
              background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', marginTop: '16px', fontFamily: "'Poppins', sans-serif"
            }}>
              Volver al PIN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('landing');
  const [avatarOnboarding, setAvatarOnboarding] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(() => {
    const email = localStorage.getItem('safetyLove_userEmail') || localStorage.getItem('safetyLove_psychEmail') || '';
    if (email) {
      return localStorage.getItem(`safetyLove_pinLock_${email}`) !== 'true' && localStorage.getItem('safetyLove_pinLock') !== 'true';
    }
    return localStorage.getItem('safetyLove_pinLock') !== 'true';
  });
  const previewDashboard = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'dashboard';
  const previewPsy = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'psychologist';

  const clearDarkMode = () => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-mode');
    document.documentElement.style.fontSize = '';
  };

  const handleLogin = (role) => {
    clearDarkMode();
    setUserRole(role || 'user');
    const email = localStorage.getItem('safetyLove_userEmail') || localStorage.getItem('safetyLove_psychEmail') || '';
    setCurrentUserEmail(email);
    const pinLockEnabled = localStorage.getItem(`safetyLove_pinLock_${email}`) === 'true' || localStorage.getItem('safetyLove_pinLock') === 'true';
    if (pinLockEnabled) {
      setPinUnlocked(false);
    } else {
      setPinUnlocked(true);
    }
    setView('dashboard');
  };

  if (previewDashboard) return <ErrorBoundary><DashboardEscritorio /></ErrorBoundary>;
  if (previewPsy) return <ErrorBoundary><PsychologistDashboard /></ErrorBoundary>;
  if (view === 'landing') return <LandingPage onEnterApp={(mode) => { if (mode === 'signup') { setView('signup'); } else { setView('login'); } }} />;
  if (view === 'login') return (
    <LoginPage
      onLogin={handleLogin}
      onGoToLanding={() => setView('landing')}
      onSignUp={(role) => { clearDarkMode(); setUserRole(role || 'user'); setView('signup'); }}
    />
  );
  if (view === 'signup') return (
    <LoginPage
      isSignUp
      onSignUp={(role) => { clearDarkMode(); setUserRole(role || 'user'); setAvatarOnboarding(true); setView('dashboard'); }}
      onLogin={handleLogin}
      onGoToLanding={() => setView('landing')}
      onLoginRedirect={() => setView('login')}
    />
  );

  if (view === 'dashboard' && !pinUnlocked) {
    return <PinLockScreen onUnlock={() => setPinUnlocked(true)} userEmail={currentUserEmail} />;
  }

  if (userRole === 'psychologist') return <ErrorBoundary><PsychologistDashboard onLogout={() => { clearDarkMode(); setPinUnlocked(true); setView('login'); }} /></ErrorBoundary>;

  return (
    <ErrorBoundary key={view}>
      <DashboardEscritorio onLogout={() => { clearDarkMode(); setPinUnlocked(true); setView('login'); }} />
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
