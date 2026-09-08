import React, { useState, useRef, useEffect } from 'react';
import {
  Heart, Settings, Palette, Moon, Sun, Volume2, MessageCircle,
  Shield, Lock, FileText, Globe, LogOut, User, Mail, Pencil,
  Image as ImageIcon, Camera, ChevronRight, BookOpen, BarChart3,
  Bell, Clock, Download, Star, HelpCircle, File, Info
} from 'lucide-react';

export default function ConfiguracionStudentSection({ darkMode: darkModeProp, onToast, onDarkModeChange, userPhotoUrl, setUserPhotoUrl, userName, setUserName, userBio, setUserBio, onLogout }) {
  const [email, setEmail] = useState(() => localStorage.getItem('safetyLove_userEmail') || 'correo@ejemplo.com');
  const pinKey = (base) => `${base}_${email}`;
  const [dm, setDm] = useState(() => darkModeProp !== undefined ? darkModeProp : document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (darkModeProp !== undefined) setDm(darkModeProp);
  }, [darkModeProp]);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('safetyLove_fontSize') || 'normal');
  const [textStyle, setTextStyle] = useState(() => localStorage.getItem('safetyLove_textStyle') || 'standard');
  const [modal, setModal] = useState(null);
  const [modalVal, setModalVal] = useState('');
  const [modalVal2, setModalVal2] = useState('');
  const [lang, setLang] = useState(() => localStorage.getItem('safetyLove_lang') || 'es');

  // Wellness settings
  const [writingReminder, setWritingReminder] = useState(() => localStorage.getItem('safetyLove_writingReminder') === 'true');
  const [diaryReminder, setDiaryReminder] = useState(() => localStorage.getItem('safetyLove_diaryReminder') === 'true');
  const [dailyPhrase, setDailyPhrase] = useState(() => localStorage.getItem('safetyLove_dailyPhrase') !== 'false');
  const [exercises, setExercises] = useState(() => localStorage.getItem('safetyLove_exercises') !== 'false');

  // Privacy settings
  const [pinLock, setPinLock] = useState(() => localStorage.getItem(`safetyLove_pinLock_${email}`) === 'true' || localStorage.getItem('safetyLove_pinLock') === 'true');
  const [backup, setBackup] = useState(() => localStorage.getItem('safetyLove_backup') === 'true');

  // PIN modal state
  const [pinModal, setPinModal] = useState(null); // 'create' | 'confirm' | 'verify' | 'change' | 'disable'
  const [pinInput, setPinInput] = useState('');
  const [pinInput2, setPinInput2] = useState('');
  const [pinError, setPinError] = useState('');

  // Export modal
  const [exportModal, setExportModal] = useState(false);

  const toast = (msg) => { if (onToast) onToast(msg); };

  // ── INIT: Apply saved settings on mount ──
  useEffect(() => {
    const savedSize = localStorage.getItem('safetyLove_fontSize') || 'normal';
    document.documentElement.style.fontSize = savedSize === 'small' ? '13px' : savedSize === 'large' ? '17px' : '15px';

    const savedStyle = localStorage.getItem('safetyLove_textStyle') || 'standard';
    applyTextStyle(savedStyle, false);
  }, []);

  // ── FONT SIZE ──
  const applyFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('safetyLove_fontSize', size);
    document.documentElement.style.fontSize = size === 'small' ? '13px' : size === 'large' ? '17px' : '15px';
    toast(lang === 'es' ? 'Tamaño de texto ajustado' : 'Text size adjusted');
  };

  // ── TEXT STYLE ──
  const applyTextStyle = (style, showToast = true) => {
    setTextStyle(style);
    localStorage.setItem('safetyLove_textStyle', style);
    const root = document.documentElement;
    if (style === 'standard') {
      root.style.setProperty('--app-font', "'Inter', sans-serif");
      root.style.setProperty('--app-font-heading', "'Poppins', sans-serif");
    } else if (style === 'smooth') {
      root.style.setProperty('--app-font', "'Nunito', 'Inter', sans-serif");
      root.style.setProperty('--app-font-heading', "'Nunito', 'Poppins', sans-serif");
    } else if (style === 'elegant') {
      root.style.setProperty('--app-font', "'DM Sans', 'Inter', sans-serif");
      root.style.setProperty('--app-font-heading', "'DM Sans', 'Poppins', sans-serif");
    }
    if (showToast) toast(lang === 'es' ? 'Estilo de texto cambiado' : 'Text style changed');
  };

  // ── DARK MODE ──
  const toggleDark = () => {
    const next = !dm;
    setDm(next);
    document.documentElement.classList.toggle('dark', next);
    document.body.classList.toggle('dark-mode', next);
    localStorage.setItem('safetyLoveDarkMode', JSON.stringify(next));
    if (onDarkModeChange) onDarkModeChange(next);
    toast(next ? (lang === 'es' ? 'Modo oscuro activado' : 'Dark mode on') : (lang === 'es' ? 'Modo oscuro desactivado' : 'Dark mode off'));
  };

  // ── LANGUAGE ──
  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem('safetyLove_lang', code);
    toast(code === 'es' ? 'Idioma: Español' : 'Language: English');
  };

  // ── WELLNESS TOGGLES ──
  const toggleWritingReminder = () => {
    const next = !writingReminder;
    setWritingReminder(next);
    localStorage.setItem('safetyLove_writingReminder', String(next));
    toast(next ? (lang === 'es' ? 'Recordatorio de escritura activado' : 'Writing reminder on') : (lang === 'es' ? 'Recordatorio de escritura desactivado' : 'Writing reminder off'));
  };

  const toggleDiaryReminder = () => {
    const next = !diaryReminder;
    setDiaryReminder(next);
    localStorage.setItem('safetyLove_diaryReminder', String(next));
    toast(next ? (lang === 'es' ? 'Recordatorio del diario activado' : 'Diary reminder on') : (lang === 'es' ? 'Recordatorio del diario desactivado' : 'Diary reminder off'));
  };

  const toggleDailyPhrase = () => {
    const next = !dailyPhrase;
    setDailyPhrase(next);
    localStorage.setItem('safetyLove_dailyPhrase', String(next));
    toast(next ? (lang === 'es' ? 'Frase diaria activada' : 'Daily quote on') : (lang === 'es' ? 'Frase diaria desactivada' : 'Daily quote off'));
  };

  const toggleExercises = () => {
    const next = !exercises;
    setExercises(next);
    localStorage.setItem('safetyLove_exercises', String(next));
    toast(next ? (lang === 'es' ? 'Ejercicios activados' : 'Exercises on') : (lang === 'es' ? 'Ejercicios desactivados' : 'Exercises off'));
  };

  // ── BACKUP ──
  const toggleBackup = () => {
    const next = !backup;
    setBackup(next);
    localStorage.setItem('safetyLove_backup', String(next));
    if (next) {
      performBackup();
    }
    toast(next ? (lang === 'es' ? 'Copia de seguridad activada' : 'Backup on') : (lang === 'es' ? 'Copia de seguridad desactivada' : 'Backup off'));
  };

  const performBackup = () => {
    const data = {};
    const keys = [
      'safetyLoveDarkMode', 'safetyLove_fontSize', 'safetyLove_textStyle', 'safetyLove_lang',
      'safetyLove_userName', 'safetyLove_userEmail', 'safetyLove_userBio',
      'safetyLove_writingReminder', 'safetyLove_diaryReminder', 'safetyLove_dailyPhrase',
      'safetyLove_exercises', pinKey('safetyLove_pinLock'), 'safetyLove_backup',
      'safetyLoveAvatar', 'safetyLoveMascot', 'safetyLove_gameStats',
      'streak', 'achievements', 'completed_activities',
      'pet_hunger', 'pet_energy', 'pet_happiness', 'pet_level', 'pet_xp', 'pet_friendship',
      'loginStreakState', 'chatia_history', 'safetyLove_memoria_best',
      'safetyLove_cancelledSessions'
    ];
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) data[k] = v;
    });
    data._backupDate = new Date().toISOString();
    data._backupVersion = '1.0';
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-love-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(lang === 'es' ? 'Copia de seguridad descargada' : 'Backup downloaded');
  };

  // ── EXPORT DIARY ──
  const exportDiary = (format) => {
    const diaryData = localStorage.getItem('chatia_history') || localStorage.getItem('safetyLove_diaryEntries') || '[]';
    let entries;
    try { entries = JSON.parse(diaryData); } catch { entries = []; }

    if (!entries || (Array.isArray(entries) && entries.length === 0)) {
      toast(lang === 'es' ? 'No tienes entradas para exportar todavía.' : 'No entries to export yet.');
      setExportModal(false);
      return;
    }

    let content, filename, mime;
    if (format === 'txt') {
      content = entries.map(e => {
        const date = e.date || e.created_at || '';
        const text = e.content || e.text || e.message || JSON.stringify(e);
        return `[${date}]\n${text}\n`;
      }).join('\n---\n\n');
      filename = `diario-safety-love-${new Date().toISOString().slice(0,10)}.txt`;
      mime = 'text/plain';
    } else if (format === 'json') {
      content = JSON.stringify(entries, null, 2);
      filename = `diario-safety-love-${new Date().toISOString().slice(0,10)}.json`;
      mime = 'application/json';
    } else {
      content = entries.map(e => {
        const date = e.date || e.created_at || '';
        const text = e.content || e.text || e.message || JSON.stringify(e);
        return `Fecha: ${date}\nContenido: ${text}\n`;
      }).join('\n---\n\n');
      filename = `diario-safety-love-${new Date().toISOString().slice(0,10)}.txt`;
      mime = 'text/plain';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportModal(false);
    toast(lang === 'es' ? 'Diario exportado correctamente' : 'Diary exported successfully');
  };

  // ── PIN LOCK ──
  const startPinSetup = () => {
    if (pinLock) {
      setPinModal('verify');
      setPinInput('');
      setPinError('');
    } else {
      setPinModal('create');
      setPinInput('');
      setPinInput2('');
      setPinError('');
    }
  };

  const handlePinCreate = () => {
    if (pinInput.length < 4 || pinInput.length > 6) {
      setPinError(lang === 'es' ? 'El PIN debe tener 4-6 dígitos' : 'PIN must be 4-6 digits');
      return;
    }
    setPinModal('confirm');
    setPinInput2('');
    setPinError('');
  };

  const handlePinConfirm = () => {
    if (pinInput !== pinInput2) {
      setPinError(lang === 'es' ? 'Los PINs no coinciden' : 'PINs do not match');
      return;
    }
    localStorage.setItem(pinKey('safetyLove_pin'), pinInput);
    localStorage.setItem(pinKey('safetyLove_pinLock'), 'true');
    setPinLock(true);
    setPinModal(null);
    toast(lang === 'es' ? 'Bloqueo PIN configurado correctamente' : 'PIN lock configured');
  };

  const handlePinVerify = () => {
    const saved = localStorage.getItem(pinKey('safetyLove_pin'));
    if (pinInput === saved) {
      localStorage.setItem(pinKey('safetyLove_pinLock'), 'false');
      localStorage.removeItem(pinKey('safetyLove_pin'));
      setPinLock(false);
      setPinModal(null);
      toast(lang === 'es' ? 'Bloqueo PIN desactivado' : 'PIN lock disabled');
    } else {
      setPinError(lang === 'es' ? 'PIN incorrecto' : 'Incorrect PIN');
    }
  };

  const handlePinChange = () => {
    const saved = localStorage.getItem(pinKey('safetyLove_pin'));
    if (pinInput === saved) {
      setPinModal('create');
      setPinInput('');
      setPinInput2('');
      setPinError('');
    } else {
      setPinError(lang === 'es' ? 'PIN actual incorrecto' : 'Current PIN incorrect');
    }
  };

  // ── PROFILE ──
  const saveName = () => {
    if (modalVal.trim()) {
      setUserName(modalVal.trim());
      localStorage.setItem('safetyLove_userName', modalVal.trim());
      setModal(null);
      toast(lang === 'es' ? 'Nombre actualizado' : 'Name updated');
    }
  };

  const saveEmail = () => {
    if (modalVal.trim() && modalVal.includes('@')) {
      setEmail(modalVal.trim());
      localStorage.setItem('safetyLove_userEmail', modalVal.trim());
      setModal(null);
      toast(lang === 'es' ? 'Correo actualizado' : 'Email updated');
    }
  };

  const savePassword = () => {
    if (modalVal && modalVal2 && modalVal2.length >= 6) {
      setModal(null);
      toast(lang === 'es' ? 'Contraseña actualizada' : 'Password updated');
    }
  };

  const photoRef = useRef(null);

  // ── STYLE VARS ──
  const bg = dm ? '#070D1C' : '#F5F0E8';
  const cardBg = dm ? '#0F1A2E' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textPrimary = dm ? '#F1F5F9' : '#0F172A';
  const textSecondary = dm ? '#64748B' : '#94A3B8';
  const textTertiary = dm ? '#475569' : '#CBD5E1';
  const hoverBg = dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC';
  const inputBg = dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9';

  const cardHeader = (icon, iconBg, iconColor, title, desc) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: iconBg, flexShrink: 0
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: '14px', fontWeight: 500, color: textSecondary, margin: 0, paddingLeft: '62px' }}>{desc}</p>
    </div>
  );

  const divider = () => (
    <div style={{ height: '1px', background: cardBorder, margin: '4px 0' }} />
  );

  const switchRow = (icon, label, active, onToggle) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px', borderRadius: '14px',
      minHeight: '52px', cursor: 'pointer',
      transition: 'background 150ms ease'
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: textSecondary, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '15px', fontWeight: 600, color: textPrimary, flex: 1 }}>{label}</span>
      <button onClick={onToggle} style={{
        width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
        background: active ? '#EC4899' : (dm ? '#334155' : '#CBD5E1'),
        position: 'relative', transition: 'background 200ms ease', flexShrink: 0, padding: 0
      }}>
        <span style={{
          position: 'absolute', top: '3px', left: active ? '25px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 200ms ease'
        }} />
      </button>
    </div>
  );

  const optionRow = (icon, label, onClick) => (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
      background: 'transparent', textAlign: 'left', minHeight: '52px',
      transition: 'background 150ms ease'
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: textSecondary, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '15px', fontWeight: 600, color: textPrimary, flex: 1 }}>{label}</span>
      <ChevronRight size={18} style={{ color: textTertiary, flexShrink: 0 }} />
    </button>
  );

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: '22px',
    padding: '28px',
    display: 'flex', flexDirection: 'column'
  };

  return (
    <div style={{ minHeight: '100%', height: '100%', overflowY: 'auto', fontFamily: "'Inter', sans-serif", background: bg, color: textPrimary }} className="custom-scrollbar">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 48px' }}>

        {/* ═══ HEADER ═══ */}
        <header style={{ marginBottom: '36px' }}>
          <h1 style={{
            fontSize: '40px', fontWeight: 800, letterSpacing: '-0.02em',
            color: textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif",
            lineHeight: 1.1
          }}>
            {lang === 'es' ? 'Ajustes' : 'Settings'}
          </h1>
          <p style={{
            fontSize: '17px', fontWeight: 500, color: textSecondary,
            marginTop: '8px', margin: 0, paddingTop: '8px'
          }}>
            {lang === 'es' ? 'Personaliza tu experiencia y controla tu privacidad.' : 'Customize your experience and control your privacy.'}
          </p>
        </header>

        {/* ═══ GRID PRINCIPAL ═══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '22px',
          marginBottom: '32px'
        }}
          className="settings-grid"
        >
          <style>{`
            @media (max-width: 1024px) { .settings-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 640px) { .settings-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          {/* ── APARIENCIA ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Palette size={22} style={{ color: '#EC4899' }} />,
              'rgba(236,72,153,0.1)', '#EC4899',
              lang === 'es' ? 'Apariencia' : 'Appearance',
              lang === 'es' ? 'Cómo se ve la aplicación.' : 'How the app looks.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {switchRow(<Moon size={18} />, lang === 'es' ? 'Modo oscuro' : 'Dark mode', dm, toggleDark)}
              {switchRow(<Sun size={18} />, lang === 'es' ? 'Modo claro' : 'Light mode', !dm, toggleDark)}
            </div>
          </div>

          {/* ── BIENESTAR ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Heart size={22} style={{ color: '#A78BFA' }} />,
              'rgba(167,139,250,0.1)', '#A78BFA',
              lang === 'es' ? 'Bienestar' : 'Wellness',
              lang === 'es' ? 'Recordatorios y bienestar.' : 'Reminders and wellness.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {switchRow(<BookOpen size={18} />, lang === 'es' ? 'Recordatorio de escritura' : 'Writing reminder', writingReminder, toggleWritingReminder)}
              {divider()}
              {switchRow(<Clock size={18} />, lang === 'es' ? 'Recordatorio del diario' : 'Diary reminder', diaryReminder, toggleDiaryReminder)}
              {divider()}
              {switchRow(<MessageCircle size={18} />, lang === 'es' ? 'Frase diaria' : 'Daily quote', dailyPhrase, toggleDailyPhrase)}
              {divider()}
              {switchRow(<Heart size={18} />, lang === 'es' ? 'Ejercicios' : 'Exercises', exercises, toggleExercises)}
            </div>
          </div>

          {/* ── PRIVACIDAD ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Shield size={22} style={{ color: '#34D399' }} />,
              'rgba(52,211,153,0.1)', '#34D399',
              lang === 'es' ? 'Privacidad' : 'Privacy',
              lang === 'es' ? 'Protege tu información.' : 'Protect your information.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {switchRow(<Lock size={18} />, lang === 'es' ? 'Bloqueo PIN' : 'PIN lock', pinLock, startPinSetup)}
              {divider()}
              {switchRow(<Download size={18} />, lang === 'es' ? 'Copia de seguridad' : 'Backup', backup, toggleBackup)}
              {divider()}
              {optionRow(<FileText size={18} />, lang === 'es' ? 'Exportar diario' : 'Export diary', () => setExportModal(true))}
            </div>
          </div>

          {/* ── NOTIFICACIONES ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Bell size={22} style={{ color: '#FBBF24' }} />,
              'rgba(251,191,36,0.1)', '#FBBF24',
              lang === 'es' ? 'Notificaciones' : 'Notifications',
              lang === 'es' ? 'Controla tus alertas.' : 'Control your alerts.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {switchRow(<Bell size={18} />, lang === 'es' ? 'Activar notificaciones' : 'Enable notifications', false, () => toast(lang === 'es' ? 'Notificaciones' : 'Notifications'))}
              {divider()}
              {optionRow(<Clock size={18} />, lang === 'es' ? 'Horario silencioso' : 'Quiet hours', () => toast(lang === 'es' ? 'Horario silencioso' : 'Quiet hours'))}
              {divider()}
              {optionRow(<Settings size={18} />, lang === 'es' ? 'Frecuencia' : 'Frequency', () => toast(lang === 'es' ? 'Frecuencia' : 'Frequency'))}
            </div>
          </div>

          {/* ── IDIOMA ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Globe size={22} style={{ color: '#60A5FA' }} />,
              'rgba(96,165,250,0.1)', '#60A5FA',
              lang === 'es' ? 'Idioma' : 'Language',
              lang === 'es' ? 'Selecciona tu idioma.' : 'Choose your language.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { code: 'es', label: 'Español' },
                { code: 'en', label: 'English' }
              ].map((l) => {
                const active = lang === l.code;
                return (
                  <button key={l.code} onClick={() => changeLang(l.code)} style={{
                    width: '100%', height: '52px', borderRadius: '14px',
                    padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', fontSize: '15px', fontWeight: 600,
                    background: active ? 'rgba(236,72,153,0.12)' : inputBg,
                    color: active ? '#EC4899' : textPrimary,
                    border: active ? '1.5px solid rgba(236,72,153,0.3)' : '1.5px solid transparent',
                    transition: 'all 150ms ease'
                  }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = inputBg; }}
                  >
                    <span>{l.label}</span>
                    {active && <span style={{ fontSize: '18px', fontWeight: 700 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── ACERCA DE ── */}
          <div style={cardStyle}>
            {cardHeader(
              <Info size={22} style={{ color: '#A78BFA' }} />,
              'rgba(167,139,250,0.1)', '#A78BFA',
              lang === 'es' ? 'Acerca de' : 'About',
              lang === 'es' ? 'Información y soporte.' : 'Information and support.'
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {optionRow(<FileText size={18} />, lang === 'es' ? 'Términos y condiciones' : 'Terms', () => toast(lang === 'es' ? 'Abriendo términos...' : 'Opening terms...'))}
              {divider()}
              {optionRow(<Shield size={18} />, lang === 'es' ? 'Política de privacidad' : 'Privacy policy', () => toast(lang === 'es' ? 'Abriendo política...' : 'Opening policy...'))}
              {divider()}
              {optionRow(<HelpCircle size={18} />, lang === 'es' ? 'Soporte' : 'Support', () => toast(lang === 'es' ? 'Abriendo soporte...' : 'Opening support...'))}
              {divider()}
              {optionRow(<Star size={18} />, lang === 'es' ? 'Calificar la app' : 'Rate the app', () => toast(lang === 'es' ? '¡Gracias!' : 'Thanks!'))}
            </div>
          </div>
        </div>

        {/* ═══ PERFIL + CERRAR SESIÓN ═══ */}
        <div style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: '22px',
          padding: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '24px', flexWrap: 'wrap'
        }}
          className="profile-card"
        >
          <style>{`
            @media (max-width: 640px) { .profile-card { flex-direction: column !important; align-items: stretch !important; } .profile-card button { width: 100% !important; } }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: inputBg, border: '2.5px solid #EC4899',
                boxShadow: '0 4px 16px rgba(236,72,153,0.15)'
              }}>
                {userPhotoUrl ? (
                  <img src={userPhotoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={28} style={{ color: textSecondary }} />
                )}
              </div>
              <label style={{
                position: 'absolute', bottom: '0', right: '-2px',
                width: '24px', height: '24px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: '#EC4899',
                border: `2.5px solid ${cardBg}`,
                boxShadow: '0 2px 8px rgba(236,72,153,0.3)'
              }}>
                <Camera size={11} color="#fff" />
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { const r = new FileReader(); r.onload = (ev) => { setUserPhotoUrl(ev.target.result); toast(lang === 'es' ? 'Foto actualizada' : 'Photo updated'); }; r.readAsDataURL(f); }
                }} />
              </label>
            </div>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontSize: '19px', fontWeight: 700, color: textPrimary, margin: 0 }}>{userName}</h4>
              <p style={{ fontSize: '15px', fontWeight: 500, color: textSecondary, margin: 0, marginTop: '4px' }}>
                {userBio || 'Cada pequeño paso cuenta.'} <span style={{ color: '#EC4899' }}>❤️</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <Mail size={14} style={{ color: textSecondary }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: textSecondary }}>{email}</span>
              </div>
            </div>
          </div>
          <button onClick={() => { toast(lang === 'es' ? 'Cerrando sesión...' : 'Logging out...'); setTimeout(() => { if (onLogout) onLogout(); }, 800); }} style={{
            height: '54px', padding: '0 28px', borderRadius: '16px',
            border: '1.5px solid rgba(236,72,153,0.3)',
            background: 'transparent',
            color: '#EC4899', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 200ms ease', flexShrink: 0, fontFamily: 'inherit'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'; }}
          >
            <LogOut size={18} /> {lang === 'es' ? 'Cerrar sesión' : 'Log out'}
          </button>
        </div>

      </div>

      {/* ═══ MODAL: PIN LOCK ═══ */}
      {pinModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '16px'
        }} onClick={() => setPinModal(null)}>
          <div style={{
            background: cardBg, color: textPrimary,
            borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '400px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Lock size={28} style={{ color: '#EC4899' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, textAlign: 'center', marginBottom: '8px' }}>
              {pinModal === 'create' && (lang === 'es' ? 'Crear PIN' : 'Create PIN')}
              {pinModal === 'confirm' && (lang === 'es' ? 'Confirmar PIN' : 'Confirm PIN')}
              {pinModal === 'verify' && (lang === 'es' ? 'Ingresa tu PIN' : 'Enter your PIN')}
              {pinModal === 'change' && (lang === 'es' ? 'Cambiar PIN' : 'Change PIN')}
            </h3>
            <p style={{ fontSize: '13px', color: textSecondary, textAlign: 'center', margin: '0 0 20px' }}>
              {pinModal === 'create' && (lang === 'es' ? 'Ingresa un PIN de 4-6 dígitos' : 'Enter a 4-6 digit PIN')}
              {pinModal === 'confirm' && (lang === 'es' ? 'Confirma tu PIN' : 'Confirm your PIN')}
              {pinModal === 'verify' && (lang === 'es' ? 'Ingresa tu PIN para desactivar el bloqueo' : 'Enter your PIN to disable lock')}
              {pinModal === 'change' && (lang === 'es' ? 'Ingresa tu PIN actual' : 'Enter your current PIN')}
            </p>
            <input
              type="password"
              value={pinModal === 'confirm' || pinModal === 'change' ? pinInput2 : pinInput}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                if (pinModal === 'confirm' || pinModal === 'change') setPinInput2(val);
                else setPinInput(val);
              }}
              maxLength={6}
              autoFocus
              style={{
                width: '100%', padding: '16px 20px', borderRadius: '16px',
                border: `1.5px solid ${pinError ? '#EF4444' : cardBorder}`, background: inputBg,
                fontSize: '24px', color: textPrimary, outline: 'none', textAlign: 'center',
                letterSpacing: '0.3em', fontWeight: 700, boxSizing: 'border-box'
              }}
              placeholder="••••••"
            />
            {pinError && <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center', margin: '10px 0 0' }}>{pinError}</p>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setPinModal(null)} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: inputBg, color: textSecondary, cursor: 'pointer', transition: 'all 150ms ease' }}>
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button onClick={() => {
                if (pinModal === 'create') handlePinCreate();
                else if (pinModal === 'confirm') handlePinConfirm();
                else if (pinModal === 'verify') handlePinVerify();
                else if (pinModal === 'change') handlePinChange();
              }} style={{
                flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px',
                border: 'none', background: '#EC4899', color: '#fff', cursor: 'pointer',
                transition: 'all 150ms ease'
              }}>
                {pinModal === 'verify' ? (lang === 'es' ? 'Desactivar' : 'Disable') : (lang === 'es' ? 'Siguiente' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: EXPORT DIARY ═══ */}
      {exportModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '16px'
        }} onClick={() => setExportModal(false)}>
          <div style={{
            background: cardBg, color: textPrimary,
            borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '400px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <FileText size={28} style={{ color: '#EC4899' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, textAlign: 'center', marginBottom: '8px' }}>
              {lang === 'es' ? 'Exportar diario' : 'Export diary'}
            </h3>
            <p style={{ fontSize: '13px', color: textSecondary, textAlign: 'center', margin: '0 0 24px' }}>
              {lang === 'es' ? 'Selecciona el formato de exportación' : 'Select export format'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => exportDiary('txt')} style={{
                width: '100%', height: '48px', borderRadius: '14px', border: `1.5px solid ${cardBorder}`,
                background: inputBg, color: textPrimary, fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 150ms ease'
              }}>
                <File size={16} /> {lang === 'es' ? 'Texto plano (.txt)' : 'Plain text (.txt)'}
              </button>
              <button onClick={() => exportDiary('json')} style={{
                width: '100%', height: '48px', borderRadius: '14px', border: `1.5px solid ${cardBorder}`,
                background: inputBg, color: textPrimary, fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 150ms ease'
              }}>
                <File size={16} /> {lang === 'es' ? 'Estructurado (.json)' : 'Structured (.json)'}
              </button>
              <button onClick={() => setExportModal(false)} style={{
                width: '100%', height: '48px', borderRadius: '14px', border: 'none',
                background: inputBg, color: textSecondary, fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 150ms ease'
              }}>
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODALES EXISTENTES ═══ */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '16px'
        }} onClick={() => setModal(null)}>
          <div style={{
            background: cardBg, color: textPrimary,
            borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '480px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            {modal === 'name' && (
              <>
                <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, textAlign: 'center' }}>{lang === 'es' ? 'Editar nombre' : 'Edit name'}</h3>
                <input value={modalVal} onChange={(e) => setModalVal(e.target.value)} style={{
                  width: '100%', padding: '16px 20px', borderRadius: '16px',
                  border: `1.5px solid ${cardBorder}`, background: inputBg,
                  fontSize: '16px', color: textPrimary, outline: 'none', marginTop: '20px',
                  boxSizing: 'border-box'
                }} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} />
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setModal(null)} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: inputBg, color: textSecondary, cursor: 'pointer' }}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={saveName} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: '#EC4899', color: '#fff', cursor: 'pointer' }}>{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
            {modal === 'email' && (
              <>
                <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, textAlign: 'center' }}>{lang === 'es' ? 'Correo electrónico' : 'Email'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '16px', border: `1.5px solid ${cardBorder}`, background: inputBg, marginTop: '20px' }}>
                  <Mail size={20} style={{ color: textSecondary }} />
                  <input type="email" value={modalVal} onChange={(e) => setModalVal(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '16px', color: textPrimary, outline: 'none' }} placeholder="correo@ejemplo.com" />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setModal(null)} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: inputBg, color: textSecondary, cursor: 'pointer' }}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={saveEmail} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: '#EC4899', color: '#fff', cursor: 'pointer' }}>{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
            {modal === 'password' && (
              <>
                <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, textAlign: 'center' }}>{lang === 'es' ? 'Cambiar contraseña' : 'Change password'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '16px', border: `1.5px solid ${cardBorder}`, background: inputBg, marginTop: '20px' }}>
                  <Lock size={20} style={{ color: textSecondary }} />
                  <input type="password" value={modalVal} onChange={(e) => setModalVal(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '16px', color: textPrimary, outline: 'none' }} placeholder={lang === 'es' ? 'Contraseña actual' : 'Current password'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '16px', border: `1.5px solid ${cardBorder}`, background: inputBg, marginTop: '12px' }}>
                  <Lock size={20} style={{ color: textSecondary }} />
                  <input type="password" value={modalVal2} onChange={(e) => setModalVal2(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '16px', color: textPrimary, outline: 'none' }} placeholder={lang === 'es' ? 'Nueva contraseña' : 'New password'} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={() => setModal(null)} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: inputBg, color: textSecondary, cursor: 'pointer' }}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={savePassword} style={{ flex: 1, height: '48px', borderRadius: '14px', fontWeight: 600, fontSize: '14px', border: 'none', background: '#EC4899', color: '#fff', cursor: 'pointer' }}>{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
