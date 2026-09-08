import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, Eye,
  ChevronRight, ChevronLeft, Activity, BarChart3, ArrowUpRight, ArrowDownRight,
  AlertTriangle, X, Heart, MessageCircle
} from 'lucide-react';

const STAT_CARDS = [
  { label: 'Predominante', value: 'Positivo', pct: '55%', change: '+6%', up: true, color: 'text-green-600 bg-green-50', ring: 'ring-green-200', emoji: '😀' },
  { label: null, value: 'Neutral', pct: '28%', change: '+4%', up: true, color: 'text-yellow-600 bg-yellow-50', ring: 'ring-yellow-200', emoji: '😐' },
  { label: null, value: 'Preocupación', pct: '15%', change: '+1%', up: true, color: 'text-orange-500 bg-orange-50', ring: 'ring-orange-200', emoji: '😟' },
  { label: null, value: 'En riesgo', pct: '5%', change: '-2%', up: false, color: 'text-red-500 bg-red-50', ring: 'ring-red-200', emoji: '😔' },
];

const EMOTIONS = [
  { label: 'Tranquilo', pct: 28, color: 'bg-blue-400' },
  { label: 'Satisfecho', pct: 22, color: 'bg-green-400' },
  { label: 'Preocupación', pct: 18, color: 'bg-orange-400' },
  { label: 'Neutro', pct: 14, color: 'bg-gray-400' },
  { label: 'Alegre', pct: 10, color: 'bg-pink-400' },
  { label: 'Ansiedad', pct: 5, color: 'bg-amber-500' },
  { label: 'Triste', pct: 3, color: 'bg-purple-400' },
];

const STUDENTS_FOLLOW = [
  { name: 'Miguel Álvarez', status: 'En riesgo', statusColor: 'bg-red-100 text-red-600', initials: 'MA', avatarBg: 'from-blue-300 to-blue-500',
    moods: { '2026-8-1': 'Feliz', '2026-8-3': 'Tranquilo', '2026-8-5': 'Triste', '2026-8-8': 'Feliz', '2026-8-10': 'Neutral', '2026-8-12': 'Tranquilo', '2026-8-15': 'Feliz', '2026-8-17': 'Enamorado', '2026-8-19': 'Tranquilo' },
    posts: [
      { title: 'Sobre la ansiedad', body: 'A veces siento que todo va muy rápido, pero estoy aprendiendo a calmarme.', time: 'Hace 2 días', likes: 12, comments: 3 },
      { title: 'Mi progreso', body: 'Hoy me sentí más tranquilo que ayer. Pequeños pasos cuentan.', time: 'Hace 5 días', likes: 8, comments: 2 },
    ]
  },
  { name: 'Sofía Martínez', status: 'Preocupada', statusColor: 'bg-orange-100 text-orange-600', initials: 'SM', avatarBg: 'from-pink-300 to-pink-500',
    moods: { '2026-8-2': 'Preocupada', '2026-8-4': 'Triste', '2026-8-7': 'Neutral', '2026-8-9': 'Preocupada', '2026-8-11': 'Triste', '2026-8-14': 'Neutral', '2026-8-16': 'Tranquilo', '2026-8-18': 'Feliz' },
    posts: [
      { title: 'Estrés académico', body: 'Las presiones de estudio me están afectando, pero busco ayuda.', time: 'Ayer', likes: 15, comments: 5 },
    ]
  },
  { name: 'Juan Camilo Ruiz', status: 'Sin registros', statusColor: 'bg-gray-100 text-gray-600', initials: 'JR', avatarBg: 'from-purple-300 to-purple-500',
    moods: {},
    posts: []
  },
  { name: 'Valeria Gómez', status: 'Estable', statusColor: 'bg-green-100 text-green-600', initials: 'VG', avatarBg: 'from-green-300 to-green-500',
    moods: { '2026-8-1': 'Feliz', '2026-8-3': 'Feliz', '2026-8-5': 'Tranquilo', '2026-8-8': 'Feliz', '2026-8-10': 'Feliz', '2026-8-12': 'Tranquilo', '2026-8-15': 'Feliz', '2026-8-17': 'Feliz', '2026-8-19': 'Feliz' },
    posts: [
      { title: 'Autoestima', body: 'He aprendido a valorarme más. La terapia me está ayudando mucho.', time: 'Hace 3 días', likes: 20, comments: 7 },
      { title: 'Relaciones sanas', body: 'Hoy entendí que establecer límites es un acto de amor propio.', time: 'Hace 1 semana', likes: 18, comments: 4 },
    ]
  },
];

function MiniLineChart() {
  const weeks = ['20 Jul', '27 Jul', '3 Ago', '10 Ago', '17 Ago'];
  const lines = [
    { label: 'Positivo', color: '#22C55E', data: [40, 42, 48, 52, 55] },
    { label: 'Neutral', color: '#EAB308', data: [30, 28, 26, 27, 28] },
    { label: 'Preocupación', color: '#F97316', data: [20, 22, 18, 16, 15] },
    { label: 'En riesgo', color: '#EF4444', data: [10, 8, 8, 5, 5] },
  ];

  const w = 600;
  const h = 160;
  const padL = 32;
  const padB = 24;
  const padT = 8;
  const padR = 10;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  return (
    <div className="flex flex-col">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = padT + chartH - (v / 100) * chartH;
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={w} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={padL - 4} y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400 font-semibold">{v}%</text>
            </g>
          );
        })}
        {/* X labels */}
        {weeks.map((wk, i) => {
          const x = padL + (i / (weeks.length - 1)) * chartW;
          return (
            <text key={wk} x={x} y={h - 2} textAnchor="middle" className="text-[8px] fill-gray-400 font-semibold">{wk}</text>
          );
        })}
        {/* Lines */}
        {lines.map((line) => {
          const pts = line.data.map((v, i) => {
            const x = padL + (i / (line.data.length - 1)) * chartW;
            const y = padT + chartH - (v / 100) * chartH;
            return `${x},${y}`;
          }).join(' ');
          return (
            <polyline key={line.label} points={pts} fill="none" stroke={line.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          );
        })}
      </svg>
      <div className="flex items-center gap-4 mt-2 px-8 pb-4">
        {lines.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] font-semibold text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeguimientoEmocionalSection() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [calMonth, setCalMonth] = useState(7);
  const [calYear, setCalYear] = useState(2026);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();

  const getMoodEmoji = (label) => {
    const moods = {
      'Feliz': '😊', 'Tranquilo': '😌', 'Neutral': '😐', 'Triste': '😢',
      'Enojado': '😠', 'Cansado': '😴', 'Enamorado': '😍', 'Estresado': '😩',
      'Preocupada': '😟', 'Preocupación': '😟'
    };
    return moods[label] || '😐';
  };

  const getMoodColor = (label) => {
    if (label === 'Feliz' || label === 'Enamorado') return '#D1F4D9';
    if (label === 'Tranquilo' || label === 'Cansado') return '#FFF3B0';
    if (label === 'Triste' || label === 'Enojado' || label === 'Preocupada') return '#FFB3C6';
    return '#F3F4F6';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-[22px] font-black text-slate-800 mb-1">Seguimiento emocional</h2>
            <p className="text-[13px] text-gray-400 font-semibold">Visualiza la evolución emocional y patrones de tus estudiantes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 px-4 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 flex items-center gap-2 hover:bg-gray-50 transition">
              Todos los estudiantes
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button className="h-9 px-4 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 flex items-center gap-2 hover:bg-gray-50 transition">
              Últimos 30 días
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        {/* ═══ Top Stats ═══ */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map((s) => (
            <div key={s.value} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[22px]">{s.emoji}</span>
                <span className="text-[15px] font-black text-slate-800">{s.value}</span>
              </div>
              <p className="text-[26px] font-black text-slate-800 leading-none mb-2">{s.pct}</p>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${s.up ? 'text-green-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {s.change} vs período anterior
              </div>
            </div>
          ))}
        </div>

        {/* ═══ Row 2: Chart ═══ */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-[14px] font-bold text-slate-800">Evolución emocional general</h3>
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="max-w-4xl">
              <MiniLineChart />
            </div>
          </div>
        </div>

        {/* ═══ Row 3: Emotions + Students ═══ */}
        <div className="grid grid-cols-2 gap-5 mb-6">

          {/* Most Frequent Emotions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-[14px] font-bold text-slate-800">Emociones más frecuentes</h3>
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <div className="space-y-3">
              {EMOTIONS.map((e) => (
                <div key={e.label} className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-gray-600 min-w-[90px]">{e.label}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${e.color} transition-all flex items-center justify-end pr-2`}
                         style={{ width: `${Math.max(e.pct, 8)}%` }}>
                      {e.pct >= 10 && <span className="text-[9px] font-bold text-white">{e.pct}%</span>}
                    </div>
                  </div>
                  {e.pct < 10 && <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{e.pct}%</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Students to Follow */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-slate-800">Estudiantes a seguir</h3>
              <button className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition">Ver todas</button>
            </div>
            <div className="space-y-3">
              {STUDENTS_FOLLOW.map((s, i) => (
                <div key={i} onClick={() => setSelectedStudent(s)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.avatarBg} flex items-center justify-center text-white text-[12px] font-bold shrink-0`}>
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-slate-800 truncate">{s.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.statusColor} shrink-0`}>{s.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 rounded-xl text-[11px] font-bold text-pink-500 hover:bg-pink-50 transition flex items-center justify-center gap-1">
              Ver todas las estudiantes <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* ═══ Important Notice ═══ */}
        <div className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-2xl border border-pink-100 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800 mb-1">Importante</p>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
              Si observas tendencias negativas considerables, evalúa priorizar por los estudiantes. <span className="text-pink-500 font-bold">No concetúes una evaluación profesional.</span>
            </p>
          </div>
        </div>

      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedStudent.avatarBg} flex items-center justify-center text-white text-[14px] font-bold`}>
                  {selectedStudent.initials}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">{selectedStudent.name}</h3>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${selectedStudent.statusColor}`}>{selectedStudent.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-72px)] p-6">
              {/* Calendar Section */}
              <div className="mb-6">
                <h4 className="text-[14px] font-bold text-slate-800 mb-3">Registro emocional</h4>
                <div className="bg-gray-50 rounded-2xl p-4">
                  {/* Month Nav */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <button onClick={() => setCalMonth(prev => prev === 0 ? 11 : prev - 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-pink-50 transition">
                      <ChevronLeft size={14} className="text-pink-500" />
                    </button>
                    <span className="text-[13px] font-bold text-slate-800">{monthNames[calMonth]} {calYear}</span>
                    <button onClick={() => setCalMonth(prev => prev === 11 ? 0 : prev + 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-pink-50 transition">
                      <ChevronRight size={14} className="text-pink-500" />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'].map(d => (
                      <div key={d} className="text-[9px] font-bold text-gray-400 text-center py-1">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const key = `${calYear}-${calMonth}-${day}`;
                      const mood = selectedStudent.moods[key];
                      return (
                        <div key={day} className="h-8 flex items-center justify-center relative">
                          {mood ? (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[14px]" style={{ backgroundColor: getMoodColor(mood) }}>
                              {getMoodEmoji(mood)}
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">{day}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Blog Posts Section */}
              <div>
                <h4 className="text-[14px] font-bold text-slate-800 mb-3">Publicaciones en Blog Anónimo</h4>
                {selectedStudent.posts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.posts.map((post, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-pink-100 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[14px] font-bold text-slate-800 mb-1.5">{post.title}</h5>
                            <p className="text-[13px] text-gray-500 leading-relaxed">{post.body}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                          <span className="text-[11px] text-gray-400 font-medium">{post.time}</span>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-pink-500 transition">
                              <Heart size={14} className="text-pink-400" />
                              <span className="font-medium">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-blue-500 transition">
                              <MessageCircle size={14} />
                              <span className="font-medium">{post.comments}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <MessageCircle size={20} className="text-gray-300" />
                    </div>
                    <p className="text-[13px] text-gray-400 font-medium">Este estudiante no tiene publicaciones aún.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
