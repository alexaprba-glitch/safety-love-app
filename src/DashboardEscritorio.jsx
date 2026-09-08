import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { addEmergencyRequest } from './emergencyStore';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarPortrait from './AvatarPortrait.jsx';
import ChatIA from './ChatIA.jsx';
import BlogAnonimo from './BlogAnonimo.jsx';
import GamesSection from './GamesSection.jsx';
import ConfiguracionStudentSection from './ConfiguracionStudentSection.jsx';
import DiaryPersonalSection from './DiaryPersonalSection.jsx';
import PsicologoSection from './PsicologoSection.jsx';
import EmotionDayModal from './EmotionDayModal.jsx';
import RemindersSection from './RemindersSection.jsx';
import SafetyMascot from './SafetyMascot.jsx';
import MascotSelector from './MascotSelector.jsx';
import { getMascotById } from './mascotData';
import {
  Heart,
  MessageCircle,
  MessageSquare,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  Settings,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Bookmark,
  BookOpen,
  Home,
  Smile,
  Shield,
  Send,
  MoreHorizontal,
  PlusCircle,
  Users,
  Lightbulb,
  Book,
  PlusSquare,
  Meh,
  Frown,
  Zap,
  Edit3,
  Image as ImageIcon,
  Image,
  Tag,
  Star,
  PenTool,
  UserCircle2,
  Paperclip,
  Clock,
  ArrowRight,
  Info,
  Share2,
  Moon,
  PawPrint,
  Bone,
  Volleyball,
  Shirt,
  Palette,
  Type as TypeIcon,
  Bell,
  Bot,
  Volume2,
  Fingerprint,
  Globe,
  FileText,
  LogOut,
  Pencil,
  Mail,
  Flag,
  Coffee,
  Brain,
  Dumbbell,
  Trash2,
  CheckCircle,
  CheckCircle2,
  LayoutList,
  Wind,
  Target,
  Feather,
  PieChart,
  PenLine,
  Check,
  Video,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  Link as LinkIcon,
  Droplet,
  Phone,
  Activity,
  RefreshCw,
  ChevronDown,
  Circle,
  X,
  Camera,
  Menu
} from 'lucide-react';

// ================= ERROR BOUNDARY =================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return React.createElement('div', { className: 'p-8 bg-red-50 text-red-800 rounded-xl m-4' },
        React.createElement('h2', { className: 'font-bold text-lg mb-2' }, 'Error en Configuración'),
        React.createElement('pre', { className: 'text-sm whitespace-pre-wrap' }, this.state.error.message + '\n' + this.state.error.stack)
      );
    }
    return this.props.children;
  }
}

// ================= CUSTOM SVG ILLUSTRATIONS =================

const SidebarMug = () => (
  <svg className="w-16 h-16 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Plant sprouting */}
    <path d="M48 40 Q35 25, 25 30 Q35 37, 48 40" fill="#8EB694" />
    <path d="M48 40 Q60 25, 70 30 Q60 37, 48 40" fill="#8EB694" />
    <path d="M48 40 Q48 15, 43 10 Q50 23, 48 40" fill="#A7C7AE" />
    
    {/* Cup/Mug */}
    <path d="M28 50 C28 78, 68 78, 68 50 Z" fill="#FFF1F2" stroke="#E88B9A" strokeWidth="2.5" />
    <path d="M68 54 C74 54, 74 64, 68 64" stroke="#E88B9A" strokeWidth="2.5" fill="none" />
    
    {/* Heart on Cup */}
    <path d="M48 66 C44 62, 40 58, 40 55 C40 51, 44 49, 48 53 C52 49, 56 51, 56 55 C56 58, 52 62, 48 66 Z" fill="#E88B9A" />
  </svg>
);

const CalendarSprout = () => (
  <svg className="w-20 h-32 opacity-40 absolute right-1 bottom-1 pointer-events-none" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 140 Q40 100, 60 20" stroke="#8EB694" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Leaves */}
    <path d="M43 115 Q30 110, 25 100 Q40 100, 43 115 Z" fill="#8EB694" />
    <path d="M47 105 Q60 100, 65 90 Q50 90, 47 105 Z" fill="#A7C7AE" />
    <path d="M50 85 Q35 80, 30 70 Q45 70, 50 85 Z" fill="#8EB694" />
    <path d="M53 75 Q68 70, 73 60 Q58 60, 53 75 Z" fill="#A7C7AE" />
    <path d="M55 55 Q42 50, 38 40 Q50 40, 55 55 Z" fill="#8EB694" />
    <path d="M58 45 Q70 40, 75 30 Q63 30, 58 45 Z" fill="#A7C7AE" />
    <path d="M60 20 Q50 10, 45 2 Q58 10, 60 20 Z" fill="#8EB694" />
  </svg>
);

const VersiculoVase = () => (
  <svg className="w-16 h-20 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stems */}
    <path d="M40 50 Q30 30, 20 15" stroke="#8EB694" strokeWidth="1.5" fill="none" />
    <path d="M40 50 Q50 25, 60 10" stroke="#8EB694" strokeWidth="1.5" fill="none" />
    <path d="M40 50 L40 5" stroke="#8EB694" strokeWidth="1.5" fill="none" />
    
    {/* Leaves */}
    <circle cx="20" cy="15" r="4" fill="#A7C7AE" />
    <circle cx="23" cy="22" r="3" fill="#8EB694" />
    <circle cx="16" cy="25" r="3.5" fill="#8EB694" />
    
    <circle cx="60" cy="10" r="4" fill="#A7C7AE" />
    <circle cx="55" cy="18" r="3.5" fill="#8EB694" />
    
    <circle cx="40" cy="5" r="4.5" fill="#A7C7AE" />
    <circle cx="37" cy="18" r="3" fill="#8EB694" />
    <circle cx="44" cy="28" r="3.5" fill="#8EB694" />
    
    {/* Vase */}
    <path d="M25 50 Q40 45, 55 50 L50 85 C50 90, 30 90, 30 85 Z" fill="#FFF1F2" stroke="#E88B9A" strokeWidth="1.5" />
    <ellipse cx="40" cy="50" rx="15" ry="3" fill="#FFE4E6" />
    
    {/* Bottom shadow */}
    <ellipse cx="40" cy="90" rx="12" ry="2" fill="#E2E8F0" opacity="0.5" />
  </svg>
);

const SunsetHills = () => (
  <svg className="w-full h-14 rounded-b-3xl" viewBox="0 0 200 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="100" cy="40" r="20" fill="#FFFBEB" />
    <circle cx="100" cy="40" r="15" fill="#FFEDD5" />
    
    {/* Hills */}
    <path d="M0 60 Q50 35, 100 45 Q150 55, 200 35 L200 60 Z" fill="#E6EDE7" />
    <path d="M0 60 Q30 45, 80 40 Q130 35, 200 50 L200 60 Z" fill="#D6E4D8" opacity="0.8" />
    <path d="M0 60 Q70 50, 140 42 Q180 38, 200 60 Z" fill="#8EB694" opacity="0.25" />
  </svg>
);

const SpeechBubbles = () => (
  <svg className="w-24 h-20 absolute right-4 bottom-2 pointer-events-none" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big Bubble */}
    <path d="M15 35 C15 18, 48 18, 48 35 C48 42, 43 48, 38 50 C35 55, 23 58, 25 50 C16 48, 15 42, 15 35 Z" fill="#FFF1F2" stroke="#FEE2E2" strokeWidth="1.5" />
    
    {/* Small Bubble */}
    <path d="M48 52 C48 40, 78 40, 78 52 C78 57, 73 61, 70 63 C68 67, 61 68, 62 63 C53 62, 48 57, 48 52 Z" fill="#FFE4E6" opacity="0.8" />
    
    {/* Tiny hearts */}
    <path d="M30 28 C28 26, 26 26, 26 28 C26 30, 30 33, 30 33 C30 33, 34 30, 34 28 C34 26, 32 26, 30 28 Z" fill="#E88B9A" />
    <path d="M63 48 C62 47, 61 47, 61 48 C61 49, 63 51, 63 51 C63 51, 65 49, 65 48 C65 47, 64 47, 63 48 Z" fill="#E88B9A" />
  </svg>
);

const NotebookIllustration = () => (
  <svg className="w-16 h-20" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Notebook Cover */}
    <rect x="15" y="10" width="50" height="75" rx="6" fill="#FFF1F2" stroke="#E88B9A" strokeWidth="2.5" />
    
    {/* Spine details / rings */}
    <path d="M12 22 L18 22 M12 35 L18 35 M12 48 L18 48 M12 61 L18 61 M12 74 L18 74" stroke="#E88B9A" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* White heart in the center */}
    <path d="M40 50 C35 44, 28 40, 28 32 C28 23, 38 20, 40 30 C42 20, 52 23, 52 32 C52 40, 45 44, 40 50 Z" fill="white" stroke="#E88B9A" strokeWidth="1.5" />
    
    {/* Bookmark ribbon */}
    <path d="M48 10 L48 30 L52 25 L56 30 L56 10 Z" fill="#E88B9A" opacity="0.5" />
  </svg>
);

// Safety bot logo used in anonymous chat
const SafetyIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 45C35 30 20 35 20 50C20 65 50 85 50 85C50 85 80 65 80 50C80 35 65 30 50 45Z" fill="#FFB3C6" />
    <path d="M45 40L40 30L45 35L50 30L55 35L60 30L55 40" stroke="#8EB694" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 65C30 50 40 40 50 40C60 40 70 50 70 65" stroke="#D4A373" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

function DailyVerseSection({ darkMode }) {
  const dm = darkMode;
  const pink = '#F43F9E';
  const textPrimary = dm ? '#F8FAFC' : '#1E293B';
  const textSecondary = dm ? '#94A3B8' : '#64748B';

  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: dm ? '#070D1C' : '#F5F0E8', padding: '40px 40px' }}>
      <style>{`
        .verse-card-wrapper { position: relative; width: 100%; max-width: 1250px; }
        .verse-decor { position: absolute; pointer-events: none; opacity: 0.06; }
        @media (max-width: 768px) {
          .verse-actions-grid { grid-template-columns: 1fr !important; }
          .verse-main-title { font-size: 32px !important; }
          .verse-reflection-text { font-size: 15px !important; max-width: 100% !important; }
          .verse-card-inner { padding: 28px 24px !important; }
        }
      `}</style>

      <div className="verse-card-wrapper">
        {/* ── Decorative background shapes ── */}
        <div className="verse-decor" style={{ top: '-40px', left: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,158,0.15) 0%, transparent 70%)' }} />
        <div className="verse-decor" style={{ bottom: '-60px', right: '-30px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />
        <div className="verse-decor" style={{ top: '40%', right: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

        {/* ── Botanical left decoration ── */}
        <div className="verse-decor hidden lg:block" style={{ left: '-80px', top: '20%', opacity: 0.04 }}>
          <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
            <path d="M60 200 C60 200, 20 140, 30 100 C35 80, 50 70, 60 50 C70 70, 85 80, 90 100 C100 140, 60 200, 60 200Z" fill="#F43F9E" />
            <path d="M60 50 C60 50, 40 20, 50 0" stroke="#F43F9E" strokeWidth="2" fill="none" />
            <path d="M50 10 C40 0, 30 5, 35 15" fill="#F43F9E" opacity="0.5" />
            <path d="M50 10 C60 0, 70 5, 65 15" fill="#F43F9E" opacity="0.5" />
          </svg>
        </div>

        {/* ── Botanical right decoration ── */}
        <div className="verse-decor hidden lg:block" style={{ right: '-80px', top: '15%', opacity: 0.04 }}>
          <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
            <path d="M60 200 C60 200, 100 140, 90 100 C85 80, 70 70, 60 50 C50 70, 35 80, 30 100 C20 140, 60 200, 60 200Z" fill="#A78BFA" />
            <path d="M60 50 C60 50, 80 20, 70 0" stroke="#A78BFA" strokeWidth="2" fill="none" />
            <path d="M70 10 C80 0, 90 5, 85 15" fill="#A78BFA" opacity="0.5" />
            <path d="M70 10 C60 0, 50 5, 55 15" fill="#A78BFA" opacity="0.5" />
          </svg>
        </div>

        {/* ── Main Card ── */}
        <div
          className="verse-card-inner relative overflow-hidden"
          style={{
            width: '100%',
            borderRadius: '32px',
            padding: '56px 60px',
            background: dm
              ? 'linear-gradient(165deg, #0D1527 0%, #121D35 30%, #15192E 60%, #0F1830 100%)'
              : 'linear-gradient(165deg, #FFFFFF 0%, #F8FAFC 30%, #F1F5F9 60%, #FFFFFF 100%)',
            border: dm ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            boxShadow: dm ? '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)' : '0 24px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
          }}
        >
          {/* ── Share Button ── */}
          <button className="absolute flex items-center transition-all duration-200 z-10"
            style={{
              top: '24px',
              right: '24px',
              height: '44px',
              padding: '0 18px',
              borderRadius: '12px',
              background: 'transparent',
              border: dm ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              color: dm ? 'rgba(255,255,255,0.7)' : '#475569',
              fontSize: '14px',
              fontWeight: 600,
              gap: '8px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = pink; e.currentTarget.style.background = 'rgba(244,63,158,0.08)'; e.currentTarget.style.color = '#F43F9E'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dm ? 'rgba(255,255,255,0.7)' : '#475569'; }}>
            <Share2 size={16} /> Compartir
          </button>

          {/* ── Header: VERSÍCULO DEL DÍA ── */}
          <div className="flex justify-center items-center relative z-10" style={{ marginTop: '8px', marginBottom: '36px', gap: '16px' }}>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, rgba(244,63,158,0.4))' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: pink }}>
              Versículo del día
            </span>
            <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, rgba(244,63,158,0.4), transparent)' }} />
          </div>

          {/* ── Quote Icon ── */}
          <div className="flex justify-center relative z-10" style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '72px',
              lineHeight: 1,
              color: pink,
              opacity: 0.5,
              textShadow: '0 0 40px rgba(244,63,158,0.2)',
              fontFamily: 'Georgia, serif',
            }}>
              &#10077;
            </div>
          </div>

          {/* ── Verse Text ── */}
          <div className="flex justify-center relative z-10" style={{ marginBottom: '32px' }}>
            <h1
              className="verse-main-title"
              style={{
                fontSize: '52px',
                fontWeight: 400,
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: '880px',
                lineHeight: 1.3,
                color: dm ? '#FFFFFF' : '#1E293B',
                fontFamily: "Georgia, 'Times New Roman', serif",
                textShadow: dm ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              <span style={{ color: pink, opacity: 0.6, fontSize: '56px', fontFamily: 'Georgia, serif' }}>&ldquo;</span>
              El amor es paciente, es bondadoso. No es envidioso ni jactancioso ni orgulloso.
              <span style={{ color: pink, opacity: 0.6, fontSize: '56px', fontFamily: 'Georgia, serif' }}>&rdquo;</span>
            </h1>
          </div>

          {/* ── Reference Pill ── */}
          <div className="flex justify-center relative z-10" style={{ marginBottom: '40px' }}>
            <div className="inline-flex items-center" style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: '1px solid rgba(244,63,158,0.25)',
              background: 'rgba(244,63,158,0.06)',
              gap: '10px',
              fontSize: '15px',
              fontWeight: 600,
              color: dm ? 'rgba(255,255,255,0.85)' : '#475569',
            }}>
              <BookOpen size={16} style={{ color: pink }} />
              1 Corintios 13:4
            </div>
          </div>

          {/* ── Separator: REFLEXIÓN PARA TI ── */}
          <div className="flex justify-center items-center relative z-10" style={{ marginBottom: '24px', gap: '16px' }}>
            <div style={{ height: '1px', width: '50px', background: 'linear-gradient(90deg, transparent, rgba(244,63,158,0.3))' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px', color: pink, textTransform: 'uppercase' }}>
              &#9829; Reflexión para ti &#9829;
            </span>
            <div style={{ height: '1px', width: '50px', background: 'linear-gradient(90deg, rgba(244,63,158,0.3), transparent)' }} />
          </div>

          {/* ── Reflection Text ── */}
          <div className="flex justify-center relative z-10" style={{ marginBottom: '40px' }}>
            <p
              className="verse-reflection-text"
              style={{
                fontSize: '18px',
                lineHeight: 1.7,
                textAlign: 'center',
                maxWidth: '860px',
                color: dm ? 'rgba(255,255,255,0.65)' : '#475569',
                fontWeight: 400,
              }}
            >
              Recuerda que el amor verdadero comienza contigo mismo y con la paciencia que te tienes en tu proceso de crecimiento.
              No tienes que ser perfecto para ser amado; la bondad y la humildad son tus mejores guías. Hoy, date permiso para brillar
              sin compararte con los demás.
            </p>
          </div>

          {/* ── Action Cards ── */}
          <div className="verse-actions-grid grid grid-cols-2 relative z-10" style={{ gap: '20px' }}>
            <button
              className="flex items-center transition-all duration-200 text-left group"
              style={{
                minHeight: '100px',
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(244,63,158,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(244,63,158,0.2), rgba(244,63,158,0.08))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: '20px',
              }}>
                <Heart size={24} style={{ color: pink }} />
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>Guarda este versículo</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Recuérdalo cuando lo necesites</p>
              </div>
            </button>

            <button
              className="flex items-center transition-all duration-200 text-left group"
              style={{
                minHeight: '100px',
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.08))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginRight: '20px',
              }}>
                <PenLine size={24} style={{ color: '#A78BFA' }} />
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>Escribe tu reflexión</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Anota lo que este versículo significa para ti</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function DailyAdviceSection({ darkMode }) {
  const dm = darkMode;
  const [reflection, setReflection] = useState('');
  const [savedFrase, setSavedFrase] = useState(false);
  const [tipExpanded, setTipExpanded] = useState(null);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [habits, setHabits] = useState([
    { id: 1, text: 'Beber 2 litros de agua', icon: '💧', done: false },
    { id: 2, text: 'Meditar 5 minutos', icon: '🧘', done: false },
    { id: 3, text: 'Caminar al aire libre', icon: '🚶', done: false },
    { id: 4, text: 'Escribir en el diario', icon: '📓', done: false },
    { id: 5, text: 'Dormir antes de las 11', icon: '🌙', done: false },
  ]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const completedHabits = habits.filter(h => h.done).length;
  const habitPct = Math.round((completedHabits / habits.length) * 100);

  const bg = dm ? 'bg-[#1a1a2e]' : 'bg-[#F8F9FC]';
  const card = dm ? 'bg-[#16213e] border-[#2a2a4a]' : 'bg-white border-gray-100';
  const cardHover = dm ? 'hover:bg-[#1a2440]' : 'hover:bg-gray-50';
  const text = dm ? 'text-gray-100' : 'text-slate-800';
  const text2 = dm ? 'text-gray-400' : 'text-slate-500';
  const text3 = dm ? 'text-gray-300' : 'text-slate-600';
  const subtle = dm ? 'text-gray-500' : 'text-slate-400';
  const softBg = dm ? 'bg-[#1f2b4d]' : 'bg-gray-50';

  const exercises = [
    { lucide: <Wind size={22} />, label: 'Respiración 4-7-8', desc: 'Calma tu sistema nervioso con esta técnica probada', time: '4 min', lightBg: 'bg-blue-50', darkBg: 'bg-blue-900/30', textCol: 'text-blue-600', darkTextCol: 'text-blue-400', accent: 'from-blue-500 to-cyan-400' },
    { lucide: <Brain size={22} />, label: 'Meditación guiada', desc: 'Enfóca tu atención plena en el momento presente', time: '5 min', lightBg: 'bg-purple-50', darkBg: 'bg-purple-900/30', textCol: 'text-purple-600', darkTextCol: 'text-purple-400', accent: 'from-purple-500 to-violet-400' },
  ];

  const benefits = [
    { icon: <Heart size={16} className="text-rose-500" />, title: 'Reduce la ansiedad', desc: 'Técnicas de respiración que calman tu mente' },
    { icon: <Moon size={16} className="text-purple-500" />, title: 'Mejora tu sueño', desc: 'Hábitos nocturnos para descansar mejor' },
    { icon: <Shield size={16} className="text-blue-500" />, title: 'Fortalece tu autoestima', desc: 'Prácticas diarias de autocompasión' },
    { icon: <Sparkles size={16} className="text-amber-500" />, title: 'Aumenta tu energía', desc: 'Ejercicios que revitalizan tu cuerpo' },
    { icon: <BookOpen size={16} className="text-emerald-500" />, title: 'Claridad mental', desc: 'Meditación para enfocar tus pensamientos' },
  ];

  const weekBars = [
    { day: 'L', val: 85 }, { day: 'M', val: 70 }, { day: 'X', val: 90 },
    { day: 'J', val: 60 }, { day: 'V', val: 95 }, { day: 'S', val: 40 }, { day: 'D', val: 30 },
  ];

  return (
    <div className={`min-h-full ${bg} p-6 md:p-8`}>
      <div className="max-w-[1520px] mx-auto">

        {/* ── 1. FRASE DEL DÍA — Full width ── */}
        <div className={`${card} rounded-[24px] border overflow-hidden transition-shadow duration-300 hover:shadow-xl mb-6 ${dm ? 'shadow-black/20 hover:shadow-pink-500/10' : 'shadow-gray-200/60 hover:shadow-pink-200/50'}`}>
          <div className={`relative p-10 md:p-12 ${dm ? 'bg-gradient-to-br from-[#2a1f3d] via-[#1f2847] to-[#1f2b4d]' : 'bg-gradient-to-br from-rose-50 via-pink-50/80 to-purple-50'}`}>
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] ${dm ? 'bg-pink-400' : 'bg-rose-400'}`}></div>
            <div className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-[0.05] ${dm ? 'bg-purple-400' : 'bg-purple-300'}`}></div>
            <div className={`absolute top-1/2 right-16 w-20 h-20 rounded-full opacity-[0.04] ${dm ? 'bg-rose-400' : 'bg-pink-300'}`}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${dm ? 'bg-white/10' : 'bg-white/60'}`}>
                <span className="text-3xl">“</span>
              </div>
              <div className="flex-1">
                <span className={`inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase ${dm ? 'text-pink-400' : 'text-rose-500'}`}>
                  <BookOpen size={14} /> Frase del día
                </span>
                <h2 className={`text-2xl md:text-[1.8rem] font-serif italic leading-[1.8] max-w-3xl ${text}`}>
                  "Lo que hoy duele no define quién eres ni cuánto vales. Eres suficiente tal y como eres."
                </h2>
                <div className="flex items-center gap-5 mt-8">
                  <button
                    onClick={() => setSavedFrase(!savedFrase)}
                    className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                      savedFrase
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-400/30'
                        : dm
                          ? 'bg-white/10 text-rose-300 border border-white/10 hover:bg-white/15'
                          : 'bg-white/80 text-rose-500 border border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    <Heart size={16} className={savedFrase ? 'fill-white' : ''} />
                    {savedFrase ? 'Guardada' : 'Guardar frase'}
                  </button>
                  <span className={`text-xs font-medium ${subtle}`}>1 Corintios 13:4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid: Reflexión + Consejo del día ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">

          {/* ── 2. REFLEXIÓN ── */}
          <div className={`${card} rounded-[24px] border p-8 transition-shadow duration-300 hover:shadow-lg ${dm ? 'shadow-black/10' : 'shadow-gray-200/40'}`}>
            <div className="flex items-start gap-5 mb-6">
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 ${dm ? 'bg-gradient-to-br from-pink-900/40 to-purple-900/40' : 'bg-gradient-to-br from-rose-100 to-pink-100'}`}>
                <PenLine size={24} className="text-rose-500" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${text}`}>Comparte tu reflexión</h3>
                <p className={`text-sm mt-1 ${text2}`}>Escribe cómo te sientes hoy. Es tu espacio seguro y privado.</p>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                maxLength={500}
                className={`w-full h-[180px] p-6 rounded-2xl border text-sm leading-relaxed outline-none resize-none transition-all duration-300 focus:ring-2 ${
                  dm
                    ? 'bg-[#1f2b4d] border-[#2a2a4a] text-gray-200 placeholder-gray-500 focus:border-pink-500/50 focus:ring-pink-500/10'
                    : 'bg-gray-50 border-gray-200 text-slate-700 placeholder-slate-400 focus:border-pink-400 focus:ring-pink-100'
                }`}
                placeholder="Hoy me siento... porque..."
              />
              <span className={`absolute bottom-4 right-5 text-[11px] tabular-nums font-medium transition-colors ${reflection.length > 450 ? 'text-red-400' : subtle}`}>
                {reflection.length}/500
              </span>
            </div>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => { if (reflection.trim()) setReflection(''); }}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-sm hover:from-rose-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-rose-300/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Publicar <Send size={15} />
              </button>
            </div>
          </div>

          {/* ── 3. CONSEJO DESTACADO + 4. BENEFICIOS ── */}
          <div className="space-y-6">
            {/* Consejo destacado */}
            <div className={`${card} rounded-[24px] border overflow-hidden transition-shadow duration-300 hover:shadow-lg ${dm ? 'shadow-black/10' : 'shadow-gray-200/40'}`}>
              <div className={`relative p-7 ${dm ? 'bg-gradient-to-br from-amber-900/20 to-orange-900/10' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 ${dm ? 'bg-amber-900/40' : 'bg-amber-100'}`}>
                    <Lightbulb size={24} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500">Consejo del día</span>
                    <h4 className={`font-bold text-base mt-1 ${text}`}>Habla contigo como le hablarías a un buen amigo</h4>
                    <p className={`text-sm mt-2 leading-relaxed ${text3}`}>
                      {tipExpanded === 'main'
                        ? 'La autocompasión es el primer paso hacia el bienestar. Cuando te hablas con amabilidad, reducís el estrés y aumentás tu capacidad de recuperación emocional. Intentá pausar antes de juzgarte.'
                        : 'Cambia tu diálogo interno. Cuando cometas un error, en vez de criticarte, pregúntate: ¿qué le diría a alguien que quiero?'}
                    </p>
                    <button
                      onClick={() => setTipExpanded(tipExpanded === 'main' ? null : 'main')}
                      className="mt-3 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                    >
                      {tipExpanded === 'main' ? 'Leer menos' : 'Leer más'} <ChevronRight size={13} className={`transition-transform duration-200 ${tipExpanded === 'main' ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. RETO DEL DÍA + UN PASO A LA VEZ ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">

          {/* Reto del día */}
          <div className={`${card} rounded-[24px] border overflow-hidden transition-shadow duration-300 hover:shadow-lg ${dm ? 'shadow-black/10' : 'shadow-gray-200/40'}`}>
            <div className={`p-8 ${dm ? 'bg-gradient-to-br from-pink-900/20 to-rose-900/10' : 'bg-gradient-to-br from-pink-50 to-rose-50'}`}>
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${dm ? 'bg-pink-900/40' : 'bg-pink-100'}`}>
                  <span className="text-3xl">✦</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-pink-500">Reto del día</span>
                  <h4 className={`font-bold text-lg mt-1 ${text}`}>5 minutos de gratitud</h4>
                  <p className={`text-sm mt-2 leading-relaxed ${text3}`}>
                    Escribe 3 cosas por las que estés agradecido hoy. Pueden ser pequeñas: una sonrisa, un café caliente, o el simple hecho de estar aquí.
                  </p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold ${text2}`}>Progreso</span>
                      <span className="text-xs font-bold text-pink-500">{challengeAccepted ? '100%' : '0%'}</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${dm ? 'bg-[#2a2a4a]' : 'bg-pink-100'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-700 ease-out"
                        style={{ width: challengeAccepted ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!challengeAccepted) {
                        setShowChallengeModal(true);
                      } else {
                        setChallengeAccepted(false);
                        setChallengeText('');
                      }
                    }}
                    className={`mt-5 px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      challengeAccepted
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-300/30'
                        : dm
                          ? 'bg-pink-900/40 text-pink-300 border border-pink-500/30 hover:bg-pink-900/60'
                          : 'bg-pink-100 text-pink-600 border border-pink-200 hover:bg-pink-200'
                    }`}
                  >
                    {challengeAccepted ? '✓ Reto aceptado' : 'Aceptar reto'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Un paso a la vez */}
          <div className={`${card} rounded-[24px] border p-7 transition-shadow duration-300 hover:shadow-lg ${dm ? 'shadow-black/10' : 'shadow-gray-200/40'}`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dm ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <Target size={18} className="text-purple-500" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${text}`}>Un paso a la vez</h4>
                  <p className={`text-[11px] ${text2}`}>
                    <span className="font-bold text-purple-500">{completedHabits}</span>/{habits.length} completados
                  </p>
                </div>
              </div>
              <div className="relative">
                <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" strokeWidth="4" className={dm ? 'stroke-[#2a2a4a]' : 'stroke-gray-100'} />
                  <circle cx="24" cy="24" r="20" fill="none" strokeWidth="4" stroke="#a855f7" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - habitPct / 100)}`} className="transition-all duration-700 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-[11px] font-extrabold ${text}`}>{habitPct}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {habits.map(h => (
                <div
                  key={h.id}
                  onClick={() => toggleHabit(h.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border group ${
                    h.done
                      ? dm ? 'bg-purple-900/15 border-purple-500/20' : 'bg-purple-50 border-purple-100'
                      : dm ? 'bg-[#1f2b4d] border-transparent hover:bg-[#252f4d] hover:border-[#2a2a4a]' : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                    h.done
                      ? 'bg-purple-500 border-purple-500'
                      : dm ? 'border-gray-600 group-hover:border-purple-400' : 'border-gray-300 group-hover:border-purple-400'
                  }`}>
                    {h.done && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-base shrink-0">{h.icon}</span>
                  <span className={`flex-1 font-medium text-xs transition-all duration-200 ${h.done ? (dm ? 'text-gray-500 line-through' : 'text-slate-400 line-through') : text}`}>
                    {h.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal Reto del día ── */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowChallengeModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div
            className={`relative w-full max-w-lg rounded-[24px] border overflow-hidden shadow-2xl animate-[scaleIn_0.2s_ease] ${card}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-7 pb-5 ${dm ? 'bg-gradient-to-br from-pink-900/20 to-rose-900/10' : 'bg-gradient-to-br from-pink-50 to-rose-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dm ? 'bg-pink-900/40' : 'bg-pink-100'}`}>
                    <span className="text-2xl">✦</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-pink-500">Reto del día</span>
                    <h3 className={`font-bold text-base ${text}`}>5 minutos de gratitud</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${dm ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  ✕
                </button>
              </div>
              <p className={`text-sm leading-relaxed ${text3}`}>
                Escribe 3 cosas por las que estés agradecido hoy. Pueden ser pequeñas: una sonrisa, un café caliente, o el simple hecho de estar aquí.
              </p>
            </div>

            {/* Body */}
            <div className="p-7 pt-5">
              <textarea
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                maxLength={500}
                className={`w-full h-[160px] p-5 rounded-2xl border text-sm leading-relaxed outline-none resize-none transition-all duration-300 focus:ring-2 ${
                  dm
                    ? 'bg-[#1f2b4d] border-[#2a2a4a] text-gray-200 placeholder-gray-500 focus:border-pink-500/50 focus:ring-pink-500/10'
                    : 'bg-gray-50 border-gray-200 text-slate-700 placeholder-slate-400 focus:border-pink-400 focus:ring-pink-100'
                }`}
                placeholder="1. Agradezco por...&#10;2. Me siento afortunado/a de...&#10;3. Valorizo..."
              />
              <span className={`text-[11px] tabular-nums font-medium ${challengeText.length > 450 ? 'text-red-400' : subtle}`}>
                {challengeText.length}/500
              </span>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => setShowChallengeModal(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${dm ? 'bg-[#1f2b4d] text-gray-300 hover:bg-[#252f4d]' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (challengeText.trim()) {
                      setChallengeAccepted(true);
                      setShowChallengeModal(false);
                    }
                  }}
                  disabled={!challengeText.trim()}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    challengeText.trim()
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300/30 hover:shadow-xl'
                      : dm ? 'bg-[#1f2b4d] text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Completar reto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SafetyLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85C30 85 15 70 15 50C15 35 25 25 35 30C40 32 45 35 50 40C55 35 60 32 65 30C75 25 85 35 85 50C85 70 70 85 50 85Z" fill="#E8B5A2" />
    <path d="M50 40C45 30 35 25 30 25C20 25 15 35 15 45C15 55 25 65 35 65C40 65 45 60 50 55C55 60 60 65 65 65C75 65 85 55 85 45C85 35 80 25 70 25C65 25 55 30 50 40Z" fill="#FFB3C6" />
    <path d="M50 35L50 20M50 20L45 15M50 20L55 15" stroke="#8EB694" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Beautiful branch illustration for the Quote Card
const QuoteBranchSVG = () => (
  <svg className="absolute right-0 bottom-0 h-full w-24 opacity-20 pointer-events-none" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 190 C 50 150, 60 100, 55 20" stroke="#FF4F9D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M55 20 Q 35 10, 25 25 Q 40 35, 55 20" fill="#FF4F9D" />
    <path d="M57 60 Q 30 50, 32 70 Q 45 85, 57 60" fill="#FF4F9D" />
    <path d="M59 100 Q 35 95, 38 115 Q 50 120, 59 100" fill="#FF4F9D" />
    <path d="M58 140 Q 32 135, 35 155 Q 48 160, 58 140" fill="#FF4F9D" />
    <path d="M56 40 Q 75 30, 85 45 Q 70 55, 56 40" fill="#FF4F9D" />
    <path d="M58 80 Q 78 70, 88 85 Q 72 95, 58 80" fill="#FF4F9D" />
    <path d="M60 120 Q 80 110, 90 125 Q 75 135, 60 120" fill="#FF4F9D" />
  </svg>
);

// Cute smiling heart SVG for Guidelines
const CuteSmilingHeartSVG = () => (
  <svg className="w-[85px] h-[85px]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heart3D" x1="30" y1="10" x2="70" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFA6C9" />
        <stop offset="60%" stopColor="#FF60A8" />
        <stop offset="100%" stopColor="#E03880" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="92" rx="20" ry="4" fill="#000" fillOpacity="0.06" />
    <path d="M50 84 C 50 84, 15 57, 15 34 C 15 20, 25 10, 39 10 C 47 10, 49 14, 50 17 C 51 14, 53 10, 61 10 C 75 10, 85 20, 85 34 C 85 57, 50 84, 50 84 Z" fill="url(#heart3D)" />
    {/* Eyes */}
    <circle cx="40" cy="40" r="3.2" fill="#3D001F" />
    <circle cx="60" cy="40" r="3.2" fill="#3D001F" />
    {/* Eye Highlights */}
    <circle cx="38.8" cy="38.8" r="1" fill="#FFFFFF" />
    <circle cx="58.8" cy="38.8" r="1" fill="#FFFFFF" />
    {/* Smile */}
    <path d="M47 47 Q 50 51, 53 47" stroke="#3D001F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Blush */}
    <circle cx="34" cy="44" r="3.5" fill="#FF1A75" fillOpacity="0.5" />
    <circle cx="66" cy="44" r="3.5" fill="#FF1A75" fillOpacity="0.5" />
    {/* Shine */}
    <path d="M24 25 C 22 29, 20 35, 22 41 C 23 35, 27 29, 31 26 C 28 25, 26 25, 24 25 Z" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

function AnonymousChatSection({ darkMode, language, showMascotGame, setShowMascotGame, gameTime, gameLives, gameScore, gameItems, gameContainerRef, handleKeyDown, setGameMessage, endGame, setActiveNav }) {
  const dm = darkMode;
  const [postText, setPostText] = useState('');
  const [category, setCategory] = useState('Relaciones');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedPost, setSelectedPost] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [commentDraft, setCommentDraft] = useState({ text: '', imageUrl: null });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const filters = ['Todos', 'Relaciones', 'Consejos', 'Superación', 'Ansiedad', 'Autoestima', 'Apoyo'];
  const anecdoteCategories = ['Relaciones', 'Consejos', 'Superación', 'Ansiedad', 'Autoestima', 'Apoyo'];

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Corazón Tranquilo',
      time: 'Hace 2 horas',
      title: 'Me ayudó hablarle en voz alta',
      body: 'Aunque me costó mucho abrirme, sentir que alguien podría escuchar sin juzgarme me devolvió un poco de paz. Gracias por crear este espacio.',
      tag: 'Relaciones',
      tags: ['Relaciones', 'Apoyo'],
      likes: 24,
      comments: [
        { id: 101, author: 'Sofía', time: 'Hace 15 min', text: 'Gracias por compartirlo, me siento identificada.', likes: 4, liked: false, isOwn: false },
        { id: 102, author: 'Tú', time: 'Hace 8 min', text: 'Te entiendo mucho y me alegra que te sientas escuchada.', likes: 2, liked: true, isOwn: true }
      ],
      apoyos: 8,
      liked: false,
      saved: false,
      avatarType: 'heart'
    },
    {
      id: 2,
      author: 'Luna Serena',
      time: 'Hace 5 horas',
      title: 'Aprendí a poner límites sin sentir culpa',
      body: 'No es egoísmo poner un límite, es cuidarte. Hoy estoy intentándolo con más calma, y eso ya es un gran paso.',
      tag: 'Superación',
      tags: ['Superación', 'Consejos'],
      likes: 18,
      comments: [
        { id: 201, author: 'Ana', time: 'Hace 3 min', text: 'Eso se siente tan bien de leer.', likes: 3, liked: false, isOwn: false }
      ],
      apoyos: 8,
      liked: false,
      saved: false,
      avatarType: 'moon'
    },
    {
      id: 3,
      author: 'Esperanza',
      time: 'Hace 8 horas',
      title: '¿Cómo superar la ansiedad sin cerrarte?',
      body: 'A veces la ansiedad se siente como ruido constante. Lo que me está funcionando es respirar, escribir y recordar que no tengo que resolver todo hoy.',
      tag: 'Ansiedad',
      tags: ['Ansiedad', 'Relaciones'],
      likes: 31,
      comments: [],
      apoyos: 8,
      liked: false,
      saved: false,
      avatarType: 'leaf'
    }
  ]);

  const toggleLike = (id) => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post));
  };

  const handleAddComment = () => {
    if (!selectedPost) return;
    const cleanText = commentDraft.text.trim();
    if (!cleanText && !commentDraft.imageUrl) return;

    const newComment = {
      id: Date.now(),
      author: 'Tú',
      time: 'Ahora',
      text: cleanText || 'Imagen',
      image: commentDraft.imageUrl || null,
      likes: 0,
      liked: false,
      isOwn: true
    };

    setPosts(prev => prev.map(post => post.id === selectedPost.id ? { ...post, comments: [...(post.comments || []), newComment] } : post));
    setSelectedPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev);
    setCommentDraft({ text: '', imageUrl: null });
  };

  const handleCommentImageSelected = (file) => {
    if (!file) return;
    setCommentDraft(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
  };

  const toggleCommentLike = (commentId) => {
    setPosts(prev => prev.map(post => {
      if (!post.comments || !Array.isArray(post.comments)) return post;
      return {
        ...post,
        comments: post.comments.map(comment => comment.id === commentId ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } : comment)
      };
    }));

    if (selectedPost) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: (prev.comments || []).map(comment => comment.id === commentId ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 } : comment)
      } : prev);
    }
  };

  const deleteComment = (commentId) => {
    setPosts(prev => prev.map(post => {
      if (!post.comments || !Array.isArray(post.comments)) return post;
      return { ...post, comments: post.comments.filter(comment => comment.id !== commentId) };
    }));

    if (selectedPost) {
      setSelectedPost(prev => prev ? { ...prev, comments: (prev.comments || []).filter(comment => comment.id !== commentId) } : prev);
    }
  };

  const toggleSave = (id) => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, saved: !post.saved } : post));
  };

  // current user's profile photo (used when a post is public). Replace with real user photo if available.
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // cache of public profile images keyed by user_id
  const [profilesCache, setProfilesCache] = useState({});

  useEffect(() => {
    let mounted = true;
    // get authenticated user and profile photo from profiles table (if exists)
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        setAuthUser(user || null);
        if (user?.id) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
          if (profile) {
            // try common photo fields
            const photo = profile.avatar_url || profile.photo || profile.avatar || profile.image || null;
            if (photo && mounted) setUserPhotoUrl(photo);
            // do not override local userName here to avoid ordering issues; leave userName state as-is
          }
        }
      } catch (e) {
        // ignore errors, keep local fallback
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, []);

  // When posts change, fetch public avatar_url for any user_ids we don't have yet in cache
  useEffect(() => {
    let mounted = true;
    const loadPublicAvatars = async () => {
      try {
        const userIds = Array.from(new Set(posts.filter(p => p && p.user_id && !profilesCache[p.user_id]).map(p => p.user_id)));
        if (userIds.length === 0) return;
        const { data, error } = await supabase.from('profiles').select('id, avatar_url').in('id', userIds);
        if (error || !data) return;
        if (!mounted) return;
        const next = { ...profilesCache };
        data.forEach(pr => {
          if (pr && pr.id) next[pr.id] = pr.avatar_url || null;
        });
        setProfilesCache(next);
        // also update posts in-place to include profile_avatar_url for convenience
        setPosts(prev => prev.map(p => ({ ...p, profile_avatar_url: p.user_id ? next[p.user_id] || p.profile_avatar_url || null : p.profile_avatar_url })));
      } catch (e) {
        // ignore errors
      }
    };
    loadPublicAvatars();
    return () => { mounted = false; };
  }, [posts]);

  const handleImageSelected = (file) => {
    if (!file) return;
    setSelectedImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
  };

  const publishPost = () => {
    const text = postText.trim();
    if (!text && !selectedImageFile) return;

    const tempId = Date.now();
    const snapText = text;
    const snapAnon = isAnonymous;
    const snapCat = category;
    const snapImg = imagePreviewUrl;
    const snapImgFile = selectedImageFile;

    const palette = [
      'bg-pink-100 text-pink-500', 'bg-blue-100 text-blue-500', 'bg-green-100 text-green-500',
      'bg-yellow-100 text-yellow-500', 'bg-purple-100 text-purple-500', 'bg-amber-100 text-amber-500'
    ];
    const displayName = snapAnon ? '' : 'Tú';
    const name = snapAnon ? '' : (displayName || 'Usuario');
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    const colorCls = palette[Math.abs(hash) % palette.length];
    const initials = name ? name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : null;

    const newPost = {
      id: tempId,
      author: snapAnon ? 'Anónimo' : (displayName || 'Tú'),
      time: 'Ahora',
      title: '',
      body: snapText,
      tag: snapCat,
      tags: [snapCat],
      likes: 0,
      comments: [],
      apoyos: 0,
      liked: false,
      saved: false,
      isAnonymous: snapAnon,
      avatarType: 'heart',
      image_url: snapImg || null,
      avatar_initials: (!snapAnon && !userPhotoUrl) ? initials : null,
      avatar_color: (!snapAnon && !userPhotoUrl) ? colorCls : null
    };

    setPosts(prev => [newPost, ...prev]);
    setPostText('');
    setSelectedTags([]);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);

    (async () => {
      try {
        let imageUrl = null;
        if (snapImgFile) {
          setImageUploading(true);
          try {
            const ts = Date.now();
            const fp = `post-images/${ts}_${snapImgFile.name}`;
            const { data: upData, error: upErr } = await supabase.storage.from('post-images').upload(fp, snapImgFile);
            if (!upErr) {
              const { data: pubData } = supabase.storage.from('post-images').getPublicUrl(fp);
              imageUrl = pubData?.publicUrl || null;
            }
          } catch (_) {}
        }

        const entry = {
          user_id: snapAnon ? null : (authUser?.id || null),
          author_name: snapAnon ? null : (displayName || null),
          content: snapText || null,
          category: snapCat,
          is_anonymous: snapAnon,
          image_url: imageUrl,
          avatar_initials: (!snapAnon && !userPhotoUrl) ? initials : null,
          avatar_color: (!snapAnon && !userPhotoUrl) ? colorCls : null,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('posts').insert(entry).select().single();
        if (!error && data) {
          setPosts(prev => prev.map(p => p.id === tempId ? { ...p, id: data.id, time: 'Ahora', image_url: data.image_url || p.image_url } : p));
        }
      } catch (_) {}
      setImageUploading(false);
    })();
  };

  const filteredPosts = activeFilter === 'Todos' ? posts : posts.filter(post => post.tag === activeFilter || (post.tags && post.tags.includes(activeFilter)));

  const renderAvatar = (post) => {
    // Render avatar circle before each anecdote.
    // Priority: public profile.avatar_url (from Supabase) -> AvatarPortrait (local 3D config) -> explicit avatar image fields -> initials with color -> anonymous silhouette.

    if (!post) return <div className="w-11 h-11 flex-shrink-0" />;

    // If we have a public avatar URL from the profiles table, prefer that image
    const publicAvatar = post.profile_avatar_url || post.profileAvatarUrl || (post.user_id ? profilesCache[post.user_id] : null);
    if (publicAvatar) {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
          <img src={publicAvatar} alt={post.author || 'Usuario'} className="w-full h-full object-cover" />
        </div>
      );
    }

    // If post belongs to a known user but no public avatar image, fall back to AvatarPortrait (reads local saved avatar config)
    if (!post.isAnonymous && post.user_id) {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
          {userPhotoUrl ? <img src={userPhotoUrl} alt="Avatar" className="w-full h-full object-cover" /> : <AvatarPortrait variant="head" className="w-full h-full" />}
        </div>
      );
    }

    const avatarImage = post?.avatar_url || post?.photo || post?.user_photo || post?.avatarImage || null;
    const initials = post?.avatar_initials || (post?.author ? post.author.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : null);
    const colorCls = post?.avatar_color || 'bg-pink-100 text-pink-600';

    if (post?.isAnonymous) {
      return (
        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 border border-pink-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" />
          </svg>
        </div>
      );
    }

    if (avatarImage) {
      return (
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
          <img src={avatarImage} alt={post.author || 'Usuario'} className="w-full h-full object-cover" />
        </div>
      );
    }

    // initials fallback (uses color classes stored on the post if present)
    return (
      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorCls} border border-gray-100`}>
        {initials || 'U'}
      </div>
    );
  };

  return (
    <div className={`min-h-full ${dm ? 'bg-[#070D1C]' : 'bg-[#FAF9FB]'} p-6 md:p-8`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

          {/* Main Feed Column */}
          <main className="min-w-0">

            {/* Tarjeta de publicación estilo imagen enviada */}
            {showMascotGame ? (
              <div className="p-6 rounded-2xl bg-white border mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Mini-juego: Atrapa los objetos</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div>Tiempo: <span className="font-bold text-pink-500">{gameTime}s</span></div>
                      <div>Vidas: <span className="font-bold text-pink-500">{gameLives}</span></div>
                      <div>Puntos: <span className="font-bold text-pink-500">{gameScore}</span></div>
                    </div>
                  </div>

                  <div
                    ref={gameContainerRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    className="relative bg-gradient-to-b from-[#FFF1F2] to-white rounded-lg w-full h-64 overflow-hidden border"
                  >
                    {/* falling items */}
                    {gameItems.map(item => (
                      <div key={item.id} style={{ position: 'absolute', left: `${item.x}%`, top: item.y, transform: 'translateX(-50%)' }} className="text-2xl pointer-events-none">
                        {item.icon}
                      </div>
                    ))}

                    {/* mascot (catcher) */}
                    <div style={{ position: 'absolute', left: `${mascotX}%`, bottom: 8, transform: 'translateX(-50%)' }} className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-3xl shadow-lg">
                      <AnimatedCatMascot variant={currentPetIndex} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={startGame} className="px-4 py-2 bg-pink-500 text-white rounded-full">Iniciar</button>
                    <button onClick={() => updateMascotX(x => x - MASCOT_STEP)} className="px-3 py-2 bg-gray-100 rounded-full">◀</button>
                    <button onClick={() => updateMascotX(x => x + MASCOT_STEP)} className="px-3 py-2 bg-gray-100 rounded-full">▶</button>
                    <button onClick={() => { setShowMascotGame(false); setGameMessage(''); }} className="ml-auto px-4 py-2 bg-gray-100 rounded-full">Cerrar</button>
                    <div className="text-sm text-gray-500">{gameMessage}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`mb-6 p-8 rounded-3xl border ${dm ? 'bg-[#FFF0F6]/5 border-white/10' : 'bg-rose-50 border-[#F0E5EB]'}`}>
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    {/* Mostrar avatar del usuario cuando el post sea público */}
                    {!isAnonymous ? (
                      (profilesCache[authUser?.id] || userPhotoUrl) ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100">
                          <img src={profilesCache[authUser?.id] || userPhotoUrl} alt="Mi avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100">
                          <AvatarPortrait variant="head" className="w-full h-full" />
                        </div>
                      )
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-pink-50">
                        <Lock size={20} />
                      </div>
                    )}
                  </div>

                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder={isAnonymous ? "¿Qué hay en tu corazón hoy? Compártelo anónimamente..." : "¿Qué hay en tu corazón hoy? Compártelo con todos..."}
                    className={`${dm ? 'bg-transparent text-gray-200 placeholder:text-gray-500' : 'bg-transparent text-slate-700 placeholder:text-slate-400'} w-full min-h-[120px] rounded-xl px-4 py-3 pt-8 outline-none text-[16px] resize-none`}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5 text-[18px] text-slate-400">
                    <button type="button" className="hover:opacity-90" aria-label="emoji"><Smile size={20} /></button>
                    <input id="post-image-input" type="file" accept="image/*" onChange={(e) => handleImageSelected(e.target.files[0])} className="hidden" />
                    <label htmlFor="post-image-input" className="cursor-pointer hover:opacity-90"><ImageIcon size={20} /></label>
                    <button type="button" className="hover:opacity-90 text-slate-500" aria-label="mention"></button>
                    {imagePreviewUrl && (
                      <img src={imagePreviewUrl} alt="preview" className="w-16 h-12 object-cover rounded-lg ml-2 border" />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full bg-white/5 p-1.5">
                      <button onClick={() => setIsAnonymous(true)} aria-pressed={isAnonymous} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition ${isAnonymous ? 'bg-[#FF4F9D] text-white shadow-[0_6px_15px_rgba(255,79,157,0.18)]' : 'bg-transparent text-slate-500 hover:bg-[#FFF4F8] hover:text-[#FF4F9D]'}`}>
                        <Lock size={17} />
                        <span>Anónimo</span>
                      </button>

                      <button onClick={() => setIsAnonymous(false)} aria-pressed={!isAnonymous} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition ${!isAnonymous ? 'bg-[#FF4F9D] text-white shadow-[0_6px_15px_rgba(255,79,157,0.18)]' : 'bg-transparent text-slate-500 hover:bg-[#FFF4F8] hover:text-[#FF4F9D]'}`}>
                        <Globe size={17} />
                        <span>Público</span>
                      </button>
                    </div>

                    <button onClick={() => { publishPost(); setTimeout(() => setImageUploading(false), 3000); }} disabled={imageUploading} className="bg-pink-400 text-white px-7 py-2.5 rounded-full shadow-sm font-semibold hover:brightness-95 ml-2 text-[15px]">
                      {imageUploading ? (language === 'es' ? 'Subiendo...' : 'Uploading...') : (language === 'es' ? 'Publicar' : 'Publish')}
                    </button>
                  </div>
                </div>

                {postText.trim() !== '' && (
                  <div className="mt-4">
                    <div className={`mb-3 text-[13px] font-bold uppercase tracking-[0.14em] ${dm ? 'text-gray-400' : 'text-slate-400'}`}>
                      Categoría de la anécdota
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {anecdoteCategories.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCategory(item)}
                          className={`rounded-full border px-5 py-2.5 text-[14px] font-semibold transition ${
                            category === item
                              ? 'border-pink-200 bg-[#FFEAF4] text-pink-600 shadow-sm'
                              : dm
                                ? 'border-white/10 bg-[#111827] text-gray-300 hover:border-pink-500/40 hover:text-pink-300'
                                : 'border-[#F2E5EE] bg-white text-slate-600 hover:border-pink-200 hover:text-pink-500'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`h-[38px] rounded-full px-[20px] text-[13px] font-semibold transition-all duration-200 ${
                    activeFilter === filter 
                      ? 'bg-[#FF4F9D] text-white shadow-[0_6px_15px_rgba(255,79,157,0.2)]' 
                      : dm 
                        ? 'bg-[#111827] text-gray-400 hover:bg-white/5' 
                        : 'bg-white text-slate-500 hover:bg-[#FFF4F8] hover:text-[#FF4F9D] border border-[#F3E7EE]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Feed List */}
            <div className="space-y-0 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className={`${dm ? 'border-white/20' : 'border-[#E0D0D8]'} border-b-2 py-6 first:pt-0`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {renderAvatar(post)}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[14px] ${dm ? 'text-gray-100' : 'text-slate-800'}`}>{post.author}</span>
                      <span className="text-slate-300 text-[10px]">"¢</span>
                      <span className={`text-[12px] ${dm ? 'text-gray-500' : 'text-slate-400'}`}>{post.time}</span>
                    </div>
                  </div>

                  <div className={`text-[16px] mb-2 ${dm ? 'text-white' : 'text-slate-900'}`}>{post.title}</div>
                  <div className={`text-[14px] leading-relaxed ${dm ? 'text-gray-300' : 'text-slate-600'}`}>{post.body}</div>
                  {post.image_url && (
                    <img src={post.image_url} alt="Imagen de la anécdota" onClick={() => setLightboxImg(post.image_url)} className="mt-3 w-full max-h-48 rounded-2xl object-cover border border-[#F6E6EE] cursor-pointer hover:opacity-90 transition" />
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5 text-[13px] text-slate-500">
                      {/* Likes count */}
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition ${post.liked ? 'text-rose-500' : 'hover:text-[#FF4F9D]'}`}>
                        <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>

                      {/* Comments count */}
                      <button onClick={() => setSelectedPost(post)} className="flex items-center gap-1.5 hover:text-[#FF4F9D] transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 4.75 4.75 0 002.327-.406c.6-.263 1.258-.292 1.836-.075.867.324 1.79.525 2.751.525z" />
                        </svg>
                        <span>{Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)}</span>
                      </button>

                      {/* Supports (apoyos) count */}
                      <button className="flex items-center gap-1.5 hover:text-[#FF4F9D] transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0112.75 21.5h-1.5a2.25 2.25 0 01-2.25-2.263V19.13m4.26-3.074a4.125 4.125 0 00-6.732-2.316M14.25 9a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.111a6.003 6.003 0 015-5.908m0 0a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
                        </svg>
                        <span>{post.apoyos || 6}</span>
                      </button>
                    </div>

                    <button className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#FF4F9D] transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                      </svg>
                      <span>Compartir</span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Ver más publicaciones Button */}
            <div className="flex justify-center mt-8 mb-12">
              <button className={`flex items-center gap-1.5 text-[14px] text-slate-400 hover:text-slate-600 transition cursor-pointer`}>
                <span>Ver más publicaciones</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </main>

          {/* Right Widgets Sidebar */}
          <aside className="space-y-6 xl:pt-[480px]">
            {/* Quote Card (Card 1) */}
            <div className="relative">
              <div className={`rounded-3xl border p-6 shadow-[0_8px_24px_rgba(255,79,157,0.03)] relative overflow-hidden min-h-[160px] flex flex-col justify-between pt-8 ${dm ? 'bg-gradient-to-br from-[#2a1a3d] to-[#1f2b4d] border-[#3a3050]' : 'bg-gradient-to-br from-[#FFF0F5] to-[#FFE9F2] border-[#FCD6E5]'}`}>
                <QuoteBranchSVG />
                <div className="text-[36px] font-serif font-bold text-[#FF65A5] leading-none mb-2">“</div>
                <div className={`text-[15px] font-semibold leading-relaxed pr-16 z-10 ${dm ? 'text-gray-300' : 'text-slate-700'}`}>
                  No estás solo. Tu historia puede ser la luz que alguien necesita hoy.
                </div>
                <div className="text-[#FF4F9D] text-[18px] mt-4 z-10">♥</div>
              </div>
            </div>

            {/* Guidelines Card (Card 3) */}
            <div className={`rounded-3xl border p-6 shadow-[0_8px_24px_rgba(0,0,0,0.01)] relative overflow-hidden ${dm ? 'bg-gradient-to-br from-[#1f2b4d] to-[#16213e] border-[#2a2a4a]' : 'bg-gradient-to-br from-[#FCF5F8] to-[#FFF9FC] border-[#F5E6EE]'}`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className={`text-[15px] font-bold mb-4 text-center ${dm ? 'text-gray-200' : 'text-slate-800'}`}>
                    <span>Escribe con respeto y empatía</span>
                  </div>
                  <ul className="space-y-3">
                    <li className={`flex items-start gap-2 text-[13px] font-medium ${dm ? 'text-gray-400' : 'text-slate-600'}`}>
                      <span className="text-[#8B5CF6] font-bold mt-0.5">✓</span>
                      <span>Comparte tu experiencia de forma positiva.</span>
                    </li>
                    <li className={`flex items-start gap-2 text-[13px] font-medium ${dm ? 'text-gray-400' : 'text-slate-600'}`}>
                      <span className="text-[#8B5CF6] font-bold mt-0.5">✓</span>
                      <span>Evita juzgar o criticar a otros.</span>
                    </li>
                    <li className={`flex items-start gap-2 text-[13px] font-medium ${dm ? 'text-gray-400' : 'text-slate-600'}`}>
                      <span className="text-[#8B5CF6] font-bold mt-0.5">✓</span>
                      <span>Recuerda que todos merecemos respeto.</span>
                    </li>
                  </ul>
                </div>
                <div className="shrink-0 flex items-center justify-center mt-2">
                  <CuteSmilingHeartSVG />
                </div>
              </div>
            </div>

            {/* Stats Card (Card 2) */}
            <div className={`${dm ? 'bg-[#111827] border-white/10' : 'bg-white border-[#F3E6EE]'} rounded-3xl border p-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)]`}>
              <div className={`text-[15px] mb-5 ${dm ? 'text-gray-200' : 'text-slate-800'}`}>Nuestra comunidad</div>
              <div className="grid grid-cols-4 gap-2">
                {/* Stats 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${dm ? 'bg-[#1f2b4d]' : 'bg-[#FFF0F5]'}`}>
                    <svg className={`w-5 h-5 ${dm ? 'text-pink-400' : 'text-[#FF4F9D]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </div>
                  <div className={`text-[17px] font-extrabold leading-tight ${dm ? 'text-gray-100' : 'text-slate-800'}`}>128</div>
                  <div className={`text-[10px] mt-1 font-medium leading-tight ${dm ? 'text-gray-500' : 'text-slate-400'}`}>Publicaciones hoy</div>
                </div>

                {/* Stats 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${dm ? 'bg-[#1f2b4d]' : 'bg-[#EFEAFF]'}`}>
                    <svg className={`w-5 h-5 ${dm ? 'text-purple-400' : 'text-[#8B5CF6]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0112.75 21.5h-1.5a2.25 2.25 0 01-2.25-2.263V19.13m4.26-3.074a4.125 4.125 0 00-6.732-2.316M14.25 9a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.111a6.003 6.003 0 015-5.908m0 0a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75z" />
                    </svg>
                  </div>
                  <div className={`text-[17px] font-extrabold leading-tight ${dm ? 'text-gray-100' : 'text-slate-800'}`}>342</div>
                  <div className={`text-[10px] mt-1 font-medium leading-tight ${dm ? 'text-gray-500' : 'text-slate-400'}`}>Personas conectadas</div>
                </div>

                {/* Stats 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${dm ? 'bg-[#1f2b4d]' : 'bg-[#FFF0F5]'}`}>
                    <svg className={`w-5 h-5 ${dm ? 'text-pink-400' : 'text-[#FF4F9D]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 4.75 4.75 0 002.327-.406c.6-.263 1.258-.292 1.836-.075.867.324 1.79.525 2.751.525z" />
                    </svg>
                  </div>
                  <div className={`text-[17px] font-extrabold leading-tight ${dm ? 'text-gray-100' : 'text-slate-800'}`}>587</div>
                  <div className={`text-[10px] mt-1 font-medium leading-tight ${dm ? 'text-gray-500' : 'text-slate-400'}`}>Comentarios hoy</div>
                </div>

                {/* Stats 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${dm ? 'bg-[#1f2b4d]' : 'bg-[#E2FDF2]'}`}>
                    <svg className={`w-5 h-5 ${dm ? 'text-emerald-400' : 'text-[#10B981]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div className={`text-[17px] font-extrabold leading-tight ${dm ? 'text-gray-100' : 'text-slate-800'}`}>1.2k</div>
                  <div className={`text-[10px] mt-1 font-medium leading-tight ${dm ? 'text-gray-500' : 'text-slate-400'}`}>Apoyos dados</div>
                </div>
              </div>
            </div>
          </aside>
        </div>


      </div>

{selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-50 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <div className="w-full max-w-[540px] rounded-2xl bg-white shadow-2xl max-h-[88vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-[16px] text-slate-900 leading-snug">{selectedPost.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>{selectedPost.author}</span>
                  <span>·</span>
                  <span>{selectedPost.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition text-lg leading-none">×</button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 pb-5">

              {/* Post body */}
              <p className="text-[13.5px] leading-[1.65] text-slate-500">{selectedPost.body}</p>

              {selectedPost.image_url && (
                <img src={selectedPost.image_url} alt="" className="mt-3 w-full max-h-52 rounded-xl object-cover" />
              )}

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[10px] text-slate-400">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 flex items-center gap-4 text-[12px] text-slate-400 border-b border-slate-100 pb-4">
                <span className="inline-flex items-center gap-1"><Heart size={13} className="text-pink-400" /> {selectedPost.likes}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle size={13} /> {Array.isArray(selectedPost.comments) ? selectedPost.comments.length : (selectedPost.comments || 0)}</span>
              </div>

              {/* Comments list */}
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400 mb-3">Comentarios</div>

                {(Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0) ? (
                  <div className="space-y-0">
                    {selectedPost.comments.map((comment, idx) => (
                      <div key={comment.id} className={`flex gap-2.5 py-3 ${idx > 0 ? 'border-t border-slate-50' : ''}`}>
                        <div className="shrink-0 h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                          {comment.author ? comment.author.slice(0, 1).toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-slate-700">{comment.author}</span>
                            <span className="text-[10px] text-slate-300">{comment.time}</span>
                            {comment.isOwn && (
                              <button onClick={() => deleteComment(comment.id)} className="ml-auto text-[10px] text-slate-400 hover:text-rose-400 transition">Eliminar</button>
                            )}
                          </div>
                          {comment.text && <p className="mt-0.5 text-[13px] leading-[1.55] text-slate-600">{comment.text}</p>}
                          {comment.image && <img src={comment.image} alt="" className="mt-1.5 max-h-24 rounded-lg object-cover" />}
                          <button onClick={() => toggleCommentLike(comment.id)} className={`mt-1.5 inline-flex items-center gap-1 text-[10px] ${comment.liked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}>
                            <Heart size={10} fill={comment.liked ? 'currentColor' : 'none'} strokeWidth={2} />
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-3 text-center text-[12px] text-slate-300">Sé el primero en comentar.</p>
                )}
              </div>
            </div>

            {/* Input area */}
            <div className="border-t border-slate-100 px-5 py-3">
              <div className="flex items-end gap-2.5">
                <textarea
                  value={commentDraft.text}
                  onChange={(e) => setCommentDraft(prev => ({ ...prev, text: e.target.value }))}
                  rows={1}
                  placeholder="Escribe un comentario..."
                  className="flex-1 resize-none bg-slate-50 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none border border-transparent focus:border-pink-200 transition"
                />
                <button
                  onClick={handleAddComment}
                  className="shrink-0 h-[36px] px-5 rounded-xl bg-slate-900 text-white text-[12px] font-medium transition hover:bg-slate-800 disabled:opacity-25 disabled:cursor-not-allowed"
                  disabled={!commentDraft.text.trim() && !commentDraft.imageUrl}
                >
                  Enviar
                </button>
              </div>
              {commentDraft.imageUrl && (
                <div className="relative mt-2 inline-block">
                  <img src={commentDraft.imageUrl} alt="" className="max-h-16 rounded-lg object-cover" />
                  <button onClick={() => setCommentDraft(prev => ({ ...prev, imageUrl: null }))} className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-slate-800 text-white text-[9px]">✕</button>
                </div>
              )}
              <label className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-slate-400 hover:text-pink-400 transition">
                <ImageIcon size={12} />
                Imagen
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCommentImageSelected(e.target.files?.[0])} />
              </label>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


const PottedPlant = ({ className = "w-16 h-20" }) => (
  <svg className={className} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Leaves */}
    <path d="M40 60 Q35 40, 25 35 Q35 28, 40 60" fill="#8EB694" />
    <path d="M40 60 Q45 40, 55 35 Q45 28, 40 60" fill="#8EB694" />
    
    <path d="M40 55 Q30 30, 18 25 Q32 18, 40 55" fill="#A7C7AE" />
    <path d="M40 55 Q50 30, 62 25 Q48 18, 40 55" fill="#A7C7AE" />
    
    <path d="M40 50 L40 10 C36 8, 38 0, 40 5 L40 50" stroke="#8EB694" strokeWidth="2" fill="none" />
    <path d="M40 15 Q30 5, 25 1 C35 2, 40 15" fill="#8EB694" />
    <path d="M40 25 Q50 12, 55 8 Q45 10, 40 25" fill="#8EB694" />
    
    {/* Pot */}
    <path d="M25 60 H55 L50 85 C50 88, 30 88, 30 85 Z" fill="#FDD3BD" stroke="#E88B9A" strokeWidth="1.5" />
    <rect x="22" y="56" width="36" height="4" rx="2" fill="#E88B9A" />
  </svg>
);

const BotanicalBranch = ({ className = "w-24 h-16" }) => (
  <svg className={className} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50 Q50 45, 90 10" stroke="#8EB694" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    
    {/* Small leaves */}
    <path d="M30 45 Q20 38, 22 30 Q30 35, 30 45 Z" fill="#8EB694" opacity="0.8" />
    <path d="M42 42 Q52 35, 50 28 Q42 32, 42 42 Z" fill="#A7C7AE" opacity="0.8" />
    <path d="M52 35 Q42 28, 44 20 Q52 25, 52 35 Z" fill="#8EB694" opacity="0.8" />
    <path d="M65 30 Q75 22, 73 15 Q65 20, 65 30 Z" fill="#A7C7AE" opacity="0.8" />
    <path d="M78 22 Q68 15, 70 8 Q78 12, 78 22 Z" fill="#8EB694" opacity="0.8" />
  </svg>
);

const LockCardFlowers = () => (
  <svg className="w-full h-12 absolute bottom-0 left-0" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 30 Q10 10, 20 30" stroke="#8EB694" strokeWidth="0.8" fill="none" />
    <circle cx="20" cy="18" r="2.5" fill="#E88B9A" />
    
    <path d="M20 30 Q35 5, 50 30" stroke="#8EB694" strokeWidth="0.8" fill="none" />
    <circle cx="35" cy="12" r="3.5" fill="#E88B9A" />
    <circle cx="31" cy="10" r="1.5" fill="#F7C6CE" />
    <circle cx="39" cy="10" r="1.5" fill="#F7C6CE" />
    
    <path d="M50 30 Q65 15, 80 30" stroke="#8EB694" strokeWidth="0.8" fill="none" />
    <circle cx="65" cy="20" r="2.5" fill="#E88B9A" />
    
    <path d="M75 30 Q90 10, 100 30" stroke="#8EB694" strokeWidth="0.8" fill="none" />
    <circle cx="90" cy="18" r="3" fill="#E88B9A" />
  </svg>
);

// SVGs for Community Experiences List Items
const HuggingIllustration = () => (
  <svg className="w-10 h-10 rounded-xl bg-[#FFF1F2] p-1.5" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Silhouette of two people hugging */}
    <circle cx="16" cy="14" r="5" fill="#E88B9A" opacity="0.8" />
    <circle cx="24" cy="14" r="5" fill="#A7C7AE" opacity="0.8" />
    <path d="M8 32 C8 24, 18 20, 20 28 C22 20, 32 24, 32 32 Z" fill="#E88B9A" opacity="0.6" />
    <path d="M20 28 C21 27, 22 26, 23 26" stroke="#4A3B32" strokeWidth="1.5" />
  </svg>
);

const SproutIllustration = () => (
  <svg className="w-10 h-10 rounded-xl bg-[#EFF6FF] p-1.5" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 35 V15" stroke="#8EB694" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 25 Q10 20, 12 12 Q20 18, 20 25" fill="#8EB694" />
    <path d="M20 20 Q30 15, 28 8 Q20 13, 20 20" fill="#A7C7AE" />
  </svg>
);

const WalkingIllustration = () => (
  <svg className="w-10 h-10 rounded-xl bg-[#FFF8F8] p-1.5" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="4" fill="#E88B9A" />
    <circle cx="25" cy="15" r="4" fill="#8EB694" />
    <path d="M10 32 L14 23 L16 32" stroke="#E88B9A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 32 L26 23 L24 32" stroke="#8EB694" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 23 H26" stroke="#4A3B32" strokeWidth="1.5" />
  </svg>
);

const PET_OUTFITS = [
  { id: null, label: 'Sin ropa', emoji: '🧥' },
  { id: 'bow', label: 'Lazo', emoji: '🎀' },
  { id: 'cap', label: 'Boina', emoji: '🧢' },
  { id: 'glasses', label: 'Lentes', emoji: '🕶️' },
  { id: 'flower', label: 'Flor', emoji: '🌸' },
];

function AnimatedCatMascot({ sleeping, hungry, variant, outfit }) {
  const palettes = [
    { head: '#F7F3F4', body: '#F1D8E0', accent: '#D592A8', blush: '#FBEAF0' },
    { head: '#F0EBFF', body: '#D9D1FF', accent: '#9E8DE8', blush: '#F7F3FF' },
    { head: '#E6F7F2', body: '#C9F2E5', accent: '#58B8A0', blush: '#EFFCF8' },
    { head: '#EAF4FF', body: '#CDE5FF', accent: '#5B8DEF', blush: '#F4F9FF' },
    { head: '#FFF5DE', body: '#FDE9BA', accent: '#E6A65A', blush: '#FFF9EF' },
  ];
  const p = palettes[(variant ?? 0) % palettes.length] || palettes[0];
  const droopy = hungry !== undefined && hungry < 30;

  return (
    <svg viewBox="0 0 220 200" className="w-full max-w-[300px] h-auto drop-shadow-[0_12px_28px_rgba(213,146,168,0.25)] relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(80 168)">
        <path d="M0 0 C -18 -6, -28 -20, -22 -46" stroke={p.body} strokeWidth="11" strokeLinecap="round" />
      </g>

      <path d="M64 117 Q64 96 90 96 L130 96 Q156 96 156 117 L156 162 Q156 184 134 184 L86 184 Q64 184 64 162 Z" fill={p.body} />
      <path d="M88 96 Q110 124 132 96" stroke={p.blush} strokeWidth="5" strokeLinecap="round" />
      <path d="M98 123 L98 133 M123 123 L123 133" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <g fill={p.accent} opacity="0.9">
        <ellipse cx="96" cy="162" rx="9" ry="8" />
        <ellipse cx="124" cy="162" rx="9" ry="8" />
      </g>

      <ellipse cx="92" cy="196" rx="16" ry="9" fill={p.head} />
      <ellipse cx="128" cy="196" rx="16" ry="9" fill={p.head} />

      <circle cx="110" cy="76" r="46" fill={p.head} />

      <g>
        <path d="M76 52 L84 12 L106 46 Z" fill={p.head} />
        <path d="M144 52 L136 12 L114 46 Z" fill={p.head} />
        <path d="M83 42 L90 20 L100 42 Z" fill={p.accent} opacity="0.9" />
        <path d="M137 42 L130 20 L120 42 Z" fill={p.accent} opacity="0.9" />
      </g>

      {sleeping ? (
        <>
          <path d="M88 76 Q96 82 104 76" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" />
          <path d="M116 76 Q124 82 132 76" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : droopy ? (
        <>
          <path d="M90 78 Q96 74 102 78" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" />
          <path d="M118 78 Q124 74 130 78" stroke="#1a1f2c" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="96" cy="74" rx="7" ry="9" fill="#1a1f2c" />
          <ellipse cx="124" cy="74" rx="7" ry="9" fill="#1a1f2c" />
          <ellipse cx="98" cy="71" rx="3" ry="3.5" fill="#fff" />
          <ellipse cx="126" cy="71" rx="3" ry="3.5" fill="#fff" />
          <circle cx="94" cy="77" r="1.2" fill="#fff" opacity="0.5" />
          <circle cx="122" cy="77" r="1.2" fill="#fff" opacity="0.5" />
        </>
      )}

      <ellipse cx="88" cy="88" rx="7" ry="4.5" fill={p.blush} opacity="0.9" />
      <ellipse cx="132" cy="88" rx="7" ry="4.5" fill={p.blush} opacity="0.9" />

      <path d="M106 85 L114 85 L110 90 Z" fill={p.accent} />
      <path d="M110 91 Q103 97 96 95" stroke="#1a1f2c" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M110 91 Q117 97 124 95" stroke="#1a1f2c" strokeWidth="2.2" strokeLinecap="round" />

      {outfit === 'bow' && (
        <g transform="translate(148 38)">
          <path d="M0 0 L-16 -10 L-16 10 Z" fill="#E996A6" />
          <path d="M0 0 L16 -10 L16 10 Z" fill="#D87390" />
          <circle cx="0" cy="0" r="7.5" fill="#F9D9E3" />
        </g>
      )}
      {outfit === 'cap' && (
        <g transform="translate(110 35)">
          <path d="M-30 2 Q0 -18 30 2 L25 16 H-25 Z" fill="#CAB6FF" />
          <path d="M-18 16 H18" stroke="#8D75D3" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}
      {outfit === 'glasses' && (
        <g>
          <rect x="82" y="70" width="18" height="11" rx="4.5" fill="rgba(15,23,42,0.9)" />
          <rect x="120" y="70" width="18" height="11" rx="4.5" fill="rgba(15,23,42,0.9)" />
          <path d="M100 75 H120" stroke="rgba(15,23,42,0.9)" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {outfit === 'flower' && (
        <g transform="translate(145 104)">
          <circle cx="0" cy="0" r="7" fill="#F3B0C5" />
          <circle cx="-8" cy="-6" r="4.5" fill="#FBE4EC" />
          <circle cx="8" cy="-6" r="4.5" fill="#FBE4EC" />
          <circle cx="-8" cy="6" r="4.5" fill="#FBE4EC" />
          <circle cx="8" cy="6" r="4.5" fill="#FBE4EC" />
          <circle cx="0" cy="10" r="4.5" fill="#F9D978" />
        </g>
      )}
    </svg>
  );
}

function CfgSection({ darkMode, title, icon, children }) {
  return (
    <div className={`p-6 rounded-3xl shadow-sm border ${darkMode ? 'bg-[#16213e] border-[#2a2a4a]' : 'bg-white border-gray-100'}`}>
      <h3 className={`flex items-center gap-2 font-bold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{icon} {title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function CfgOption({ darkMode, icon, label, onClick }) {
  return (
    <div onClick={onClick} className={`flex justify-between items-center text-sm cursor-pointer rounded-lg p-2 transition ${darkMode ? 'text-gray-400 hover:text-pink-400 hover:bg-[#1f2b4d]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
      <span className="flex items-center gap-2">{icon} {label}</span>
      <ChevronRight size={16} className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}/>
    </div>
  );
}

function CfgSwitch({ darkMode, icon, label, active, onToggle }) {
  return (
    <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <span className="flex items-center gap-2">{icon} {label}</span>
      <button onClick={onToggle} className={`w-10 h-6 rounded-full transition-colors relative ${active ? 'bg-pink-400' : darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function CfgLang({ darkMode, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 w-full text-sm p-2 rounded-lg transition font-medium ${active ? 'bg-pink-50 text-pink-600 border border-pink-200' : darkMode ? 'text-gray-400 hover:bg-[#1f2b4d] border border-transparent hover:border-gray-600' : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'}`}>
      <Globe size={16} />
      <span>{label}</span>
      {active && <span className="ml-auto text-pink-500">✓</span>}
    </button>
  );
}

function CfgFontSize({ darkMode, icon, label, fontSize, setFontSize, triggerToast, language }) {
  const sizes = [
    { key: 'small', label: 'A', size: 'text-xs' },
    { key: 'normal', label: 'A', size: 'text-sm' },
    { key: 'large', label: 'A', size: 'text-base' },
    { key: 'xlarge', label: 'A', size: 'text-lg' },
  ];
  return (
    <div>
      <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <span className="flex items-center gap-2">{icon} {label}</span>
      </div>
      <div className="flex gap-2 mt-2">
        {sizes.map((s) => (
          <button
            key={s.key}
            onClick={() => { setFontSize(s.key); triggerToast(language === 'es' ? 'Tamaño de texto ajustado' : 'Text size adjusted'); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border ${fontSize === s.key ? 'bg-pink-50 border-pink-300 text-pink-600' : darkMode ? 'bg-[#1f2b4d] border-[#2a2a4a] text-gray-400 hover:border-gray-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'} ${s.size}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardEscritorio({ onLogout }) {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('Inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pet state
  const petImages = Array.from({ length: 5 }, (_, index) => `Mascota ${index + 1}`);
  const [currentPetIndex, setCurrentPetIndex] = useState(() => { try { return parseInt(localStorage.getItem('pet_variant')) || 0; } catch { return 0; } });
  const [isSleeping, setIsSleeping] = useState(false);
  const [hunger, setHunger] = useState(80);
  const [sleep, setSleep] = useState(70);
  const [fun, setFun] = useState(60); // Diversión (se desvanece cuando no está jugando)
  const [petOutfit, setPetOutfit] = useState(null);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [feedAnimations, setFeedAnimations] = useState([]);

  // Per-mascot level & XP
  const getMascotStats = () => {
    try {
      const all = JSON.parse(localStorage.getItem('mascot_stats')) || {};
      return all[currentMascotId] || { level: 1, xp: 0 };
    } catch { return { level: 1, xp: 0 }; }
  };
  const [mascotLevel, setMascotLevel] = useState(() => getMascotStats().level);
  const [mascotXp, setMascotXp] = useState(() => getMascotStats().xp);

  const addXp = (amount) => {
    try {
      const all = JSON.parse(localStorage.getItem('mascot_stats')) || {};
      const current = all[currentMascotId] || { level: 1, xp: 0 };
      let newXp = current.xp + amount;
      let newLevel = current.level;
      if (newXp >= 100) {
        newXp = newXp - 100;
        newLevel = current.level + 1;
        triggerToast(`¡Tu mascota subió al nivel ${newLevel}! 🎉`);
      }
      all[currentMascotId] = { level: newLevel, xp: newXp };
      localStorage.setItem('mascot_stats', JSON.stringify(all));
      setMascotLevel(newLevel);
      setMascotXp(newXp);
    } catch {}
  };

  // Mascot selector state
  const [currentMascotId, setCurrentMascotId] = useState(() => {
    try { return localStorage.getItem('safetyLoveMascot') || 'michi-menta'; } catch { return 'michi-menta'; }
  });
  const [showMascotSelector, setShowMascotSelector] = useState(false);

  const handleMascotSelect = (mascotId) => {
    setCurrentMascotId(mascotId);
    try { localStorage.setItem('safetyLoveMascot', mascotId); } catch {}
    const stats = (() => {
      try {
        const all = JSON.parse(localStorage.getItem('mascot_stats')) || {};
        return all[mascotId] || { level: 1, xp: 0 };
      } catch { return { level: 1, xp: 0 }; }
    })();
    setMascotLevel(stats.level);
    setMascotXp(stats.xp);
  };

  // Mascot game state
  const [showMascotGame, setShowMascotGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [gameItems, setGameItems] = useState([]);
  const [mascotX, setMascotX] = useState(50); // percent across container
  const MASCOT_STEP = 4; // percent per arrow click (smaller movement)
  const [gameTime, setGameTime] = useState(30);
  const [gameLives, setGameLives] = useState(3);
  const [poisonHit, setPoisonHit] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');
  const [achievementLevels, setAchievementLevels] = useState({ 20: false, 40: false });
  const gameContainerRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const gameTimerRef = useRef(null);
  const animationRef = useRef(null);
  const itemIdRef = useRef(0);
  const mascotXRef = useRef(50);
  const gameScoreRef = useRef(0); // para que el loop vea el score actual en tiempo real

  // helper to clamp and update mascot position
  const updateMascotX = (next) => {
    setMascotX((prev) => {
      const val = Math.max(5, Math.min(95, typeof next === 'function' ? next(prev) : next));
      mascotXRef.current = val;
      return val;
    });
  };

  const spawnItem = () => {
    const id = ++itemIdRef.current;
    const x = Math.random() * 80 + 10; // percent 10-90
    const roll = Math.random();

    let item;
    if (roll < 0.66) {
      const foods = [
        { emoji: '🍓', value: 1, label: 'Fruta' },
        { emoji: '🍏', value: 2, label: 'Manzana' },
        { emoji: '🥕', value: 2, label: 'Zanahoria' },
        { emoji: '🍉', value: 2, label: 'Sandía' },
        { emoji: '🍊', value: 2, label: 'Naranja' },
        { emoji: '🥐', value: 3, label: 'Pan' }
      ];
      const chosen = foods[Math.floor(Math.random() * foods.length)];
      item = { id, x, y: -28, speed: 0.8 + Math.random() * 1.1, type: 'good', emoji: chosen.emoji, value: chosen.value, label: chosen.label };
    } else if (roll < 0.9) {
      const poisons = [
        { emoji: '☠️', value: 1, label: 'Veneno' },
        { emoji: '🧪', value: 1, label: 'Droga' },
        { emoji: '💀', value: 2, label: 'Peligro' },
        { emoji: '🦴', value: 1, label: 'Peligro' }
      ];
      const chosen = poisons[Math.floor(Math.random() * poisons.length)];
      item = { id, x, y: -28, speed: 0.9 + Math.random() * 1.2, type: 'bad', emoji: chosen.emoji, value: chosen.value, label: chosen.label };
    } else {
      item = { id, x, y: -28, speed: 1.0 + Math.random() * 1.2, type: 'bonus', emoji: '⭐', value: 4, label: 'Bonus' };
    }

    setGameItems(prev => [...prev, item]);
  };

  const endGame = (reason) => {
    setGameRunning(false);
    setShowMascotGame(false);
    setGameMessage(reason ? `${reason} - Puntos: ${gameScore}` : `Juego terminado. Puntos: ${gameScore}`);
    if (gameScore > 0) addXp(Math.min(gameScore, 50));
    if (spawnIntervalRef.current) { clearInterval(spawnIntervalRef.current); spawnIntervalRef.current = null; }
    if (gameTimerRef.current) { clearInterval(gameTimerRef.current); gameTimerRef.current = null; }
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
  };

  const startGame = () => { console.log('startGame called, activeNav=', activeNav);
    // initialize
    setGameItems([]);
    setGameScore(0);
    gameScoreRef.current = 0;
    setGameTime(30);
    setGameLives(3);
    setGameRunning(true);
    setShowAchievement(false);
    setAchievementText('');
    setAchievementLevels({ 20: false, 40: false });
    setGameMessage('');
    itemIdRef.current = 0;
    mascotXRef.current = 50;
    setMascotX(50);

    // spawn items every 700ms
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    spawnIntervalRef.current = setInterval(spawnItem, 700);

    // countdown timer
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = setInterval(() => {
      setGameTime(t => {
        if (t <= 1) { endGame('Tiempo terminado'); return 0; }
        return t - 1;
      });
    }, 1000);

    // game loop: update positions
    let last = performance.now();
    const loop = (now) => {
      const delta = now - last;
      last = now;
      setGameItems(prev => {
        const container = gameContainerRef.current;
        const width = container ? container.clientWidth : 300;
        const height = container ? container.clientHeight : 240;
        const next = [];
        const multiplier = Math.min(2.8, 1 + (gameScoreRef.current || 0) * 0.025);

        prev.forEach(it => {
          const ny = it.y + it.speed * multiplier * (delta / 16);
          const mascotPx = (mascotXRef.current / 100) * width;
          const itemPx = (it.x / 100) * width;

          if (ny > height - 48) {
            if (Math.abs(mascotPx - itemPx) < 60) {
              setGameItems(prevItems => prevItems.filter(item => item.id !== it.id));

              if (it.type === 'good' || it.type === 'bonus') {
                setGameScore(s => {
                  const ns = s + (it.value || 1);
                  gameScoreRef.current = ns;
                  setGameMessage(it.type === 'bonus' ? '¡Bonus extra! ✨' : '¡Buena elección! 🍏');
                  return ns;
                });
              }

              if (it.type === 'bad') {
                setPoisonHit(true);
                setTimeout(() => setPoisonHit(false), 600);
                setGameLives(l => {
                  const nl = l - 1;
                  setGameMessage('¡Cuidado! Hay veneno. ☠️');
                  if (nl <= 0) {
                    endGame('No te quedan vidas');
                  }
                  return nl;
                });
              }
            }
            return;
          }

          next.push({ ...it, y: ny });
        });

        return next;
      });
      animationRef.current = requestAnimationFrame(loop);
    };
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(loop);
  };

  const handleKeyDown = (e) => {
    if (!gameRunning) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') updateMascotX(x => x - MASCOT_STEP);
      if (e.key === 'ArrowRight' || e.key === 'd') updateMascotX(x => x + MASCOT_STEP);
  };

  useEffect(() => {
    if (gameScore >= 20 && !achievementLevels[20]) {
      setAchievementLevels(prev => ({ ...prev, 20: true }));
      setAchievementText('20 puntos');
      setShowAchievement(true);
      setGameMessage('¡Logro desbloqueado! 20 puntos');
    }

    if (gameScore >= 40 && !achievementLevels[40]) {
      setAchievementLevels(prev => ({ ...prev, 40: true }));
      setAchievementText('40 puntos');
      setShowAchievement(true);
      setGameMessage('¡Logro desbloqueado! 40 puntos');
    }
  }, [gameScore, achievementLevels]);

  useEffect(() => {
    if (!showAchievement) return;
    const timeout = setTimeout(() => setShowAchievement(false), 2000);
    return () => clearTimeout(timeout);
  }, [showAchievement]);

  useEffect(() => {
    // expose a global helper so other components (mascot buttons elsewhere) can open the game in Inicio
    window.openMascotGame = () => { console.log('window.openMascotGame called'); setActiveNav('MiniJuego'); setShowMascotGame(true); };

    // cleanup on unmount
    return () => {
      delete window.openMascotGame;
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    // if navigation changes to the MiniJuego view, start the game and ensure the game area is shown
    if (activeNav === 'MiniJuego') {
      setShowMascotGame(true);
      // small delay to ensure DOM mounted
      setTimeout(() => { if (!gameRunning) startGame(); }, 50);
    } else {
      // if navigating away, stop the game
      if (gameRunning) endGame('Navegación');
    }
  }, [activeNav]);

  const getTodayKey = () => new Date().toISOString().slice(0, 10);

  const diffInDays = (fromDate, toDate) => {
    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);
    return Math.round((end - start) / 86400000);
  };

  const readStreakState = () => {
    const freshLogin = sessionStorage.getItem('safetyLoveFreshLogin') === 'true';
    if (freshLogin) {
      try {
        localStorage.removeItem('loginStreakState');
        localStorage.removeItem('loginStreak');
      } catch {}
      sessionStorage.removeItem('safetyLoveFreshLogin');
      return { streak: 0, lastDate: null, registeredDates: [] };
    }

    try {
      const stored = localStorage.getItem('loginStreakState');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            streak: Math.min(7, Number(parsed.streak) || 0),
            lastDate: typeof parsed.lastDate === 'string' ? parsed.lastDate : null,
            registeredDates: Array.isArray(parsed.registeredDates) ? parsed.registeredDates : [],
          };
        }
      }

      const legacy = JSON.parse(localStorage.getItem('loginStreak'));
      if (typeof legacy === 'number' && Number.isFinite(legacy)) {
        return { streak: Math.min(7, legacy), lastDate: getTodayKey(), registeredDates: [] };
      }
    } catch {}

    return { streak: 0, lastDate: null, registeredDates: [] };
  };

  const [streakState, setStreakState] = useState(() => readStreakState());
  const loginStreak = streakState.streak;
  const hasRegisteredToday = streakState.lastDate === getTodayKey();
  const [streakBurst, setStreakBurst] = useState(false);

  useEffect(() => {
    const today = getTodayKey();
    if (!streakState.lastDate) return;

    const diff = diffInDays(streakState.lastDate, today);
    if (diff > 1 || (streakState.streak >= 7 && diff >= 1)) {
      setStreakState({ streak: 0, lastDate: today, registeredDates: [] });
    }
  }, [streakState.lastDate, streakState.streak]);

  useEffect(() => {
    try { localStorage.setItem('loginStreakState', JSON.stringify(streakState)); } catch {}
  }, [streakState]);

  const registerStreakDay = () => {
    const today = getTodayKey();
    if (streakState.lastDate === today) {
      triggerToast('Ya registraste tu racha hoy.');
      return;
    }

    const previousDate = streakState.lastDate;
    let nextStreak = 1;
    let newDates = [];

    if (previousDate) {
      const diff = diffInDays(previousDate, today);
      if (diff === 1) {
        nextStreak = Math.min(7, streakState.streak + 1);
        newDates = [...(streakState.registeredDates || []), today];
      } else if (diff > 1) {
        nextStreak = 1;
        newDates = [today];
      }
    } else {
      newDates = [today];
    }

    const nextState = { streak: nextStreak, lastDate: today, registeredDates: newDates };
    setStreakState(nextState);
    setStreakBurst(true);
    setTimeout(() => setStreakBurst(false), 900);
    triggerToast(nextStreak >= 7 ? '¡Racha de 7 días completada! 🔥' : '¡Día registrado! 🔥');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((prev) => Math.max(0, prev - 1));
      if (!isSleeping) {
        setSleep((prev) => Math.max(0, prev - 1));
      } else {
        setSleep((prev) => Math.min(100, prev + 5));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isSleeping]);

  // Decremento lento de la barra de Diversión cuando NO se está jugando
  useEffect(() => {
    if (gameRunning) return; // mientras se juega no decrece
    const iv = setInterval(() => {
      setFun(f => Math.max(0, f - 1));
    }, 3000); // baja 1 punto cada 3 segundos
    return () => clearInterval(iv);
  }, [gameRunning]);

  // Al mostrar el mini-juego, intentar enfocar el contenedor para que reciba onKeyDown
  useEffect(() => {
    if (showMascotGame && gameContainerRef.current) {
      try { gameContainerRef.current.focus(); } catch (e) { /* ignore */ }
    }
  }, [showMascotGame]);

  // Soporte global de teclado para mover la mascota mientras el juego está corriendo
  useEffect(() => {
    const onKey = (e) => {
      if (!gameRunning) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') updateMascotX(x => x - MASCOT_STEP);
      if (e.key === 'ArrowRight' || e.key === 'd') updateMascotX(x => x + MASCOT_STEP);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameRunning]);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayMoods, setDayMoods] = useState({});
  const [dayNotes, setDayNotes] = useState({});

  const moodEmojis = [
    { emoji: '😊', label: 'Feliz', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😌', label: 'Tranquilo', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😐', label: 'Neutral', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😢', label: 'Triste', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😫', label: 'Estresado', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😠', label: 'Enojado', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '😴', label: 'Cansado', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
    { emoji: '🥰', label: 'Enamorado', color: '#F59E0B', bg: 'bg-[#FFF9E6]', text: 'text-amber-700', border: 'border-amber-400' },
  ];

  const moodTips = {
    Feliz: { tip: 'Aprovecha esta energía positiva para conectar con alguien que quieras o hacer algo que te apasione.', icon: '🌟', action: 'Comparte tu alegría con alguien especial' },
    Tranquilo: { tip: 'Es un buen momento para reflexionar, meditar o simplemente disfrutar del silencio. Aprovecha esta calma.', icon: '🧘', action: 'Dedica 5 minutos a respirar profundo' },
    Neutral: { tip: 'Los días neutros son perfectos para explorar algo nuevo. ¿Qué tal leer algo interesante o aprender algo nuevo?', icon: '📖', action: 'Explora algo nuevo hoy' },
    Triste: { tip: 'Está bien sentirse así. Permítete sentir, pero recuerda que esto pasará. Habla con alguien de confianza o escribe lo que sientes.', icon: '💙', action: 'Escribe en tu diario o habla con alguien' },
    Estresado: { tip: 'Respira profundo 10 veces. Prioriza lo importante y deja lo demás para después. Tu salud mental es primero.', icon: '🫁', action: 'Haz 10 respiraciones profundas' },
    Enojado: { tip: 'Antes de reaccionar, cuenta hasta 10. El enojo es válido, pero no dejes que te controle. Sal a caminar si puedes.', icon: '🚶', action: 'Sal a caminar 10 minutos' },
    Cansado: { tip: 'Tu cuerpo te pide descanso. Si puedes, duerme una siesta o acost temprano. Mañana será un día mejor.', icon: '😴', action: 'Descansa o duerme temprano' },
    Enamorado: { tip: 'Disfruta ese sentimiento bonito. El amor propio también cuenta: cuídate, date un gusto, mírate al espejo y sonríe.', icon: '💕', action: 'Date un gusto o regálate algo' },
  };

  const getMoodCellColor = (label) => {
    if (!label) return 'transparent';
    if (label === 'Feliz') return '#C8E6C9';
    if (label === 'Enamorado') return '#C8E6C9';
    if (label === 'Tranquilo') return '#FFF3B0';
    if (label === 'Neutral') return '#FFF3B0';
    if (label === 'Triste') return '#BBDEFB';
    if (label === 'Estresado') return '#FFB3C6';
    if (label === 'Enojado') return '#FFB3C6';
    if (label === 'Cansado') return '#FFF3B0';
    return '#FFF9E6';
  };

  const getMoodForDay = (day) => {
    const key = `${calYear}-${calMonth}-${day}`;
    return dayMoods[key] || null;
  };

  const isSameCalendarDay = (a, b) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const calMonth = calendarDate.getMonth();
  const calYear = calendarDate.getFullYear();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const today = new Date();

  const [modalDraftNote, setModalDraftNote] = useState('');
  const [modalDraftMood, setModalDraftMood] = useState(null);

  useEffect(() => {
    if (!showDayModal || !selectedDay) {
      setModalDraftNote('');
      setModalDraftMood(null);
      return;
    }

    const key = `${calYear}-${calMonth}-${selectedDay}`;
    setModalDraftNote(dayNotes[key] || '');
    setModalDraftMood(dayMoods[key] || null);
  }, [showDayModal, selectedDay, calYear, calMonth, dayNotes, dayMoods]);

  const saveMood = (emoji) => {
    if (!selectedDay) return;

    const selectedDate = new Date(calYear, calMonth, selectedDay);
    if (!isSameCalendarDay(selectedDate, today)) {
      triggerToast('Solo puedes registrar el día actual');
      return;
    }

    setModalDraftMood(emoji);
  };

  const getNoteForDay = (day) => {
    const key = `${calYear}-${calMonth}-${day}`;
    return dayNotes[key] || '';
  };

  const saveNote = (text) => {
    if (!selectedDay) return;

    const selectedDate = new Date(calYear, calMonth, selectedDay);
    if (!isSameCalendarDay(selectedDate, today)) {
      triggerToast('Solo puedes escribir el día actual');
      return;
    }

    const key = `${calYear}-${calMonth}-${selectedDay}`;
    setDayNotes(prev => ({ ...prev, [key]: text }));
  };

  const saveDayRecord = () => {
    if (!selectedDay) return;

    const selectedDate = new Date(calYear, calMonth, selectedDay);
    if (!isSameCalendarDay(selectedDate, today)) {
      triggerToast('Solo puedes guardar el día actual');
      return;
    }

    const key = `${calYear}-${calMonth}-${selectedDay}`;

    if (modalDraftMood) {
      setDayMoods(prev => ({ ...prev, [key]: modalDraftMood }));
    } else {
      setDayMoods(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    if (modalDraftNote.trim()) {
      saveNote(modalDraftNote);
    } else {
      setDayNotes(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    setShowDayModal(false);
  };

  const todayMood = getMoodForDay(today.getDate());
  const todayMoodStyle = todayMood ? moodEmojis.find(m => m.emoji === todayMood) : null;
  const [homeReflection, setHomeReflection] = useState('');

  const prevMonth = () => setCalendarDate(new Date(calYear, calMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(calYear, calMonth + 1, 1));
  const prevYear = () => setCalendarDate(new Date(calYear - 1, calMonth, 1));
  const nextYear = () => setCalendarDate(new Date(calYear + 1, calMonth, 1));

  // Emotion Selection state
  const [selectedEmotion, setSelectedEmotion] = useState('Feliz');
  const [registeredDaysCount, setRegisteredDaysCount] = useState(() => { try { return JSON.parse(localStorage.getItem('safetyLove_registeredDays')) ?? 0; } catch { return 0; } });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [emotionalStreak, setEmotionalStreak] = useState(() => { try { return JSON.parse(localStorage.getItem('streak')) ?? 0; } catch { return 0; } });

  // Settings state (lifted from SettingsSectionContent)
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('safetyLoveDarkMode') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('safetyLoveDarkMode', darkMode); } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load profile photo from Supabase on mount
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        setAuthUser(user || null);
        if (user?.id) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
          if (profile && mounted) {
            const photo = profile.avatar_url || profile.photo || profile.avatar || profile.image || null;
            if (photo) setUserPhotoUrl(photo);
            if (profile.name) setUserName(profile.name);
            if (profile.email) setUserEmail(profile.email);
          }
          if (!profile && mounted) {
            const metaName = user.user_metadata?.name;
            const metaEmail = user.email;
            if (metaName) setUserName(metaName);
            if (metaEmail) setUserEmail(metaEmail);
          }
        }
      } catch (e) {
        // ignore errors, keep local fallback
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, []);

  const [language, setLanguage] = useState('es');
  const [fontSize, setFontSize] = useState('normal');
  const [saludoAuto, setSaludoAuto] = useState(true);
  const [recordatorioEscribir, setRecordatorioEscribir] = useState(true);
  const [recordatorioDiario, setRecordatorioDiario] = useState(true);
  const [fraseDiaria, setFraseDiaria] = useState(true);
  const [ejercicios, setEjercicios] = useState(true);
  const [bloqueoPin, setBloqueoPin] = useState(false);
  const [copiaSeguridad, setCopiaSeguridad] = useState(true);
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  // Profile photo (loaded from Supabase)
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  // Account modal state
  const [userName, setUserName] = useState('Miguel Páez');
  const [userEmail, setUserEmail] = useState('miguel@example.com');
  const [userBio, setUserBio] = useState('Cada pequeño paso cuenta.');
  const [userAvatar, setUserAvatar] = useState('MP');
  const [activeModal, setActiveModal] = useState(null);
  const [modalInput, setModalInput] = useState('');
  const [modalInput2, setModalInput2] = useState('');
  const [avatarColors] = useState([
    { bg: 'bg-pink-100', text: 'text-pink-500', label: 'Rosa' },
    { bg: 'bg-blue-100', text: 'text-blue-500', label: 'Azul' },
    { bg: 'bg-green-100', text: 'text-green-500', label: 'Verde' },
    { bg: 'bg-purple-100', text: 'text-purple-500', label: 'Morado' },
    { bg: 'bg-amber-100', text: 'text-amber-500', label: 'Ámbar' },
  ]);
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const photoInputRef = useRef(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileEditField, setProfileEditField] = useState(null);
  const [profileEditValue, setProfileEditValue] = useState('');

  // Dark mode class helper
  const dm = (light, dark) => darkMode ? dark : light;

  // Font size helper
  const fontSizeMap = { small: 'text-xs', normal: 'text-sm', large: 'text-base', xlarge: 'text-lg' };

  // Language translations
  const t = (key) => {
    const translations = {
      es: {
        inicio: 'Inicio', registro: 'Registro de Emociones',         chat: 'Blog Anónimo',
        consejos: 'Consejos Diarios', versiculo: 'Versículo Diario',
        diario: 'Diario Personal', recordatorios: 'Recordatorios', configuracion: 'Configuración',
        avatar: 'Personaliza tu avatar',
        hola: 'Hola de nuevo, Miguel', cultivar: '¿Qué te gustaría cultivar hoy?',
        bienvenida: 'Bienvenido a tu espacio', safetyLove: 'Safety Love está aquí para apoyarte. Respira, refleja y avanza a tu propio ritmo hoy.',
        momento: 'Tu Momento de Bienestar', configTitle: 'Configuración',
        configSub: 'Personaliza tu experiencia en Safety Love',
        cuenta: 'Cuenta', apariencia: 'Apariencia', safetyBot: 'Safety Bot', bienestar: 'Bienestar',
        privacidad: 'Privacidad', notificaciones: 'Notificaciones', idioma: 'Idioma', acercaDe: 'Acerca de',
        modoOscuro: 'Modo oscuro', cambiarFoto: 'Cambiar foto de perfil', editarNombre: 'Editar nombre',
        correo: 'Correo electrónico', cambiarPass: 'Cambiar contraseña', colorPrincipal: 'Color principal',
        tamInterfaz: 'Tamaño de interfaz', tamTexto: 'Tamaño del texto', cambiarMascota: 'Cambiar mascota',
        vozBot: 'Voz del bot', estiloChat: 'Estilo de conversación', saludoAuto: 'Saludo automático',
        recEscribir: 'Recordatorio para escribir', recDiario: 'Recordatorio del diario',
        fraseDiaria: 'Frase motivacional diaria', ejercicios: 'Ejercicios recomendados',
        bloqueoPin: 'Bloquear con PIN', biometria: 'Huella / Face ID', copiaSeg: 'Copia de seguridad',
        exportar: 'Exportar diario', notifActivar: 'Activar notificaciones', horarioSilencioso: 'Horario silencioso',
        frecuencia: 'Frecuencia', espanol: 'Español', ingles: 'Inglés',
        terminos: 'Términos y condiciones', politica: 'Política de privacidad',
        soporte: 'Contactar soporte', calificar: 'Calificar aplicación',
        cerrarSesion: 'Cerrar sesión', editPerfil: 'Editar perfil',
        pequenosPasos: 'Quédate con nosotros más tiempo',
      },
      en: {
        inicio: 'Home', registro: 'Emotion Tracking', chat: 'Anonymous Blog',
        experiencias: 'Experiences', consejos: 'Daily Tips', versiculo: 'Daily Verse',
        diario: 'Personal Diary', recordatorios: 'Reminders', configuracion: 'Settings',
        avatar: 'Customize your avatar',
        hola: 'Welcome back, Miguel', cultivar: 'What would you like to cultivate today?',
        bienvenida: 'Welcome to your space', safetyLove: 'Safety Love is here to support you. Breathe, reflect, and move forward at your own pace today.',
        momento: 'Your Wellness Moment', configTitle: 'Settings',
        configSub: 'Customize your Safety Love experience',
        cuenta: 'Account', apariencia: 'Appearance', safetyBot: 'Safety Bot', bienestar: 'Wellness',
        privacidad: 'Privacy', notificaciones: 'Notifications', idioma: 'Language', acercaDe: 'About',
        modoOscuro: 'Dark mode', cambiarFoto: 'Change profile photo', editarNombre: 'Edit name',
        correo: 'Email', cambiarPass: 'Change password', colorPrincipal: 'Accent color',
        tamInterfaz: 'Interface size', tamTexto: 'Text size', cambiarMascota: 'Change mascot',
        vozBot: 'Bot voice', estiloChat: 'Conversation style', saludoAuto: 'Auto greeting',
        recEscribir: 'Writing reminder', recDiario: 'Diary reminder',
        fraseDiaria: 'Daily motivational quote', ejercicios: 'Recommended exercises',
        bloqueoPin: 'PIN lock', biometria: 'Fingerprint / Face ID', copiaSeg: 'Backup',
        exportar: 'Export diary', notifActivar: 'Enable notifications', horarioSilencioso: 'Quiet hours',
        frecuencia: 'Frequency', espanol: 'Spanish', ingles: 'English',
        terminos: 'Terms and conditions', politica: 'Privacy policy',
        soporte: 'Contact support', calificar: 'Rate application',
        cerrarSesion: 'Log out', editPerfil: 'Edit profile',
        pequenosPasos: 'Stay with us longer',
      }
    };
    return translations[language]?.[key] || translations['es']?.[key] || key;
  };

  // Verses and Tips rotation
  const [verseIdx, setVerseIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  const verses = [
    { text: "El amor todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.", ref: "1 Corintios 13:7" },
    { text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.", ref: "Isaías 41:10" },
    { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.", ref: "Juan 14:27" },
    { text: "El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.", ref: "Salmos 23:1-2" }
  ];

  const tips = [
    { text: "La comunicación honesta fortalece cualquier relación.", highlight: "Comunicación" },
    { text: "Aprende a decir 'no' sin culpa; establecer límites es un acto de amor propio.", highlight: "Límites" },
    { text: "Toma 5 minutos para respirar conscientemente hoy. Tu mente lo agradecerá.", highlight: "Respiración" },
    { text: "Dedica un momento para agradecer 3 cosas buenas que te ocurrieron hoy.", highlight: "Gratitud" }
  ];

  // Experiencias list state with dynamic likes
  const [experiences, setExperiences] = useState([
    { id: 1, title: "Superamos una infidelidad", desc: "Fue un proceso difícil, pero con amor, paciencia y ayuda logramos reconstruir nuestra relación...", likes: 45, icon: <HuggingIllustration /> },
    { id: 2, title: "Cómo mejorar la comunicación", desc: "Les comparto lo que ha funcionado para nosotros cuando discutimos...", likes: 32, icon: <SproutIllustration /> },
    { id: 3, title: "De amigos a pareja", desc: "Nunca imaginé que mi mejor amigo se convertiría en el amor de mi vida...", likes: 19, icon: <WalkingIllustration /> }
  ]);

  const handleLikeExperience = (id) => {
    setExperiences(prev =>
      prev.map(exp => exp.id === id ? { ...exp, likes: exp.likes + 1 } : exp)
    );
    triggerToast('¡Le diste amor a esta historia!');
  };

  // Chat Anónimo Forum Space State
  const [activeForumTab, setActiveForumTab] = useState('Todas las conversaciones');
  const [forumMessages, setForumMessages] = useState([
    { id: 1, text: "¿Cómo manejar los celos en la relación?", author: "Anónima", time: "Hace 10 min", likes: 12, comments: 8, tab: "Celos" },
    { id: 2, text: "Terminé mi relación y no sé cómo seguir adelante.", author: "Anónima", time: "Hace 25 min", likes: 15, comments: 9, tab: "Relaciones" },
    { id: 3, text: "¿Cómo construir confianza después de una traición?", author: "Anónima", time: "Hace 40 min", likes: 9, comments: 5, tab: "Confianza" }
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([
    { id: 1, date: '14 de mayo, 2024', title: 'Hoy agradezco las pequeñas cosas...', icon: <BookOpen size={16} /> },
    { id: 2, date: '10 de mayo, 2024', title: 'Fue un día difícil, pero aprendí...', icon: <Heart size={16} /> },
    { id: 3, date: '7 de mayo, 2024', title: 'Pequeños pasos me están...', icon: <Star size={16} /> },
  ]);


  // SettingsSectionContent removed — content inlined in render

  const handleSendPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: newPostText,
      author: "Anónima",
      time: "Hace 1 min",
      likes: 0,
      comments: 0,
      tab: activeForumTab === 'Todas las conversaciones' ? 'General' : activeForumTab
    };

    setForumMessages([newMsg, ...forumMessages]);
    setNewPostText('');
    triggerToast("Tu mensaje ha sido publicado de forma anónima.");
  };

  const handleLikePost = (id) => {
    setForumMessages(prev =>
      prev.map(msg => msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg)
    );
  };

  // Toast notifier
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRegisterEmotion = () => {
    triggerToast(`Registraste tu estado: ${selectedEmotion} 💖`);
    if (registeredDaysCount < 7) {
      setRegisteredDaysCount(prev => {
        const next = prev + 1;
        try { localStorage.setItem('safetyLove_registeredDays', JSON.stringify(next)); } catch {}
        return next;
      });
    }
  };

  const emotions = [
    { label: 'Feliz', emoji: '😊', bg: 'bg-[#FFF9E6]' },
    { label: 'Tranquilo/a', emoji: '😌', bg: 'bg-[#EEF6FF]' },
    { label: 'Pensativo/a', emoji: '🤔', bg: 'bg-[#FFF0EB]' },
    { label: 'Triste', emoji: '😢', bg: 'bg-[#F5F0FF]' },
    { label: 'Enojado/a', emoji: '😠', bg: 'bg-[#FFF0F2]' },
  ];

  const allSidebarLinks = [
    { id: 'Inicio', label: t('inicio'), icon: <Home size={18} fill="currentColor" /> },
    { id: 'Registro de Emociones', label: t('registro'), icon: <Smile size={18} /> },
    { id: 'Chat Anónimo', label: t('chat'), icon: <MessageCircle size={18} /> },
    { id: 'Versículo Diario', label: t('versiculo'), icon: <BookOpen size={18} /> },
    { id: 'Diario Personal', label: t('diario'), icon: <Book size={18} /> },
    { id: 'Chat con IA', label: 'Chat con IA', icon: <Bot size={18} /> },
    { id: 'Habla con tu psicólogo', label: 'Habla con tu psicólogo', icon: <Phone size={18} /> },
    { id: 'Juegos', label: 'Juegos', icon: <Volleyball size={18} /> },
    { id: 'Recordatorios', label: t('recordatorios'), icon: <Clock size={18} /> },
    { id: 'Configuración', label: t('configuracion'), icon: <Settings size={18} /> },
  ];

  // Filter messages based on activeForumTab
  const filteredMessages = forumMessages.filter(msg => {
    if (activeForumTab === 'Todas las conversaciones') return true;
    return msg.tab.toLowerCase() === activeForumTab.toLowerCase();
  });

  return (
    <div className={`flex h-screen w-screen overflow-hidden select-none font-sans relative ${fontSizeMap[fontSize]} ${darkMode ? 'bg-[#070D1C] text-slate-200' : 'text-slate-900'}`} style={{ background: darkMode ? undefined : '#F5F0E8' }}>
      
      {/* Toast Alert popup */}
      {showToast && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#E88B9A] text-white py-3 px-6 rounded-full shadow-lg font-semibold text-xs tracking-wide animate-fadeIn flex items-center gap-2">
          {toastMessage}
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setProfileOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%', maxWidth: '960px', maxHeight: '88vh',
              overflowY: 'auto', borderRadius: '28px',
              background: darkMode ? '#0F172A' : '#F5F0E8',
              border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.25), 0 4px 20px rgba(0,0,0,0.1)',
              padding: '0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── CLOSE BUTTON ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 28px 0' }}>
              <button onClick={() => setProfileOpen(false)}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                  color: darkMode ? '#64748B' : '#94A3B8',
                  border: 'none', cursor: 'pointer', transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '8px 48px 48px' }}>

              {/* ── HEADER: AVATAR + INFO ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '32px',
                marginBottom: '32px', flexWrap: 'wrap'
              }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                    border: '3px solid #F472B6',
                    boxShadow: '0 8px 24px rgba(244,114,182,0.2)'
                  }}>
                    {userPhotoUrl ? (
                      <img src={userPhotoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={44} style={{ color: darkMode ? '#475569' : '#94A3B8' }} />
                    )}
                  </div>
                  <label style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: '#EC4899',
                    border: '3px solid ' + (darkMode ? '#0F172A' : '#FFFFFF'),
                    boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                    transition: 'all 200ms ease'
                  }}>
                    <Camera size={16} color="#fff" />
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { const r = new FileReader(); r.onload = (ev) => { setUserPhotoUrl(ev.target.result); }; r.readAsDataURL(f); }
                    }} />
                  </label>
                </div>

                {/* Name + Bio + Email */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2 style={{
                    fontSize: '30px', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#0F172A',
                    lineHeight: 1.2, marginBottom: '8px', letterSpacing: '-0.02em',
                    fontFamily: "'Poppins', sans-serif",
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {userName}
                  </h2>
                  <p style={{
                    fontSize: '16px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8',
                    marginBottom: '10px', lineHeight: 1.4
                  }}>
                    {userBio || 'Cada pequeño paso cuenta.'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} style={{ color: darkMode ? '#475569' : '#94A3B8' }} />
                    <span style={{
                      fontSize: '14px', fontWeight: 500,
                      color: darkMode ? '#475569' : '#94A3B8'
                    }}>{userEmail}</span>
                  </div>
                </div>
              </div>

              {/* ── STATS ── */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px', marginBottom: '32px'
              }}>
                {[
                  { value: loginStreak || 0, label: 'Racha', color: '#EC4899', bg: darkMode ? 'rgba(236,72,153,0.1)' : '#FBCFE8', icon: '🔥' },
                  { value: emotionalStreak || 0, label: 'Emociones', color: '#F59E0B', bg: darkMode ? 'rgba(245,158,11,0.1)' : '#FDE68A', icon: '😊' },
                  { value: registeredDaysCount || 0, label: 'Días', color: '#8B5CF6', bg: darkMode ? 'rgba(139,92,246,0.1)' : '#DDD6FE', icon: '📅' },
                ].map((s) => (
                  <div key={s.label} style={{
                    borderRadius: '20px', padding: '24px', textAlign: 'center',
                    background: s.bg,
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 200ms ease'
                  }}>
                    <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>{s.icon}</span>
                    <p style={{
                      fontSize: '32px', fontWeight: 800, color: s.color,
                      lineHeight: 1, fontFamily: "'Poppins', sans-serif"
                    }}>{s.value}</p>
                    <p style={{
                      fontSize: '14px', fontWeight: 600,
                      color: darkMode ? '#475569' : '#94A3B8', marginTop: '6px'
                    }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── DATA FIELDS ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {[
                  { icon: <User size={18} />, label: 'NOMBRE', value: userName, field: 'name' },
                  { icon: <Mail size={18} />, label: 'CORREO', value: userEmail, field: 'email' },
                  { icon: <PenTool size={18} />, label: 'BIO', value: userBio || 'No configurada', field: 'bio' },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderRadius: '18px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                    minHeight: '80px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, flex: 1 }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
                        color: darkMode ? '#64748B' : '#64748B', flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                          color: darkMode ? '#475569' : '#94A3B8', marginBottom: '4px'
                        }}>{item.label}</p>
                        <p style={{
                          fontSize: '16px', fontWeight: 600,
                          color: darkMode ? '#E2E8F0' : '#1E293B',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{item.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileEditField(item.field);
                        setProfileEditValue(item.field === 'name' ? userName : item.field === 'email' ? userEmail : userBio);
                      }}
                      style={{
                        fontSize: '14px', fontWeight: 600, color: '#EC4899',
                        background: darkMode ? 'rgba(236,72,153,0.1)' : '#FDF2F8',
                        border: 'none', cursor: 'pointer', flexShrink: 0,
                        padding: '8px 18px', borderRadius: '12px',
                        transition: 'all 200ms ease', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.2)' : '#FCE7F3'}
                      onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.1)' : '#FDF2F8'}
                    >
                      Editar <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <button
                  onClick={() => { setProfileOpen(false); setActiveNav('Configuración'); setActiveModal('name'); setModalInput(userName); }}
                  style={{
                    height: '64px', borderRadius: '18px', border: 'none',
                    background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 16px rgba(236,72,153,0.3)',
                    transition: 'all 200ms ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,72,153,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.3)'; }}
                >
                  <Pencil size={18} /> Editar perfil
                </button>
                <button
                  onClick={() => { setProfileOpen(false); setActiveNav('Configuración'); }}
                  style={{
                    height: '64px', borderRadius: '18px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    background: darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                    color: darkMode ? '#CBD5E1' : '#475569',
                    fontSize: '16px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 200ms ease', fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9'}
                >
                  <Settings size={18} /> Ajustes
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {/* ── Profile Edit Modal ── */}
      {profileEditField && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onMouseDown={() => setProfileEditField(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-full max-w-[520px] rounded-[28px] shadow-2xl overflow-hidden ${darkMode ? 'bg-[#1E293B]' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col items-center pt-10 pb-6 px-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-pink-500 to-rose-500">
                <User size={28} color="#fff" />
              </div>
              <h3 className={`text-[22px] font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {profileEditField === 'name' ? 'Editar nombre' : profileEditField === 'email' ? 'Editar correo' : 'Editar bio'}
              </h3>
              <p className={`text-[13px] font-medium mt-2 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {profileEditField === 'name' ? 'Actualiza el nombre que se muestra en tu perfil.' : profileEditField === 'email' ? 'Actualiza tu correo electrónico.' : 'Actualiza tu biografía personal.'}
              </p>
            </div>

            {/* Input */}
            <div className="px-8 pb-3">
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-2 pl-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {profileEditField === 'name' ? 'Nombre' : profileEditField === 'email' ? 'Correo' : 'Bio'}
              </label>
              <div className="relative">
                {!profileEditValue && (
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {profileEditField === 'name' ? <User size={18} /> : profileEditField === 'email' ? <Mail size={18} /> : <PenTool size={18} />}
                  </div>
                )}
                <input
                  autoFocus
                  value={profileEditValue}
                  onChange={(e) => setProfileEditValue(e.target.value)}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === 'Enter') { const val = profileEditValue.trim(); if (!val) return; if (profileEditField === 'name') { setUserName(val); localStorage.setItem('safetyLove_userName', val); } else if (profileEditField === 'email') { setUserEmail(val); localStorage.setItem('safetyLove_userEmail', val); } else { setUserBio(val); localStorage.setItem('safetyLove_userBio', val); } setProfileEditField(null); } }}
                  className={`w-full h-[56px] pl-12 pr-5 rounded-2xl border text-[15px] font-medium outline-none transition-all duration-200 focus:border-pink-400 focus:shadow-[0_0_0_3px_rgba(244,63,158,0.12)] ${darkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-gray-50 text-slate-800'}`}
                  placeholder=""
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 px-8 pb-8 pt-6">
              <button onClick={() => setProfileEditField(null)}
                className={`flex-1 h-[54px] rounded-2xl font-semibold text-[14px] transition-all duration-200 border ${darkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10' : 'bg-gray-100 text-slate-600 hover:bg-gray-200 border-gray-200'}`}>
                Cancelar
              </button>
              <button onClick={() => {
                const val = profileEditValue.trim();
                if (!val) return;
                if (profileEditField === 'name') {
                  setUserName(val);
                  localStorage.setItem('safetyLove_userName', val);
                } else if (profileEditField === 'email') {
                  setUserEmail(val);
                  localStorage.setItem('safetyLove_userEmail', val);
                } else {
                  setUserBio(val);
                  localStorage.setItem('safetyLove_userBio', val);
                }
                setProfileEditField(null);
              }}
                className="flex-1 h-[54px] rounded-2xl font-semibold text-[14px] transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #F43F9E, #E11D6D)', color: '#fff', boxShadow: '0 4px 16px rgba(244,63,158,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,158,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,63,158,0.3)'; }}>
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <nav
        className="hidden lg:flex flex-col items-center z-50"
        style={{
          position: 'fixed',
          left: '16px',
          top: '16px',
          bottom: '16px',
          width: '72px',
          padding: '18px 0',
          background: darkMode ? 'linear-gradient(180deg, #151D30 0%, #111827 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
          borderRadius: '28px',
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
          border: darkMode ? 'none' : '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {/* Logo */}
        <button onClick={() => setActiveNav('Inicio')} className="flex items-center justify-center mb-1 transition-all duration-200 hover:scale-110" title="Safety Love">
          <img src="/logo.png" alt="SafetyLove" className="w-20 h-20 object-contain" />
        </button>

        {/* Nav items */}
        <div className="flex flex-col items-center flex-1 justify-between py-2">
          {allSidebarLinks.map((link) => {
            const isActive = activeNav === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveNav(link.id)}
                className="relative flex items-center justify-center transition-all duration-200 group"
                style={{
                  width: isActive ? '42px' : '36px',
                  height: '36px',
                  borderRadius: '14px',
                  background: isActive
                    ? 'linear-gradient(135deg, #F43F9E, #E11D6D)'
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : darkMode ? '#64748B' : '#475569',
                  boxShadow: isActive ? '0 4px 16px rgba(244,63,158,0.35)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
                    e.currentTarget.style.color = darkMode ? '#94A3B8' : '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = darkMode ? '#64748B' : '#475569';
                  }
                }}
                title={link.label}
              >
                <span className="shrink-0" style={{ transform: 'scale(0.85)' }}>{link.icon}</span>
                {/* Active label pill extending right */}
                {isActive && (
                  <span className="absolute left-full ml-2 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap pointer-events-none opacity-100 transition-opacity duration-200" style={{ background: darkMode ? '#1a2236' : '#FFFFFF', color: darkMode ? '#FFFFFF' : '#1E293B', boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {link.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Profile */}
        <button
          onClick={() => setProfileOpen(true)}
          className="w-9 h-9 rounded-[14px] flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #F472B6, #FB7185)',
            boxShadow: '0 4px 12px rgba(244,114,182,0.3)',
          }}
          title={userName}
        >
          {userPhotoUrl ? (
            <img src={userPhotoUrl} alt="Avatar" className="w-full h-full object-cover rounded-[14px]" />
          ) : (
            <span className="text-white text-[12px] font-extrabold">{userName?.charAt(0) || 'U'}</span>
          )}
        </button>
      </nav>

      {/* ================= MOBILE HAMBURGER ================= */}
      <button onClick={() => setMobileMenuOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-[90] w-10 h-10 rounded-xl flex items-center justify-center transition ${darkMode ? 'bg-[#1E293B] text-gray-300' : 'bg-white text-slate-600 shadow-sm'}`}
        aria-label="Abrir menú">
        <Menu size={20} />
      </button>

      {/* Mobile overlay for settings etc */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col overflow-hidden h-full transition-[padding] duration-[200ms] ease-in-out"
        style={{ padding: '0 0 0 104px' }}>
        {activeNav === 'MiniJuego' ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(7,13,28,0.85)', backdropFilter: 'blur(10px)', padding: '24px' }}>
            <style>{`
              @keyframes float-item { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
              @keyframes game-star-glow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
              @keyframes game-mascot-idle { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
              .game-star-particle { animation: game-star-glow 3s ease-in-out infinite; }
              .game-mascot-float { animation: game-mascot-idle 2.5s ease-in-out infinite; }
              @media (max-width: 640px) { .game-controls-row { flex-direction: column !important; align-items: stretch !important; } .game-stats-row { flex-wrap: wrap !important; } }
            `}</style>

            <div className="w-full overflow-hidden" style={{
              maxWidth: '700px',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'linear-gradient(165deg, #0D1527 0%, #101A32 40%, #0F1830 100%)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
              padding: '20px',
            }}>

              {/* ── HEADER ── */}
              <div className="text-center relative" style={{ marginBottom: '16px' }}>
                <button onClick={() => { setActiveNav('Inicio'); setShowMascotGame(false); endGame(); }}
                  className="absolute top-0 right-0 flex items-center transition-all duration-200"
                  style={{
                    height: '36px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#94A3B8',
                    fontSize: '12px',
                    fontWeight: 600,
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F83B91'; e.currentTarget.style.background = 'rgba(248,59,145,0.08)'; e.currentTarget.style.color = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94A3B8'; }}>
                  <X size={14} /> Cerrar
                </button>

                <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#F83B91', marginBottom: '10px' }}>
                  &#10022; Mascota &#10022;
                </p>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.1, marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>
                  Mini-juego de bienestar
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                  Cuida de tu mascota y mejora tu bienestar día a día.
                </p>
              </div>

              {/* ── STATS + GAME AREA ── */}

              {/* Stats row */}
              <div className="game-stats-row flex items-center" style={{ gap: '10px', marginBottom: '14px' }}>
                <div className="flex items-center" style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(248,59,145,0.15)',
                  background: 'rgba(248,59,145,0.06)',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#F83B91',
                }}>
                  <span style={{ opacity: 0.7 }}>⏱</span> {gameTime}s
                </div>
                <div className="flex items-center" style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34,197,94,0.15)',
                  background: 'rgba(34,197,94,0.06)',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#22C55E',
                }}>
                  <span style={{ opacity: 0.7 }}>❤️</span> {gameLives}
                </div>
                <div className="flex items-center" style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(250,204,21,0.15)',
                  background: 'rgba(250,204,21,0.06)',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FACC15',
                }}>
                  <span style={{ opacity: 0.7 }}>⭐</span> {gameScore}
                </div>
              </div>

              {/* ── GAME ARENA ── */}
              <div ref={gameContainerRef} tabIndex={0} onKeyDown={handleKeyDown}
                className="relative w-full overflow-hidden"
                style={{
                  height: '340px',
                  borderRadius: '28px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'linear-gradient(180deg, #0B1120 0%, #111D35 40%, #151F3A 70%, #0D1525 100%)',
                  boxShadow: 'inset 0 2px 60px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.04)',
                }}>

                {/* Starfield background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[
                    { x: '5%', y: '8%', r: 1.5, o: 0.35, d: 0 },
                    { x: '15%', y: '5%', r: 1, o: 0.25, d: 0.5 },
                    { x: '28%', y: '12%', r: 1.2, o: 0.3, d: 1 },
                    { x: '42%', y: '3%', r: 0.8, o: 0.2, d: 1.5 },
                    { x: '58%', y: '7%', r: 1.4, o: 0.28, d: 0.8 },
                    { x: '72%', y: '10%', r: 1, o: 0.22, d: 2 },
                    { x: '85%', y: '4%', r: 1.3, o: 0.3, d: 0.3 },
                    { x: '93%', y: '14%', r: 0.9, o: 0.2, d: 1.2 },
                    { x: '10%', y: '20%', r: 0.7, o: 0.15, d: 2.5 },
                    { x: '50%', y: '18%', r: 0.6, o: 0.12, d: 1.8 },
                    { x: '78%', y: '22%', r: 0.8, o: 0.18, d: 0.7 },
                    { x: '35%', y: '25%', r: 0.5, o: 0.1, d: 3 },
                  ].map((s, i) => (
                    <div key={i} className="absolute rounded-full bg-white game-star-particle"
                      style={{ left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, opacity: s.o, animationDelay: `${s.d}s` }} />
                  ))}
                </div>

                {/* Subtle nebula glow */}
                <div className="absolute pointer-events-none" style={{
                  top: '10%', left: '20%', width: '300px', height: '200px',
                  borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
                }} />
                <div className="absolute pointer-events-none" style={{
                  top: '5%', right: '15%', width: '250px', height: '180px',
                  borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,59,145,0.03) 0%, transparent 70%)',
                }} />

                {/* Ground — curved platform */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '80px' }}>
                  <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
                    <defs>
                      <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(248,59,145,0.06)" />
                        <stop offset="100%" stopColor="rgba(13,21,37,0.9)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,30 Q250,0 500,20 Q750,40 1000,15 L1000,80 L0,80 Z" fill="url(#groundGrad)" />
                    <path d="M0,30 Q250,0 500,20 Q750,40 1000,15" fill="none" stroke="rgba(248,59,145,0.12)" strokeWidth="1" />
                  </svg>
                </div>

                {/* Ground glow line */}
                <div className="absolute inset-x-0 pointer-events-none" style={{ bottom: '70px', height: '1px', background: 'linear-gradient(90deg, transparent 5%, rgba(248,59,145,0.1) 30%, rgba(139,92,246,0.08) 70%, transparent 95%)' }} />

                {/* ── GAME ITEMS ── */}
                {gameItems.map(item => (
                  <div
                    key={item.id}
                    style={{ position: 'absolute', left: `${item.x}%`, top: item.y, animation: `float-item ${2.5 + (item.id % 3) * 0.4}s ease-in-out infinite` }}
                    className="pointer-events-none select-none"
                  >
                    <div style={{
                      width: '64px', height: '64px',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px',
                      border: item.type === 'good'
                        ? '2px solid rgba(34,197,94,0.45)'
                        : item.type === 'bonus'
                        ? '2px solid rgba(250,204,21,0.45)'
                        : '2px solid rgba(244,63,94,0.45)',
                      background: item.type === 'good'
                        ? 'rgba(34,197,94,0.1)'
                        : item.type === 'bonus'
                        ? 'rgba(250,204,21,0.1)'
                        : 'rgba(244,63,94,0.1)',
                      boxShadow: item.type === 'good'
                        ? '0 0 20px rgba(34,197,94,0.15)'
                        : item.type === 'bonus'
                        ? '0 0 20px rgba(250,204,21,0.15)'
                        : '0 0 20px rgba(244,63,94,0.15)',
                    }}>
                      {item.emoji}
                    </div>
                  </div>
                ))}

                {/* ── MASCOTA GLOW ── */}
                <div className="absolute pointer-events-none" style={{ bottom: '20px', left: `${mascotX}%`, transform: 'translateX(-50%)' }}>
                  <div style={{
                    width: '100px', height: '12px',
                    borderRadius: '50%',
                    background: 'rgba(248,59,145,0.12)',
                    filter: 'blur(10px)',
                    position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                  }} />
                </div>

                {/* ── MASCOTA ── */}
                <div
                  className={`pointer-events-none ${!poisonHit ? 'game-mascot-float' : ''}`}
                  style={{
                    position: 'absolute', left: `${mascotX}%`, bottom: '24px',
                    transform: `translateX(-50%) ${poisonHit ? 'rotate(-15deg) scale(0.85)' : ''}`,
                    filter: poisonHit ? 'grayscale(100%) brightness(0.6)' : 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                >
                  <div style={{
                    width: '130px', height: '130px',
                    filter: 'drop-shadow(0 16px 24px rgba(244,114,182,0.18))',
                  }}>
                    <SafetyMascot size={100} mascotId={currentMascotId} />
                  </div>
                </div>

                {/* ── ACHIEVEMENT OVERLAY ── */}
                {showAchievement && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
                    <div className="animate-[bounce_0.7s_ease-in-out] rounded-[20px] border border-[#F83B91]/30 backdrop-blur-sm" style={{
                      background: 'rgba(16,26,45,0.92)',
                      padding: '20px 36px',
                      boxShadow: '0 20px 60px rgba(248,59,145,0.25)',
                    }}>
                      <div className="text-center" style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F83B91', marginBottom: '6px' }}>Logro</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC' }}>{achievementText} ✨</div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── CONTROLS ── */}
              <div className="game-controls-row flex items-center justify-center" style={{ gap: '10px', marginTop: '14px' }}>
                <button onClick={startGame}
                  className="flex items-center justify-center transition-all duration-200 active:scale-[0.97]"
                  style={{
                    height: '44px',
                    padding: '0 24px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #F83B91, #C026D3)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '0 8px 24px rgba(248,59,145,0.3)',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(248,59,145,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(248,59,145,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <span style={{ fontSize: '16px' }}>&#9654;</span> Iniciar juego
                </button>
                <button onClick={() => updateMascotX(x => x - MASCOT_STEP)}
                  className="flex items-center justify-center transition-all duration-200 active:scale-[0.97]"
                  style={{
                    height: '44px',
                    padding: '0 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 700,
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94A3B8'; }}>
                  <span style={{ fontSize: '16px' }}>&#9664;</span> Mover
                </button>
                <button onClick={() => updateMascotX(x => x + MASCOT_STEP)}
                  className="flex items-center justify-center transition-all duration-200 active:scale-[0.97]"
                  style={{
                    height: '44px',
                    padding: '0 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#94A3B8',
                    fontSize: '13px',
                    fontWeight: 700,
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#F8FAFC'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#94A3B8'; }}>
                  Mover <span style={{ fontSize: '16px' }}>&#9654;</span>
                </button>
              </div>

              {/* ── INSTRUCTION CARD ── */}
              <div className="flex items-center" style={{
                marginTop: '14px',
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
                gap: '14px',
              }}>
                <div style={{
                  width: '42px', height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(248,59,145,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Heart size={20} style={{ color: '#F83B91' }} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.3 }}>
                    {gameMessage || 'Recoge la comida y evita el veneno.'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Cada elección positiva te ayuda a sentirte mejor.
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : activeNav === 'Registro de Emociones' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: darkMode ? '#070D1C' : '#F5F0E8', minHeight: 0 }}>
            <div style={{ flex: 1, padding: '44px 48px', overflowY: 'auto', minHeight: 0 }} className="custom-scrollbar">
              <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }} className="emotion-grid">
                <style>{`
                  @media (max-width: 1024px) { .emotion-grid { grid-template-columns: 1fr !important; } }
                `}</style>

                {/* ═══ LEFT COLUMN — Calendar ═══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

                  {/* Calendar Card */}
                  <section style={{
                    width: '100%', borderRadius: '24px', padding: '36px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <h2 style={{
                      fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center',
                      color: darkMode ? '#F1F5F9' : '#0F172A', margin: '0 0 10px',
                      fontFamily: "'Poppins', sans-serif"
                    }}>¿Cómo te has sentido?</h2>
                    <p style={{
                      fontSize: '16px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8',
                      textAlign: 'center', margin: '0 0 32px'
                    }}>Selecciona el día para registrar cómo te sentiste.</p>

                    {/* Month Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', marginBottom: '32px' }}>
                      <button onClick={prevMonth} style={{
                        width: '46px', height: '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : '#FFF5FA',
                        transition: 'all 150ms ease'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#FFE4F0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#FFF5FA'}
                      >
                        <ChevronLeft size={20} style={{ color: '#EC4899' }} />
                      </button>
                      <span style={{
                        fontSize: '22px', fontWeight: 700, minWidth: '200px', textAlign: 'center',
                        color: darkMode ? '#F1F5F9' : '#0F172A'
                      }}>{monthNames[calMonth]} {calYear}</span>
                      <button onClick={nextMonth} style={{
                        width: '46px', height: '46px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : '#FFF5FA',
                        transition: 'all 150ms ease'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#FFE4F0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#FFF5FA'}
                      >
                        <ChevronRight size={20} style={{ color: '#EC4899' }} />
                      </button>
                    </div>

                    {/* Day Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '12px' }}>
                      {['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'].map(d => (
                        <div key={d} style={{
                          fontSize: '13px', fontWeight: 700, textAlign: 'center', padding: '10px 0',
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: darkMode ? '#475569' : '#94A3B8'
                        }}>{d}</div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                      {(() => {
                        const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
                        const cells = [];
                        for (let i = 0; i < firstDay; i++) {
                          const d = prevMonthDays - firstDay + 1 + i;
                          cells.push(
                            <div key={`prev-${i}`} style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: '14px 8px', minHeight: '72px', borderRadius: '16px',
                              opacity: 0.3
                            }}>
                              <span style={{ fontSize: '15px', fontWeight: 600, color: darkMode ? '#334155' : '#CBD5E1' }}>{d}</span>
                            </div>
                          );
                        }
                        for (let day = 1; day <= daysInMonth; day++) {
                          const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                          const mood = getMoodForDay(day);
                          const moodObj = mood ? moodEmojis.find(m => m.emoji === mood) : null;

                          cells.push(
                            <button
                              key={`day-${day}`}
                              type="button"
                              onClick={() => {
                                const clickedDate = new Date(calYear, calMonth, day);
                                if (!isSameCalendarDay(clickedDate, today)) {
                                  triggerToast('Solo puedes registrar el día actual');
                                  return;
                                }
                                setSelectedDay(day);
                                setShowDayModal(true);
                              }}
                              style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '14px 8px', minHeight: '72px', borderRadius: '16px',
                                border: isToday ? '2px solid #EC4899' : `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                                background: moodObj
                                  ? getMoodCellColor(moodObj.label)
                                  : (isToday ? (darkMode ? 'rgba(236,72,153,0.06)' : '#FFF5FA') : (darkMode ? 'rgba(255,255,255,0.02)' : '#FAFBFC')),
                                boxShadow: isToday ? '0 0 16px rgba(236,72,153,0.12)' : 'none',
                                cursor: 'pointer', position: 'relative', transition: 'all 150ms ease',
                                fontFamily: 'inherit'
                              }}
                              onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#FFF5FA'; }}
                              onMouseLeave={(e) => { if (!isToday && !moodObj) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : '#FAFBFC'; }}
                            >
                              {moodObj ? (
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'
                                  }}>
                                    <span style={{ fontSize: '24px', lineHeight: 1 }}>{moodObj.emoji}</span>
                                  </div>
                                  <span style={{
                                    position: 'absolute', bottom: '-6px', right: '-2px',
                                    fontSize: '11px', fontWeight: 700,
                                    color: darkMode ? '#CBD5E1' : '#475569',
                                    background: darkMode ? '#070D1C' : '#FFFFFF',
                                    borderRadius: '8px', padding: '1px 6px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                                  }}>{day}</span>
                                </div>
                              ) : (
                                <span style={{
                                  fontSize: '15px', fontWeight: 600,
                                  color: darkMode ? '#64748B' : '#94A3B8'
                                }}>{day}</span>
                              )}
                              {isToday && <span style={{ position: 'absolute', bottom: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#EC4899' }} />}
                            </button>
                          );
                        }
                        const remaining = 42 - cells.length;
                        for (let i = 1; i <= remaining && cells.length < 42; i++) {
                          cells.push(
                            <div key={`next-${i}`} style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              padding: '14px 8px', minHeight: '72px', borderRadius: '16px',
                              opacity: 0.3
                            }}>
                              <span style={{ fontSize: '15px', fontWeight: 600, color: darkMode ? '#334155' : '#CBD5E1' }}>{i}</span>
                            </div>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                  </section>

                  {/* Motivational Banner */}
                  <div style={{
                    width: '100%', borderRadius: '22px', padding: '24px 28px',
                    display: 'flex', alignItems: 'center', gap: '20px',
                    background: darkMode ? 'linear-gradient(135deg, rgba(236,72,153,0.04), rgba(167,139,250,0.03))' : 'linear-gradient(135deg, #FFF5FA, #FFF0FC)',
                    border: `1px solid ${darkMode ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.12)'}`,
                    boxShadow: '0 4px 20px rgba(15,23,42,0.03)', minHeight: '90px',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: darkMode ? 'rgba(236,72,153,0.12)' : 'rgba(236,72,153,0.08)',
                      flexShrink: 0
                    }}>
                      <Heart size={22} style={{ color: '#EC4899' }} fill="currentColor" />
                    </div>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A', margin: '0 0 4px' }}>¡Vas muy bien! 🌙</p>
                      <p style={{ fontSize: '15px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8', margin: 0 }}>Registrar tus emociones cada día te ayuda a entenderte mejor.</p>
                    </div>
                    <svg style={{ width: '120px', height: '120px', position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 120 120" fill="none">
                      <path d="M90 100 Q50 70, 30 30" stroke="#FBCFE8" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <path d="M80 80 Q50 60, 55 40 Q75 50, 80 80 Z" fill="#F9A8D4" opacity="0.7" />
                      <path d="M60 60 Q30 40, 35 20 Q55 30, 60 60 Z" fill="#F472B6" opacity="0.6" />
                      <circle cx="90" cy="25" r="3" fill="#F9A8D4" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* ═══ RIGHT COLUMN ═══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Resumen de tu mes */}
                  <section style={{
                    borderRadius: '24px', padding: '28px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <h3 style={{
                      fontSize: '22px', fontWeight: 700, margin: '0 0 24px',
                      color: darkMode ? '#F1F5F9' : '#0F172A'
                    }}>Resumen de tu mes</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[
                        { count: (() => { let c = 0; for (let d = 1; d <= daysInMonth; d++) { const m = getMoodForDay(d); const obj = m ? moodEmojis.find(x => x.emoji === m) : null; if (obj && ['Feliz','Enamorado','Tranquilo'].includes(obj.label)) c++; } return c; })(), label: 'Positivos', bg: darkMode ? 'rgba(34,197,94,0.1)' : '#F0FDF4', accent: '#22C55E', face: 'happy' },
                        { count: (() => { let c = 0; for (let d = 1; d <= daysInMonth; d++) { const m = getMoodForDay(d); const obj = m ? moodEmojis.find(x => x.emoji === m) : null; if (obj && ['Neutral','Cansado'].includes(obj.label)) c++; } return c; })(), label: 'Neutros', bg: darkMode ? 'rgba(251,191,36,0.1)' : '#FFFBEB', accent: '#F59E0B', face: 'neutral' },
                        { count: (() => { let c = 0; for (let d = 1; d <= daysInMonth; d++) { const m = getMoodForDay(d); const obj = m ? moodEmojis.find(x => x.emoji === m) : null; if (obj && ['Triste','Estresado','Enojado'].includes(obj.label)) c++; } return c; })(), label: 'Difíciles', bg: darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA', accent: '#EC4899', face: 'sad' },
                      ].map((stat, idx) => (
                        <div key={idx} style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                          padding: '16px 8px', borderRadius: '18px', background: stat.bg, textAlign: 'center'
                        }}>
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'
                          }}>
                            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                              <circle cx="16" cy="16" r="13.5" stroke={stat.accent} strokeWidth="1.5" fill="none" />
                              <circle cx="11.2" cy="13.5" r="1.3" fill={stat.accent} />
                              <circle cx="20.8" cy="13.5" r="1.3" fill={stat.accent} />
                              {stat.face === 'happy' && <path d="M10.5 19.5C12.5 21.8 14.7 22.9 16 22.9C17.3 22.9 19.5 21.8 21.5 19.5" stroke={stat.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
                              {stat.face === 'neutral' && <line x1="10.5" y1="19.8" x2="21.5" y2="19.8" stroke={stat.accent} strokeWidth="1.6" strokeLinecap="round" />}
                              {stat.face === 'sad' && <path d="M10.5 21.8C12.5 18.9 14.7 17.9 16 17.9C17.3 17.9 19.5 18.9 21.5 21.8" stroke={stat.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
                            </svg>
                          </div>
                          <span style={{ fontSize: '26px', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#0F172A', lineHeight: 1 }}>{stat.count}</span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: darkMode ? '#64748B' : '#94A3B8' }}>{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Tu emoción del día */}
                  <section style={{
                    borderRadius: '24px', padding: '32px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{
                        fontSize: '22px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A',
                        margin: '0 0 6px'
                      }}>Tu emoción del día</h3>
                      <p style={{
                        fontSize: '14px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8',
                        margin: '0 0 28px'
                      }}>{today.getDate()} de {monthNames[calMonth]}, {calYear}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', textAlign: 'center' }}>
                      <div style={{
                        width: '76px', height: '76px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: todayMoodStyle ? (
                          ['Feliz','Enamorado','Tranquilo'].includes(todayMoodStyle.label) ? (darkMode ? 'rgba(34,197,94,0.1)' : '#F0FDF4') :
                          ['Neutral','Cansado'].includes(todayMoodStyle.label) ? (darkMode ? 'rgba(251,191,36,0.1)' : '#FFFBEB') : (darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA')
                        ) : (darkMode ? 'rgba(34,197,94,0.1)' : '#F0FDF4'),
                        marginBottom: '20px'
                      }}>
                        <svg width="56" height="56" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                          <circle cx="24" cy="24" r="18" stroke={todayMoodStyle?.color || '#22C55E'} strokeWidth="1.6" fill="none" />
                          <circle cx="17.4" cy="20.4" r="1.8" fill={todayMoodStyle?.color || '#22C55E'} />
                          <circle cx="30.6" cy="20.4" r="1.8" fill={todayMoodStyle?.color || '#22C55E'} />
                          {(!todayMoodStyle || ['Feliz','Enamorado','Tranquilo'].includes(todayMoodStyle?.label)) && (
                            <path d="M15.4 28.2C18.1 31.3 20.8 32.8 24 32.8C27.2 32.8 29.9 31.3 32.6 28.2" stroke={todayMoodStyle?.color || '#22C55E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          )}
                          {todayMoodStyle && ['Neutral','Cansado'].includes(todayMoodStyle.label) && (
                            <line x1="15.4" y1="29.5" x2="32.6" y2="29.5" stroke={todayMoodStyle?.color || '#F59E0B'} strokeWidth="2" strokeLinecap="round" />
                          )}
                          {todayMoodStyle && ['Triste','Estresado','Enojado'].includes(todayMoodStyle.label) && (
                            <path d="M15.4 30.4C18.1 26.8 20.8 25.2 24 25.2C27.2 25.2 29.9 26.8 32.6 30.4" stroke={todayMoodStyle?.color || '#EC4899'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          )}
                        </svg>
                      </div>
                      <span style={{ fontSize: '22px', fontWeight: 700, color: todayMoodStyle?.color || '#22C55E', marginBottom: '8px', display: 'block' }}>
                        {todayMoodStyle?.label || 'Feliz'}
                      </span>
                      <p style={{
                        fontSize: '15px', fontWeight: 500, textAlign: 'center', maxWidth: '260px', lineHeight: 1.5,
                        color: darkMode ? '#64748B' : '#94A3B8', margin: 0
                      }}>
                        {todayMoodStyle ? `Hoy te sientes ${todayMoodStyle.label.toLowerCase()} y con energía.` : 'Hoy te sientes alegre y con energía.'}
                      </p>
                    </div>
                  </section>

                  {/* Consejo del día */}
                  {todayMoodStyle && moodTips[todayMoodStyle.label] && (
                    <section style={{
                      borderRadius: '24px', padding: '28px',
                      background: darkMode ? 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' : 'linear-gradient(135deg, #FFF5FA, #FFF0FC)',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                      boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                    }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A', margin: '0 0 14px' }}>Consejo para hoy</h3>
                      <p style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.6, color: darkMode ? '#CBD5E1' : '#475569', margin: '0 0 18px' }}>
                        {moodTips[todayMoodStyle.label].tip}
                      </p>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '14px 18px', borderRadius: '16px', marginBottom: '18px',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: darkMode ? '#F9A8D4' : '#DB2777' }}>
                          {moodTips[todayMoodStyle.label].action}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const insights = document.getElementById('insights-section');
                          if (insights) insights.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          padding: '12px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                          background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
                          color: darkMode ? '#64748B' : '#94A3B8',
                          fontSize: '14px', fontWeight: 600, transition: 'all 150ms ease', fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#FFFFFF'}
                        onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'}
                      >
                        Ver insights
                        <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                      </button>
                    </section>
                  )}

                  {/* Insights */}
                  <section id="insights-section" style={{
                    borderRadius: '24px', padding: '32px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A', margin: '0 0 24px' }}>Insights</h3>
                    {(() => {
                      const monthPrefix = `${calYear}-${calMonth}-`;
                      let pos = 0, neu = 0, neg = 0;
                      Object.entries(dayMoods || {}).forEach(([k, v]) => {
                        if (!k.startsWith(monthPrefix)) return;
                        const mood = v && typeof v === 'string' ? v : (v && v.emoji) || null;
                        if (!mood) return;
                        const obj = moodEmojis.find(m => m.emoji === mood);
                        const label = obj?.label || '';
                        if (['Feliz','Enamorado','Tranquilo'].includes(label)) pos++;
                        else if (['Neutral','Cansado'].includes(label)) neu++;
                        else if (['Triste','Estresado','Enojado'].includes(label)) neg++;
                      });
                      const total = pos + neu + neg || 1;
                      const percentPositive = Math.round((pos / total) * 100);
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <rect x="1" y="10" width="4" height="9" rx="1" fill="#F8BBD0" />
                                <rect x="8" y="6" width="4" height="13" rx="1" fill="#F48FB1" />
                                <rect x="15" y="2" width="4" height="17" rx="1" fill="#EC407A" />
                              </svg>
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.5, color: darkMode ? '#64748B' : '#94A3B8', margin: 0 }}>
                              <span style={{ fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A' }}>Días felices este mes:</span>{' '}
                              <span style={{ fontWeight: 700, color: '#EC4899' }}>{percentPositive}%</span>
                            </p>
                          </div>
                          <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
                            <svg viewBox="0 0 36 36" style={{ width: '76px', height: '76px', transform: 'rotate(-90deg)' }}>
                              <circle cx="18" cy="18" r="14" fill="none" stroke={darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9'} strokeWidth="3" />
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#EC4899" strokeWidth="3" strokeDasharray={`${Math.round((percentPositive/100)*88)} 88`} strokeDashoffset={`${88 - Math.round((percentPositive/100)*88)}`} strokeLinecap="round" />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '17px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A' }}>{percentPositive}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </section>
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === 'Diario Personal' ? (
          <div style={{ minHeight: 0 }} className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
            <DiaryPersonalSection darkMode={darkMode} onToast={triggerToast} userName={userName} />
          </div>
        ) : activeNav === 'Chat Anónimo' ? (
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
            <BlogAnonimo darkMode={darkMode} />
          </div>
        ) : activeNav === 'Chat con IA' ? (
          <div className={`flex-1 h-full ${darkMode ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
            <ChatIA darkMode={darkMode} userPhotoUrl={userPhotoUrl} />
          </div>
        ) : activeNav === 'Versículo Diario' ? (
          <div style={{ minHeight: 0 }} className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${darkMode ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
            <DailyVerseSection darkMode={darkMode} />
          </div>
        ) : activeNav === 'Consejos Diarios' ? (
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#1a1a2e]' : 'bg-[#F5F0E8]'}`}>
            <DailyAdviceSection darkMode={darkMode} />
          </div>
        ) : activeNav === 'Configuración' ? (
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#1a1a2e]' : 'bg-[#F5F0E8]'}`}>
            <ConfiguracionStudentSection darkMode={darkMode} onToast={triggerToast} onDarkModeChange={setDarkMode} userPhotoUrl={userPhotoUrl} setUserPhotoUrl={setUserPhotoUrl} userName={userName} setUserName={setUserName} userBio={userBio} setUserBio={setUserBio} onLogout={onLogout} />
          </div>
        ) : activeNav === 'Juegos' ? (
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#070D1C]' : 'bg-[#F5F0E8]'}`}>
            <GamesSection darkMode={darkMode} />
          </div>
        ) : activeNav === 'Habla con tu psicólogo' ? (
          <PsicologoSection darkMode={darkMode} />
        ) : activeNav === 'Recordatorios' ? (
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#1a1a2e]' : 'bg-[#F5F0E8]'}`}>
            <RemindersSection darkMode={darkMode} />
          </div>
        ) : (
          <div style={{
            flex: 1, overflowY: 'auto', fontFamily: "'Inter', sans-serif",
            background: darkMode ? '#070D1C' : '#F5F0E8'
          }} className="custom-scrollbar">
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '44px 48px' }}>

              {/* ═══ HEADER ═══ */}
              <header style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#EC4899', display: 'inline-block'
                  }} />
                  <span style={{
                    fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em',
                    color: '#EC4899', textTransform: 'uppercase'
                  }}>Tu bienestar es importante</span>
                </div>
                <h1 style={{
                  fontSize: '44px', fontWeight: 800, letterSpacing: '-0.02em',
                  color: darkMode ? '#F1F5F9' : '#0F172A', margin: 0,
                  fontFamily: "'Poppins', sans-serif", lineHeight: 1.1
                }}>
                  Hola de nuevo, Miguel <span style={{ color: '#EC4899' }}>♥</span>
                </h1>
                <p style={{
                  fontSize: '18px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8',
                  marginTop: '10px'
                }}>¿Qué te gustaría cultivar hoy?</p>
              </header>

              {/* ═══ GRID PRINCIPAL ═══ */}
              <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }} className="inicio-grid">
                <style>{`
                  @media (max-width: 900px) { .inicio-grid { grid-template-columns: 1fr !important; } }
                `}</style>

                {/* ═══ COLUMNA IZQUIERDA ═══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* ── MASCOTA ── */}
                  <div style={{
                    borderRadius: '24px', padding: '32px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden', minHeight: '380px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '280px' }}>
                      <div style={{ position: 'relative' }}>
                        <SafetyMascot size={200} mascotId={currentMascotId} sleeping={isSleeping} outfit={petOutfit} />
                        {isSleeping && (
                          <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: [0, 1, 0], y: -30 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ position: 'absolute', top: '-16px', right: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <span style={{ fontSize: '36px', fontWeight: 700, color: '#F9A8D4', textShadow: '0 2px 8px rgba(249,168,212,0.4)' }}>Zzz</span>
                          </motion.div>
                        )}
                        {feedAnimations.map((anim) => (
                          <motion.div
                            key={anim.id}
                            initial={{ opacity: 1, y: 0, scale: 0.5 }}
                            animate={{ opacity: 0, y: -60, scale: 1.2 }}
                            transition={{ duration: anim.type === 'chicken' ? 1.2 : 1.4, ease: 'easeOut' }}
                            style={{ position: 'absolute', zIndex: 30, pointerEvents: 'none', left: anim.type === 'chicken' ? '35%' : '65%', bottom: '40%' }}
                          >
                            <span style={{ fontSize: '32px' }}>{anim.type === 'chicken' ? '🍗' : '+20 exp'}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── ESTADO DE KOKO ── */}
                  <div style={{
                    borderRadius: '24px', padding: '28px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: darkMode ? 'rgba(236,72,153,0.12)' : '#FFF5FA',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ color: '#EC4899', fontWeight: 700, fontSize: '12px' }}>Lv.{mascotLevel}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: darkMode ? '#F1F5F9' : '#0F172A' }}>
                          {(getMascotById(currentMascotId) || {}).name || 'Bumi'}
                        </span>
                      </div>
                      <button onClick={() => setShowMascotSelector(true)} style={{
                        fontSize: '13px', fontWeight: 600, color: '#EC4899',
                        padding: '6px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        background: darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                        transition: 'all 150ms ease', fontFamily: 'inherit'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.18)' : '#FFE4F0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA'}
                      >
                        Cambiar mascota
                      </button>
                    </div>
                    <p style={{ fontSize: '14px', color: darkMode ? '#64748B' : '#94A3B8', margin: '0 0 20px' }}>
                      Estoy muy feliz de verte hoy! 😊
                    </p>

                    {/* Experiencia */}
                    <div style={{ marginBottom: '22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: darkMode ? '#475569' : '#94A3B8', textTransform: 'uppercase' }}>Experiencia</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: darkMode ? '#64748B' : '#94A3B8' }}>Nv.{mascotLevel} — {mascotXp}/100</span>
                      </div>
                      <div style={{
                        height: '8px', borderRadius: '4px',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                        overflow: 'hidden'
                      }}>
                        <div style={{ height: '100%', background: '#EC4899', borderRadius: '4px', transition: 'width 500ms ease', width: `${mascotXp}%` }} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      {[
                        { icon: '😊', label: 'Hambre', value: hunger, color: '#F97316', bg: darkMode ? 'rgba(249,115,22,0.1)' : '#FFF7ED' },
                        { icon: '⚡', label: 'Sueño', value: sleep, color: '#3B82F6', bg: darkMode ? 'rgba(59,130,246,0.1)' : '#EFF6FF' },
                        { icon: '🎮', label: 'Diversión', value: fun, color: '#8B5CF6', bg: darkMode ? 'rgba(139,92,246,0.1)' : '#F5F3FF' },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#CBD5E1' : '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{stat.icon}</span> {stat.label}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: stat.color }}>{stat.value}%</span>
                          </div>
                          <div style={{
                            height: '8px', borderRadius: '4px',
                            background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                            overflow: 'hidden'
                          }}>
                            <div style={{ height: '100%', background: stat.color, borderRadius: '4px', transition: 'width 500ms ease', width: `${stat.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Indicadores */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px',
                      paddingTop: '22px',
                      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`
                    }}>
                      {[
                        { icon: '😊', label: 'Felicidad', value: 'Alta', bg: darkMode ? 'rgba(249,115,22,0.1)' : '#FFF7ED', color: '#F97316' },
                        { icon: '⚡', label: 'Energía', value: 'Media', bg: darkMode ? 'rgba(59,130,246,0.1)' : '#EFF6FF', color: '#3B82F6' },
                        { icon: '💚', label: 'Afecto', value: 'Max', bg: darkMode ? 'rgba(34,197,94,0.1)' : '#F0FDF4', color: '#22C55E' },
                      ].map((ind) => (
                        <div key={ind.label} style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          padding: '14px 8px', borderRadius: '16px', background: ind.bg, textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '20px' }}>{ind.icon}</span>
                          <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', color: darkMode ? '#475569' : '#94A3B8', textTransform: 'uppercase', margin: '0 0 2px' }}>{ind.label}</p>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: ind.color, margin: 0 }}>{ind.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ═══ COLUMNA DERECHA ═══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* ── RACHA ── */}
                  <div style={{
                    borderRadius: '24px', padding: '32px',
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)', position: 'relative', overflow: 'visible'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div style={{
                          width: '52px', height: '52px', borderRadius: '18px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA'
                        }}>
                          <Flame size={26} style={{ color: '#EC4899' }} />
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '20px', color: darkMode ? '#F1F5F9' : '#0F172A', margin: 0 }}>Racha de inicio de sesión</h3>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: darkMode ? '#64748B' : '#94A3B8', marginTop: '4px', margin: '4px 0 0' }}>
                            {hasRegisteredToday
                              ? 'Hoy ya registraste tu racha. ¡Sigue así!'
                              : loginStreak > 0
                                ? `¡Llevas ${loginStreak} ${loginStreak === 1 ? 'día' : 'días'} de racha! 🔥`
                                : 'Marca tu día para sumar a tu racha.'}
                          </p>
                        </div>
                      </div>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <svg width="52" height="60" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={streakBurst ? 'drop-shadow-[0_0_18px_rgba(255,75,130,0.7)]' : ''}>
                          <path d="M0 0H60V70L30 55L0 70V0Z" fill="url(#paint0_linear_streak)"/>
                          <defs>
                            <linearGradient id="paint0_linear_streak" x1="30" y1="0" x2="30" y2="70" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF4B82"/>
                              <stop offset="1" stopColor="#FF8FA3"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <motion.div key={loginStreak} initial={{ scale: 1.5, rotate: -6 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 12 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', paddingTop: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', opacity: 0.9, textTransform: 'uppercase' }}>Días</span>
                          <span style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1, textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>{loginStreak}</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', position: 'relative', padding: '0 8px' }}>
                      <div style={{
                        position: 'absolute', left: '48px', right: '48px', top: '50%',
                        height: '4px', borderRadius: '2px',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                        zIndex: 0, transform: 'translateY(-50%)'
                      }} />
                      {(() => {
                        const todayDate = new Date();
                        const todayDay = todayDate.getDay();
                        const mondayOffset = todayDay === 0 ? -6 : 1 - todayDay;
                        const monday = new Date(todayDate);
                        monday.setDate(monday.getDate() + mondayOffset);
                        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                        const registered = streakState.registeredDates || [];
                        return labels.map((label, idx) => {
                          const d = new Date(monday);
                          d.setDate(monday.getDate() + idx);
                          const key = d.toISOString().slice(0, 10);
                          const isToday = key === getTodayKey();
                          const isRegistered = registered.includes(key);
                          return (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1, padding: '0 4px' }}>
                            {isToday ? (
                              <motion.div key={`today-${isRegistered}`} initial={isRegistered ? { scale: 0.4, rotate: -20 } : { scale: 0.9 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 350, damping: 14 }} style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '14px', fontWeight: 900,
                                boxShadow: '0 0 18px rgba(255,75,130,0.35)',
                                border: '4px solid #FFF5FA',
                                background: isRegistered ? 'linear-gradient(135deg, #FF4B82, #FF8FA3)' : (darkMode ? '#1f2b4d' : '#E2E8F0')
                              }}>
                                {isRegistered ? <Check size={22} strokeWidth={3} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }} /> : <span style={{ color: darkMode ? '#64748B' : '#94A3B8' }}>·</span>}
                              </motion.div>
                            ) : isRegistered ? (
                              <motion.div initial={{ scale: 0.4, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 15 }} style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: darkMode ? 'rgba(236,72,153,0.12)' : '#FFF5FA',
                                color: '#EC4899'
                              }}>
                                <Check size={22} strokeWidth={3} />
                              </motion.div>
                            ) : (
                              <div style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                                color: darkMode ? '#334155' : '#CBD5E1'
                              }}>
                                <span style={{ fontSize: '14px', fontWeight: 700 }}>·</span>
                              </div>
                            )}
                            <span style={{
                              fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                              color: isToday ? '#FF4B82' : isRegistered ? '#F472B6' : (darkMode ? '#475569' : '#94A3B8')
                            }}>{label}</span>
                          </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      <AnimatePresence>
                        {streakBurst && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={`flame-${i}`}
                                initial={{ opacity: 1, scale: 0.3, y: 0, x: 0 }}
                                animate={{
                                  opacity: [1, 0.8, 0],
                                  scale: [0.3, 1.2, 0.5],
                                  y: [0, -60 - Math.random() * 40],
                                  x: [(i - 3.5) * 8, (i - 3.5) * 15],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 + Math.random() * 0.3, ease: 'easeOut' }}
                                style={{ position: 'absolute', bottom: '50%' }}
                              >
                                <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                                  <path d="M12 0C12 0 4 8 4 16C4 20.4183 7.58172 24 12 24C16.4183 24 20 20.4183 20 16C20 8 12 0 12 0Z" fill={i % 3 === 0 ? '#FF4B82' : i % 3 === 1 ? '#FF8FA3' : '#FFB6C1'} opacity={0.9} />
                                  <path d="M12 8C12 8 8 13 8 17C8 19.2091 9.79086 21 12 21C14.2091 21 16 19.2091 16 17C16 13 12 8 12 8Z" fill="#FFD93D" opacity={0.8} />
                                </svg>
                              </motion.div>
                            ))}
                            <motion.div initial={{ scale: 0.5, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '2px solid rgba(255,75,130,0.5)', bottom: '40%' }} />
                          </div>
                        )}
                      </AnimatePresence>
                      <motion.button
                        whileTap={hasRegisteredToday ? undefined : { scale: 0.95 }}
                        onClick={registerStreakDay}
                        disabled={hasRegisteredToday}
                        style={{
                          position: 'relative', zIndex: 10,
                          height: '56px', padding: '0 32px', borderRadius: '18px',
                          fontWeight: 700, fontSize: '16px', border: 'none', cursor: hasRegisteredToday ? 'not-allowed' : 'pointer',
                          background: hasRegisteredToday
                            ? (darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9')
                            : 'linear-gradient(135deg, #FF4B82, #FF8FA3)',
                          color: hasRegisteredToday ? (darkMode ? '#475569' : '#94A3B8') : '#fff',
                          boxShadow: hasRegisteredToday ? 'none' : '0 4px 16px rgba(255,75,130,0.25)',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          transition: 'all 200ms ease', fontFamily: 'inherit'
                        }}
                      >
                        <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '10px' }}>{hasRegisteredToday ? '✓ Hoy registrado' : 'Registrar día'}</span>
                        {streakBurst && (
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 2] }} transition={{ duration: 0.6 }} style={{ position: 'absolute', inset: 0, borderRadius: '18px', background: 'rgba(255,255,255,0.3)' }} />
                        )}
                      </motion.button>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 700, textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '24px', color: darkMode ? '#475569' : '#94A3B8' }}>
                      Tu racha crece día a día. ¡No la dejes apagar! 🔥
                    </p>
                  </div>

                  {/* ── TU COMPAÑERO ESTÁ AQUÍ ── */}
                  <div style={{
                    borderRadius: '24px', padding: '32px', flex: 1,
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 8px 30px rgba(15,23,42,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '28px' }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA',
                        flexShrink: 0
                      }}>
                        <PawPrint size={26} style={{ color: '#EC4899' }} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '20px', color: darkMode ? '#F1F5F9' : '#0F172A', margin: 0, lineHeight: 1.2 }}>Tu compañero está aquí</h3>
                        <p style={{ fontSize: '15px', color: darkMode ? '#64748B' : '#94A3B8', marginTop: '4px', margin: '4px 0 0' }}>Cuida de tu mascota para que esté siempre feliz contigo.</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="activities-grid">
                      <style>{`
                        @media (max-width: 640px) { .activities-grid { grid-template-columns: 1fr !important; } }
                      `}</style>
                      {[
                        { onClick: () => {
                            setHunger((prev) => Math.min(100, prev + 20));
                            addXp(20);
                            const id = Date.now();
                            setFeedAnimations((prev) => [...prev, { id, type: 'chicken' }]);
                            setTimeout(() => setFeedAnimations((prev) => prev.filter((a) => a.id !== id)), 1200);
                            const expId = Date.now() + 1;
                            setFeedAnimations((prev) => [...prev, { id: expId, type: 'exp' }]);
                            setTimeout(() => setFeedAnimations((prev) => prev.filter((a) => a.id !== expId)), 1400);
                          }, icon: '🍗', label: 'Alimentar', sub: 'Dale algo rico', bg: darkMode ? 'rgba(249,115,22,0.08)' : '#FFF7ED', color: '#F97316' },
                        { onClick: () => { setActiveNav('MiniJuego'); setShowMascotGame(true); addXp(15); const mn = (getMascotById(currentMascotId) || {}).name || 'Bumi'; triggerToast(`¡${mn} está jugando! 🎉`); }, icon: '⚽', label: 'Jugar', sub: 'Diviértanse juntos', bg: darkMode ? 'rgba(139,92,246,0.08)' : '#F5F3FF', color: '#8B5CF6' },
                        { onClick: () => { setIsSleeping(!isSleeping); const mn = (getMascotById(currentMascotId) || {}).name || 'Bumi'; triggerToast(isSleeping ? `¡${mn} despertó! →` : `¡${mn} está durmiendo! 💤`); }, icon: '🌙', label: isSleeping ? 'Despertar' : 'Dormir', sub: isSleeping ? 'Que vuelva a la acción' : 'Que descanse', bg: darkMode ? 'rgba(59,130,246,0.08)' : '#EFF6FF', color: '#3B82F6' },
                        { onClick: () => setShowWardrobe(!showWardrobe), icon: '👕', label: petOutfit ? 'Cambiar ropa' : 'Vestir', sub: petOutfit ? `Lleva: ${(PET_OUTFITS.find((o) => o.id === petOutfit) || {}).label || ''}` : `Elige ropa para ${(getMascotById(currentMascotId) || {}).name || 'Bumi'}`, bg: darkMode ? 'rgba(236,72,153,0.08)' : '#FFF5FA', color: '#EC4899' },
                      ].map((action) => (
                        <button key={action.label} onClick={action.onClick} style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '18px 20px', borderRadius: '18px', border: 'none',
                          background: action.bg, cursor: 'pointer', textAlign: 'left',
                          transition: 'all 200ms ease', minHeight: '84px', fontFamily: 'inherit'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
                            flexShrink: 0, fontSize: '22px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                          }}>
                            {action.icon}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '16px', color: darkMode ? '#F1F5F9' : '#0F172A', margin: 0 }}>{action.label}</p>
                            <p style={{ fontSize: '14px', marginTop: '2px', color: darkMode ? '#64748B' : '#94A3B8', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {showWardrobe && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: darkMode ? '#475569' : '#94A3B8', textAlign: 'center', margin: '0 0 16px' }}>
                              Elige ropa para {(getMascotById(currentMascotId) || {}).name || 'Bumi'}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                              {PET_OUTFITS.map((o) => {
                                const active = petOutfit === o.id;
                                const mascotName = (getMascotById(currentMascotId) || {}).name || 'Bumi';
                                return (
                                  <button key={o.id ?? 'none'} onClick={() => { setPetOutfit(o.id); triggerToast(o.id ? `${mascotName} lleva ${o.label} 😊` : `Quitaste la ropa de ${mascotName}`); }} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    padding: '16px 8px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                                    background: active
                                      ? (darkMode ? 'rgba(236,72,153,0.12)' : '#FFF5FA')
                                      : (darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
                                    transition: 'all 150ms ease', fontFamily: 'inherit'
                                  }}>
                                    <span style={{ fontSize: '24px', lineHeight: 1 }}>{o.emoji}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: active ? '#EC4899' : (darkMode ? '#64748B' : '#94A3B8') }}>{o.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Achievements Modal */}
              {showAchievements && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowAchievements(false)}>
                  <div style={{
                    background: darkMode ? '#0F1A2E' : '#FFFFFF',
                    borderRadius: '28px', maxWidth: '520px', width: '100%', padding: '36px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative'
                  }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowAchievements(false)} style={{
                      position: 'absolute', top: '16px', right: '16px',
                      width: '40px', height: '40px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                      color: darkMode ? '#64748B' : '#94A3B8', border: 'none', cursor: 'pointer',
                      transition: 'all 150ms ease', fontSize: '16px'
                    }}>✕</button>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <div style={{
                        width: '68px', height: '68px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FBBF24, #F43F9E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 18px', boxShadow: '0 8px 24px rgba(244,63,158,0.2)'
                      }}>
                        <span style={{ fontSize: '32px' }}>🏆</span>
                      </div>
                      <h3 style={{ fontSize: '24px', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#0F172A', margin: 0 }}>Tus Logros</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
                      {[
                        { value: emotionalStreak || 0, label: 'Días actuales', bg: darkMode ? 'rgba(236,72,153,0.1)' : '#FFF5FA', color: '#EC4899' },
                        { value: emotionalStreak || 0, label: 'Récord personal', bg: darkMode ? 'rgba(167,139,250,0.1)' : '#F5F3FF', color: '#8B5CF6' },
                        { value: `${Math.min(((emotionalStreak || 0) / 7) * 100, 100).toFixed(0)}%`, label: 'Progreso', bg: darkMode ? 'rgba(251,191,36,0.1)' : '#FFFBEB', color: '#F59E0B' },
                      ].map((s) => (
                        <div key={s.label} style={{ borderRadius: '18px', padding: '18px', textAlign: 'center', background: s.bg }}>
                          <p style={{ fontSize: '26px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: darkMode ? '#64748B' : '#94A3B8', marginTop: '6px', margin: '6px 0 0' }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: darkMode ? '#64748B' : '#475569', margin: '0 0 14px' }}>Insignias</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {[
                          { days: 7, label: 'Bronce', emoji: '🥉' },
                          { days: 15, label: 'Plata', emoji: '🥈' },
                          { days: 30, label: 'Oro', emoji: '🥇' },
                          { days: 60, label: 'Diamante', emoji: '💎' },
                          { days: 100, label: 'Maestro', emoji: '👑' },
                        ].map(r => {
                          const unlocked = (emotionalStreak || 0) >= r.days;
                          return (
                            <div key={r.days} style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 14px', borderRadius: '14px',
                              border: `1px solid ${unlocked ? 'rgba(236,72,153,0.2)' : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')}`,
                              background: unlocked ? (darkMode ? 'rgba(236,72,153,0.06)' : '#FFF5FA') : (darkMode ? 'rgba(255,255,255,0.02)' : '#F8FAFC'),
                              opacity: unlocked ? 1 : 0.4
                            }}>
                              <span style={{ fontSize: '18px' }}>{r.emoji}</span>
                              <div>
                                <p style={{ fontSize: '12px', fontWeight: 700, color: unlocked ? (darkMode ? '#F1F5F9' : '#0F172A') : (darkMode ? '#475569' : '#94A3B8'), margin: 0 }}>{r.label}</p>
                                <p style={{ fontSize: '11px', color: darkMode ? '#475569' : '#94A3B8', margin: 0 }}>{r.days} días</p>
                              </div>
                              {unlocked && <span style={{ color: '#22C55E', fontSize: '14px', marginLeft: '4px' }}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{
                      borderRadius: '18px', padding: '18px', textAlign: 'center',
                      background: darkMode ? 'rgba(236,72,153,0.08)' : '#FFF5FA'
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: darkMode ? '#64748B' : '#94A3B8', margin: 0 }}>Próxima meta</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#0F172A', marginTop: '6px', margin: '6px 0 0' }}>🥉 Medalla Bronce</p>
                      <p style={{ fontSize: '13px', color: darkMode ? '#475569' : '#94A3B8', marginTop: '4px', margin: '4px 0 0' }}>Sigue registrando para desbloquear nuevas insignias</p>
                    </div>
                  </div>
                </div>
              )}

              <footer style={{ marginTop: '52px', paddingTop: '24px', textAlign: 'center', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}>
                <p style={{ fontSize: '13px', color: darkMode ? '#475569' : '#94A3B8', margin: 0 }}>© 2026 Safety Love • Tu bienestar emocional primero</p>
              </footer>
            </div>
          </div>
        )
      }
      </main>

      <EmotionDayModal
        darkMode={darkMode}
        show={showDayModal}
        selectedDay={selectedDay}
        calYear={calYear}
        calMonth={calMonth}
        monthNames={monthNames}
        moodEmojis={moodEmojis}
        getMoodForDay={getMoodForDay}
        saveMood={saveMood}
        saveDayRecord={saveDayRecord}
        onSaveNote={(text) => {
          const key = `${calYear}-${calMonth}-${selectedDay}`;
          setDayNotes(prev => ({ ...prev, [key]: text }));
        }}
        onClose={() => setShowDayModal(false)}
      />

      {/* Mascot Selector Modal */}
      <MascotSelector
        isOpen={showMascotSelector}
        onClose={() => setShowMascotSelector(false)}
        onSelect={handleMascotSelect}
        currentMascotId={currentMascotId}
        darkMode={darkMode}
      />

    </div>
  );
}
