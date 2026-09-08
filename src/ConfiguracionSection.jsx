import React, { useState, useRef, useEffect } from 'react';
import {
  Heart, Settings, Palette, Moon, Sun, Volume2, MessageCircle,
  Shield, Lock, FileText, Globe, LogOut, User, Mail, Pencil,
  Image as ImageIcon, Camera, ChevronRight, BookOpen, BarChart3,
  Bell, Clock, Download, Star, HelpCircle, File, Info
} from 'lucide-react';

function CfgSw({ dm, icon, label, active, onToggle }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition ${dm ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className={`text-[13px] font-semibold flex-1 ${dm ? 'text-gray-300' : 'text-slate-700'}`}>{label}</span>
      <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${active ? 'bg-pink-500' : dm ? 'bg-gray-600' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function CfgOpt({ dm, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition ${dm ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-slate-700'}`}>
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-[13px] font-semibold flex-1">{label}</span>
      <ChevronRight size={16} className="text-gray-500" />
    </button>
  );
}

function CfgLangOpt({ dm, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition ${active ? (dm ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-pink-50 border border-pink-200') : (dm ? 'hover:bg-white/5 border border-transparent' : 'hover:bg-gray-50 border border-transparent')}`}>
      <span className={`text-[13px] font-semibold flex-1 ${active ? 'text-pink-400' : dm ? 'text-gray-300' : 'text-slate-700'}`}>{label}</span>
      {active && <span className="text-pink-500 font-bold text-[13px]">✓</span>}
    </button>
  );
}

export default function ConfiguracionSection({ darkMode: dmProp, setDarkMode: setDmProp, userName, setUserName, userEmail, setUserEmail, userPhotoUrl, setUserPhotoUrl, onLogout, onPhotoChange }) {
  const dm = dmProp;
  const setDm = setDmProp;
  const pinKey = (base) => `${base}_${userEmail}`;
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('safetyLove_psychFontSize') || 'normal');
  const [textStyle, setTextStyle] = useState(() => localStorage.getItem('safetyLove_psychTextStyle') || 'standard');
  const [lang, setLang] = useState(() => localStorage.getItem('safetyLove_psychLang') || 'es');
  const [modal, setModal] = useState(null);
  const [modalVal, setModalVal] = useState('');
  const [modalVal2, setModalVal2] = useState('');
  const [pinLock, setPinLock] = useState(() => localStorage.getItem(pinKey('safetyLove_pinLock')) === 'true' || localStorage.getItem('safetyLove_pinLock') === 'true');
  const [pinModal, setPinModal] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinInput2, setPinInput2] = useState('');
  const [pinError, setPinError] = useState('');

  const toast = (msg) => {
    const el = document.createElement('div');
    el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-2xl bg-slate-800 text-white text-[13px] font-semibold shadow-xl';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  };

  useEffect(() => {
    const sizeMap = { small: '13px', normal: '15px', large: '17px' };
    document.documentElement.style.fontSize = sizeMap[fontSize] || '15px';
    localStorage.setItem('safetyLove_psychFontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const saved = localStorage.getItem('safetyLove_psychTextStyle') || 'standard';
    applyTextStyle(saved, false);
  }, []);

  useEffect(() => {
    localStorage.setItem('safetyLove_psychLang', lang);
  }, [lang]);

  const applyFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('safetyLove_psychFontSize', size);
    document.documentElement.style.fontSize = size === 'small' ? '13px' : size === 'large' ? '17px' : '15px';
    toast(lang === 'es' ? 'Tamaño de texto ajustado' : 'Text size adjusted');
  };

  const applyTextStyle = (style, showToast = true) => {
    setTextStyle(style);
    localStorage.setItem('safetyLove_psychTextStyle', style);
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

  const toggleDark = () => {
    const next = !dm;
    setDm(next);
    toast(next ? (lang === 'es' ? 'Modo oscuro activado' : 'Dark mode on') : (lang === 'es' ? 'Modo oscuro desactivado' : 'Dark mode off'));
  };

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

  const saveName = () => {
    if (modalVal.trim()) {
      setUserName(modalVal.trim());
      localStorage.setItem('safetyLove_psychName', modalVal.trim());
      setModal(null);
      toast(lang === 'es' ? 'Nombre actualizado' : 'Name updated');
    }
  };

  const saveEmail = () => {
    if (modalVal.trim() && modalVal.includes('@')) {
      setUserEmail(modalVal.trim());
      localStorage.setItem('safetyLove_psychEmail', modalVal.trim());
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

  const cardStyle = dm
    ? 'bg-[#16213e] border-[#1e2d4a]'
    : 'bg-white border-gray-100';

  return (
    <div className={`min-h-full font-sans ${dm ? 'bg-[#070D1C] text-gray-200' : 'bg-[#FAFAFC] text-gray-900'}`}>
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 lg:py-12">

        {/* ═══ HEADER ═══ */}
        <header className="mb-8">
          <h1 className={`text-[32px] sm:text-[36px] font-extrabold tracking-tight ${dm ? 'text-white' : 'text-[#172033]'}`}>
            {lang === 'es' ? 'Ajustes' : 'Settings'}
          </h1>
          <p className={`text-[15px] mt-2 font-medium ${dm ? 'text-slate-400' : 'text-[#64748B]'}`}>
            {lang === 'es' ? 'Personaliza tu experiencia y controla tu privacidad.' : 'Customize your experience and control your privacy.'}
          </p>
        </header>

        {/* ═══ GRID PRINCIPAL ═══ */}
        <div style={{ marginBottom: '40px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* ── APARIENCIA ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-pink-500/10' : 'bg-pink-50'}`}>
                <Palette size={18} className="text-pink-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Apariencia' : 'Appearance'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Cómo se ve la aplicación.' : 'How the app looks.'}
            </p>
            <div className="space-y-1">
              <CfgSw dm={dm} icon={<Moon size={16}/>} label={lang === 'es' ? 'Modo oscuro' : 'Dark mode'} active={dm} onToggle={toggleDark} />
              <CfgSw dm={dm} icon={<Sun size={16}/>} label={lang === 'es' ? 'Modo claro' : 'Light mode'} active={!dm} onToggle={toggleDark} />
            </div>
          </div>

          {/* ── BIENESTAR ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                <Heart size={17} className="text-purple-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Bienestar' : 'Wellness'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Recordatorios y bienestar.' : 'Reminders and wellness.'}
            </p>
            <div className="space-y-1">
              <CfgSw dm={dm} icon={<BookOpen size={16}/>} label={lang === 'es' ? 'Recordatorio de escritura' : 'Writing reminder'} active={false} onToggle={() => toast(lang === 'es' ? 'Recordatorio' : 'Reminder')} />
              <CfgSw dm={dm} icon={<Clock size={16}/>} label={lang === 'es' ? 'Recordatorio del diario' : 'Diary reminder'} active={false} onToggle={() => toast(lang === 'es' ? 'Recordatorio' : 'Reminder')} />
              <CfgSw dm={dm} icon={<MessageCircle size={16}/>} label={lang === 'es' ? 'Frase diaria' : 'Daily quote'} active={false} onToggle={() => toast(lang === 'es' ? 'Frase diaria' : 'Daily quote')} />
              <CfgSw dm={dm} icon={<Heart size={16}/>} label={lang === 'es' ? 'Ejercicios' : 'Exercises'} active={false} onToggle={() => toast(lang === 'es' ? 'Ejercicios' : 'Exercises')} />
            </div>
          </div>

          {/* ── PRIVACIDAD ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Shield size={17} className="text-emerald-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Privacidad' : 'Privacy'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Protege tu información.' : 'Protect your information.'}
            </p>
            <div className="space-y-1">
              <CfgSw dm={dm} icon={<Lock size={16}/>} label={lang === 'es' ? 'Bloqueo PIN' : 'PIN lock'} active={pinLock} onToggle={startPinSetup} />
              <CfgSw dm={dm} icon={<Download size={16}/>} label={lang === 'es' ? 'Copia de seguridad' : 'Backup'} active={false} onToggle={() => toast(lang === 'es' ? 'Copia de seguridad' : 'Backup')} />
              <CfgOpt dm={dm} icon={<FileText size={16}/>} label={lang === 'es' ? 'Exportar diario' : 'Export diary'} onClick={() => toast(lang === 'es' ? 'Exportando...' : 'Exporting...')} />
            </div>
          </div>

          {/* ── NOTIFICACIONES ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                <Bell size={17} className="text-amber-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Notificaciones' : 'Notifications'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Controla tus alertas.' : 'Control your alerts.'}
            </p>
            <div className="space-y-1">
              <CfgSw dm={dm} icon={<Bell size={16}/>} label={lang === 'es' ? 'Activar notificaciones' : 'Enable notifications'} active={false} onToggle={() => toast(lang === 'es' ? 'Notificaciones' : 'Notifications')} />
              <CfgOpt dm={dm} icon={<Clock size={16}/>} label={lang === 'es' ? 'Horario silencioso' : 'Quiet hours'} onClick={() => toast(lang === 'es' ? 'Horario silencioso' : 'Quiet hours')} />
              <CfgOpt dm={dm} icon={<Settings size={16}/>} label={lang === 'es' ? 'Frecuencia' : 'Frequency'} onClick={() => toast(lang === 'es' ? 'Frecuencia' : 'Frequency')} />
            </div>
          </div>

          {/* ── IDIOMA ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Globe size={17} className="text-blue-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Idioma' : 'Language'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Selecciona tu idioma.' : 'Choose your language.'}
            </p>
            <div className="space-y-2">
              <CfgLangOpt dm={dm} label="Español" active={lang === 'es'} onClick={() => { setLang('es'); toast('Idioma: Español'); }} />
              <CfgLangOpt dm={dm} label="English" active={lang === 'en'} onClick={() => { setLang('en'); toast('Language: English'); }} />
            </div>
          </div>

          {/* ── ACERCA DE ── */}
          <div className={`rounded-[20px] border p-7 ${cardStyle}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dm ? 'bg-slate-500/10' : 'bg-slate-50'}`}>
                <Info size={17} className="text-slate-400" />
              </div>
              <h3 className={`text-[16px] font-bold ${dm ? 'text-white' : 'text-slate-900'}`}>{lang === 'es' ? 'Acerca de' : 'About'}</h3>
            </div>
            <p className={`text-[12px] font-medium mb-5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'es' ? 'Información y soporte.' : 'Information and support.'}
            </p>
            <div className="space-y-1">
              <CfgOpt dm={dm} icon={<FileText size={16}/>} label={lang === 'es' ? 'Términos y condiciones' : 'Terms'} onClick={() => toast(lang === 'es' ? 'Abriendo términos...' : 'Opening terms...')} />
              <CfgOpt dm={dm} icon={<Shield size={16}/>} label={lang === 'es' ? 'Política de privacidad' : 'Privacy policy'} onClick={() => toast(lang === 'es' ? 'Abriendo política...' : 'Opening policy...')} />
              <CfgOpt dm={dm} icon={<HelpCircle size={16}/>} label={lang === 'es' ? 'Soporte' : 'Support'} onClick={() => toast(lang === 'es' ? 'Abriendo soporte...' : 'Opening support...')} />
              <CfgOpt dm={dm} icon={<Star size={16}/>} label={lang === 'es' ? 'Calificar la app' : 'Rate the app'} onClick={() => toast(lang === 'es' ? '¡Gracias!' : 'Thanks!')} />
            </div>
          </div>

        </div>

        {/* ═══ PERFIL + CERRAR SESIÓN ═══ */}
        <div style={{ marginTop: '40px' }} className={`rounded-[20px] border p-7 ${cardStyle}`}>
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9', border: '2px solid rgba(255,255,255,0.1)' }}>
                {userPhotoUrl ? (
                  <img src={userPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className={dm ? 'text-slate-500' : 'text-slate-400'} />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition"
                style={{ background: '#F43F9E', border: '2px solid #16213e' }}>
                <Camera size={11} color="#fff" />
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { const r = new FileReader(); r.onload = (ev) => { setUserPhotoUrl(ev.target.result); if (onPhotoChange) onPhotoChange(ev.target.result); toast(lang === 'es' ? 'Foto actualizada' : 'Photo updated'); }; r.readAsDataURL(f); }
                }} />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`text-[16px] font-bold truncate ${dm ? 'text-white' : 'text-slate-900'}`}>{userName}</h4>
              <p className={`text-[13px] font-medium mt-0.5 truncate ${dm ? 'text-slate-400' : 'text-slate-500'}`}>Cada pequeño paso cuenta. <span className="text-pink-400">❤️</span></p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Mail size={12} className={dm ? 'text-slate-500' : 'text-slate-400'} />
                <span className={`text-[12px] truncate ${dm ? 'text-slate-500' : 'text-slate-400'}`}>{userEmail}</span>
              </div>
            </div>
          </div>
          <button onClick={() => { toast(lang === 'es' ? 'Cerrando sesión...' : 'Logging out...'); setTimeout(() => { if (onLogout) onLogout(); }, 800); }}
            className={`w-full py-3.5 rounded-2xl font-semibold text-[13px] transition flex items-center justify-center gap-2 ${dm ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-gray-50 text-slate-600 hover:bg-gray-100 border border-gray-200'}`}>
            <LogOut size={16}/> {lang === 'es' ? 'Cerrar sesión' : 'Log out'}
          </button>
        </div>

      </div>

      {/* ═══ MODALES ═══ */}
      {modal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className={`${dm ? 'bg-[#16213e] text-gray-200' : 'bg-white text-gray-900'} rounded-3xl shadow-2xl p-8 w-full max-w-xl`} onClick={(e) => e.stopPropagation()}>
            {modal === 'name' && (
              <>
                <h3 className="text-2xl font-bold mb-2 text-center">{lang === 'es' ? 'Editar nombre' : 'Edit name'}</h3>
                <input value={modalVal} onChange={(e) => setModalVal(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border text-base outline-none mt-4 ${dm ? 'bg-[#1f2b4d] border-[#2a2a4a] text-gray-200 focus:border-pink-400' : 'bg-gray-50 border-gray-200 focus:border-pink-400'}`} placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'} />
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setModal(null)} className={`flex-1 h-12 rounded-2xl font-semibold text-sm transition ${dm ? 'bg-[#1f2b4d] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={saveName} className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-pink-500 text-white hover:bg-pink-600 transition">{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
            {modal === 'email' && (
              <>
                <h3 className="text-2xl font-bold mb-2 text-center">{lang === 'es' ? 'Correo electrónico' : 'Email'}</h3>
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border mt-4 ${dm ? 'bg-[#1f2b4d] border-[#2a2a4a]' : 'bg-gray-50 border-gray-200'}`}>
                  <Mail size={20} className="text-gray-400" />
                  <input type="email" value={modalVal} onChange={(e) => setModalVal(e.target.value)} className={`flex-1 bg-transparent text-base outline-none ${dm ? 'text-gray-200' : 'text-gray-700'}`} placeholder="correo@ejemplo.com" />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setModal(null)} className={`flex-1 h-12 rounded-2xl font-semibold text-sm transition ${dm ? 'bg-[#1f2b4d] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={saveEmail} className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-pink-500 text-white hover:bg-pink-600 transition">{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
            {modal === 'password' && (
              <>
                <h3 className="text-2xl font-bold mb-2 text-center">{lang === 'es' ? 'Cambiar contraseña' : 'Change password'}</h3>
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border mt-4 ${dm ? 'bg-[#1f2b4d] border-[#2a2a4a]' : 'bg-gray-50 border-gray-200'}`}>
                  <Lock size={20} className="text-gray-400" />
                  <input type="password" value={modalVal} onChange={(e) => setModalVal(e.target.value)} className={`flex-1 bg-transparent text-base outline-none ${dm ? 'text-gray-200' : 'text-gray-700'}`} placeholder={lang === 'es' ? 'Contraseña actual' : 'Current password'} />
                </div>
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border mt-3 ${dm ? 'bg-[#1f2b4d] border-[#2a2a4a]' : 'bg-gray-50 border-gray-200'}`}>
                  <Lock size={20} className="text-gray-400" />
                  <input type="password" value={modalVal2} onChange={(e) => setModalVal2(e.target.value)} className={`flex-1 bg-transparent text-base outline-none ${dm ? 'text-gray-200' : 'text-gray-700'}`} placeholder={lang === 'es' ? 'Nueva contraseña' : 'New password'} />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setModal(null)} className={`flex-1 h-12 rounded-2xl font-semibold text-sm transition ${dm ? 'bg-[#1f2b4d] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
                  <button onClick={savePassword} className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-pink-500 text-white hover:bg-pink-600 transition">{lang === 'es' ? 'Guardar' : 'Save'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ PIN MODAL ═══ */}
      {pinModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPinModal(null)}>
          <div className={`${dm ? 'bg-[#16213e] text-gray-200' : 'bg-white text-gray-900'} rounded-3xl shadow-2xl p-8 w-full max-w-sm`} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                <Lock size={24} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-center">
                {pinModal === 'create' && (lang === 'es' ? 'Crear PIN' : 'Create PIN')}
                {pinModal === 'confirm' && (lang === 'es' ? 'Confirmar PIN' : 'Confirm PIN')}
                {pinModal === 'verify' && (lang === 'es' ? 'Ingresa tu PIN' : 'Enter your PIN')}
              </h3>
              <p className={`text-[13px] mt-1 text-center ${dm ? 'text-slate-400' : 'text-slate-500'}`}>
                {pinModal === 'create' && (lang === 'es' ? 'Ingresa un PIN de 4-6 dígitos' : 'Enter a 4-6 digit PIN')}
                {pinModal === 'confirm' && (lang === 'es' ? 'Confirma tu PIN' : 'Confirm your PIN')}
                {pinModal === 'verify' && (lang === 'es' ? 'Ingresa tu PIN para desactivar el bloqueo' : 'Enter your PIN to disable lock')}
              </p>
            </div>
            <input
              type="password" value={pinModal === 'confirm' ? pinInput2 : pinInput}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); if (pinModal === 'confirm') setPinInput2(val); else setPinInput(val); setPinError(''); }}
              placeholder="••••" maxLength={6} autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') { if (pinModal === 'create') handlePinCreate(); else if (pinModal === 'confirm') handlePinConfirm(); else if (pinModal === 'verify') handlePinVerify(); } }}
              className={`w-full h-14 rounded-2xl border text-center text-2xl font-bold tracking-[0.3em] outline-none mb-3 ${dm ? 'bg-[#1f2b4d] border-[#2a2a4a] text-gray-200 focus:border-pink-400' : 'bg-gray-50 border-gray-200 focus:border-pink-400'}`}
            />
            {pinError && <p className="text-red-500 text-[13px] font-semibold text-center mb-3">{pinError}</p>}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setPinModal(null)} className={`flex-1 h-12 rounded-2xl font-semibold text-sm transition ${dm ? 'bg-[#1f2b4d] text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                {lang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button onClick={() => { if (pinModal === 'create') handlePinCreate(); else if (pinModal === 'confirm') handlePinConfirm(); else if (pinModal === 'verify') handlePinVerify(); }}
                className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-pink-500 text-white hover:bg-pink-600 transition">
                {pinModal === 'verify' ? (lang === 'es' ? 'Desactivar' : 'Disable') : (lang === 'es' ? 'Siguiente' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
