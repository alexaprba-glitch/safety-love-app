import React, { useState, useEffect, useRef } from 'react';
import twemoji from 'twemoji';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import ChatIA from './ChatIA';
import {
  Heart,
  Shield,
  User,
  Lock,
  Unlock,
  Mail,
  MessageCircle,
  MessageSquare,
  BookOpen,
  Calendar,
  LogOut,
  Smile,
  SmilePlus,
  Meh,
  Frown,
  Users,
  Search,
  Send,
  MoreHorizontal,
  Trash2,
  Zap,
  X,
  Settings,
  Info,
  Paperclip,
  Flame,
  Pencil,
  Image as ImageIcon,
  Layout,
  Award,
  Pin,
  TrendingUp,
  Phone,
  BarChart3,
  Target,
  Quote,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Home,
  ArrowRight,
  UserCircle2,
  Clock,
  Calendar as CalendarIcon,
  Moon,
  Palette,
  Type as TypeIcon,
  Bot,
  Volume2,
  Fingerprint,
  Globe,
  FileText,
  Star
} from 'lucide-react';

const BLOG_TOPICS = ['General', 'Autoestima', 'Relaciones', 'Ansiedad', 'Familia', 'Amistades', 'Estudios', 'Crecimiento personal'];
const BLOG_TOPICS_EN = ['General', 'Self-esteem', 'Relationships', 'Anxiety', 'Family', 'Friendships', 'Studies', 'Personal growth'];

const REACTION_TYPES = [
  { emoji: '❤️', label: 'Me ayudó', color: '#EF4444' },
  { emoji: '🤗', label: 'Te entiendo', color: '#F59E0B' },
  { emoji: '💪', label: 'Ánimo', color: '#10B981' },
  { emoji: '🙏', label: 'Gracias', color: '#8B5CF6' },
];
const REACTION_TYPES_EN = [
  { emoji: '❤️', label: 'Helped me', color: '#EF4444' },
  { emoji: '🤗', label: 'I get you', color: '#F59E0B' },
  { emoji: '💪', label: 'Cheer up', color: '#10B981' },
  { emoji: '🙏', label: 'Thanks', color: '#8B5CF6' },
];

const TOPIC_ICONS = {
  'General': '💬', 'Autoestima': '🌟', 'Relaciones': '💕', 'Ansiedad': '😰',
  'Familia': '👪', 'Amistades': '🤝', 'Estudios': '📚', 'Crecimiento personal': '🌱',
};
const TOPIC_ICONS_EN = {
  'General': '💬', 'Self-esteem': '🌟', 'Relationships': '💕', 'Anxiety': '😰',
  'Family': '👪', 'Friendships': '🤝', 'Studies': '📚', 'Personal growth': '🌱',
};


const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Feliz', color: '#F59E0B' },
  { emoji: '😢', label: 'Triste', color: '#6366F1' },
  { emoji: '😰', label: 'Ansioso', color: '#8B5CF6' },
  { emoji: '😤', label: 'Frustrado', color: '#EF4444' },
  { emoji: '😕', label: 'Confundido', color: '#EC4899' },
  { emoji: '😌', label: 'Tranquilo', color: '#10B981' },
];
const MOOD_OPTIONS_EN = [
  { emoji: '😊', label: 'Happy', color: '#F59E0B' },
  { emoji: '😢', label: 'Sad', color: '#6366F1' },
  { emoji: '😰', label: 'Anxious', color: '#8B5CF6' },
  { emoji: '😤', label: 'Frustrated', color: '#EF4444' },
  { emoji: '😕', label: 'Confused', color: '#EC4899' },
  { emoji: '😌', label: 'Calm', color: '#10B981' },
];

const DAILY_CHALLENGES = [
  { id: 'logro', icon: '🏆', label: 'Comparte un logro', desc: 'Publica algo positivo que te haya pasado hoy.' },
  { id: 'ayuda', icon: '🤝', label: 'Ayuda a alguien', desc: 'Reacciona o comenta en una publicacion de alguien mas.' },
  { id: 'emocion', icon: '😊', label: 'Expresa tu emocion', desc: 'Publica algo seleccionando como te sientes.' },
  { id: 'apoyo', icon: '💪', label: 'Da tu apoyo', desc: 'Usa 3 reacciones diferentes en publicaciones.' },
  { id: 'reflexion', icon: '💭', label: 'Escribe una reflexion', desc: 'Comparte un pensamiento profundo con la comunidad.' },
  { id: 'lectura', icon: '📖', label: 'Lee y apoya', desc: 'Lee 5 publicaciones y reacciona a ellas.' },
  { id: 'agradece', icon: '🙏', label: 'Agradece algo', desc: 'Escribe algo por lo que estes agradecido hoy.' },
];
const DAILY_CHALLENGES_EN = [
  { id: 'logro', icon: '🏆', label: 'Share an achievement', desc: 'Post something positive that happened to you today.' },
  { id: 'ayuda', icon: '🤝', label: 'Help someone', desc: 'React or comment on someone else\'s post.' },
  { id: 'emocion', icon: '😊', label: 'Express your emotion', desc: 'Post something selecting how you feel.' },
  { id: 'apoyo', icon: '💪', label: 'Give your support', desc: 'Use 3 different reactions on posts.' },
  { id: 'reflexion', icon: '💭', label: 'Write a reflection', desc: 'Share a deep thought with the community.' },
  { id: 'lectura', icon: '📖', label: 'Read and support', desc: 'Read 5 posts and react to them.' },
  { id: 'agradece', icon: '🙏', label: 'Be grateful', desc: 'Write something you are grateful for today.' },
];

const getTodayChallenge = () => {
  const day = new Date().getDate();
  return DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
};

const AppInput = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="mb-5">
    <label className="text-xs font-medium text-gray-500 mb-2 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-4 rounded-xl border-none bg-white text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-pink-200 placeholder:text-gray-300 leading-5"
    />
  </div>
);

const LETTER_TYPES = [
  { id: 'future', icon: '📝', label: 'Para mi yo del futuro' },
  { id: 'unsent', icon: '💌', label: 'Cartas que nunca envie' },
  { id: 'personal', icon: '💬', label: 'Mensajes personales' },
  { id: 'shared', icon: '🌟', label: 'Reflexiones compartidas' },
];
const LETTER_TYPES_EN = [
  { id: 'future', icon: '📝', label: 'For my future self' },
  { id: 'unsent', icon: '💌', label: 'Letters I never sent' },
  { id: 'personal', icon: '💬', label: 'Personal messages' },
  { id: 'shared', icon: '🌟', label: 'Shared reflections' },
];

const ANONYMOUS_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

const getAnonymousAvatar = (name) => {
  if (!name) return { color: '#94A3B8', initial: '?' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  const color = ANONYMOUS_COLORS[Math.abs(hash) % ANONYMOUS_COLORS.length];
  const initial = name.charAt(0).toUpperCase();
  return { color, initial };
};

const getUserId = (name) => {
  if (!name) return 0;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return Math.abs(h) % 900 + 100;
};

const BADGE_TYPES = {
  firstPost: { icon: '🌱', label: 'Primera publicación', color: '#F59E0B' },
  activeMember: { icon: '💪', label: 'Miembro activo', color: '#EF4444' },
  supportive: { icon: '🤝', label: 'Usuario solidario', color: '#EC4899' },
  consistent: { icon: '📝', label: 'Participación constante', color: '#8B5CF6' },
};
const BADGE_TYPES_EN = {
  firstPost: { icon: '🌱', label: 'First post', color: '#F59E0B' },
  activeMember: { icon: '💪', label: 'Active member', color: '#EF4444' },
  supportive: { icon: '🤝', label: 'Supportive user', color: '#EC4899' },
  consistent: { icon: '📝', label: 'Consistent participation', color: '#8B5CF6' },
};

const getUserBadges = (userName, posts) => {
  const badges = [];
  const userPosts = posts.filter(p => p.author === userName);
  if (userPosts.length >= 1) badges.push(BADGE_TYPES.firstPost);
  if (userPosts.length >= 3) badges.push(BADGE_TYPES.activeMember);
  const totalSupport = userPosts.reduce((s, p) => s + Object.values(p.reactions || {}).reduce((a, b) => a + b, 0), 0);
  if (totalSupport >= 10) badges.push(BADGE_TYPES.supportive);
  if (userPosts.length >= 2) badges.push(BADGE_TYPES.consistent);
  return badges;
};

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniela',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo'
];

const TRAIT_LIST = [
  { id: 'introvertido', emoji: '🏠', label: 'Introvertido', desc: 'Valora su espacio personal y reflexiona profundamente antes de actuar.' },
  { id: 'extrovertido', emoji: '🌻', label: 'Extrovertido', desc: 'Sociable, le encanta conectar con los demás y contagia energía positiva.' },
  { id: 'detallista', emoji: '😊', label: 'Detallista', desc: 'Organizado, le gusta que las cosas salgan bien y cuida cada pequeño detalle.' },
  { id: 'creativo', emoji: '😊', label: 'Creativo', desc: 'Expresa sus emociones a través del arte, la música o ideas innovadoras.' },
  { id: 'sensible', emoji: '🏠', label: 'Sensible', desc: 'Conecta profundamente con sus sentimientos y siente gran empatúa por los demás.' },
  { id: 'analitico', emoji: '🏠', label: 'Analítico', desc: 'Le gusta entender el porqué de las cosas y resolver problemas lógicamente.' },
  { id: 'apasionado', emoji: '💪', label: 'Apasionado', desc: 'Actúa con el corazón, vive cada momento con intensidad y gran entusiasmo.' },
  { id: 'tranquilo', emoji: '😌', label: 'Tranquilo', desc: 'Toma las cosas con calma, evita el drama y prefiere mantener la paz.' }
];

const BIBLE_VERSES_ES = [
  { verse: 'El Señor es mi pastor, nada me falta; en verdes pastos me hace descansar.', ref: 'Salmos 23:1-2', reflection: 'Confía en que Dios proveerá todo lo que necesitas. A veces la paz comienza cuando aceptamos que no estamos solos.' },
  { verse: 'Todo lo puedo en Cristo que me fortalece.', ref: 'Filipenses 4:13', reflection: 'No hay obstáculo demasiado grande cuando pones tu confianza en Dios. Tu fortaleza viene de lo alto.' },
  { verse: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.', ref: 'Isaías 41:10', reflection: 'El miedo es natural, pero no tiene la última palabra. Dios camina a tu lado en cada paso.' },
  { verse: 'Venid a mí todos los que estáis trabajados y cargados, y yo os hará descansar.', ref: 'Mateo 11:28', reflection: 'No tienes que cargar con todo tú solo. Entregar tus cargas a Dios es un acto de valentía, no de debilidad.' },
  { verse: 'El amor es paciente, es bondadoso. No tiene envidia, no es jactancioso, no se envanece.', ref: '1 Corintios 13:4', reflection: 'El amor verdadero no exige ni lastima. Recuerda que mereces relaciones que reflejen esta clase de amor.' },
  { verse: 'Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de calamidad, para daros un futuro y una esperanza.', ref: 'Jeremías 29:11', reflection: 'Incluso cuando no entiendes el camino, Dios ya tiene preparado algo bueno para ti.' },
  { verse: 'El Señor está cerca de los quebrantados de corazón y salva a los de espíritu abatido.', ref: 'Salmos 34:18', reflection: 'Tu dolor no pasa desapercibido. Dios está mís cerca cuando mís lo necesitas.' },
  { verse: 'La paz les dejo, mi paz les doy; no como el mundo la da, yo se la doy.', ref: 'Juan 14:27', reflection: 'La paz que Dios ofrece trasciende cualquier circunstancia. Permite que esa paz habite en tu corazón.' },
];

const BIBLE_VERSES_EN = [
  { verse: 'The Lord is my shepherd, I shall not want; He makes me lie down in green pastures.', ref: 'Psalm 23:1-2', reflection: 'Trust that God will provide everything you need. Sometimes peace begins when we accept that we are not alone.' },
  { verse: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13', reflection: 'No obstacle is too great when you put your trust in God. Your strength comes from above.' },
  { verse: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you.', ref: 'Isaiah 41:10', reflection: 'Fear is natural, but it does not have the final word. God walks beside you every step of the way.' },
  { verse: 'Come to me, all who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28', reflection: 'You do not have to carry everything alone. Surrendering your burdens to God is an act of courage, not weakness.' },
  { verse: 'Love is patient and kind; it does not envy or boast; it is not arrogant.', ref: '1 Corinthians 13:4', reflection: 'True love does not demand or hurt. Remember that you deserve relationships that reflect this kind of love.' },
  { verse: 'For I know the plans I have for you, plans for welfare and not for evil, to give you a future and a hope.', ref: 'Jeremiah 29:11', reflection: 'Even when you do not understand the path, God already has something good prepared for you.' },
  { verse: 'The Lord is near to the brokenhearted and saves the crushed in spirit.', ref: 'Psalm 34:18', reflection: 'Your pain does not go unnoticed. God is closest when you need Him most.' },
  { verse: 'Peace I leave with you; my peace I give to you; not as the world gives do I give to you.', ref: 'John 14:27', reflection: 'The peace God offers transcends any circumstance. Allow that peace to dwell in your heart.' },
];

const MOTIVATIONAL_MESSAGES_ES = [
  { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', quote: 'Eres mís fuerte de lo que crees', text: 'Cada día que te levantas y sigues adelante, estás demostrando una fortaleza que quizñs no ves en ti mismo. Confía en el proceso.' },
  { image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', quote: 'El sol también sale despuñs de la tormenta', text: 'Las dificultades son temporales. Asé como la lluvia limpia el aire, tus lñgrimas limpian tu alma y preparan el camino para días mís brillantes.' },
  { image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', quote: 'No estás solo en este camino', text: 'A veces parece que nadie entiende lo que sientes, pero hay personas que se preocupan por ti. Permitirte ser vulnerable es el primer paso para conectar.' },
  { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600', quote: 'Cada paso cuenta, por pequeño que sea', text: 'No subestimes el poder de las pequeñas acciones. Un paso a la vez, y un día mirarñs atrñs y verñs todo lo que has avanzado.' },
  { image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', quote: 'Mereces amor, respeto y felicidad', text: 'Nunca aceptes menos de lo que mereces. Tu valor no lo define lo que otros piensan de ti, sino lo que tú sabes que vales.' },
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', quote: 'La esperanza es el ancla del alma', text: 'Cuando todo parece incierto, la esperanza te sostiene. Mantún viva la llama de la fe, porque siempre hay un nuevo amanecer esperando.' },
  { image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600', quote: 'Tu voz interior merece ser escuchada', text: 'Aprender a escucharte es uno de los actos mís valientes. Tus sentimientos son válidos y merecen ser expresados sin miedo.' },
  { image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600', quote: 'Confía en el proceso de sanar', text: 'Sanar no es lineal. Habrñ días buenos y días difíciles, pero cada uno te acerca mís a la paz interior que buscas.' },
];

const MOTIVATIONAL_MESSAGES_EN = MOTIVATIONAL_MESSAGES_ES;

export default function App() {
  const [session, setSession] = useState(null);
  const [genderTheme, setGenderTheme] = useState('mujer'); // 'mujer', 'hombre'
  const [isLandingLeaving, setIsLandingLeaving] = useState(false);
  const [isLoginLeaving, setIsLoginLeaving] = useState(false);
  const [currentView, setCurrentView] = useState('userDash'); // 'themePicker', 'login', 'register', 'avatarEdit', 'onboarding', 'userDash', 'adminDash', 'blog'
  const [isEditingAvatarFromProfile, setIsEditingAvatarFromProfile] = useState(false);
  const [role, setRole] = useState('adolescente'); // 'adolescente', 'psicologo'
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(AVATARS[0]);
  const [userId, setUserId] = useState(null);
  const [mascotType, setMascotType] = useState('gato');
  const [showMascotSelector, setShowMascotSelector] = useState(false);
  const [petHunger, setPetHunger] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_hunger')) ?? 70; } catch { return 70; } });
  const [petEnergy, setPetEnergy] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_energy')) ?? 70; } catch { return 70; } });
  const [petHappiness, setPetHappiness] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_happiness')) ?? 70; } catch { return 70; } });
  const [petAction, setPetAction] = useState(null);
  const [petMessage, setPetMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [petLevel, setPetLevel] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_level')) ?? 1; } catch { return 1; } });
  const [petXp, setPetXp] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_xp')) ?? 0; } catch { return 0; } });
  const [petFriendship, setPetFriendship] = useState(() => { try { return JSON.parse(localStorage.getItem('pet_friendship')) ?? 0; } catch { return 0; } });
  const [emotionalStreak, setEmotionalStreak] = useState(() => { try { return JSON.parse(localStorage.getItem('streak')) ?? 0; } catch { return 0; } });
  const [achievements, setAchievements] = useState(() => { try { return JSON.parse(localStorage.getItem('achievements')) ?? []; } catch { return []; } });
  const [completedActivities, setCompletedActivities] = useState(() => { try { return JSON.parse(localStorage.getItem('completed_activities')) ?? []; } catch { return []; } });
  const [tooltipDay, setTooltipDay] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isWelcomeLeaving, setIsWelcomeLeaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [savedMessages, setSavedMessages] = useState([]);
  const [savedVerses, setSavedVerses] = useState([]);
  const [language, setLanguage] = useState('es');

  const translations = {
    es: {
      inicio: 'Inicio', recursos: 'Recursos', perfil: 'Perfil',
      iniciar_sesion: 'Iniciar Sesion', registrarse: 'Registrarse',
      correo: 'Correo electrónico', contrasenia: 'Contraseña',
      confirmar_contrasenia: 'Confirmar contraseña',
      nombre: 'Nombre', registrate: 'Registrate',
      bienvenido: 'Bienvenido a Safety Love',
      mensaje_para_ti: 'Un mensaje para ti',
      mensajes_para_ti: 'Mensajes para ti',
      blog_anonimo: 'Blog Anónimo', chat_ia: 'Chat IA',
      versiculo_consuelo: 'Versículo de Consuelo',
      mi_perfil: 'Mi Perfil', cerrar_sesion: 'Cerrar Sesión',
      tema_claro: 'Tema Claro', tema_oscuro: 'Tema Oscuro',
      mensajes_guardados: 'Mensajes Guardados',
      versiculos_guardados: 'Versículos Guardados',
      notificaciones: 'Notificaciones',
      marcar_leidas: 'Marcar leídas', borrar_todas: 'Borrar todas',
      compartir: 'Compartir', guardar: 'Guardar',
      publicar: 'Publicar', anonimo: 'Anónimo', publico: 'Público',
      siempre: 'Siempre',
      no_notificaciones: 'No tienes notificaciones nuevas',
      no_tienes_cuenta: '¿No tienes cuenta?',
      ya_tienes_cuenta: '¿Ya tienes cuenta?',
      recordarme: 'Recordarme',
      olvidaste_contrasenia: '¿Olvidaste tu contraseña?',
      ingresar: 'Ingresar',
      crear_cuenta: 'Crear cuenta',
      linea_apoyo: 'Línea de apoyo',
      necesita_ayuda: '¿Necesitas ayuda inmediata?',
      hero_title: 'Tu refugio seguro en el mundo digital',
      hero_desc: 'Acompañamiento emocional, herramientas de bienestar y una comunidad que te entiende. Estás en un lugar seguro.',
      privacidad: '100% Privado',
      privacidad_desc: 'Tu información permanece protegida y encriptada.',
      apoyo_expertos: 'Apoyo de Expertos',
      apoyo_expertos_desc: 'Acceso a contenido desarrollado por especialistas.',
      comunidad_segura: 'Comunidad Segura',
      comunidad_segura_desc: 'Un espacio moderado para compartir experiencias.',
      testimonio_texto: 'Encontré un espacio donde realmente me escuchan sin juzgar.',
      testimonio_autor: '— Sofía, 17 años',
      politica_privacidad: 'Política de Privacidad',
      terminos_servicio: 'Términos de Servicio',
      recursos_crisis: 'Recursos de Crisis',
      guia_padres: 'Guía para Padres',
      cambiar_mascota: 'Cambiar Mascota',
      editar_avatar: 'Editar Avatar',
      salas: 'Salas', cartas: 'Cartas',
      todos: 'Todos', apoyo: 'Apoyo',
      miembros_desde: 'Miembro desde',
      anecdotes_publicadas: 'Anécdotas publicadas',
      ingles: 'Inglés', espanol: 'Español',
      idioma: 'Idioma',
      blog_header: 'Comparte lo que sientes',
      blog_desc: 'Un espacio seguro para expresarte de forma anónima y recibir apoyo de la comunidad. Aquí no hay juicios, solo personas que te entienden.',
      blog_activos: 'activos',
      blog_publicaciones: 'publicaciones',
      blog_apoyos: 'apoyos',
      blog_tus_insignias: 'Tus insignias',
      blog_sin_insignias: 'Publica para ganar insignias',
      blog_comparte: 'Comparte un logro',
      blog_completado: '¡Reto completado!',
      blog_vuelve_manana: 'Vuelve mañana para un nuevo reto.',
      blog_completado_btn: 'Completado',
      blog_completar: 'Completar reto',
      blog_no_posts: 'No hay publicaciones aún',
      blog_primero: 'Sé el primero en compartir sobre',
      blog_comentarios: 'comentarios',
      blog_editado: 'Editado',
      blog_ampliar: 'Ampliar',
      blog_panel_emocional: 'Panel Emocional',
      blog_mas_apoyados: 'Más apoyados',
      blog_tendencia: 'Tendencia',
      blog_frase_comunidad: 'Frase de la comunidad',
      blog_necesitas_hablar: '¿Necesitas hablar?',
      blog_apoyo_profesional: 'Apoyo profesional, siempre confidencial.',
      blog_hablar_ahora: 'Hablar ahora',
      blog_escribe_comentario: 'Escribe un comentario...',
      blog_enviar: 'Enviar',
      blog_cartas_anonimas: 'Cartas Anñnimas',
      blog_escribe_carta: 'Escribe tu carta anónima...',
      blog_publicar_carta: 'Publicar carta anónima',
      blog_reportar: 'Reportar publicación',
      blog_mantener_segura: 'Mantún la comunidad segura',
      blog_inapropiado: 'Contenido inapropiado',
      blog_acoso: 'Acoso',
      blog_falsa: 'Informaciñn falsa',
      blog_ofensivo: 'Lenguaje ofensivo',
      blog_otro: 'Otro',
      blog_enviar_reporte: 'Enviar',
      blog_cancelar: 'Cancelar',
      blog_centro_seguridad: 'Centro de seguridad',
      blog_terminos: 'Tñrminos',
      blog_privacidad: 'Privacidad',
      blog_copyright: 'ñ 2024 Safety Love. Siempre seguro, siempre anñnimo.',
      blog_siempre: 'Siempre',
      blog_24h: '24h',
      blog_3dias: '3 días',
      blog_7dias: '7 días',
      blog_tematicas: 'Temítica',
      blog_como_sientes: 'ñCñmo te sientes?',
      blog_que_sientes_hoy: 'ñQuñ estás sintiendo hoy,',
    },
    en: {
      inicio: 'Home', recursos: 'Resources', perfil: 'Profile',
      iniciar_sesion: 'Sign In', registrarse: 'Sign Up',
      correo: 'Email', contrasenia: 'Password',
      confirmar_contrasenia: 'Confirm password',
      nombre: 'Name', registrate: 'Register',
      bienvenido: 'Welcome to Safety Love',
      mensaje_para_ti: 'A message for you',
      mensajes_para_ti: 'Messages for you',
      blog_anonimo: 'Anonymous Blog', chat_ia: 'AI Chat',
      versiculo_consuelo: 'Comfort Verse',
      mi_perfil: 'My Profile', cerrar_sesion: 'Sign Out',
      tema_claro: 'Light Theme', tema_oscuro: 'Dark Theme',
      mensajes_guardados: 'Saved Messages',
      versiculos_guardados: 'Saved Verses',
      notificaciones: 'Notifications',
      marcar_leidas: 'Mark all read', borrar_todas: 'Clear all',
      compartir: 'Share', guardar: 'Save',
      publicar: 'Publish', anonimo: 'Anonymous', publico: 'Public',
      siempre: 'Always',
      no_notificaciones: 'You have no new notifications',
      no_tienes_cuenta: "Don't have an account?",
      ya_tienes_cuenta: 'Already have an account?',
      recordarme: 'Remember me',
      olvidaste_contrasenia: 'Forgot your password?',
      ingresar: 'Sign In',
      crear_cuenta: 'Create Account',
      linea_apoyo: 'Support Line',
      necesita_ayuda: 'Need immediate help?',
      hero_title: 'Your safe haven in the digital world',
      hero_desc: 'Emotional support, wellness tools, and a community that understands you. You are in a safe place.',
      privacidad: '100% Private',
      privacidad_desc: 'Your information remains protected and encrypted.',
      apoyo_expertos: 'Expert Support',
      apoyo_expertos_desc: 'Access content developed by specialists.',
      comunidad_segura: 'Safe Community',
      comunidad_segura_desc: 'A moderated space to share experiences.',
      testimonio_texto: 'I found a space where they truly listen without judgment.',
      testimonio_autor: '— Sofia, 17 years old',
      politica_privacidad: 'Privacy Policy',
      terminos_servicio: 'Terms of Service',
      recursos_crisis: 'Crisis Resources',
      guia_padres: 'Parent Guide',
      cambiar_mascota: 'Change Pet',
      editar_avatar: 'Edit Avatar',
      salas: 'Rooms', cartas: 'Letters',
      todos: 'All', apoyo: 'Support',
      miembros_desde: 'Member since',
      anecdotes_publicadas: 'Stories published',
      ingles: 'English', espanol: 'Spanish',
      idioma: 'Language',
      blog_header: 'Share what you feel',
      blog_desc: 'A safe space to express yourself anonymously and receive support from the community. No judgment, only people who understand you.',
      blog_activos: 'active',
      blog_publicaciones: 'posts',
      blog_apoyos: 'supports',
      blog_tus_insignias: 'Your badges',
      blog_sin_insignias: 'Post to earn badges',
      blog_comparte: 'Share an achievement',
      blog_completado: 'Challenge completed!',
      blog_vuelve_manana: 'Come back tomorrow for a new challenge.',
      blog_completado_btn: 'Completed ñS',
      blog_completar: 'Complete challenge',
      blog_no_posts: 'No posts yet',
      blog_primero: 'Be the first to share about',
      blog_comentarios: 'comments',
      blog_editado: 'Edited',
      blog_ampliar: 'Expand',
      blog_panel_emocional: 'Emotional Panel',
      blog_mas_apoyados: 'Most supported',
      blog_tendencia: 'Trending',
      blog_frase_comunidad: 'Community quote',
      blog_necesitas_hablar: 'Need to talk?',
      blog_apoyo_profesional: 'Professional support, always confidential.',
      blog_hablar_ahora: 'Talk now',
      blog_escribe_comentario: 'Write a comment...',
      blog_enviar: 'Send',
      blog_cartas_anonimas: 'Anonymous Letters',
      blog_escribe_carta: 'Write your anonymous letter...',
      blog_publicar_carta: 'Publish anonymous letter',
      blog_reportar: 'Report post',
      blog_mantener_segura: 'Keep the community safe',
      blog_inapropiado: 'Inappropriate content',
      blog_acoso: 'Harassment',
      blog_falsa: 'False information',
      blog_ofensivo: 'Offensive language',
      blog_otro: 'Other',
      blog_enviar_reporte: 'Send report',
      blog_cancelar: 'Cancel',
      blog_centro_seguridad: 'Safety center',
      blog_terminos: 'Terms',
      blog_privacidad: 'Privacy',
      blog_copyright: 'ñ 2024 Safety Love. Always safe, always anonymous.',
      blog_siempre: 'Forever',
      blog_24h: '24h',
      blog_3dias: '3 days',
      blog_7dias: '7 days',
      blog_tematicas: 'Topic',
      blog_como_sientes: 'How do you feel?',
      blog_que_sientes_hoy: 'What are you feeling today,',
    }
  };
  translations.en = translations.es;
  const t = (key) => translations[language]?.[key] || key;
  const BIBLE_VERSES = language === 'en' ? BIBLE_VERSES_EN : BIBLE_VERSES_ES;
  const MOTIVATIONAL_MESSAGES = language === 'en' ? MOTIVATIONAL_MESSAGES_EN : MOTIVATIONAL_MESSAGES_ES;
  const activeTopics = language === 'en' ? BLOG_TOPICS_EN : BLOG_TOPICS;
  const activeTopicIcons = language === 'en' ? TOPIC_ICONS_EN : TOPIC_ICONS;
  const activeMoods = language === 'en' ? MOOD_OPTIONS_EN : MOOD_OPTIONS;
  const activeChallenges = language === 'en' ? DAILY_CHALLENGES_EN : DAILY_CHALLENGES;
  const activeBadges = language === 'en' ? BADGE_TYPES_EN : BADGE_TYPES;
  const activeLetters = language === 'en' ? LETTER_TYPES_EN : LETTER_TYPES;
  const activeReactions = language === 'en' ? REACTION_TYPES_EN : REACTION_TYPES;
  const getLocalChallenge = () => { const d = new Date().getDate(); return activeChallenges[d % activeChallenges.length]; };
  const getLocalBadges = (uName, posts2) => { const b = []; const up = posts2.filter(p => p.author === uName); if (up.length >= 1) b.push(activeBadges.firstPost); if (up.length >= 3) b.push(activeBadges.activeMember); const totalS = up.reduce((s, p) => s + Object.values(p.reactions || {}).reduce((a, b) => a + b, 0), 0); if (totalS >= 10) b.push(activeBadges.supportive); if (up.length >= 2) b.push(activeBadges.consistent); return b; };

  useEffect(() => {
    const timer = setInterval(() => {
      setPetHunger(prev => Math.max(0, prev - 2));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const COLORS = genderTheme === 'mujer' ? {
    primary: '#FA9DA6',    // Rosa Coral
    secondary: '#FBCCD4',  // Rosa Claro
    background: '#F3E2C6', // Beige/Crema
    accent: '#8EB694',     // Verde Suave
  } : {
    primary: '#5B97FC',    // Azul Real mís claro y vibrante
    secondary: '#1E293B',  // Slate Medium
    background: '#0F172A', // Slate Deep Dark
    accent: '#85B3FF',     // Light Blue Accent mís claro y suave
  };

  const THEMES = genderTheme === 'mujer' ? {
    userDash: { bg: '#FFE4EC', accent: '#FA9DA6', secondary: '#FBCCD4', icon: '#FA9DA6' },
    blog: { bg: '#FFFFFF', accent: '#3B82F6', secondary: '#DBEAFE', icon: '#3B82F6' },
    mensajes: { bg: '#F0FFF4', accent: '#48BB78', secondary: '#C6F6D5', icon: '#48BB78' },
    chat: { bg: '#FFE4EC', accent: '#FA9DA6', secondary: '#FBCCD4', icon: '#FA9DA6' },
    versiculos: { bg: '#FFF7ED', accent: '#FB923C', secondary: '#FFEDD5', icon: '#FB923C' },
    profile: { bg: '#FFE4EC', accent: '#FA9DA6', secondary: '#FBCCD4', icon: '#FA9DA6' },
    recursos: { bg: '#FFE4EC', accent: '#FA9DA6', secondary: '#FBCCD4', icon: '#FA9DA6' }
  } : {
    userDash: { bg: '#0F172A', accent: '#5B97FC', secondary: '#1E293B', icon: '#85B3FF' },
    blog: { bg: '#FFFFFF', accent: '#5B97FC', secondary: '#1E293B', icon: '#85B3FF' },
    mensajes: { bg: '#0F172A', accent: '#4ADE80', secondary: '#1E293B', icon: '#4ADE80' },
    chat: { bg: '#0F172A', accent: '#F472B6', secondary: '#1E293B', icon: '#F472B6' },
    versiculos: { bg: '#0F172A', accent: '#FB923C', secondary: '#1E293B', icon: '#FB923C' },
    profile: { bg: '#0F172A', accent: '#5B97FC', secondary: '#1E293B', icon: '#85B3FF' },
    recursos: { bg: '#0F172A', accent: '#5B97FC', secondary: '#1E293B', icon: '#85B3FF' }
  };

  useEffect(() => {
    if (genderTheme === 'hombre') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [genderTheme]);

  useEffect(() => {
  if (currentView === 'blog') {
      const blogTheme = THEMES.blog;
      document.body.style.backgroundColor = blogTheme.bg;
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [currentView, genderTheme]);

  useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          setUserId(session.user.id);
          loadUserData(session.user.id);
        }
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          setUserId(session.user.id);
          if (_event === 'SIGNED_IN') {
            loadUserData(session.user.id);
          }
        } else {
          setUserId(null);
        }
      });
      return () => subscription.unsubscribe();
    } catch(e) {
      console.warn('Sin DB - mantener login inicial:', e.message);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => {
      twemoji.parse(document.body, { ext: '.svg', className: 'twemoji-apple' });
    });
  }, [currentView]);

  // Pet decay + persistence
  useEffect(() => {
    const decay = setInterval(() => {
      setPetHunger(prev => Math.max(0, prev - 1));
      setPetEnergy(prev => Math.max(0, prev - 0.7));
      setPetHappiness(prev => Math.max(0, prev - 0.5));
    }, 10000);
    return () => clearInterval(decay);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('pet_hunger', JSON.stringify(Math.round(petHunger)));
      localStorage.setItem('pet_energy', JSON.stringify(Math.round(petEnergy)));
      localStorage.setItem('pet_happiness', JSON.stringify(Math.round(petHappiness)));
      localStorage.setItem('pet_level', JSON.stringify(petLevel));
      localStorage.setItem('pet_xp', JSON.stringify(petXp));
      localStorage.setItem('pet_friendship', JSON.stringify(petFriendship));
      localStorage.setItem('streak', JSON.stringify(emotionalStreak));
      localStorage.setItem('achievements', JSON.stringify(achievements));
      localStorage.setItem('completed_activities', JSON.stringify(completedActivities));
    } catch (e) { console.error('localStorage write error:', e); }
    if (petHunger > 80 && petEnergy > 80 && petHappiness > 80) setConfetti(true);
    else setConfetti(false);
  }, [petHunger, petEnergy, petHappiness, petLevel, petXp, petFriendship, emotionalStreak, achievements, completedActivities]);

  // Login view state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' (within login view)
  // Register view state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('adolescente');
  const [regError, setRegError] = useState('');
  const [regIsLoading, setRegIsLoading] = useState(false);
  // Onboarding view state
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingSelectedAvatar, setOnboardingSelectedAvatar] = useState(AVATARS[0]);
  
  // Avatar Edit view state (after registration)
  const [avatarEditStep, setAvatarEditStep] = useState(0);
  const [avatarEditGender, setAvatarEditGender] = useState('mujer');
  const [avatarEditOptions, setAvatarEditOptions] = useState({
    seed: 'Felix',
    gender: 'mujer',
    top: 'longButNotTooLong',
    facialHair: '',
    hairColor: '2c2c2c',
    skinColor: 'ffdbac',
    clothing: 'hoodie',
    clothesColor: '262e33',
    hatColor: 'ffffff',
    eyes: 'happy',
    mouth: 'smile',
    facialHairColor: '2c1b18',
    accessories: ''
  });

  const [avatarOptions, setAvatarOptions] = useState({
    seed: 'Felix',
    gender: 'mujer',
    top: 'longButNotTooLong',
    facialHair: '',
    hairColor: '2c2c2c',
    skinColor: 'ffdbac',
    clothing: 'hoodie',
    clothesColor: '262e33',
    hatColor: 'ffffff',
    eyes: 'happy',
    mouth: 'smile',
    facialHairColor: '2c1b18',
    accessories: ''
  });

  const getCustomAvatarUrl = (opts) => {
    const isBald = opts.top === 'noHair';
    let url;
    if (isBald) {
      url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${opts.seed}&topProbability=0&skinColor=${opts.skinColor}&clothing=${opts.clothing}&clothesColor=${opts.clothesColor}&eyes=${opts.eyes}&mouth=${opts.mouth}`;
    } else {
      url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${opts.seed}&top=${opts.top}&topProbability=100&hairColor=${opts.hairColor}&skinColor=${opts.skinColor}&clothing=${opts.clothing}&clothesColor=${opts.clothesColor}&eyes=${opts.eyes}&mouth=${opts.mouth}&hatColor=${opts.hatColor}`;
    }
    if (opts.facialHair) {
      url += `&facialHair=${opts.facialHair}&facialHairProbability=100&facialHairColor=${opts.facialHairColor}`;
    } else {
      url += `&facialHairProbability=0`;
    }
    if (opts.accessories && ['round', 'sunglasses', 'kurt', 'prescription01', 'prescription02', 'wayfarers'].includes(opts.accessories)) {
      url += `&accessories=${opts.accessories}&accessoriesProbability=100&accessoriesColor=${opts.accessoriesColor || '262e33'}`;
    } else {
      url += `&accessoriesProbability=0`;
    }
    if (opts.accessories === 'earrings' || opts.accessories === 'gorra' || opts.accessories === 'diadema' || opts.accessories === 'cross') {
      url += `&custom_overlay=${opts.accessories}&custom_overlay_color=${opts.accessoriesColor || 'FBBF24'}`;
    }
    return url;
  };

  const UserAvatar = ({ url, className = "w-full h-full object-cover" }) => {
    if (typeof url !== 'string' || url.length < 5) return <span className="font-bold text-gray-500">{url}</span>;
    const hasEarrings = url.includes('custom_overlay=earrings');
    const hasNecklace = url.includes('custom_overlay=necklace');
    const hasDiadema = url.includes('custom_overlay=diadema');
    const hasCross = url.includes('custom_overlay=cross');
    const hasGorra = url.includes('custom_overlay=gorra');
    
    let color = 'FBBF24'; // Default gold
    const colorMatch = url.match(/custom_overlay_color=([0-9a-fA-F]+)/);
    if (colorMatch && colorMatch[1]) {
      color = colorMatch[1].toUpperCase();
    }
    const hexColor = `#${color}`;
    
    let strokeColor = '#B45309'; // Default gold stroke
    if (color === 'D1D5DB' || color === 'C0C0C0') strokeColor = '#6B7280'; // Silver
    else if (color === '111827' || color === '262E33') strokeColor = '#374151'; // Black
    else if (color === 'F472B6') strokeColor = '#BE185D'; // Rose gold
    else if (color === '3B82F6') strokeColor = '#1D4ED8'; // Blue
    else if (color === 'DC2626') strokeColor = '#991B1B'; // Red
    else if (color === '2563EB') strokeColor = '#1E40AF'; // Blue
    else if (color === '16A34A') strokeColor = '#166534'; // Green
    else if (color === 'EC4899') strokeColor = '#BE185D'; // Pink
    else if (color === 'FFFFFF') strokeColor = '#9CA3AF'; // White

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img src={url} alt="avatar" className={className} />
        {hasEarrings && (
          <svg className="absolute w-[55%] h-[55%] top-[40%] left-1/2 -translate-x-1/2 drop-shadow-md pointer-events-none z-10" viewBox="0 0 100 100" fill={hexColor} stroke={strokeColor} strokeWidth="3">
            <circle cx="15" cy="45" r="8" />
            <circle cx="85" cy="45" r="8" />
          </svg>
        )}
        {hasNecklace && (
          <svg className="absolute w-[45%] h-[40%] top-[44%] left-[53%] -translate-x-1/2 drop-shadow-md pointer-events-none z-10" viewBox="0 0 100 100" fill="none" stroke={hexColor} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 4">
            <path d="M25,15 Q58,48 95,15" />
          </svg>
        )}
        {hasDiadema && (
          <svg className="absolute w-[38%] h-[18%] top-[5%] left-1/2 -translate-x-1/2 drop-shadow-md pointer-events-none z-10" viewBox="0 0 100 100" fill={hexColor} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round">
            <path d="M15,85 L25,30 L38,48 L50,18 L62,48 L75,30 L85,85 Z" />
            <circle cx="50" cy="18" r="5" fill="none" stroke={strokeColor} strokeWidth="2" />
          </svg>
        )}
        {hasCross && (
          <svg className="absolute w-[38%] h-[42%] top-[43%] left-1/2 -translate-x-1/2 drop-shadow-md pointer-events-none z-10" viewBox="0 0 100 100" fill="none" stroke={hexColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15,12 Q50,42 85,12" strokeWidth="2.5" strokeDasharray="2 3" />
            <path d="M50,45 L50,82 M42,62 L58,62" strokeWidth="4" />
            <circle cx="50" cy="45" r="2.5" fill={hexColor} />
          </svg>
        )}
        {hasGorra && (
          <svg className="absolute w-[58%] h-[30%] top-[1%] left-[78%] -translate-x-1/2 drop-shadow-md pointer-events-none z-10" viewBox="0 0 120 80" fill={hexColor} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="60" cy="38" rx="52" ry="32" />
            <path d="M22,45 Q30,58 60,62 Q90,58 98,45" fill={hexColor} />
            <circle cx="60" cy="16" r="4.5" fill={hexColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        )}
      </div>
    );
  };

  const AppleEmoji = ({ emoji, className = "w-6 h-6 inline-block align-middle" }) => {
    if (!emoji) return null;
    const codePoints = Array.from(emoji).map(c => c.codePointAt(0).toString(16));
    const cleanCodePoints = codePoints.filter(cp => cp !== 'fe0f');
    const hex = cleanCodePoints.join('-');
    const src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/${hex}.png`;
    
    return (
      <img 
        src={src} 
        alt={emoji} 
        className={className} 
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          if (parent && !parent.querySelector('.emoji-fallback')) {
            const span = document.createElement('span');
            span.className = 'emoji-fallback';
            span.innerText = emoji;
            parent.appendChild(span);
          }
        }}
      />
    );
  };

  const renderTextWithAppleEmojis = (text) => {
    if (!text) return null;
    const emojiRegex = /([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{200d}\u{fe0f}]+)/gu;
    const parts = text.split(emojiRegex);
    return parts.map((part, index) => {
      if (emojiRegex.test(part)) {
        return <AppleEmoji key={index} emoji={part} className="w-5 h-5 inline-block align-middle mx-0.5" />;
      }
      return part;
    });
  };

  const getMascotForMood = (emoji) => {
    if (!emoji) return '/mascot/neutral.png';
    if (['😊', '🏠', '🏠', '😌'].includes(emoji)) return '/mascot/happy.png';
    if (['😢', '🏠'].includes(emoji)) return '/mascot/sad.png';
    if (['😠'].includes(emoji)) return '/mascot/angry.png';
    if (['😴'].includes(emoji)) return '/mascot/sleepy.png';
    return '/mascot/neutral.png';
  };

  const getMascotMessage = (emoji) => {
    if (!emoji) return "ñHola! ñCñmo te sientes hoy? Cuñntamelo en el calendario.";
    if (['😊', '🏠', '🏠'].includes(emoji)) return "ñQuñ alegrña verte asé! Tu sonrisa ilumina el día.";
    if (['😌'].includes(emoji)) return "La calma es tu superpoder. Estús en equilibrio hoy.";
    if (['😢', '🏠'].includes(emoji)) return "Estoy aquñ contigo. Estú bien no estar bien a veces.";
    if (['😠'].includes(emoji)) return "Respira profundo conmigo... Todo va a estar bien.";
    if (['😴'].includes(emoji)) return "Un descanso es justo lo que necesitas. Dulces sueños.";
    return "Estoy aquñ para escucharte y acompañarte.";
  };
  const [posts, setPosts] = useState([]);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('Todos');
  const [newPostTopic, setNewPostTopic] = useState('General');
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostText, setEditingPostText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentImage, setNewCommentImage] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const fileInputRef = useRef(null);
  const commentFileInputRef = useRef(null);
  const [reportModal, setReportModal] = useState({ isOpen: false, type: null, targetId: null, commentId: null });
  const [reportReason, setReportReason] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showEmotionalAssistant, setShowEmotionalAssistant] = useState(false);
  const [showUrgentHelp, setShowUrgentHelp] = useState(false);
  const [emotionalMessage, setEmotionalMessage] = useState('');
  const [emotionalChat, setEmotionalChat] = useState([]);
  const pinnedPostIds = [];
  const [selectedMood, setSelectedMood] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showChallenges, setShowChallenges] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [showAddTraitInline, setShowAddTraitInline] = useState(false);
  const [showSavedMessages, setShowSavedMessages] = useState(false);
  const [showSavedVerses, setShowSavedVerses] = useState(false);
  const [selectedProfileAddPreview, setSelectedProfileAddPreview] = useState(null);
  const nameInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCommentEmojiPicker, setShowCommentEmojiPicker] = useState(false);
  const [showPostEmojiPicker, setShowPostEmojiPicker] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [transitioningView, setTransitioningView] = useState(null);
  const [letters, setLetters] = useState([]);
  const [letterType, setLetterType] = useState('carta');
  const [newLetter, setNewLetter] = useState('');
  const [showLetters, setShowLetters] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState('1 day');
  const commentInputRef = useRef(null);
  const commentEmojiRef = useRef(null);
  const postEmojiRef = useRef(null);
  const [moodEntries, setMoodEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [tempMood, setTempMood] = useState({ emoji: '😊', description: '', intensity: 2 });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const calendarRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("EMOTICONOS Y PERSONAS");
  const [activeAvatarCategory, setActiveAvatarCategory] = useState("genero");
  const [avatarRotation, setAvatarRotation] = useState(0);
  const [avatarTraits, setAvatarTraits] = useState([null, null, null, null]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [selectedPreviewTrait, setSelectedPreviewTrait] = useState('empatia');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [loginRole, setLoginRole] = useState('adolescente');
  const [activeForm, setActiveForm] = useState('login');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatFile, setChatFile] = useState(null);
  const [showChatEmojis, setShowChatEmojis] = useState(false);
  const [showAvatarSection, setShowAvatarSection] = useState(false);
  const [currentToast, setCurrentToast] = useState(null);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  
  const MOOD_EMOJIS = ['😊', '😢', '😠', '😌', '😰'];
  const CHAT_EMOJIS = ['😊', '😂', '😍', '🥰', '😢', '😠', '😌', '😰', '😗', '😚', '😘', '😙', '😛', '😜', '🤪', '🤨', '🤔', '🤫', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮', '😳', '🥺', '🥹', '😭', '😤', '😡', '🤬', '😋', '🤩', '🤗', '❤', '💕', '🌟', '🔥', '👋', '👍', '👎', '👏', '🎉', '🎊', '✨', '💡', '📖', '🎵', '🌈'];
  const EMOJI_CATEGORIES = {
    "EMOTICONOS Y PERSONAS": ['😊', '😂', '😍', '🥰', '😘', '😚', '😛', '😜', '🤪', '🤨', '🤔', '🤫', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮', '😳', '🥺', '🥹', '😭', '😤', '😡', '🤬', '😋', '🤩', '🤗'],
    "ANIMALES Y NATURALEZA": ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦀'],
    "COMIDA Y BEBIDA": ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🫓', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆'],
    "ACTIVIDADES Y DEPORTES": ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🫸', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋', '🤼', '🤸', '🤺', '⛹', '🤾', '🏌', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣'],
    "VIAJES Y LUGARES": ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍', '🛵', '🛺', '🚲', '🛴', '🛹', '🚏', '🛣', '🛤', '⛽', '🛳', '⛴', '🛥', '🚢', '✈', '🛩', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🏠', '🏡', '🏘', '🏚', '🏗', '🏢', '🏭', '🏣', '🏤', '🏥', '🏦', '🏨'],
    "OBJETOS Y SIMBOLOS": ['⌚', '📱', '💻', '⌨', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '🎞', '🎞', '📞', '☎', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋', '🪫', '🔌', '💡', '🔦', '🕯', '🪄', '🧯', '🗑', '🛢', '💰', '💴', '💵', '💶', '💷']
  };

  const EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

  // Funciones del Blog
  const handleReact = (postId, type) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const prev = p.userReaction;
        const newReactions = { ...p.reactions };
        if (prev === type) {
          newReactions[type] = Math.max(0, (newReactions[type] || 0) - 1);
          return { ...p, reactions: newReactions, userReaction: null };
        } else {
          if (prev) newReactions[prev] = Math.max(0, (newReactions[prev] || 0) - 1);
          newReactions[type] = (newReactions[type] || 0) + 1;
          return { ...p, reactions: newReactions, userReaction: type };
        }
      }
      return p;
    }));
  };

  const handleComment = (postId) => {
    setActiveCommentsPostId(postId);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() && !newCommentImage) return;

    setPosts(posts.map(p => {
      if (p.id === activeCommentsPostId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now(), text: newCommentText, image: newCommentImage, author: userName, time: 'Ahora', likes: 0, liked: false, isOwn: true }]
        };
      }
      return p;
    }));
    if (userId) { supabase.from('comments').insert({ post_id: activeCommentsPostId, user_id: userId, content: newCommentText, image: newCommentImage || null }).then(); }
    setNewCommentText('');
    setNewCommentImage(null);
  };

  const insertCommentEmoji = (emoji) => {
    const input = commentInputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newText = newCommentText.slice(0, start) + emoji + newCommentText.slice(end);
      setNewCommentText(newText);
      requestAnimationFrame(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length;
        input.focus();
      });
    } else {
      setNewCommentText(prev => prev + emoji);
    }
    setShowCommentEmojiPicker(false);
  };

  const insertPostEmoji = (emoji) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setNewPost(prev => prev.slice(0, start) + emoji + prev.slice(end));
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setNewPost(prev => prev + emoji);
    }
    setShowPostEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentEmojiRef.current && !commentEmojiRef.current.contains(e.target)) {
        setShowCommentEmojiPicker(false);
      }
    };
    if (showCommentEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCommentEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (postEmojiRef.current && !postEmojiRef.current.contains(e.target)) {
        setShowPostEmojiPicker(false);
      }
    };
    if (showPostEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPostEmojiPicker]);

  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const isLiked = !c.liked;
              return { ...c, liked: isLiked, likes: isLiked ? c.likes + 1 : c.likes - 1 };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const showToast = (title, message, type) => {
    setCurrentToast({ title, message, type });
    setTimeout(() => setCurrentToast(null), 3000);
  };

  const goTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const loadUserData = async (userId) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profile) {
        setUserName(profile.name || profile.email || 'Usuario');
        setUserAvatar(profile.avatar || AVATARS[0]);
        setGenderTheme(profile.gender_theme || 'mujer');
        setMascotType(profile.mascot_type || 'gato');
        setRole(profile.role || 'adolescente');
      }
      const { data: msgs } = await supabase.from('saved_messages').select('*').eq('user_id', userId);
      if (msgs) setSavedMessages(msgs);
      const { data: verses } = await supabase.from('saved_verses').select('*').eq('user_id', userId);
      if (verses) setSavedVerses(verses);
      const { data: moods } = await supabase.from('mood_entries').select('date, emoji, description, intensity').eq('user_id', userId);
      if (moods) {
        const moodMap = {};
        moods.forEach(m => { moodMap[m.date] = { emoji: m.emoji, description: m.description, intensity: m.intensity || 2 }; });
        setMoodEntries(moodMap);
      }
    } catch (err) {
      // Sin DB - usar valores por defecto
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    setConfirmModal({
      isOpen: true,
      title: 'ñBorrar comentario?',
      message: 'Esta acciñn no se puede deshacer.',
      onConfirm: () => {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments.filter(c => c.id !== commentId)
            };
          }
          return p;
        }));
        if (userId) { supabase.from('comments').delete().eq('id', commentId).then(); }
        setConfirmModal({ ...confirmModal, isOpen: false });
        showToast("Comentario borrado", "Tu respuesta ha sido eliminada.", "info");
      }
    });
  };

  const saveEditComment = (postId, commentId) => {
    if (!editingCommentText.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              return { ...c, text: editingCommentText, isEdited: true };
            }
            return c;
          })
        };
      }
      return p;
    }));
    setEditingCommentId(null);
    showToast("Comentario actualizado", "Tu comentario ha sido editado.", "info");
  };

  const addEmojiToPost = (emoji) => {
    setNewPost(newPost + emoji);
    setShowEmojiPicker(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addWelcomeNotification = () => {
    const welcome = { 
      id: Date.now(), 
      title: 'ñBienvenida!', 
      message: `Gracias por unirte a Safety Love, ${userName}. Este es tu espacio seguro.`, 
      time: 'Reciente', 
      type: 'info',
      read: false 
    };
    setNotifications([welcome, ...notifications]);
  };

  const Mascot = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [animState, setAnimState] = useState('idle');
    const [isHovered, setIsHovered] = useState(false);
    const [expression, setExpression] = useState('neutral');
    const [isBlinking, setIsBlinking] = useState(false);
    const [bounceCount, setBounceCount] = useState(0);
    const petActionRef = useRef(petAction);
    petActionRef.current = petAction;
    const petHungerRef = useRef(petHunger);
    petHungerRef.current = petHunger;
    const petEnergyRef = useRef(petEnergy);
    petEnergyRef.current = petEnergy;
    const petHappinessRef = useRef(petHappiness);
    petHappinessRef.current = petHappiness;

    const tips = [
      'T\u00F3mate un momento para respirar profundo \u{1F9D8}',
      'Recuerda que no est\u00E1s sola \u{1F49B}',
      'Cada emoci\u00F3n es v\u00E1lida y merece ser escuchada \u{1F49C}',
      'Has hecho un gran d\u00EDa hoy \u{1F31F}',
      'Mereces amor y respeto siempre \u{1F49D}',
      'Estoy aqu\u00ED para ti cuando me necesites \u{1F90D}',
      '\u00A1T\u00FA puedes con todo! \u{1F929}',
      'Lo importante es intentarlo, no rendirse \u{1F4AA}',
    ];

    const hungerMsgs = ['Tengo un poco de hambre... \u{1F622}', '\u00BFPodr\u00EDas darme de comer?', 'Mi est\u00F3mago suena...'];
    const energyMsgs = ['Estoy tan cansada... \u{1F62B}', 'Necesito dormir un poco...', 'Mis ojos se cierran...'];
    const happyMsgs = ['\u00A1Estoy muy feliz! \u{1F60A}', '\u00A1Qu\u00E9 bonito d\u00EDa! \u{1F31F}', 'Gracias por cuidarme \u{2764}\uFE0F'];

    useEffect(() => {
      if (petAction) {
        setAnimState(petAction);
        setExpression(petAction === 'sleep' ? 'neutral' : 'happy');
      } else if (petHunger < 20) {
        setAnimState('idle');
        setExpression('sad');
        setMessage(hungerMsgs[Math.floor(Math.random() * hungerMsgs.length)]);
      } else if (petEnergy < 20) {
        setAnimState('idle');
        setExpression('neutral');
        if (!petActionRef.current) setMessage(energyMsgs[Math.floor(Math.random() * energyMsgs.length)]);
      } else if (petHappiness > 80) {
        setAnimState('happy');
        setExpression('happy');
        setMessage(happyMsgs[Math.floor(Math.random() * happyMsgs.length)]);
      } else {
        setAnimState('idle');
        setExpression('neutral');
      }
    }, [petAction, petHunger, petEnergy, petHappiness]);

    useEffect(() => {
      setAnimState('greeting');
      setExpression('happy');
      const greetings = [
        '\u00A1Hola! Soy Zuri, tu amiga emocional \u{1F98A}',
        'Estoy aqu\u00ED para ti siempre \u{1F49C}',
        'Bienvenida a Safety Love, amiga \u{1F49B}',
      ];
      setMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      const t1 = setTimeout(() => { setAnimState('idle'); setExpression('neutral'); }, 3000);
      const interval = setInterval(() => {
        if (!petActionRef.current) {
          const h = petHungerRef.current;
          const e = petEnergyRef.current;
          const ha = petHappinessRef.current;
          if (h < 20) {
            setExpression('sad');
            setMessage(hungerMsgs[Math.floor(Math.random() * hungerMsgs.length)]);
          } else if (e < 20) {
            setExpression('neutral');
            setMessage(energyMsgs[Math.floor(Math.random() * energyMsgs.length)]);
          } else if (ha > 80) {
            setAnimState('happy');
            setExpression('happy');
            setMessage(happyMsgs[Math.floor(Math.random() * happyMsgs.length)]);
          } else {
            setAnimState('happy');
            setExpression('happy');
            setMessage(tips[Math.floor(Math.random() * tips.length)]);
          }
          setTimeout(() => { if (!petActionRef.current) { setAnimState('idle'); setExpression(h < 20 ? 'sad' : 'neutral'); setMessage(''); } }, 5000);
        }
      }, 20000);
      return () => { clearTimeout(t1); clearInterval(interval); };
    }, []);

    useEffect(() => {
      if (petHappiness > 80 && !petAction) {
        const t = setTimeout(() => { setBounceCount(prev => prev + 1); }, 8000 + Math.random() * 12000);
        return () => clearTimeout(t);
      }
    }, [petHappiness, petAction, bounceCount]);

    useEffect(() => {
      const blinkInterval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000 + Math.random() * 4000);
      return () => clearInterval(blinkInterval);
    }, []);

    const containerVariants = {
      idle: {
        y: [0, -10, 0],
        scale: [1, 1.015, 1],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      },
      greeting: {
        y: [0, -40, -20, -10, 0],
        scale: [1, 1.2, 1.1, 1.05, 1],
        rotate: [0, -5, 5, -3, 0],
        transition: { duration: 1.2, ease: 'easeOut' }
      },
      happy: {
        y: [0, -25, 0, -25, 0],
        rotate: [0, -8, 8, -8, 0],
        scale: [1, 1.04, 1, 1.04, 1],
        transition: { duration: 0.8, repeat: 3, ease: 'easeInOut' }
      },
      empathy: {
        x: [0, -8, 8, -8, 0],
        transition: { duration: 1, repeat: 2, ease: 'easeInOut' }
      },
      bounce: {
        y: [0, -35, 0, -25, 0],
        rotate: [0, -12, 12, -8, 0],
        scale: [1, 1.08, 0.95, 1.05, 1],
        transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' }
      },
      eat: {
        scale: [1, 1.04, 1, 1.04, 1],
        rotate: [0, 4, -4, 4, 0],
        transition: { duration: 0.25, repeat: 3, ease: 'easeInOut' }
      },
      play: {
        y: [0, -14, 0, -12, 0],
        scale: [1, 1.12, 0.94, 1.08, 1],
        rotate: [0, -10, 10, -8, 0],
        transition: { duration: 0.35, repeat: 5, ease: 'easeInOut' }
      },
      sleep: {
        scale: [1, 0.96, 1],
        y: [0, 4, 0],
        transition: { duration: 0.6, repeat: 3, ease: 'easeInOut' }
      },
    };

    const earVariants = {
      idle: { rotate: [0, -5, 0, 5, 0], transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } },
      greeting: { rotate: [0, -15, 15, -10, 0], transition: { duration: 0.8, ease: 'easeOut' } },
      happy: { rotate: [0, -10, 10, -5, 0], transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' } },
      eat: { rotate: [0, -6, 6, -4, 0], transition: { duration: 0.25, repeat: 3, ease: 'easeInOut' } },
      play: { rotate: [0, -14, 14, -8, 0], transition: { duration: 0.3, repeat: 5, ease: 'easeInOut' } },
      sleep: { rotate: [0, -8, 0], transition: { duration: 1.5, ease: 'easeInOut' } },
    };

    const tailVariants = {
      idle: { rotate: [0, -15, 0, 15, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
      greeting: { rotate: [0, -30, 30, -20, 0], transition: { duration: 1, ease: 'easeOut' } },
      happy: { rotate: [0, -25, 25, -15, 0], transition: { duration: 0.7, repeat: 3, ease: 'easeInOut' } },
      eat: { rotate: [0, -20, 20, -10, 0], transition: { duration: 0.3, repeat: 3, ease: 'easeInOut' } },
      play: { rotate: [0, -35, 35, -20, 0], transition: { duration: 0.35, repeat: 5, ease: 'easeInOut' } },
      sleep: { rotate: [0, -5, 0], transition: { duration: 2, ease: 'easeInOut' } },
    };

    const getMouthPath = () => {
      if (expression === 'happy') return 'M40 52 Q50 62 60 52';
      if (expression === 'sad') return 'M40 58 Q50 52 60 58';
      if (expression === 'surprised') return 'M43 52 Q50 62 57 52';
      return 'M42 55 Q50 62 58 55';
    };

    const getEyeHeight = () => {
      if (isBlinking) return '2';
      if (petAction === 'sleep') return '1';
      if (expression === 'surprised') return '22';
      if (expression === 'sad') return '12';
      return '18';
    };

    if (isMinimized) {
      return (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsMinimized(false)}
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
          className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 w-16 h-16 lg:w-20 lg:h-20 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #F9A8D4, #FB7185)' }}
        >
          <svg viewBox="0 0 100 100" className="w-10 h-10 lg:w-12 lg:h-12">
            <motion.path
              d="M50 85 C20 60 5 40 5 25 C5 10 20 0 35 0 C45 0 50 10 50 10 C50 10 55 0 65 0 C80 0 95 10 95 25 C95 40 80 60 50 85Z"
              fill="white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="35" cy="30" r="5" fill="#FB7185"/>
            <circle cx="65" cy="30" r="5" fill="#FB7185"/>
            <path d="M40 48 Q50 56 60 48" stroke="#FB7185" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </motion.button>
      );
    }

    return (
      <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end gap-3" style={{ maxWidth: 'calc(100vw - 5rem)' }}>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl rounded-br-sm shadow-xl p-4 lg:p-5 relative"
              style={{ maxWidth: '260px' }}
            >
              <p className="text-sm lg:text-base text-gray-700 font-medium leading-relaxed">{message}</p>
              <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setAnimState('bounce');
            setExpression('happy');
            setMessage(tips[Math.floor(Math.random() * tips.length)]);
            setTimeout(() => { setAnimState('idle'); setExpression(petHunger < 20 ? 'sad' : 'neutral'); setMessage(''); }, 5000);
            setBounceCount(prev => prev + 1);
          }}
          variants={containerVariants}
          animate={animState}
          whileHover={{ scale: 1.05 }}
          style={{ width: 'clamp(140px, 25vw, 240px)', height: 'clamp(180px, 32vw, 280px)' }}
        >
          {/* Fox SVG */}
          <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl" style={{ filter: 'drop-shadow(0 8px 32px rgba(250,157,166,0.25))' }}>
            {/* Tail */}
            <motion.g variants={tailVariants} animate={animState} style={{ transformOrigin: '30px 200px' }}>
              <path d="M25 195 C10 180 5 155 15 140 C22 130 30 135 28 150 C26 165 30 185 35 195Z" fill="#FB923C"/>
              <path d="M20 170 C18 160 22 150 26 148 C30 148 30 155 28 162Z" fill="white" opacity="0.3"/>
            </motion.g>

            {/* Back legs */}
            <ellipse cx="110" cy="215" rx="18" ry="12" fill="#EA580C"/>
            <ellipse cx="150" cy="215" rx="18" ry="12" fill="#EA580C"/>

            {/* Body */}
            <motion.ellipse
              cx="100" cy="165" rx="55" ry="60" fill="#FB923C"
              animate={petAction === 'eat' ? { scaleX: [1, 1.02, 1, 1.02, 1] } : petAction === 'play' ? { scaleX: [1, 1.04, 0.96, 1.02, 1], scaleY: [1, 0.96, 1.04, 0.98, 1] } : petAction === 'sleep' ? { scaleY: [1, 0.97, 1], y: [0, 2, 0] } : isHovered ? { scaleX: 1.03, scaleY: 0.97 } : {}}
              transition={{ duration: petAction === 'eat' ? 0.25 : petAction === 'play' ? 0.35 : petAction === 'sleep' ? 0.6 : 0.3, repeat: petAction ? (petAction === 'sleep' ? 3 : petAction === 'play' ? 5 : 3) : 0 }}
            />
            <ellipse cx="100" cy="175" rx="38" ry="40" fill="white" opacity="0.25"/>

            <ellipse cx="100" cy="180" rx="32" ry="35" fill="#FED7AA"/>
            <ellipse cx="100" cy="185" rx="22" ry="25" fill="#FFEDD5" opacity="0.6"/>

            {/* Front paws */}
            <ellipse cx="80" cy="218" rx="14" ry="10" fill="#FB923C"/>
            <ellipse cx="130" cy="218" rx="14" ry="10" fill="#FB923C"/>
            <ellipse cx="80" cy="220" rx="8" ry="5" fill="#FED7AA"/>
            <ellipse cx="130" cy="220" rx="8" ry="5" fill="#FED7AA"/>

            {/* Left arm */}
            <motion.path
              d="M55 155 C40 170 35 190 45 200"
              stroke="#FB923C" strokeWidth="14" strokeLinecap="round" fill="none"
              animate={petAction === 'eat' ? { d: ['M55 155 C40 170 35 190 45 200', 'M55 155 C38 168 33 188 43 198'] } : petAction === 'play' ? { d: ['M55 155 C40 170 35 190 45 200', 'M55 155 C35 165 30 185 38 195'] } : petAction === 'sleep' ? { d: 'M55 155 C42 172 38 192 47 202' } : isHovered ? { d: ['M55 155 C40 170 35 190 45 200', 'M55 155 C35 165 30 185 38 195'] } : {}}
              transition={{ duration: petAction === 'eat' ? 0.25 : petAction === 'play' ? 0.35 : petAction === 'sleep' ? 0.6 : 0.4, repeat: petAction === 'sleep' ? 0 : petAction ? (petAction === 'play' ? 5 : 3) : 0 }}
            />

            {/* Head */}
            <motion.g
              animate={petAction === 'sleep' ? { y: 3 } : isHovered ? { y: -4 } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Ears */}
              <motion.g variants={earVariants} animate={animState} style={{ transformOrigin: '70px 70px' }}>
                <path d="M50 95 L35 45 L60 80Z" fill="#FB923C" stroke="#F97316" strokeWidth="2"/>
                <path d="M42 60 L48 78 L55 75Z" fill="#FED7AA"/>
                <path d="M52 95 L37 50 L58 82Z" fill="#FB923C" opacity="0.3"/>
              </motion.g>
              <motion.g variants={earVariants} animate={animState} style={{ transformOrigin: '130px 70px' }}>
                <path d="M150 95 L165 45 L140 80Z" fill="#FB923C" stroke="#F97316" strokeWidth="2"/>
                <path d="M158 60 L152 78 L145 75Z" fill="#FED7AA"/>
                <path d="M148 95 L163 50 L142 82Z" fill="#FB923C" opacity="0.3"/>
              </motion.g>

              {/* Face outline */}
              <ellipse cx="100" cy="115" rx="52" ry="45" fill="#FB923C"/>
              <ellipse cx="100" cy="120" rx="40" ry="35" fill="white" opacity="0.15"/>

              {/* Cheeks */}
              <ellipse cx="65" cy="125" rx="18" ry="14" fill="#FB923C"/>
              <ellipse cx="135" cy="125" rx="18" ry="14" fill="#FB923C"/>

              {/* White face mask */}
              <ellipse cx="100" cy="128" rx="30" ry="25" fill="#FEF3C7"/>

              {/* Eye whites */}
              <motion.ellipse
                cx="82" cy="110" rx="11" ry={getEyeHeight()} fill="white"
                animate={{ scaleY: isBlinking ? 0.1 : 1, ry: getEyeHeight() }}
                transition={{ duration: 0.1 }}
              />
              <motion.ellipse
                cx="118" cy="110" rx="11" ry={getEyeHeight()} fill="white"
                animate={{ scaleY: isBlinking ? 0.1 : 1, ry: getEyeHeight() }}
                transition={{ duration: 0.1 }}
              />

              {/* Pupils */}
              <motion.g
                animate={isHovered ? { x: [0, 2, -2, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ellipse cx="85" cy="110" rx="6" ry="7" fill="#333"/>
                <ellipse cx="121" cy="110" rx="6" ry="7" fill="#333"/>
                <ellipse cx="87" cy="108" rx="2.5" ry="2.5" fill="white"/>
                <ellipse cx="123" cy="108" rx="2.5" ry="2.5" fill="white"/>
              </motion.g>

              {/* Blush */}
              <ellipse cx="65" cy="122" rx="8" ry="5" fill="#FCA5A5" opacity="0.5"/>
              <ellipse cx="135" cy="122" rx="8" ry="5" fill="#FCA5A5" opacity="0.5"/>

              {/* Nose */}
              <ellipse cx="100" cy="128" rx="6" ry="4.5" fill="#EA580C"/>
              <ellipse cx="98" cy="127" rx="2.5" ry="1.5" fill="white" opacity="0.4"/>

              {/* Mouth */}
              <motion.path
                d={getMouthPath()}
                stroke="#EA580C" strokeWidth="2.5" fill="none" strokeLinecap="round"
                animate={expression}
                variants={{
                  happy: { d: 'M40 52 Q50 62 60 52', strokeWidth: 2.5 },
                  sad: { d: 'M40 58 Q50 52 60 58', strokeWidth: 2.5 },
                  surprised: { d: 'M43 52 Q50 62 57 52', strokeWidth: 2.5 },
                  neutral: { d: 'M42 55 Q50 62 58 55', strokeWidth: 2.5 },
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Whiskers */}
              <line x1="45" y1="120" x2="68" y2="125" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <line x1="45" y1="128" x2="68" y2="128" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <line x1="132" y1="125" x2="155" y2="120" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <line x1="132" y1="128" x2="155" y2="128" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </motion.g>
          </svg>

          {/* Minimize button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-2 -right-2 w-7 h-7 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-xs lg:text-sm text-gray-400 hover:text-gray-600 transition cursor-pointer z-10"
          >_</motion.button>
        </motion.div>
      </div>
    );
  };

  const FloatingNav = () => {
    const navItems = [
      { icon: Home, label: t('inicio'), view: 'userDash', color: '#FFB3C6' },
      { icon: Calendar, label: 'Calendario', view: 'userDash', color: '#9CA3AF' },
      { icon: Heart, label: t('recursos'), view: 'recursos', color: '#9CA3AF' },
      { icon: User, label: t('perfil'), view: 'profile', color: '#9CA3AF' },
    ];
    return (
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-4 py-6 flex flex-col gap-8 items-center w-max border border-gray-50">
        {navItems.map(item => (
          <button key={item.label} onClick={() => goTo(item.view)}
            className="flex flex-col items-center gap-1.5 transition hover:opacity-100"
            style={{ color: currentView === item.view ? item.color : '#9CA3AF', opacity: currentView === item.view ? 1 : 0.6 }}
          >
            {React.createElement(item.icon, { size: 26, fill: currentView === item.view ? item.color : 'none' })}
            <span className="text-[11px] font-bold" style={{ color: 'inherit' }}>{item.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  const NotificationsModal = () => {
    if (!isNotificationsOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsNotificationsOpen(false)}>
        <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-black text-gray-800">{t('notificaciones')}</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="text-xs font-bold text-pink-400 hover:text-pink-600 transition px-3 py-1.5 rounded-xl bg-pink-50">{t('marcar_leidas')}</button>
                  <button onClick={(e) => { e.stopPropagation(); clearAllNotifications(); }} className="text-xs font-bold text-gray-400 hover:text-red-400 transition px-3 py-1.5 rounded-xl bg-gray-50">{t('borrar_todas')}</button>
                </>
              )}
              <button onClick={() => setIsNotificationsOpen(false)} className="p-1.5 hover:bg-gray-50 rounded-lg transition"><X size={18} /></button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 font-medium text-sm">{t('no_notificaciones')}</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className={`flex items-start gap-3 px-6 py-4 border-b border-gray-50 last:border-0 ${!n.read ? 'bg-pink-50/50' : ''}`}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-pink-100 text-pink-500 text-lg">{n.type === 'heart' ? 'd' : n.type === 'info' ? '📝' : '💬'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                  <button onClick={() => deleteNotification(n.id)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-red-400 transition flex-shrink-0"><X size={14} /></button>
                </div>
              ))
            )}
            </div>
            </div>
          </div>
    );
  };


  // --- VISTA: BLOG ANñNIMO ---
  if (currentView === 'blog') {
    return (
      <div className="min-h-screen font-sans text-gray-800 flex flex-col" style={{ backgroundColor: '#EEFBF4' }}>
        {/* Header */}
        <header className="flex justify-between items-center py-5 px-6 md:px-12 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView('userDash')}
            >
              <Heart fill="#FFB3C6" color="#FFB3C6" size={20} />
              <span className="font-extrabold text-lg tracking-tight text-gray-900">
                Safety Love
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-500">
              <a href="#" className="text-gray-900">Feed</a>
              <a href="#" className="hover:text-gray-900 transition">About</a>
              <a href="#" className="hover:text-gray-900 transition">Guidelines</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Buscar experiencias..." 
                className="pl-9 pr-4 py-2 rounded-full bg-transparent border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-300 w-56 text-gray-600 placeholder-gray-400"
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-transparent" />
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer flex-shrink-0 bg-[#E5B599]">
               <div className="w-full h-full opacity-80 mix-blend-multiply bg-[url('https://api.dicebear.com/7.x/shapes/svg?seed=Felix&backgroundColor=transparent')]"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-3xl mx-auto px-6 w-full pt-10 pb-16">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Blog Anónimo</h1>
            <p className="text-gray-500 text-[14px] leading-relaxed max-w-2xl">
              Un refugio seguro para tu corazón. Comparte tus sentimientos, recibe apoyo y conéctate con empatía—completamente anónimo.
            </p>
          </div>

          {/* Post Box */}
          <div className="rounded-[1.5rem] p-6 mb-10 border border-pink-50" style={{ backgroundColor: '#FFF3F6' }}>
            <div className="flex gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFE4EB] flex items-center justify-center flex-shrink-0">
                <UserCircle2 className="text-[#FF9CB4]" size={22} strokeWidth={1.5} />
              </div>
              <textarea 
                className="w-full bg-transparent resize-none outline-none text-gray-700 placeholder-gray-300 pt-2 text-sm"
                placeholder="¿Qué hay en tu corazón hoy? Compártelo anónimamente..."
                rows="2"
              ></textarea>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4 pl-14">
                <button className="text-gray-400 hover:text-gray-600 transition p-1 bg-white rounded-full shadow-sm">
                  <UserCircle2 size={16} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition p-1 bg-white rounded-full shadow-sm">
                  <ImageIcon size={16} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition p-1 bg-white rounded-full shadow-sm">
                  <Paperclip size={16} />
                </button>
              </div>
              <button className="bg-[#FFB3C6] hover:bg-[#ff9cb4] text-gray-900 font-bold py-2 px-6 rounded-full text-xs transition">
                Post Anonymously
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-8 border-b border-gray-200/60 mb-8 px-2">
            <button className="pb-3 border-b-2 font-bold text-xs flex items-center gap-2" style={{ borderColor: '#FFB3C6', color: '#FFB3C6' }}>
              <Clock size={16} strokeWidth={2.5} /> Recent Posts
            </button>
            <button className="pb-3 font-semibold text-xs text-gray-400 hover:text-gray-700 flex items-center gap-2 transition">
              <Heart size={16} strokeWidth={2.5} /> Most Loved
            </button>
            <button className="pb-3 font-semibold text-xs text-gray-400 hover:text-gray-700 flex items-center gap-2 transition">
              <TrendingUp size={16} strokeWidth={2.5} /> Trending Stories
            </button>
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-6">
            <article className="bg-white border border-pink-100 rounded-[1.5rem] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFB3C6] flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs">Alma Anónima</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">2 hours ago</p>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <p className="text-gray-700 text-[13px] leading-relaxed mb-6">
                After 5 years of long distance, we finally moved into our first apartment today. My heart feels so full. For anyone still waiting, your time will come. Love really does transcend distance. 🌸
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-5 text-gray-400 text-xs font-semibold">
                  <button className="flex items-center gap-1.5 hover:text-[#FFB3C6] transition text-[#FFB3C6]">
                    <Heart size={16} className="fill-current" /> <span>124</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-gray-600 transition">
                    <MessageCircle size={16} className="fill-current text-gray-200" /> 18
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-[#FFF0F5] text-[#FF85A1] px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#ffe4ec] transition">
                  <Heart size={14} className="fill-current" /> Support
                </button>
              </div>
            </article>
          </div>
        </main>
      </div>
    );
  }





  // --- PANEL DEL ADMINISTRADOR (PSICñLOGO) ---

  // --- PANEL DEL ADMINISTRADOR (PSICñLOGO) ---
  if (currentView === 'adminDash') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <header className="pt-10 pb-6 px-6 rounded-b-[2rem] shadow-sm flex items-center justify-between sticky top-0 z-10" style={{ backgroundColor: COLORS.accent }}>
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl font-bold" style={{ color: COLORS.accent }}>
              Dr.
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Panel Profesional</p>
              <h1 className="text-xl font-bold tracking-tight">Dra. Rodrñguez</h1>
            </div>
          </div>
          <button onClick={() => goTo('login')} className="p-2 rounded-full hover:bg-white text-white transition">
            <LogOut size={20} />
          </button>
        </header>

        <main className="p-6 max-w-3xl mx-auto pb-24">
          {/* Mñtricas */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: `${COLORS.secondary}40` }}>
                <Users color={COLORS.primary} size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pacientes</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: `${COLORS.background}` }}>
                <Calendar color="#d97706" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Sesiones hoy</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </div>

          <h3 className="text-gray-700 font-bold mb-4 px-2">Actividad Reciente (Adolescentes)</h3>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {[
              { name: 'Daniela G.', status: 'Registrñ emociñn: Confusa', time: 'Hace 10 min', alert: false },
              { name: 'Mateo P.', status: 'Mensaje nuevo en chat', time: 'Hace 1 hora', alert: true },
              { name: 'Sofña R.', status: 'Completú lectura: "Lñmites Sanos"', time: 'Ayer', alert: false },
            ].map((user, i) => (
              <div key={i} className={`p-5 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition cursor-pointer`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-gray-600" style={{ backgroundColor: COLORS.background }}>
                    {user.name.charAt(0)}
                  </div>  
                  <div>
                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                    <p className={`text-sm ${user.alert ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{user.status}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">{user.time}</span>
              </div>
            ))}
          </div>

          {/* Botún Flotante para Agendar */}
          <button
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
            style={{ backgroundColor: COLORS.accent }}
          >
            <Calendar size={24} />
          </button>
        </main>
      </div>
    );
  }

  // --- THEME PICKER ---
  if (currentView === 'themePicker') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#F3E2C6' }}>
        <div className="text-center mb-12">
          <img src="/logo.png" alt="Safety Love" className="h-28 w-28 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-black" style={{ color: '#FA9DA6' }}>Safety Love</h1>
          <p className="text-sm font-medium mt-2 text-gray-500">Elige tu estilo</p>
        </div>
        <div className="flex gap-6">
          <button onClick={() => { setGenderTheme('mujer'); setCurrentView('userDash'); }} className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center text-5xl shadow-inner group-hover:shadow-lg transition-shadow">
              🌸
            </div>
            <span className="text-lg font-bold text-pink-400">Claro</span>
            <span className="text-xs text-gray-400 font-medium">Tema Rosado</span>
          </button>
          <button onClick={() => { setGenderTheme('hombre'); setCurrentView('userDash'); }} className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-5xl shadow-inner group-hover:shadow-lg transition-shadow">
              🌙
            </div>
            <span className="text-lg font-bold text-slate-500">Oscuro</span>
            <span className="text-xs text-gray-400 font-medium">Tema Luna</span>
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIN PAGE (Landing layout) ---
  if (currentView === 'login') {
    const theme = THEMES.login && THEMES.login[genderTheme || 'mujer'] || { primary: '#FA9DA6', secondary: '#FBCCD4', background: '#FFE4EC', accent: '#8EB694' };

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoginError('');
      if (!loginEmail || !loginPassword) { setLoginError('Completa todos los campos'); return; }
      setLoginIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
        if (error || !data?.user) {
          localStorage.removeItem('loginStreakState');
          localStorage.removeItem('loginStreak');
          sessionStorage.setItem('safetyLoveFreshLogin', 'true');
          setUserId(Date.now().toString());
          setUserName(loginEmail.split('@')[0] || 'Usuario');
          setCurrentView('userDash');
          setShowWelcome(true);
          setTimeout(() => { setShowWelcome(false); setIsWelcomeLeaving(true); setTimeout(() => setIsWelcomeLeaving(false), 500); }, 2000);
          setLoginIsLoading(false);
          return;
        }
      } catch (err) {
        localStorage.removeItem('loginStreakState');
        localStorage.removeItem('loginStreak');
        sessionStorage.setItem('safetyLoveFreshLogin', 'true');
        setUserId(Date.now().toString());
        setUserName(loginEmail.split('@')[0] || 'Usuario');
        setCurrentView('userDash');
        setShowWelcome(true);
        setTimeout(() => { setShowWelcome(false); setIsWelcomeLeaving(true); setTimeout(() => setIsWelcomeLeaving(false), 500); }, 2000);
      }
      localStorage.removeItem('loginStreakState');
      localStorage.removeItem('loginStreak');
      sessionStorage.setItem('safetyLoveFreshLogin', 'true');
      setLoginIsLoading(false);
    };

    const handleRegisterInline = async (e) => {
      e.preventDefault();
      setRegError('');
      if (!regName || !regEmail || !regPassword || !regConfirmPassword) { setRegError('Completa todos los campos'); return; }
      if (regPassword.length < 6) { setRegError('La contraseña debe tener al menos 6 caracteres'); return; }
      if (regPassword !== regConfirmPassword) { setRegError('Las contraseñas no coinciden'); return; }
      setRegIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { name: regName, role: regRole, gender_theme: genderTheme || 'mujer' } } });
        if (error || !data?.user) {
          setUserId(Date.now().toString());
          setUserName(regName);
          setRole(regRole);
          setGenderTheme(genderTheme || 'mujer');
          setAvatarEditStep(0);
          setAvatarEditGender('mujer');
          setCurrentView('avatarEdit');
          setRegIsLoading(false);
          return;
        }
        setUserId(data.user.id);
        setUserName(regName);
        setRole(regRole);
        setGenderTheme(genderTheme || 'mujer');
        setAvatarEditStep(0);
        setAvatarEditGender('mujer');
        setCurrentView('avatarEdit');
      } catch (err) {
        setUserId(Date.now().toString());
        setUserName(regName);
        setRole(regRole);
        setGenderTheme(genderTheme || 'mujer');
        setAvatarEditStep(0);
        setAvatarEditGender('mujer');
        setCurrentView('avatarEdit');
      }
      setRegIsLoading(false);
    };

    const FieldInput = ({ label, type = 'text', value, onChange, placeholder }) => (
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-pink-200 focus:border-transparent placeholder:text-gray-300"
        />
      </div>
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${theme.background}40` }}>
        <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-xl px-12 py-16 sm:px-16 sm:py-20 relative overflow-hidden">
          {/* Círculo decorativo de fondo */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: theme.primary }}></div>

          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div
              className="flex items-center justify-center rounded-3xl shadow-sm"
              style={{ backgroundColor: theme.secondary, width: '80px', height: '80px' }}
            >
              <Heart fill={theme.primary} color={theme.primary} size={40} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-800 tracking-tight">
              Safety<span style={{ color: theme.primary }}>Love</span>
            </h1>
          </div>

          {authMode === 'login' ? (
            <motion.div key="login-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-700">Bienvenido de nuevo</h2>
                <p className="text-sm text-gray-500 mt-1">Tu espacio seguro para entender tus emociones.</p>
              </div>

              {/* Selector de Rol */}
              <div className="flex bg-gray-50 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setRegRole('adolescente')}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${regRole === 'adolescente' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
                >Soy Adolescente</button>
                <button
                  type="button"
                  onClick={() => setRegRole('psicologo')}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${regRole === 'psicologo' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
                >Soy Psicólogo</button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 p-2.5 rounded-lg">{loginError}</p>}

                <div className="relative">
                  <Mail className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginIsLoading}
                  className="w-full text-white font-semibold rounded-2xl py-4 mt-3 text-base transition-transform active:scale-95 shadow-md disabled:opacity-50"
                  style={{ backgroundColor: regRole === 'adolescente' ? theme.primary : theme.accent }}
                >{loginIsLoading ? 'Cargando...' : 'Entrar'}</button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  ¿No tienes una cuenta?{' '}
                  <button type="button" onClick={() => { setRegError(''); setAuthMode('register'); }} className="font-semibold" style={{ color: theme.primary }}>
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="register-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <button type="button" onClick={() => { setLoginError(''); setAuthMode('login'); }} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 text-sm">
                ← Volver
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Crea tu cuenta</h2>
                <p className="text-sm text-gray-500 mt-2">Únete a nuestra comunidad de apoyo.</p>
              </div>

              <form className="space-y-6" onSubmit={handleRegisterInline}>
                <div className="flex bg-gray-50 p-1 rounded-2xl mb-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('adolescente')}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${regRole === 'adolescente' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
                  >Soy Adolescente</button>
                  <button
                    type="button"
                    onClick={() => setRegRole('psicologo')}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${regRole === 'psicologo' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
                  >Soy Psicólogo</button>
                </div>

                {regError && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 p-2.5 rounded-lg">{regError}</p>}

                <div className="relative">
                  <User className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-5 top-[22px] text-gray-400" size={20} />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-5 text-base text-gray-700 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={regIsLoading}
                  className="w-full text-white font-semibold rounded-2xl py-4 mt-3 text-base transition-transform active:scale-95 shadow-md disabled:opacity-50"
                  style={{ backgroundColor: regRole === 'adolescente' ? theme.primary : theme.accent }}
                >{regIsLoading ? 'Cargando...' : 'Registrarse'}</button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // --- REGISTER PAGE ---
  if (currentView === 'register') {
    const theme = THEMES.login && THEMES.login[genderTheme || 'mujer'] || { primary: '#FA9DA6', secondary: '#FBCCD4', background: '#FFE4EC', accent: '#8EB694' };

    const handleRegister = async (e) => {
      e.preventDefault();
      setRegError('');
      if (!regName || !regEmail || !regPassword) { setRegError('Completa todos los campos'); return; }
      if (regPassword.length < 6) { setRegError('La contraseña debe tener al menos 6 caracteres'); return; }
      setRegIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { name: regName, role: regRole, gender_theme: genderTheme || 'mujer' } } });
        if (error) {
          setUserId(Date.now().toString());
          setUserName(regName);
          setRole(regRole);
          setGenderTheme(genderTheme || 'mujer');
          setAvatarEditStep(0);
          setAvatarEditGender('mujer');
          setCurrentView('avatarEdit');
          setRegIsLoading(false);
          return;
        }
        if (data?.user) {
          setUserId(data.user.id);
          setUserName(regName);
          setRole(regRole);
          setGenderTheme(genderTheme || 'mujer');
          setAvatarEditStep(0);
          setAvatarEditGender('mujer');
          setCurrentView('avatarEdit');
        }
      } catch (err) {
        setUserId(Date.now().toString());
        setUserName(regName);
        setRole(regRole);
        setGenderTheme(genderTheme || 'mujer');
        setAvatarEditStep(0);
        setAvatarEditGender('mujer');
        setCurrentView('avatarEdit');
      }
      setRegIsLoading(false);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: theme.background }}>
        {/* ===== LOGO & WELCOME MESSAGE ===== */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Safety Love" className="h-20 w-20 object-contain" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
            Únete a Safety Love
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-2">
            Crea tu cuenta para acceder a tu espacio seguro
          </p>
        </motion.div>

        {/* ===== REGISTER CARD ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-3xl p-8 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{t('crear_cuenta')}</h2>
            
            <form onSubmit={handleRegister}>
              {regError && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 p-2.5 rounded-lg mb-4">{regError}</p>}
              
              <AppInput label={t('nombre')} value={regName} onChange={e => setRegName(e.target.value)} placeholder="Tu nombre" />
              
              <AppInput label={t('correo')} type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="correo@ejemplo.com" />
              
              <AppInput label={t('contrasenia')} type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
              
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Rol</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setRegRole('adolescente')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${regRole === 'adolescente' ? 'border-pink-200' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    style={regRole === 'adolescente' ? { backgroundColor: '#FFF0F3', color: theme.primary } : { backgroundColor: '#fff' }}
                  >Adolescente</button>
                  <button type="button" onClick={() => setRegRole('psicologo')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${regRole === 'psicologo' ? 'border-blue-200' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    style={regRole === 'psicologo' ? { backgroundColor: '#EFF6FF', color: '#5B97FC' } : { backgroundColor: '#fff' }}
                  >Psicólogo</button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-7 leading-relaxed">
                Al registrarte aceptas nuestros{' '}
                <button type="button" className="font-semibold text-pink-400 hover:text-pink-500 transition cursor-pointer">términos</button>
                {' '}y{' '}
                <button type="button" className="font-semibold text-pink-400 hover:text-pink-500 transition cursor-pointer">política de privacidad</button>.
              </p>
              
              <motion.button type="submit" disabled={regIsLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: theme.primary }}
              >{regIsLoading ? 'Cargando...' : t('registrate')}</motion.button>
            </form>
          </div>

          {/* ===== LOGIN LINK ===== */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-600">
              {t('ya_tienes_cuenta')}{' '}
              <button type="button" onClick={() => setCurrentView('login')} className="font-bold text-pink-500 hover:text-pink-600 transition cursor-pointer">
                {t('iniciar_sesion')}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // --- AVATAR EDIT ---
  if (currentView === 'avatarEdit') {
    const theme = avatarEditGender === 'hombre'
      ? { primary: '#5B97FC', secondary: '#1E293B', background: '#0F172A', accent: '#85B3FF' }
      : { primary: '#FA9DA6', secondary: '#FBCCD4', background: '#FFE4EC', accent: '#8EB694' };

    const handleAvatarEditNext = () => {
      if (avatarEditStep === 0) {
        setGenderTheme(avatarEditGender);
        setAvatarEditStep(1);
      }
    };

    const handleAvatarEditFinish = async () => {
      setGenderTheme(avatarEditGender);
      setUserAvatar(getCustomAvatarUrl(avatarEditOptions));
      if (userId) {
        try { 
          await supabase.from('profiles').upsert({ 
            id: userId, 
            name: userName, 
            email: '', 
            role: role, 
            gender_theme: avatarEditGender, 
            avatar: getCustomAvatarUrl(avatarEditOptions), 
            mascot_type: mascotType, 
            onboarding_completed: false 
          }); 
        } catch(e) {}
      }
      setCurrentView('userDash');
      setShowWelcome(true);
      setTimeout(() => { 
        calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      setTimeout(() => { setShowWelcome(false); setIsWelcomeLeaving(true); setTimeout(() => setIsWelcomeLeaving(false), 500); }, 2500);
    };

    const handleAvatarOptionChange = (key, value) => {
      setAvatarEditOptions(prev => ({ ...prev, [key]: value }));
    };

    const clothingOptions = ['hoodie', 'shirt', 'polo', 'sweater', 'dress', 'overall'];
    const topOptions = ['noHair', 'shortHair', 'longButNotTooLong', 'straight01', 'dreads01', 'frizzle', 'shaggy01', 'shaggy02'];
    const eyeOptions = ['happy', 'winkWacky', 'squint', 'close', 'default', 'side', 'surprised'];
    const mouthOptions = ['smile', 'tongue', 'laughing', 'sad', 'concerned', 'default', 'grinning', 'serious'];
    
    const skinColorOptions = [
      { hex: 'ffdbac', label: 'Claro' },
      { hex: 'f2ad95', label: 'Medio' },
      { hex: 'd08b5b', label: 'Oscuro' },
      { hex: 'ae5d4e', label: 'M. Oscuro' }
    ];
    const hairColorOptions = [
      { hex: '2c2c2c', label: 'Negro' },
      { hex: '6d4c41', label: 'Café' },
      { hex: 'a0826d', label: 'Castaño' },
      { hex: 'blond01', label: 'Rubio' },
      { hex: 'ff0000', label: 'Rojo' },
      { hex: '8b4513', label: 'Marrón' }
    ];
    const clothesColorOptions = [
      { hex: '262e33', label: 'Negro' },
      { hex: 'ffffff', label: 'Blanco' },
      { hex: 'FF69B4', label: 'Rosa' },
      { hex: '4169E1', label: 'Azul' },
      { hex: 'FFD700', label: 'Oro' },
      { hex: '00CED1', label: 'Turquesa' }
    ];

    const steps = [
      <div key="gender" className="text-center px-4">
        <h2 className="text-2xl font-black mb-2" style={{ color: theme.primary }}>Elige tu género</h2>
        <p className="text-sm font-medium mb-8" style={{ color: `${theme.primary}AA` }}>Esto personalizará tu experiencia</p>
        
        <div className="space-y-4">
          <button onClick={() => setAvatarEditGender('mujer')} className={`w-full p-6 rounded-2xl transition-all cursor-pointer ${avatarEditGender === 'mujer' ? 'ring-2 shadow-lg scale-105' : 'bg-gray-50 hover:bg-gray-100'}`} style={avatarEditGender === 'mujer' ? { backgroundColor: `${theme.primary}20` } : {}}>
            <div className="text-4xl mb-2">👩</div>
            <p className="font-bold" style={{ color: theme.primary }}>Femenino</p>
            <p className="text-xs text-gray-500">Tema rosa</p>
          </button>
          
          <button onClick={() => setAvatarEditGender('hombre')} className={`w-full p-6 rounded-2xl transition-all cursor-pointer ${avatarEditGender === 'hombre' ? 'ring-2 shadow-lg scale-105' : 'bg-gray-50 hover:bg-gray-100'}`} style={avatarEditGender === 'hombre' ? { backgroundColor: '#5B97FC20' } : {}}>
            <div className="text-4xl mb-2">👨</div>
            <p className="font-bold" style={{ color: '#5B97FC' }}>Masculino</p>
            <p className="text-xs text-gray-500">Tema azul</p>
          </button>
        </div>
      </div>,
      
      <div key="customize" className="px-4 space-y-6 max-h-96 overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black mb-2" style={{ color: theme.primary }}>Personaliza tu avatar</h2>
          <p className="text-xs font-medium text-gray-500">Elige ropa, pelo, ojos y más</p>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-6 flex justify-center">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
            <UserAvatar url={getCustomAvatarUrl(avatarEditOptions)} />
          </div>
        </div>

        {/* Ropa */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">👕 Ropa</label>
          <div className="grid grid-cols-3 gap-2">
            {clothingOptions.map(opt => (
              <button key={opt} onClick={() => handleAvatarOptionChange('clothing', opt)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${avatarEditOptions.clothing === opt ? 'ring-2' : 'bg-gray-100 hover:bg-gray-200'}`}
                style={avatarEditOptions.clothing === opt ? { backgroundColor: `${theme.primary}20`, color: theme.primary } : {}}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Color de Ropa */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">🎨 Color de Ropa</label>
          <div className="grid grid-cols-3 gap-2">
            {clothesColorOptions.map(opt => (
              <button key={opt.hex} onClick={() => handleAvatarOptionChange('clothesColor', opt.hex)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border-2 ${avatarEditOptions.clothesColor === opt.hex ? 'ring-2' : 'border-gray-200'}`}
                style={{ backgroundColor: `#${opt.hex}`, color: opt.hex === 'ffffff' ? '#000' : '#fff', borderColor: avatarEditOptions.clothesColor === opt.hex ? theme.primary : '#e5e7eb' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pelo */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">💇 Pelo</label>
          <div className="grid grid-cols-3 gap-2">
            {topOptions.map(opt => (
              <button key={opt} onClick={() => handleAvatarOptionChange('top', opt)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all truncate ${avatarEditOptions.top === opt ? 'ring-2' : 'bg-gray-100 hover:bg-gray-200'}`}
                style={avatarEditOptions.top === opt ? { backgroundColor: `${theme.primary}20`, color: theme.primary } : {}}
              >
                {opt.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Color de Pelo */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">🎨 Color de Pelo</label>
          <div className="grid grid-cols-3 gap-2">
            {hairColorOptions.map(opt => (
              <button key={opt.hex} onClick={() => handleAvatarOptionChange('hairColor', opt.hex)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border-2 ${avatarEditOptions.hairColor === opt.hex ? 'ring-2' : 'border-gray-200'}`}
                style={{ backgroundColor: `#${opt.hex}`, color: '#fff', borderColor: avatarEditOptions.hairColor === opt.hex ? theme.primary : '#e5e7eb' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color de Piel */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">🤎 Color de Piel</label>
          <div className="grid grid-cols-4 gap-2">
            {skinColorOptions.map(opt => (
              <button key={opt.hex} onClick={() => handleAvatarOptionChange('skinColor', opt.hex)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border-2 ${avatarEditOptions.skinColor === opt.hex ? 'ring-2' : 'border-gray-200'}`}
                style={{ backgroundColor: `#${opt.hex}`, borderColor: avatarEditOptions.skinColor === opt.hex ? theme.primary : '#e5e7eb' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ojos */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">👁️ Ojos</label>
          <div className="grid grid-cols-3 gap-2">
            {eyeOptions.map(opt => (
              <button key={opt} onClick={() => handleAvatarOptionChange('eyes', opt)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${avatarEditOptions.eyes === opt ? 'ring-2' : 'bg-gray-100 hover:bg-gray-200'}`}
                style={avatarEditOptions.eyes === opt ? { backgroundColor: `${theme.primary}20`, color: theme.primary } : {}}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Boca */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">👄 Boca</label>
          <div className="grid grid-cols-3 gap-2">
            {mouthOptions.map(opt => (
              <button key={opt} onClick={() => handleAvatarOptionChange('mouth', opt)} 
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${avatarEditOptions.mouth === opt ? 'ring-2' : 'bg-gray-100 hover:bg-gray-200'}`}
                style={avatarEditOptions.mouth === opt ? { backgroundColor: `${theme.primary}20`, color: theme.primary } : {}}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: theme.background }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl"
        >
          {steps[avatarEditStep]}
          
          <div className="flex items-center justify-between mt-8">
            <button onClick={() => avatarEditStep > 0 ? setAvatarEditStep(avatarEditStep - 1) : setCurrentView('login')} 
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600 transition cursor-pointer">
              Atrás
            </button>
            
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === avatarEditStep ? 'w-6' : ''}`} 
                  style={{ backgroundColor: i === avatarEditStep ? theme.primary : '#E5E7EB' }}>
                </div>
              ))}
            </div>
            
            {avatarEditStep < steps.length - 1 ? (
              <button onClick={handleAvatarEditNext} 
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer" 
                style={{ backgroundColor: theme.primary }}>
                Siguiente
              </button>
            ) : (
              <button onClick={handleAvatarEditFinish} 
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer" 
                style={{ backgroundColor: theme.accent }}>
                ¡Listo!
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- ONBOARDING ---
  if (currentView === 'onboarding') {
    const theme = genderTheme === 'hombre'
      ? { primary: '#5B97FC', secondary: '#1E293B', background: '#0F172A', accent: '#85B3FF' }
      : { primary: '#FA9DA6', secondary: '#FBCCD4', background: '#F3E2C6', accent: '#8EB694' };

    const handleFinishOnboarding = async () => {
      setGenderTheme(genderTheme || 'mujer');
      setUserAvatar(onboardingSelectedAvatar);
      if (userId) {
        try { await supabase.from('profiles').update({ avatar: onboardingSelectedAvatar, gender_theme: genderTheme || 'mujer', mascot_type: mascotType, onboarding_completed: true }).eq('id', userId); } catch(e) {}
      }
      setCurrentView('userDash');
      setShowWelcome(true);
      setTimeout(() => { setShowWelcome(false); setIsWelcomeLeaving(true); setTimeout(() => setIsWelcomeLeaving(false), 500); }, 2500);
    };

    const steps = [
      <div key="welcome" className="text-center px-4">
        <img src="/logo.png" alt="Safety Love" className="h-28 w-28 mx-auto mb-6 object-contain" />
        <h2 className="text-2xl font-black mb-2" style={{ color: theme.primary }}>ñBienvenido a Safety Love!</h2>
        <p className="text-sm font-medium" style={{ color: `${theme.primary}AA` }}>Tu espacio seguro para expresarte, crecer y sanar. Personalicemos tu experiencia.</p>
      </div>,
      <div key="avatar" className="px-4">
        <h3 className="text-lg font-black text-center mb-4" style={{ color: theme.primary }}>Elige tu avatar</h3>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map((a, i) => (
            <button key={i} onClick={() => setOnboardingSelectedAvatar(a)} className={`p-3 rounded-2xl transition-all cursor-pointer ${onboardingSelectedAvatar === a ? 'ring-2 shadow-lg scale-105' : 'bg-gray-50 hover:bg-gray-100'}`} style={onboardingSelectedAvatar === a ? { backgroundColor: `${theme.primary}20` } : {}}>
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white">
                <img src={a} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      </div>,
      <div key="mascot" className="px-4">
        <h3 className="text-lg font-black text-center mb-4" style={{ color: theme.primary }}>Elige tu mascota</h3>
        <div className="grid grid-cols-3 gap-3">
          {['vaca', 'gato', 'oso'].map((type) => {
            const imgs = { vaca: '/assets/dog.png', gato: '/assets/cat.png', oso: '/assets/bird.png' };
            const names = { vaca: 'Luna 🏠', gato: 'Oliver 🏠', oso: 'Pip 🏠' };
            return (
              <button key={type} onClick={() => setMascotType(type)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer ${mascotType === type ? 'ring-2 shadow-lg scale-105' : 'bg-gray-50 hover:bg-gray-100'}`} style={mascotType === type ? { backgroundColor: `${theme.primary}20` } : {}}>
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-gray-100 shadow-sm">
                  <img src={imgs[type]} alt={names[type]} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold" style={{ color: theme.primary }}>{names[type]}</span>
              </button>
            );
          })}
        </div>
      </div>,
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: theme.background }}>
        <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-xl">
          {steps[step]}
          <div className="flex items-center justify-between mt-8">
            <button onClick={() => step > 0 ? setOnboardingStep(step - 1) : goTo('login')} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600 transition cursor-pointer">Atrñs</button>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'w-6' : ''}`} style={{ backgroundColor: i === step ? theme.primary : '#E5E7EB' }}></div>))}
            </div>
            {onboardingStep < steps.length - 1 ? (
              <button onClick={() => setOnboardingStep(step + 1)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer" style={{ backgroundColor: theme.primary }}>Siguiente</button>
            ) : (
              <button onClick={handleFinishOnboarding} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer" style={{ backgroundColor: theme.accent }}>ñComenzar!</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- USER DASHBOARD ---
  if (currentView === 'userDash') {
    const theme = THEMES.userDash || THEMES.mujer;
    const dateStr = new Date().toISOString().slice(0, 10);

    const COLORS = {
      bgApp: '#FFF9F0',
      pinkLight: '#FFD6E0',
      pinkStrong: '#FFB3C6',
      greenLight: '#D1F4D9',
      orangeLight: '#FFE8D1',
    };

    return (
      <div className="min-h-screen font-sans pb-24 pl-20" style={{ backgroundColor: COLORS.bgApp }}>
        {/* HEADER / NAVBAR */}
        <header className="flex justify-between items-center py-6 px-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: COLORS.pinkStrong }}>
              <Heart fill="white" color="white" size={20} />
            </div>
            <span className="font-bold tracking-widest text-sm text-gray-800">SAFETY LOVE</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative h-8 w-8 rounded-full bg-transparent" />
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E2E8F0] border-2 border-white shadow-sm cursor-pointer" onClick={() => goTo('profile')}>
              <UserAvatar url={userAvatar} />
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6">
          {/* HERO SECTION */}
          <section className="text-center mt-8 mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {userName ? `Hola, ${userName}` : 'Safety Love'}
            </h1>
            <p className="text-gray-500 mb-6 text-lg">Un espacio seguro para sanar el corazón</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide" style={{ backgroundColor: COLORS.pinkLight, color: '#D85C7B' }}>EMPATÍA</span>
              <span className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide" style={{ backgroundColor: COLORS.greenLight, color: '#4E9F5D' }}>CRECIMIENTO</span>
              <span className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide" style={{ backgroundColor: COLORS.orangeLight, color: '#D48A43' }}>PAZ</span>
            </div>
          </section>

          {/* CALENDAR SECTION */}
          <section ref={calendarRef} id="calendar" className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm relative mb-20">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800">¿Cómo te has sentido?</h2>
              <div className="flex items-center gap-6 bg-[#F8FAFC] px-5 py-2.5 rounded-full">
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else { setCurrentMonth(currentMonth - 1); } }} className="text-gray-400 hover:text-gray-700 transition">
                  <ChevronLeft size={18} strokeWidth={3} />
                </button>
                <span className="font-bold text-gray-700 text-sm">{MONTH_NAMES[currentMonth]} {currentYear}</span>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else { setCurrentMonth(currentMonth + 1); } }} className="text-gray-400 hover:text-gray-700 transition">
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-8 gap-x-2 text-center relative z-0">
              {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day) => (
                <div key={day} className="text-[11px] font-bold text-gray-400 mb-2">{day}</div>
              ))}

              {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                <div key={`e${i}`} />
              ))}

              {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }).map((_, day) => {
                const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
                const mood = moodEntries[dStr];
                const isToday = dStr === dateStr;

                const moodPalettes = [
                  { bg: COLORS.greenLight, dot: '#4E9F5D', textColor: 'text-gray-800' },
                  { bg: COLORS.pinkStrong, dot: '#FFFFFF', textColor: 'text-white' },
                  { bg: COLORS.pinkLight, dot: '#D85C7B', textColor: 'text-gray-800' },
                  { bg: COLORS.orangeLight, dot: '#D48A43', textColor: 'text-gray-800' },
                ];
                const palette = mood ? moodPalettes[(mood.intensity || 1) % moodPalettes.length] : null;

                const handleClick = () => {
                  setSelectedDate(dStr);
                  setTempMood({ emoji: mood?.emoji || '\u{1F60A}', description: mood?.description || '' });
                  setIsMoodModalOpen(true);
                };

                if (palette) {
                  return (
                    <button key={day} onClick={handleClick} className="relative cursor-pointer">
                      <div className="absolute inset-0 rounded-2xl -m-2 z-[-1] shadow-sm" style={{ backgroundColor: palette.bg }}></div>
                      <div className={`text-sm font-bold py-4 ${palette.textColor} ${isToday ? 'ring-2 ring-pink-300 rounded-xl' : ''}`}>
                        {day + 1}
                        {mood.emoji ? (
                          <div className="text-base mt-1">{mood.emoji}</div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full mx-auto mt-2" style={{ backgroundColor: palette.dot }}></div>
                        )}
                      </div>
                    </button>
                  );
                }

                return (
                  <button key={day} onClick={handleClick} className={`text-sm font-bold py-4 rounded-xl transition cursor-pointer ${isToday ? 'text-pink-500 ring-2 ring-pink-300' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {day + 1}
                    <div className="w-1 h-1 bg-gray-300 rounded-full mx-auto mt-2"></div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs lg:text-sm text-gray-400 font-medium text-center mt-8">Toca un día para registrar cómo te sientes</p>


          </section>


        </main>

        <FloatingNav />
        {/* ===== MOOD MODAL ===== */}
        {isMoodModalOpen && (
          <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsMoodModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl shadow-xl p-6 lg:p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm lg:text-base text-gray-400 font-medium">{selectedDate}</p>
                <button onClick={() => setIsMoodModalOpen(false)} className="text-gray-300 hover:text-gray-500 transition"><X size={18} /></button>
              </div>
              <div className="flex gap-3 lg:gap-4 mb-5 justify-center">
                {MOOD_EMOJIS.map(emoji => (
                  <button key={emoji} onClick={() => setTempMood({ ...tempMood, emoji })}
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-2xl lg:text-3xl transition cursor-pointer ${tempMood.emoji === emoji ? 'scale-110 bg-pink-50 ring-2 ring-pink-200' : 'hover:bg-gray-50'}`}
                  >{emoji}</button>
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gray-400 font-medium">Intensidad:</span>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} onClick={() => setTempMood({ ...tempMood, intensity: i })}
                      className={`w-7 h-7 rounded-full transition cursor-pointer ${(tempMood.intensity || 2) >= i ? 'bg-pink-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                    ></button>
                  ))}
                </div>
              </div>
              <input type="text" value={tempMood.description} onChange={e => setTempMood({ ...tempMood, description: e.target.value })} placeholder="Describe cómo te sientes..." className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none mb-4" />
              <button onClick={() => { const newEntries = { ...moodEntries, [selectedDate]: { ...tempMood, intensity: tempMood.intensity || 2 } }; setMoodEntries(newEntries); setIsMoodModalOpen(false); setEmotionalStreak(prev => prev + 1); setPetXp(prev => prev + 15); showToast('Ánimo registrado', 'Tu estado de ánimo ha sido guardado', 'heart'); if (userId) { try { supabase.from('mood_entries').upsert({ user_id: userId, date: selectedDate, emoji: tempMood.emoji, description: tempMood.description, intensity: tempMood.intensity || 2 }).then(); } catch(e) {} } }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 cursor-pointer shadow-sm" style={{ backgroundColor: theme.accent }}>Guardar</button>
            </motion.div>
          </div>
        )}

        <Mascot /><FloatingNav />
        <NotificationsModal />
      </div>
    );
  }

  // --- RECURSOS ---
  if (currentView === 'recursos') {
    const theme = THEMES.recursos || THEMES.mujer;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pl-20 lg:p-8 lg:pl-24 xl:p-10 xl:pl-28" style={{ backgroundColor: theme.bg }}>
        <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-4xl">
          <div className="mb-6 lg:mb-8 xl:mb-10 text-center">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black" style={{ color: theme.accent }}>{t('recursos')}</h1>
            <p className="text-sm lg:text-base xl:text-lg font-medium mt-1" style={{ color: `${theme.accent}AA` }}>Herramientas para tu bienestar</p>
          </div>
          <div className="space-y-4 lg:space-y-5">
            {/* MENSAJES PARA TI */}
            <button onClick={() => goTo('mensajes')} className="w-full bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl p-8 lg:p-10 text-center transition hover:shadow-lg cursor-pointer">
              <span className="text-6xl lg:text-7xl block mb-4">💌</span>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{t('mensajes_para_ti')}</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-5">Mensajes de apoyo para tu día</p>
              <p className="text-base font-bold text-green-700 hover:text-green-800">Ver más →</p>
            </button>
            
            {/* VERSÍCULO DE CONSUELO */}
            <button onClick={() => goTo('versiculos')} className="w-full bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl p-8 lg:p-10 text-center transition hover:shadow-lg cursor-pointer">
              <span className="text-6xl lg:text-7xl block mb-4">📖</span>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{t('versiculo_consuelo')}</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-5">Versículos de esperanza</p>
              <p className="text-base font-bold text-orange-700 hover:text-orange-800">Ver más →</p>
            </button>
            
            {/* BLOG ANÓNIMO */}
            <button onClick={() => goTo('blog')} className="w-full bg-gradient-to-br from-blue-200 to-cyan-200 rounded-2xl p-8 lg:p-10 text-center transition hover:shadow-lg cursor-pointer">
              <span className="text-6xl lg:text-7xl block mb-4">📝</span>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{t('blog_anonimo')}</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-5">Comparte tu historia</p>
              <p className="text-base font-bold text-blue-700 hover:text-blue-800">Ver más →</p>
            </button>

            {/* CHAT IA */}
            <button onClick={() => goTo('chat')} className="w-full bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl p-8 lg:p-10 text-center transition hover:shadow-lg cursor-pointer">
              <span className="text-6xl lg:text-7xl block mb-4">🤖</span>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{t('chat_ia')}</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-5">Conversa con nuestro asistente emocional</p>
              <p className="text-base font-bold text-rose-700 hover:text-rose-800">Ver más →</p>
            </button>
          </div>
        </div>
        <Mascot /><FloatingNav />
        <NotificationsModal />
      </div>
    );
  }

  // --- MENSAJES ---
  if (currentView === 'mensajes') {
    const theme = THEMES.mensajes || THEMES.mujer;
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const dailyIdx = dayOfYear % MOTIVATIONAL_MESSAGES.length;
    const msg = MOTIVATIONAL_MESSAGES[dailyIdx] || MOTIVATIONAL_MESSAGES[0];
    const isSaved = savedMessages.some(m => m.quote === msg.quote);

    const saveMessage = async () => {
      if (isSaved) {
        setSavedMessages(savedMessages.filter(m => m.quote !== msg.quote));
        if (userId) { try { await supabase.from('saved_messages').delete().eq('user_id', userId).eq('quote', msg.quote); } catch(e) {} }
        showToast('Eliminado', 'Mensaje eliminado de guardados', 'info');
      } else {
        const entry = { ...msg, id: Date.now(), user_id: userId, saved_at: new Date().toISOString() };
        setSavedMessages([...savedMessages, entry]);
        if (userId) { try { await supabase.from('saved_messages').insert(entry); } catch(e) {} }
        showToast('Guardado', 'Mensaje guardado en tu perfil', 'heart');
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pl-20 lg:p-8 lg:pl-24 xl:p-10 xl:pl-28" style={{ backgroundColor: '#F0FDF4' }}>
        <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6 xl:mb-8">
            <img src="/logo.png" alt="Safety Love" className="h-20 w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 object-contain" />
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-5">
              <div className="w-11 h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 shadow-sm flex-shrink-0 cursor-pointer" style={{ borderColor: theme.accent }} onClick={() => goTo('profile')}>
                <UserAvatar url={userAvatar} />
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-[2rem] lg:rounded-[2.5rem] xl:rounded-[3rem] shadow-xl overflow-hidden">
            <img src={msg.image} alt="" className="w-full h-48 lg:h-64 xl:h-80 object-cover" />
            <div className="p-6 lg:p-8 xl:p-10">
              <h2 className="text-xl lg:text-2xl xl:text-3xl font-black text-gray-800 mb-2 lg:mb-3 xl:mb-4">{msg.quote}</h2>
              <p className="text-sm lg:text-base xl:text-lg text-gray-500 leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-between mt-6 lg:mt-8 xl:mt-10 pt-4 lg:pt-5 xl:pt-6 border-t border-gray-50">
                <button onClick={saveMessage} className={`px-5 lg:px-6 xl:px-8 py-2.5 lg:py-3 xl:py-4 rounded-xl text-sm lg:text-base xl:text-lg font-bold transition cursor-pointer ${isSaved ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  {isSaved ? 'd Guardado' : '🏠 Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Mascot /><FloatingNav />
        <NotificationsModal />
      </div>
    );
  }

  // --- VERSICULOS ---
  if (currentView === 'versiculos') {
    const theme = THEMES.versiculos || THEMES.mujer;
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const dailyIdx = dayOfYear % BIBLE_VERSES.length;
    const verse = BIBLE_VERSES[dailyIdx] || BIBLE_VERSES[0];
    const isSaved = savedVerses.some(v => v.ref === verse.ref);

    const saveVerse = async () => {
      if (isSaved) {
        setSavedVerses(savedVerses.filter(v => v.ref !== verse.ref));
        if (userId) { try { await supabase.from('saved_verses').delete().eq('user_id', userId).eq('ref', verse.ref); } catch(e) {} }
        showToast('Eliminado', 'Versículo eliminado de guardados', 'info');
      } else {
        const entry = { ...verse, id: Date.now(), user_id: userId, saved_at: new Date().toISOString() };
        setSavedVerses([...savedVerses, entry]);
        if (userId) { try { await supabase.from('saved_verses').insert(entry); } catch(e) {} }
        showToast('Guardado', 'Versículo guardado en tu perfil', 'heart');
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pl-20 lg:p-8 lg:pl-24 xl:p-10 xl:pl-28" style={{ backgroundColor: '#FED7AA' }}>
        <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6 xl:mb-8">
            <img src="/logo.png" alt="Safety Love" className="h-32 w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40 object-contain drop-shadow-lg" />
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-5">
              <div className="w-11 h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 shadow-sm flex-shrink-0 cursor-pointer" style={{ borderColor: theme.accent }} onClick={() => goTo('profile')}>
                <UserAvatar url={userAvatar} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] xl:rounded-[3rem] shadow-xl p-8 lg:p-10 xl:p-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart fill="#F97316" color="#F97316" size={24} />
                <span className="font-extrabold text-2xl tracking-tight text-gray-900">Safety Love</span>
              </div>
              <span className="text-3xl lg:text-4xl xl:text-5xl mb-4 lg:mb-5 xl:mb-6 block">{"\u{1F4D6}"}</span>
              <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 leading-relaxed mb-4 lg:mb-5 xl:mb-6">"{verse.verse}"</p>
              <p className="text-sm lg:text-base xl:text-lg font-bold" style={{ color: theme.accent }}>— {verse.ref}</p>
            </div>
            <div className="mt-6 lg:mt-8 xl:mt-10 p-4 lg:p-6 xl:p-8 rounded-2xl lg:rounded-3xl" style={{ backgroundColor: `${theme.accent}10` }}>
              <p className="text-sm lg:text-base xl:text-lg text-gray-600 leading-relaxed">{verse.reflection}</p>
            </div>
            <div className="flex items-center justify-between mt-6 lg:mt-8 xl:mt-10 pt-4 lg:pt-5 xl:pt-6 border-t border-gray-50">
              <button onClick={saveVerse} className={`px-5 lg:px-6 xl:px-8 py-2.5 lg:py-3 xl:py-4 rounded-xl text-sm lg:text-base xl:text-lg font-bold transition cursor-pointer ${isSaved ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                {isSaved ? 'P Guardado' : '❤️  Guardar'}
              </button>
            </div>
          </div>
        </div>
        <Mascot /><FloatingNav />
        <NotificationsModal />
      </div>
    );
  }

  // --- CHAT ---
  if (currentView === 'chat') {
    return <ChatIA />;
  }
  if (currentView === 'chat_old') {
    const theme = THEMES.chat || THEMES.mujer;

    const botName = 'Zuri';
    const botRole = language === 'en' ? 'Your emotional fox companion' : 'Tu zorra emocional';

    const FoxAvatar = ({ size = 'full' }) => (
      <svg viewBox="0 0 200 240" className={`w-full h-full object-cover ${size === 'small' ? 'scale-90' : ''}`} style={{ filter: 'drop-shadow(0 2px 8px rgba(250,157,166,0.2))' }}>
        <path d="M25 195 C10 180 5 155 15 140 C22 130 30 135 28 150 C26 165 30 185 35 195Z" fill="#FB923C"/>
        <ellipse cx="100" cy="165" rx="50" ry="55" fill="#FB923C"/>
        <ellipse cx="100" cy="175" rx="35" ry="37" fill="white" opacity="0.2"/>
        <ellipse cx="100" cy="180" rx="28" ry="30" fill="#FED7AA"/>
        <motion.g
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 70px' }}
        >
          <path d="M50 95 L35 45 L60 80Z" fill="#FB923C" stroke="#F97316" strokeWidth="1.5"/>
          <path d="M42 60 L48 78 L55 75Z" fill="#FED7AA"/>
        </motion.g>
        <motion.g
          animate={{ rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '130px 70px' }}
        >
          <path d="M150 95 L165 45 L140 80Z" fill="#FB923C" stroke="#F97316" strokeWidth="1.5"/>
          <path d="M158 60 L152 78 L145 75Z" fill="#FED7AA"/>
        </motion.g>
        <ellipse cx="100" cy="115" rx="48" ry="42" fill="#FB923C"/>
        <ellipse cx="100" cy="128" rx="28" ry="23" fill="#FEF3C7"/>
        <ellipse cx="82" cy="110" rx="10" ry="12" fill="white"/>
        <ellipse cx="118" cy="110" rx="10" ry="12" fill="white"/>
        <ellipse cx="85" cy="110" rx="5.5" ry="6.5" fill="#333"/>
        <ellipse cx="121" cy="110" rx="5.5" ry="6.5" fill="#333"/>
        <ellipse cx="87" cy="108" rx="2" ry="2" fill="white"/>
        <ellipse cx="123" cy="108" rx="2" ry="2" fill="white"/>
        <ellipse cx="65" cy="122" rx="7" ry="4" fill="#FCA5A5" opacity="0.5"/>
        <ellipse cx="135" cy="122" rx="7" ry="4" fill="#FCA5A5" opacity="0.5"/>
        <ellipse cx="100" cy="128" rx="5" ry="4" fill="#EA580C"/>
        <path d="M42 55 Q50 62 58 55" stroke="#EA580C" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    );

    const handleSendChat = async (e) => {
      e?.preventDefault();
      if (!chatInput.trim() && !chatFile) return;
      const userMsg = { id: Date.now(), role: 'user', content: chatInput, file: chatFile ? URL.createObjectURL(chatFile) : null, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setChatFile(null);
      setTimeout(() => {
        const botReply = language === 'en'
          ? '"Hey! Thanks for talking to me. I\'m here to listen and give you lots of love. Tell me more, friend!"'
          : '"\u00A1Hola! Gracias por hablar conmigo. Estoy aqu\u00ED para escucharte y darte mucho amor. \u00A1Cu\u00E9ntame m\u00E1s, amiga!"';
        const botMsg = { id: Date.now() + 1, role: 'assistant', content: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChatMessages(prev => [...prev, botMsg]);
      }, 1000);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pl-20 lg:p-8 lg:pl-24 xl:p-10 xl:pl-28" style={{ backgroundColor: theme.bg }}>
        <div className="w-full max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <div className="flex items-center justify-between mb-4 lg:mb-6 xl:mb-8">
            <img src="/logo.png" alt="Safety Love" className="h-20 w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 object-contain" />
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-5">
              <div className="w-11 h-11 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 shadow-sm flex-shrink-0 cursor-pointer" style={{ borderColor: theme.accent }} onClick={() => goTo('profile')}>
                <UserAvatar url={userAvatar} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] xl:rounded-[3rem] shadow-xl p-4 lg:p-6 xl:p-8 flex flex-col max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]">
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-5 mb-3 lg:mb-4 xl:mb-5 flex-shrink-0">
              <div className="w-10 h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-orange-50 flex-shrink-0">
                <FoxAvatar size="small" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-black" style={{ color: theme.accent }}>{botName}</h1>
                <p className="text-xs lg:text-sm xl:text-base text-gray-400 font-medium">{language === 'en' ? 'Your emotional companion' : 'Tu compa\u00F1ero emocional'}</p>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <button onClick={() => setShowChatHistory(true)} className="p-2 lg:p-3 xl:p-4 hover:bg-gray-100 rounded-xl transition cursor-pointer text-gray-400 hover:text-gray-600" title={language === 'en' ? 'Chat history' : 'Historial de chat'}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></button>
                <button onClick={() => {
                  if (chatMessages.length > 0) {
                    const label = chatMessages.find(m => m.role === 'user')?.content.slice(0, 40) || (language === 'en' ? 'Chat' : 'Chat') + ' ' + new Date().toLocaleDateString();
                    setChatHistory(prev => [{ id: Date.now(), label, messages: [...chatMessages], date: new Date().toISOString() }, ...prev]);
                  }
                  setChatMessages([]);
                  showToast('Nuevo chat', language === 'en' ? 'Previous chat saved' : 'Chat anterior guardado', 'info');
                }} className="p-2 lg:p-3 xl:p-4 hover:bg-gray-100 rounded-xl transition cursor-pointer text-gray-400 hover:text-green-500" title={language === 'en' ? 'New chat' : 'Nuevo chat'}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-5 xl:space-y-6 mb-3 lg:mb-4 xl:mb-5 min-h-0">
            {chatMessages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 lg:py-16 xl:py-20">
                <div className="w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full overflow-hidden border-2 border-white shadow-md bg-orange-50 mb-4 lg:mb-6 xl:mb-8">
                  <FoxAvatar />
                </div>
                <p className="font-bold text-gray-800 text-base lg:text-lg xl:text-xl">{botName} {language === 'en' ? 'How are you feeling today?' : '\u00BFC\u00F3mo te sientes hoy?'}</p>
                <p className="text-sm lg:text-base xl:text-lg text-gray-400 font-medium mt-1">{language === 'en' ? `Talk to me, I'm here to listen.` : 'H\u00E1blame, estoy aqu\u00ED para escucharte.'}</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 lg:p-5 xl:p-6 rounded-2xl lg:rounded-3xl shadow-sm ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} style={{ backgroundColor: msg.role === 'user' ? theme.accent : '#F3F4F6' }}>
                    {msg.file && <img src={msg.file} alt="compartido" className="w-full rounded-xl mb-2 max-h-48 lg:max-h-64 xl:max-h-80 object-cover" />}
                    <p className={`text-sm lg:text-base xl:text-lg leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>{msg.content}</p>
                    <p className={`text-[10px] lg:text-xs xl:text-sm mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendChat} className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-50 p-2 lg:p-3 xl:p-4 flex items-center gap-2 lg:gap-3 xl:gap-4">
            <button type="button" onClick={() => setShowChatEmojis(!showChatEmojis)} className="p-2 lg:p-3 xl:p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer"><Smile size={20} className="text-gray-400" /></button>
            <button type="button" onClick={() => document.getElementById('chat-file-input')?.click()} className="p-2 lg:p-3 xl:p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer"><Paperclip size={20} className="text-gray-400" /></button>
            <input id="chat-file-input" type="file" accept="image/*" onChange={e => setChatFile(e.target.files?.[0] || null)} className="hidden" />
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-gray-50 rounded-xl px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-4 text-sm lg:text-base xl:text-lg outline-none" />
            <button type="submit" disabled={!chatInput.trim() && !chatFile} className="p-2.5 lg:p-3 xl:p-4 rounded-xl text-white transition disabled:opacity-30 cursor-pointer" style={{ backgroundColor: theme.accent }}>
              <Send size={18} />
            </button>
          </form>
          {showChatEmojis && (
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-50 p-3 lg:p-4 xl:p-5 mt-2 lg:mt-3 xl:mt-4">
              <div className="flex flex-wrap gap-1.5 lg:gap-2 xl:gap-3 max-h-32 lg:max-h-40 xl:max-h-48 overflow-y-auto">
                {CHAT_EMOJIS.map((emoji, i) => (
                  <button key={i} onClick={() => { setChatInput(prev => prev + emoji); setShowChatEmojis(false); }} className="text-xl lg:text-2xl xl:text-3xl hover:scale-125 transition cursor-pointer">{emoji}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
        <Mascot /><FloatingNav />
        <NotificationsModal />
        {showChatHistory && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowChatHistory(false)}>
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-800">{language === 'en' ? 'Chat History' : 'Historial de chat'}</h3>
                <button onClick={() => setShowChatHistory(false)} className="p-1.5 hover:bg-gray-50 rounded-lg transition text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-400 font-medium text-sm">{language === 'en' ? 'No saved chats yet' : 'No hay chats guardados aún'}</p>
                  </div>
                ) : (
                  chatHistory.map(h => (
                    <div key={h.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition cursor-pointer" onClick={() => { setChatMessages(h.messages); setShowChatHistory(false); }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{h.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(h.date).toLocaleDateString()} ñ {h.messages.length} {language === 'en' ? 'messages' : 'mensajes'}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setChatHistory(prev => prev.filter(x => x.id !== h.id)); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-red-400 transition flex-shrink-0 ml-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PERFIL ---
  if (currentView === 'profile') {
    const ConfigSection = ({ title, icon, children }) => (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="flex items-center gap-2 font-bold mb-4 text-gray-700">{icon} {title}</h3>
        <div className="space-y-4">{children}</div>
      </div>
    );
    const Option = ({ icon, label }) => (
      <div className="flex justify-between items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    );
    const SwitchOption = ({ icon, label, active, onToggle }) => (
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <button onClick={onToggle} className={`w-10 h-6 rounded-full transition-colors relative ${active ? 'bg-pink-400' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
        </button>
      </div>
    );
    const [switches, setSwitches] = useState({
      modoOscuro: false, saludoAuto: true, recordatorioEscribir: true, recordatorioDiario: true,
      fraseDiaria: true, ejercicios: true, bloqueoPin: false, biometria: false,
      copiaSeguridad: true, notificaciones: true,
    });
    const toggleSwitch = (key) => setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
    const profileName = userName || 'Miguel Páez';
    const initials = profileName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div className="min-h-screen p-4 pl-20 pt-8" style={{ backgroundColor: '#fdfaf7' }}>
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-500 flex items-center gap-1">
                Personaliza tu experiencia en Safety Love
                <Heart size={14} fill="currentColor" className="text-pink-400" />
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-white/40" />
              <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700"><User size={20} /></button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">{initials}</div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">{profileName}</h2>
                <p className="text-pink-500 text-sm">Cada pequeño paso cuenta.</p>
                <button onClick={() => goTo('profile')} className="text-sm text-gray-400 flex items-center gap-1 mt-1"><User size={14} /> Editar perfil</button>
              </div>
            </div>

            <ConfigSection title="Cuenta" icon={<User size={18} />}>
              <Option icon={<ImageIcon size={16} />} label="Cambiar foto de perfil" />
              <Option icon={<Pencil size={16} />} label="Editar nombre" />
              <Option icon={<Mail size={16} />} label="Correo electrónico" />
              <Option icon={<Lock size={16} />} label="Cambiar contraseña" />
            </ConfigSection>

            <ConfigSection title="Apariencia" icon={<Palette size={18} />}>
              <SwitchOption icon={<Moon size={16} />} label="Modo oscuro" active={switches.modoOscuro} onToggle={() => toggleSwitch('modoOscuro')} />
              <Option icon={<Palette size={16} />} label="Color principal" />
              <Option icon={<Settings size={16} />} label="Tamaño de interfaz" />
              <Option icon={<TypeIcon size={16} />} label="Tamaño del texto" />
            </ConfigSection>

            <ConfigSection title="Safety Bot" icon={<Bot size={18} />}>
              <Option icon={<User size={16} />} label="Cambiar mascota" />
              <Option icon={<Volume2 size={16} />} label="Voz del bot" />
              <Option icon={<MessageCircle size={16} />} label="Estilo de conversación" />
              <SwitchOption icon={<Bot size={16} />} label="Saludo automático" active={switches.saludoAuto} onToggle={() => toggleSwitch('saludoAuto')} />
            </ConfigSection>

            <ConfigSection title="Bienestar" icon={<Heart size={18} />}>
              <SwitchOption label="Recordatorio para escribir" active={switches.recordatorioEscribir} onToggle={() => toggleSwitch('recordatorioEscribir')} />
              <SwitchOption label="Recordatorio del diario" active={switches.recordatorioDiario} onToggle={() => toggleSwitch('recordatorioDiario')} />
              <SwitchOption label="Frase motivacional diaria" active={switches.fraseDiaria} onToggle={() => toggleSwitch('fraseDiaria')} />
              <SwitchOption label="Ejercicios recomendados" active={switches.ejercicios} onToggle={() => toggleSwitch('ejercicios')} />
            </ConfigSection>

            <ConfigSection title="Privacidad" icon={<Shield size={18} />}>
              <SwitchOption icon={<Lock size={16} />} label="Bloquear con PIN" active={switches.bloqueoPin} onToggle={() => toggleSwitch('bloqueoPin')} />
              <SwitchOption icon={<Fingerprint size={16} />} label="Huella / Face ID" active={switches.biometria} onToggle={() => toggleSwitch('biometria')} />
              <SwitchOption icon={<Shield size={16} />} label="Copia de seguridad" active={switches.copiaSeguridad} onToggle={() => toggleSwitch('copiaSeguridad')} />
              <Option icon={<FileText size={16} />} label="Exportar diario" />
            </ConfigSection>

            <ConfigSection title="Notificaciones" icon={null}>
              <SwitchOption label="Activar notificaciones" active={switches.notificaciones} onToggle={() => toggleSwitch('notificaciones')} />
              <Option label="Horario silencioso" />
              <Option label="Frecuencia" />
            </ConfigSection>

            <ConfigSection title="Idioma" icon={<Globe size={18} />}>
              <Option label="Español" />
            </ConfigSection>

            <ConfigSection title="Acerca de" icon={<FileText size={18} />}>
              <Option label="Términos y condiciones" />
              <Option label="Política de privacidad" />
              <Option label="Contactar soporte" />
              <Option label="Calificar aplicación" />
            </ConfigSection>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-pink-50 rounded-2xl mb-4"></div>
              <button className="w-full bg-pink-200 text-pink-700 py-3 rounded-full font-bold flex items-center justify-center gap-2">
                <LogOut size={18} /> Cerrar sesión
              </button>
              <p className="text-xs text-gray-400 mt-4">Quédate con nosotros más tiempo</p>
            </div>
          </div>
        </div>
        <Mascot /><FloatingNav />
        <NotificationsModal />
      </div>
    );
  }

  return null;
}
