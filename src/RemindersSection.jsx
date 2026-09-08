import React, { useState, useEffect, useRef } from 'react';
import {
  Droplet, Heart, BookOpen, Phone, Activity, Moon, Brain, Coffee,
  Sparkles, Smile, Dumbbell, Wind, ChevronDown, Plus, ChevronLeft,
  ChevronRight, Clock, LayoutList, CheckCircle2, Check, Trash2,
  Calendar as CalendarIcon, RefreshCw, X, Pencil
} from 'lucide-react';

function DatePickerCard({ newDateISO, dm, onConfirm, onClose }) {
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const [m, setM] = useState(() => {
    const parts = String(newDateISO || '').split('-').map(Number);
    return parts.length === 3 ? parts[1] - 1 : new Date().getMonth();
  });
  const [y, setY] = useState(() => {
    const parts = String(newDateISO || '').split('-').map(Number);
    return parts.length === 3 ? parts[0] : new Date().getFullYear();
  });
  const [selected, setSelected] = useState(newDateISO);

  const firstOffset = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => { if (m === 0) { setM(11); setY(y - 1); } else { setM(m - 1); } };
  const nextMonth = () => { if (m === 11) { setM(0); setY(y + 1); } else { setM(m + 1); } };

  const pick = (day) => {
    setSelected(`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
  };

  return (
    <div className="w-64 p-4 rounded-3xl shadow-2xl border" style={{ background: dm ? '#111A2D' : '#fff', borderColor: dm ? '#293A62' : '#E2E8F0' }}>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1 rounded-full transition" style={{ color: dm ? '#94A3B8' : '#64748B' }}><ChevronLeft size={16} /></button>
        <span className="text-sm font-extrabold" style={{ color: dm ? '#F8FAFC' : '#172033' }}>{MONTHS[m]} {y}</span>
        <button type="button" onClick={nextMonth} className="p-1 rounded-full transition" style={{ color: dm ? '#94A3B8' : '#64748B' }}><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 text-[10px] text-center gap-y-1 font-bold mb-2" style={{ color: dm ? '#475569' : '#94A3B8' }}>
        {['LU','MA','MI','JU','VI','SA','DO'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 text-[13px] text-center gap-y-1 font-bold">
        {[...Array(42)].map((_, i) => {
          const day = i - firstOffset + 1;
          const isValid = day > 0 && day <= daysInMonth;
          if (!isValid) return <div key={i}></div>;
          const iso = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isSelected = iso === selected;
          const isToday = day === today.getDate() && m === today.getMonth() && y === today.getFullYear();
          return (
            <button key={i} type="button" onClick={() => pick(day)}
              className="w-8 h-8 mx-auto rounded-full flex items-center justify-center transition"
              style={isSelected ? { background: '#F43F9E', color: '#fff', boxShadow: '0 4px 12px rgba(244,63,158,0.3)' } : isToday ? { color: '#F43F9E', border: '1px solid rgba(244,63,158,0.3)' } : { color: dm ? '#94A3B8' : '#334155' }}>
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mt-3">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-full text-xs font-bold transition" style={{ background: dm ? '#1A2540' : '#F1F5F9', color: dm ? '#94A3B8' : '#64748B' }}>
          Cancelar
        </button>
        <button type="button" onClick={() => onConfirm(selected)} className="flex-1 py-2 rounded-full text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition">
          Aceptar
        </button>
      </div>
    </div>
  );
}

function AnalogClockPicker({ hours, minutes, onChange, dm }) {
  const svgRef = useRef(null);

  const updateFromEvent = (clientX, clientY) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = clientX - rect.left - cx;
    const dy = clientY - rect.top - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(cx, cy) * 0.92;
    const degrees = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    if (dist < radius * 0.45) {
      const h = Math.round(degrees / 30) % 12;
      onChange({ hours: h, minutes });
    } else {
      const m = Math.round(degrees / 6) % 60;
      onChange({ hours, minutes: m });
    }
  };

  const hh = hours % 12;
  const hourAngle = (hh * 30 + minutes * 0.5) * Math.PI / 180;
  const minuteAngle = minutes * 6 * Math.PI / 180;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className="w-full h-full cursor-pointer select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => { e.preventDefault(); svgRef.current.setPointerCapture(e.pointerId); updateFromEvent(e.clientX, e.clientY); }}
      onPointerMove={(e) => { if (e.buttons === 1) updateFromEvent(e.clientX, e.clientY); }}
    >
      <circle cx="100" cy="100" r="96" fill={dm ? '#111A2D' : '#fff'} stroke={dm ? '#293A62' : '#E5E7EB'} strokeWidth="2" />
      {[...Array(12)].map((_, i) => {
        const ang = i * 30 * Math.PI / 180;
        return (
          <line key={`t${i}`} x1={100 + 82 * Math.sin(ang)} y1={100 - 82 * Math.cos(ang)}
            x2={100 + 90 * Math.sin(ang)} y2={100 - 90 * Math.cos(ang)}
            stroke={i % 3 === 0 ? (dm ? '#94A3B8' : '#9CA3AF') : (dm ? '#293A62' : '#D1D5DB')} strokeWidth={i % 3 === 0 ? 3 : 1.5} strokeLinecap="round" />
        );
      })}
      {[...Array(12)].map((_, i) => {
        const n = i === 0 ? 12 : i;
        const ang = i * 30 * Math.PI / 180;
        return (
          <text key={`n${i}`} x={100 + 70 * Math.sin(ang)} y={100 - 70 * Math.cos(ang) + 4.5}
            textAnchor="middle" fontSize="14" fontWeight="700" fill={dm ? '#F8FAFC' : '#374151'}>{n}</text>
        );
      })}
      <line x1="100" y1="100" x2={100 + 48 * Math.sin(hourAngle)} y2={100 - 48 * Math.cos(hourAngle)}
        stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="100" x2={100 + 74 * Math.sin(minuteAngle)} y2={100 - 74 * Math.cos(minuteAngle)}
        stroke={dm ? '#94A3B8' : '#1E293B'} strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill="#EC4899" />
    </svg>
  );
}

export default function RemindersSection({ darkMode }) {
  const dm = darkMode;
  const [activeTab, setActiveTab] = useState('Todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });
  const [newCategory, setNewCategory] = useState('Personal');
  const [selectedIcon, setSelectedIcon] = useState(null);

  const ICON_OPTIONS = [
    { id: 'droplet', label: 'Agua', icon: <Droplet size={18} />, color: 'text-blue-500 bg-blue-50', catColor: 'text-blue-600 bg-blue-50' },
    { id: 'heart', label: 'Amor', icon: <Heart size={18} />, color: 'text-pink-500 bg-pink-50', catColor: 'text-pink-600 bg-pink-50' },
    { id: 'book', label: 'Estudio', icon: <BookOpen size={18} />, color: 'text-green-500 bg-green-50', catColor: 'text-green-600 bg-green-50' },
    { id: 'phone', label: 'Llamada', icon: <Phone size={18} />, color: 'text-pink-500 bg-pink-50', catColor: 'text-pink-600 bg-pink-50' },
    { id: 'activity', label: 'Ejercicio', icon: <Activity size={18} />, color: 'text-blue-500 bg-blue-50', catColor: 'text-blue-600 bg-blue-50' },
    { id: 'moon', label: 'Dormir', icon: <Moon size={18} />, color: 'text-indigo-500 bg-indigo-50', catColor: 'text-indigo-600 bg-indigo-50' },
    { id: 'brain', label: 'Meditar', icon: <Brain size={18} />, color: 'text-purple-500 bg-purple-50', catColor: 'text-purple-600 bg-purple-50' },
    { id: 'coffee', label: 'Descanso', icon: <Coffee size={18} />, color: 'text-amber-500 bg-amber-50', catColor: 'text-amber-600 bg-amber-50' },
    { id: 'sparkles', label: 'Reflexión', icon: <Sparkles size={18} />, color: 'text-yellow-500 bg-yellow-50', catColor: 'text-yellow-600 bg-yellow-50' },
    { id: 'smile', label: 'Ánimo', icon: <Smile size={18} />, color: 'text-orange-500 bg-orange-50', catColor: 'text-orange-600 bg-orange-50' },
    { id: 'dumbbell', label: 'Fuerza', icon: <Dumbbell size={18} />, color: 'text-rose-500 bg-rose-50', catColor: 'text-rose-600 bg-rose-50' },
    { id: 'wind', label: 'Respirar', icon: <Wind size={18} />, color: 'text-teal-500 bg-teal-50', catColor: 'text-teal-600 bg-teal-50' },
  ];

  const formatDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const isTodayDate = (repeat) => {
    const match = String(repeat).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return false;
    const today = new Date();
    return Number(match[3]) === today.getFullYear() && Number(match[2]) === today.getMonth() + 1 && Number(match[1]) === today.getDate();
  };

  const addReminder = () => {
    if (!newTitle.trim()) return;
    const opt = selectedIcon || ICON_OPTIONS[0];
    const formattedDate = formatDate(newDate);
    const formattedTime = formatTime(newTime);
    setTasks(prev => [...prev, {
      id: Date.now(),
      text: newTitle.trim(),
      time: formattedTime,
      repeat: formattedDate,
      category: opt.label,
      color: opt.color,
      catColor: opt.catColor,
      icon: opt.icon,
      completed: false
    }]);
    setShowAddModal(false);
    setNewTitle('');
    setNewTime('10:00');
    const d = new Date();
    setNewDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
    setSelectedIcon(null);
  };

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerHours, setPickerHours] = useState(10);
  const [pickerMinutes, setPickerMinutes] = useState(0);

  const parseTime = (t) => {
    const [h, m] = String(t || '10:00').split(':').map(Number);
    return { h: isNaN(h) ? 10 : h, m: isNaN(m) ? 0 : m };
  };

  const openTimePicker = () => {
    const { h, m } = parseTime(newTime);
    setPickerHours(h);
    setPickerMinutes(m);
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    setNewTime(`${String(pickerHours).padStart(2,'0')}:${String(pickerMinutes).padStart(2,'0')}`);
    setShowTimePicker(false);
  };

  const openDatePicker = () => {
    setShowTimePicker(false);
    setShowDatePicker(true);
  };

  const confirmDate = (iso) => {
    setNewDate(iso);
    setShowDatePicker(false);
  };

  const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const WEEKDAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  const getTasksForDate = (day, month, year) => {
    const dateLabel = `${String(day).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;
    const weekday = WEEKDAY_NAMES[new Date(year, month, day).getDay()].toLowerCase().replace('é','e');
    return tasks.filter(t => {
      if (t.repeat === 'Diariamente') return true;
      if (t.repeat === dateLabel) return true;
      const parts = String(t.repeat).split(',');
      if (parts.length > 1) {
        return parts.some(p => p.trim().toLowerCase().replace('é','e') === weekday);
      }
      return false;
    });
  };

  const prevCalMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); }
  };
  const nextCalMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); }
  };

  const [tasks, setTasks] = useState([]);

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteReminder = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const totalPendientes = tasks.length;
  const completadas = tasks.filter(t => t.completed).length;
  const tareasHoy = tasks.filter(t => t.repeat === 'Diariamente' || isTodayDate(t.repeat)).length;
  const proximos = tasks.filter(t => !t.completed && t.repeat !== 'Diariamente' && !isTodayDate(t.repeat)).length;

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'Hoy') return t.repeat === 'Diariamente' || isTodayDate(t.repeat);
    if (activeTab === 'Próximos') return !t.completed;
    if (activeTab === 'Completadas') return t.completed;
    return true;
  });

  const progressPct = totalPendientes > 0 ? Math.round((completadas / totalPendientes) * 100) : 0;

  const pink = '#F43F9E';

  const cardBg = dm ? '#111A2D' : '#FFFFFF';
  const cardBorder = dm ? 'rgba(255,255,255,0.08)' : '#EEF2F7';
  const cardShadow = dm ? '0 8px 28px rgba(0,0,0,0.2)' : '0 8px 28px rgba(23,32,51,0.04)';
  const textPrimary = dm ? '#F8FAFC' : '#172033';
  const textSecondary = dm ? '#94A3B8' : '#64748B';

  return (
    <div className="min-h-full" style={{ background: dm ? '#070D1C' : '#F5F0E8' }}>
      <div className="mx-auto" style={{ maxWidth: '1380px', padding: '36px 48px 56px' }}>

        {/* ── HEADER ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between" style={{ marginBottom: '32px', gap: '20px' }}>
          <div>
            <h1 className="font-poppins font-extrabold tracking-tight" style={{ fontSize: '44px', color: textPrimary, lineHeight: 1.1, marginBottom: '8px' }}>
              Recordatorios
            </h1>
            <p style={{ fontSize: '17px', color: textSecondary }}>
              Mantén el equilibrio organizando tus pendientes.
            </p>
          </div>
          <div className="flex items-center" style={{ gap: '14px' }}>
            <div className="relative">
              <select
                className="appearance-none outline-none cursor-pointer font-semibold"
                style={{
                  height: '48px',
                  borderRadius: '14px',
                  padding: '0 40px 0 18px',
                  fontSize: '14px',
                  background: dm ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                  border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
                  color: dm ? '#CBD5E1' : '#475569',
                }}>
                <option>Personal</option>
                <option>Trabajo</option>
                <option>Salud</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: dm ? '#475569' : '#94A3B8' }} />
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center font-bold text-white transition-all duration-200"
              style={{
                height: '50px',
                padding: '0 24px',
                borderRadius: '16px',
                fontSize: '15px',
                background: pink,
                boxShadow: '0 6px 20px rgba(244,63,158,0.2)',
                gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#DB2777'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(244,63,158,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = pink; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,63,158,0.2)'; }}>
              <Plus size={18} /> Añadir recordatorio
            </button>
          </div>
        </header>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '20px', marginBottom: '28px' }}>
          {[
            { label: 'TOTAL', value: totalPendientes, sub: 'Tareas en lista', icon: <LayoutList size={18} style={{ color: pink }} />, accent: pink },
            { label: 'COMPLETADAS', value: completadas, sub: '¡Sigue así!', icon: <CheckCircle2 size={18} className="text-emerald-500" />, accent: '#10B981' },
            { label: 'HOY', value: tareasHoy, sub: 'Pendientes para hoy', icon: <CalendarIcon size={18} style={{ color: '#A78BFA' }} />, accent: '#A78BFA' },
            { label: 'PRÓXIMOS', value: proximos, sub: 'En los próximos días', icon: <Clock size={18} className="text-blue-500" />, accent: '#3B82F6' },
          ].map((s, i) => (
            <div key={i}
              className="rounded-[22px] flex flex-col transition-all duration-200"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                padding: '24px',
                minHeight: '130px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = dm ? '0 12px 36px rgba(0,0,0,0.28)' : '0 12px 36px rgba(23,32,51,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = cardShadow; }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <span className="font-bold uppercase tracking-wider" style={{ fontSize: '12px', color: textSecondary }}>{s.label}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: dm ? `${s.accent}15` : `${s.accent}10` }}>
                  {s.icon}
                </div>
              </div>
              <div className="font-extrabold leading-none" style={{ fontSize: '36px', color: textPrimary, marginBottom: '6px' }}>{s.value}</div>
              <p className="font-medium" style={{ fontSize: '14px', color: textSecondary }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="flex items-center flex-wrap" style={{ gap: '12px', marginBottom: '28px' }}>
          {[
            { id: 'Todas', icon: <LayoutList size={15} />, label: 'Todas' },
            { id: 'Hoy', icon: <CalendarIcon size={15} />, label: 'Hoy' },
            { id: 'Próximos', icon: <Clock size={15} />, label: 'Próximos' },
            { id: 'Completadas', icon: <Check size={15} />, label: 'Completadas' },
          ].map(f => (
            <button key={f.id} onClick={() => setActiveTab(f.id)}
              className="flex items-center font-semibold transition-all duration-200"
              style={{
                padding: '0 20px',
                height: '42px',
                borderRadius: '999px',
                fontSize: '14px',
                gap: '8px',
                background: activeTab === f.id ? (dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7') : (dm ? '#111A2D' : '#FFFFFF'),
                border: activeTab === f.id ? '1px solid rgba(248,59,145,0.3)' : `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
                color: activeTab === f.id ? pink : textSecondary,
              }}
              onMouseEnter={(e) => { if (activeTab !== f.id) { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.15)' : '#CBD5E1'; e.currentTarget.style.color = pink; } }}
              onMouseLeave={(e) => { if (activeTab !== f.id) { e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'; e.currentTarget.style.color = textSecondary; } }}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT: 70/30 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]" style={{ gap: '24px' }}>

          {/* ── LEFT: Mis recordatorios ── */}
          <div className="rounded-[24px] overflow-hidden"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}>
            <div className="flex items-center justify-between"
              style={{ padding: '22px 28px', borderBottom: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}` }}>
              <h2 className="font-bold" style={{ fontSize: '18px', color: textPrimary }}>Mis recordatorios</h2>
              <span className="font-semibold" style={{ fontSize: '13px', color: textSecondary }}>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'recordatorio' : 'recordatorios'}
              </span>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {filteredTasks.length > 0 ? (
                <div className="flex flex-col" style={{ gap: '12px' }}>
                  {filteredTasks.map((task) => (
                    <div key={task.id}
                      className="flex items-center rounded-[18px] transition-all duration-200 group"
                      style={{ padding: '18px 20px', gap: '16px', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}`, background: dm ? 'transparent' : '#FFFFFF' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#FFFBFD'; e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.12)' : '#FCE7F3'; e.currentTarget.style.transform = 'translateX(2px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = dm ? 'transparent' : '#FFFFFF'; e.currentTarget.style.borderColor = dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                      <div onClick={() => toggleComplete(task.id)} className="shrink-0 cursor-pointer">
                        {task.completed ? (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: pink }}>
                            <Check size={14} className="text-white" strokeWidth={4} />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 transition" style={{ borderColor: dm ? '#293A62' : '#CBD5E1' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = pink; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? '#293A62' : '#CBD5E1'; }} />
                        )}
                      </div>
                      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${task.color}`}>
                        {task.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ fontSize: '15px', color: task.completed ? textSecondary : textPrimary, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</p>
                        <div className="flex items-center" style={{ gap: '14px', fontSize: '13px', color: textSecondary, marginTop: '4px' }}>
                          <span className="flex items-center" style={{ gap: '5px' }}><Clock size={13} /> {task.time}</span>
                          <span className="flex items-center" style={{ gap: '5px' }}><RefreshCw size={13} /> {task.repeat}</span>
                        </div>
                      </div>
                      <span className="font-bold shrink-0"
                        style={{
                          padding: '4px 14px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          background: task.completed ? (dm ? 'rgba(255,255,255,0.05)' : '#F1F5F9') : undefined,
                          color: task.completed ? textSecondary : undefined,
                        }}
                        className={task.completed ? '' : task.catColor}>
                        {task.category}
                      </span>
                      <button onClick={() => deleteReminder(task.id)}
                        className="p-2 rounded-[10px] transition opacity-0 group-hover:opacity-100 shrink-0"
                        style={{ color: dm ? '#475569' : '#94A3B8' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = dm ? 'rgba(239,68,68,0.1)' : '#FEF2F2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── EMPTY STATE ── */
                <div className="flex flex-col items-center justify-center text-center" style={{ padding: '56px 40px', minHeight: '380px' }}>
                  <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full" style={{ background: dm ? 'rgba(248,59,145,0.08)' : 'rgba(236,160,196,0.15)', filter: 'blur(20px)', transform: 'scale(1.3)' }} />
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ background: dm ? '#1A2540' : '#FFFFFF', border: `1px solid ${dm ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`, boxShadow: dm ? '0 8px 28px rgba(0,0,0,0.2)' : '0 8px 28px rgba(23,32,51,0.06)' }}>
                      <CheckCircle2 size={40} style={{ color: pink, opacity: 0.7 }} />
                    </div>
                  </div>
                  <h3 className="font-poppins font-extrabold mb-2" style={{ fontSize: '24px', color: textPrimary }}>
                    Todo al día por aquí
                  </h3>
                  <p className="mb-2" style={{ fontSize: '15px', color: textSecondary, maxWidth: '340px', lineHeight: 1.5 }}>
                    No hay recordatorios pendientes para esta vista.
                  </p>
                  <p style={{ fontSize: '15px', color: textSecondary, marginBottom: '28px' }}>
                    Tómate un respiro o añade algo nuevo.
                  </p>
                  <button onClick={() => setShowAddModal(true)}
                    className="flex items-center font-bold text-white transition-all duration-200"
                    style={{
                      height: '50px',
                      padding: '0 24px',
                      borderRadius: '14px',
                      fontSize: '15px',
                      background: pink,
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#DB2777'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = pink; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <Plus size={18} /> Crear nuevo recordatorio
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Calendar + Consejo ── */}
          <div className="flex flex-col" style={{ gap: '24px' }}>

            {/* Calendar */}
            <div className="rounded-[24px] overflow-hidden"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow, padding: '24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '22px' }}>
                <h3 className="font-poppins font-bold" style={{ fontSize: '18px', color: textPrimary }}>{MONTH_NAMES[calMonth]} {calYear}</h3>
                <div className="flex" style={{ gap: '8px' }}>
                  <button onClick={prevCalMonth} className="w-10 h-10 rounded-full flex items-center justify-center transition"
                    style={{ background: dm ? '#1A2540' : '#F8FAFC' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dm ? '#253358' : '#F1F5F9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1A2540' : '#F8FAFC'; }}>
                    <ChevronLeft size={18} style={{ color: dm ? '#94A3B8' : '#64748B' }} />
                  </button>
                  <button onClick={nextCalMonth} className="w-10 h-10 rounded-full flex items-center justify-center transition"
                    style={{ background: dm ? '#1A2540' : '#F8FAFC' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = dm ? '#253358' : '#F1F5F9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1A2540' : '#F8FAFC'; }}>
                    <ChevronRight size={18} style={{ color: dm ? '#94A3B8' : '#64748B' }} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center" style={{ marginBottom: '12px' }}>
                {['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map(d => (
                  <span key={d} className="font-bold uppercase tracking-wider" style={{ fontSize: '11px', color: dm ? '#475569' : '#94A3B8' }}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center" style={{ gap: '4px 0' }}>
                {[...Array(42)].map((_, i) => {
                  const firstOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
                  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                  const day = i - firstOffset + 1;
                  const isValid = day > 0 && day <= daysInMonth;
                  if (!isValid) return <div key={i}></div>;
                  const today = new Date();
                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const dayTasks = getTasksForDate(day, calMonth, calYear);
                  const hasTasks = dayTasks.length > 0;
                  return (
                    <div key={i} className="relative flex flex-col items-center justify-center">
                      <button
                        onClick={() => setSelectedDayInfo({ day, month: calMonth, year: calYear, label: `${MONTH_NAMES[calMonth]} ${day}, ${calYear}` })}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all duration-200"
                        style={isToday ? {
                          background: pink,
                          color: '#FFFFFF',
                          boxShadow: '0 4px 14px rgba(244,63,158,0.25)',
                        } : hasTasks ? {
                          background: dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7',
                          color: pink,
                        } : {
                          color: dm ? '#94A3B8' : '#334155',
                        }}>
                        {day}
                      </button>
                      {hasTasks && !isToday && (
                        <span className="w-1.5 h-1.5 rounded-full absolute" style={{ bottom: '2px', background: pink }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consejo Card */}
            <div
              className="rounded-[24px] overflow-hidden transition-all duration-200"
              style={{
                background: dm ? 'linear-gradient(145deg, #0D1527 0%, #121D35 40%, #0F1830 100%)' : 'linear-gradient(145deg, #FFF7FA 0%, #FFF0F5 100%)',
                border: `1px solid ${dm ? 'rgba(136,82,180,0.2)' : 'rgba(244,63,158,0.12)'}`,
                boxShadow: dm ? '0 8px 28px rgba(0,0,0,0.3)' : '0 8px 28px rgba(244,63,158,0.08)',
                padding: '28px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F43F9E 0%, #E83D8A 100%)', boxShadow: '0 4px 16px rgba(244,63,158,0.35)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7.89 8 10 8 12h1" />
                    <path d="M18 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C12.63 6 12 7.8 12 9.5 12 11.89 14 14 14 16h-1" />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: dm ? 'rgba(244,63,158,0.08)' : 'rgba(244,63,158,0.06)', border: `1px solid ${dm ? 'rgba(244,63,158,0.2)' : 'rgba(244,63,158,0.15)'}` }}>
                  <Heart size={18} fill={pink} stroke="none" />
                </div>
              </div>

              <h4 className="font-poppins font-extrabold leading-snug" style={{ fontSize: '20px', color: textPrimary, marginBottom: '12px' }}>
                Un pequeño paso a la vez
              </h4>

              <div className="relative" style={{ marginBottom: '24px' }}>
                <p className="leading-relaxed" style={{ fontSize: '15px', color: dm ? '#CBD5E1' : '#64748B', lineHeight: 1.6, maxWidth: '300px', paddingRight: '110px' }}>
                  Organizar tus tareas ayuda a reducir la ansiedad. No te presiones, haz lo que puedas hoy.
                </p>
                <div className="absolute pointer-events-none select-none" style={{ right: '0', top: '-24px', zIndex: 2 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: '-6px', top: '4px', opacity: 0.5 }}>
                    <path d="M7 0L8.2 5.8L14 7L8.2 8.2L7 14L5.8 8.2L0 7L5.8 5.8Z" fill={pink} />
                  </svg>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', right: '16px', top: '-2px', opacity: 0.4 }}>
                    <path d="M7 0L8.2 5.8L14 7L8.2 8.2L7 14L5.8 8.2L0 7L5.8 5.8Z" fill="#C084FC" />
                  </svg>
                  <svg width="90" height="90" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="60" cy="32" rx="22" ry="20" fill="#2D1B4E" />
                    <path d="M38 32 C38 32 40 18 60 16 C80 18 82 32 82 32" fill="#2D1B4E" />
                    <ellipse cx="60" cy="36" rx="15" ry="14" fill="#E8B89D" />
                    <path d="M52 35 Q55 37 58 35" stroke="#2D1B4E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M62 35 Q65 37 68 35" stroke="#2D1B4E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M56 41 Q60 44 64 41" stroke="#C4847A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M44 52 C44 48 52 46 60 46 C68 46 76 48 76 52 L76 72 C76 74 74 76 72 76 L48 76 C46 76 44 74 44 72 Z" fill="#5BBFCF" />
                    <path d="M52 46 L60 52 L68 46" stroke="#4AABB9" strokeWidth="1" fill="none" />
                    <path d="M30 90 Q40 78 52 82 L48 76 L44 76 Q28 80 30 90Z" fill="#E8B89D" />
                    <path d="M90 90 Q80 78 68 82 L72 76 L76 76 Q92 80 90 90Z" fill="#E8B89D" />
                    <path d="M44 72 Q36 80 32 92 Q50 88 60 82 Q70 88 88 92 Q84 80 76 72 Z" fill="#2D1B4E" />
                    <path d="M44 56 Q36 64 34 76 Q38 74 42 68" stroke="#E8B89D" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M76 56 Q84 64 86 76 Q82 74 78 68" stroke="#E8B89D" strokeWidth="6" fill="none" strokeLinecap="round" />
                    <path d="M38 32 Q34 44 36 56" stroke="#2D1B4E" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M82 32 Q86 44 84 56" stroke="#2D1B4E" strokeWidth="5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div style={{ height: '1px', background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', marginBottom: '18px' }} />

              <div className="flex items-center" style={{ gap: '14px' }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: dm ? 'rgba(244,63,158,0.1)' : 'rgba(244,63,158,0.08)' }}>
                  <Check size={18} style={{ color: pink }} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-bold" style={{ fontSize: '16px', color: pink }}>{completadas}/{totalPendientes}</span>
                  <span className="font-medium" style={{ fontSize: '14px', color: textSecondary, marginLeft: '6px' }}>tareas completadas</span>
                </div>
              </div>

              <div style={{
                marginTop: '14px',
                width: '100%',
                height: '6px',
                borderRadius: '999px',
                background: dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #F43F9E 0%, #FF6FB5 100%)',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 0 10px rgba(244,63,158,0.25)',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal Día ── */}
      {selectedDayInfo && (() => {
        const dayModalTasks = getTasksForDate(selectedDayInfo.day, selectedDayInfo.month, selectedDayInfo.year);
        return (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setSelectedDayInfo(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-md rounded-[28px] shadow-2xl p-6" style={{ background: dm ? '#111A2D' : '#FFFFFF', border: `1px solid ${cardBorder}` }} onClick={(e) => e.stopPropagation()}>
              <div className="relative flex items-center mb-5">
                <div className="w-9 shrink-0" />
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-extrabold" style={{ color: textPrimary }}>Recordatorios</h3>
                  <p className="font-semibold" style={{ fontSize: '13px', color: textSecondary }}>{selectedDayInfo.label}</p>
                </div>
                <button onClick={() => setSelectedDayInfo(null)} className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition"
                  style={{ color: dm ? '#475569' : '#94A3B8' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = pink; e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.08)' : '#FFF5FA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                  <X size={20} />
                </button>
              </div>
              {dayModalTasks.length === 0 ? (
                <p className="text-center text-sm py-8 font-medium" style={{ color: textSecondary }}>No hay recordatorios para este día.</p>
              ) : (
                <div className="flex flex-col max-h-[50vh] overflow-y-auto pr-1" style={{ gap: '12px' }}>
                  {dayModalTasks.map(t => (
                    <div key={t.id} className="flex items-center rounded-[18px]" style={{ padding: '14px 16px', gap: '14px', background: dm ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}` }}>
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${t.color}`}>{t.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ fontSize: '14px', color: textPrimary }}>{t.text}</p>
                        <p className="font-semibold flex items-center" style={{ fontSize: '12px', color: textSecondary, gap: '4px', marginTop: '2px' }}><Clock size={12} /> {t.time}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full font-bold shrink-0" style={{ fontSize: '11px' }} className={t.catColor}>{t.category}</span>
                      <button onClick={() => deleteReminder(t.id)} title="Eliminar recordatorio" className="shrink-0 p-1.5 rounded-full transition"
                        style={{ color: dm ? '#475569' : '#94A3B8' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = dm ? 'rgba(239,68,68,0.1)' : '#FEF2F2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#475569' : '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setSelectedDayInfo(null)} className="mt-5 w-full h-11 rounded-2xl font-semibold text-sm transition"
                style={{ background: dm ? '#1A2540' : '#F1F5F9', color: textSecondary }}
                onMouseEnter={(e) => { e.currentTarget.style.background = dm ? '#253358' : '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1A2540' : '#F1F5F9'; }}>
                Cerrar
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Modal Nuevo Recordatorio ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}
          style={{ background: 'rgba(15,23,42,0.38)', backdropFilter: 'blur(6px)' }}>
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: '28px',
              maxWidth: '760px',
              maxHeight: 'calc(100vh - 32px)',
              background: dm ? '#111A2D' : '#FFFFFF',
              boxShadow: dm ? '0 24px 80px rgba(0,0,0,0.4)' : '0 24px 80px rgba(15,23,42,0.18)',
              border: dm ? '1px solid #293A62' : '1px solid rgba(255,255,255,0.8)',
              animation: 'reminderModalIn 0.22s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes reminderModalIn {
                from { opacity: 0; transform: scale(0.97) translateY(8px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>

            <button
              onClick={() => setShowAddModal(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 w-[42px] h-[42px] rounded-[14px] flex items-center justify-center transition-all duration-150 z-10"
              style={{ background: dm ? '#1A2540' : '#F8FAFC', border: `1px solid ${dm ? '#293A62' : '#E2E8F0'}` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7'; e.currentTarget.style.color = pink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1A2540' : '#F8FAFC'; e.currentTarget.style.color = dm ? '#94A3B8' : '#64748B'; }}
            >
              <X size={20} style={{ color: dm ? '#94A3B8' : '#64748B' }} />
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 32px)', padding: '36px 40px' }}>
              <header className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center" style={{ background: dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7' }}>
                    <CalendarIcon size={28} style={{ color: pink }} />
                  </div>
                </div>
                <h2 className="font-poppins font-extrabold tracking-tight mb-2" style={{ fontSize: '32px', color: textPrimary }}>
                  Nuevo recordatorio
                </h2>
                <p style={{ fontSize: '15px', color: textSecondary }}>
                  Organiza tus tareas y no olvides lo importante.
                </p>
              </header>

              <div className="mb-7">
                <p className="font-bold mb-3" style={{ fontSize: '13px', color: textSecondary }}>Elige una categoría</p>
                <div className="grid grid-cols-4 sm:grid-cols-6" style={{ gap: '12px' }}>
                  {ICON_OPTIONS.map(opt => {
                    const isSelected = selectedIcon?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedIcon(opt)}
                        aria-label={`Categoría: ${opt.label}`}
                        aria-pressed={isSelected}
                        className="relative flex flex-col items-center justify-center transition-all duration-200"
                        style={{
                          height: '110px',
                          borderRadius: '18px',
                          background: isSelected ? (dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7') : (dm ? '#1A2540' : '#FFFFFF'),
                          border: isSelected ? `2px solid ${pink}` : `1px solid ${dm ? '#293A62' : '#E8ECF2'}`,
                          boxShadow: isSelected ? '0 6px 18px rgba(244,63,158,0.10)' : 'none',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = dm ? '#3B5998' : '#FBCFE8'; } }}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = dm ? '#293A62' : '#E8ECF2'; } }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: pink }}>✓</div>
                        )}
                        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2" style={{ transform: isSelected ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
                          <span className={opt.color} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.icon}</span>
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: isSelected ? pink : textSecondary }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-1.5 font-bold mb-2.5" style={{ fontSize: '13px', color: dm ? '#94A3B8' : '#334155' }}>
                  <Pencil size={13} style={{ color: pink }} />
                  Nombre del recordatorio
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Tomar agua"
                  className="w-full outline-none transition-all duration-200"
                  style={{
                    height: '52px',
                    borderRadius: '16px',
                    border: `1px solid ${dm ? '#293A62' : '#E2E8F0'}`,
                    padding: '0 16px',
                    fontSize: '15px',
                    background: dm ? '#1A2540' : '#FFFFFF',
                    color: textPrimary,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = pink; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(244,63,158,0.08)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = dm ? '#293A62' : '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-7">
                <div className="relative">
                  <label className="flex items-center gap-1.5 font-bold mb-2.5" style={{ fontSize: '13px', color: dm ? '#94A3B8' : '#334155' }}>
                    <CalendarIcon size={13} style={{ color: pink }} />
                    Fecha
                  </label>
                  <button type="button" onClick={openDatePicker}
                    className="w-full flex items-center justify-between transition-all duration-200"
                    style={{
                      height: '52px',
                      borderRadius: '16px',
                      border: `1px solid ${dm ? '#293A62' : '#E2E8F0'}`,
                      padding: '0 16px',
                      background: dm ? '#1A2540' : '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: textPrimary,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = pink; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? '#293A62' : '#E2E8F0'; }}>
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={16} style={{ color: pink }} className="shrink-0" />
                      {formatDate(newDate)}
                    </span>
                    <ChevronDown size={16} style={{ color: '#94A3B8' }} />
                  </button>
                  {showDatePicker && (
                    <div className="absolute left-0 bottom-full mb-2 z-30">
                      <DatePickerCard newDateISO={newDate} dm={dm} onConfirm={confirmDate} onClose={() => setShowDatePicker(false)} />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="flex items-center gap-1.5 font-bold mb-2.5" style={{ fontSize: '13px', color: dm ? '#94A3B8' : '#334155' }}>
                    <Clock size={13} style={{ color: pink }} />
                    Hora
                  </label>
                  <button type="button" onClick={openTimePicker}
                    className="w-full flex items-center justify-between transition-all duration-200"
                    style={{
                      height: '52px',
                      borderRadius: '16px',
                      border: `1px solid ${dm ? '#293A62' : '#E2E8F0'}`,
                      padding: '0 16px',
                      background: dm ? '#1A2540' : '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: textPrimary,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = pink; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = dm ? '#293A62' : '#E2E8F0'; }}>
                    <span className="flex items-center gap-2">
                      <Clock size={16} style={{ color: pink }} className="shrink-0" />
                      {formatTime(newTime)}
                    </span>
                    <ChevronDown size={16} style={{ color: '#94A3B8' }} />
                  </button>
                  {showTimePicker && (
                    <div className="absolute right-0 bottom-full mb-2 z-30 w-64 p-4 rounded-3xl shadow-2xl border" style={{ background: dm ? '#111A2D' : '#FFFFFF', borderColor: dm ? '#293A62' : '#E2E8F0' }}>
                      <p className="text-center text-lg font-extrabold mb-3" style={{ color: textPrimary }}>{formatTime(`${String(pickerHours).padStart(2,'0')}:${String(pickerMinutes).padStart(2,'0')}`)}</p>
                      <div className="w-52 h-52 mx-auto">
                        <AnalogClockPicker
                          hours={pickerHours}
                          minutes={pickerMinutes}
                          onChange={({ hours, minutes }) => { setPickerHours(hours); setPickerMinutes(minutes); }}
                          dm={dm}
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button type="button" onClick={() => setShowTimePicker(false)} className="flex-1 py-2.5 rounded-full text-xs font-bold transition"
                          style={{ background: dm ? '#1A2540' : '#F1F5F9', color: dm ? '#94A3B8' : '#64748B' }}>
                          Cancelar
                        </button>
                        <button type="button" onClick={confirmTime} className="flex-1 py-2.5 rounded-full text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition">
                          Aceptar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    height: '52px',
                    borderRadius: '16px',
                    border: `1px solid ${dm ? '#293A62' : '#E2E8F0'}`,
                    background: dm ? '#1A2540' : '#F8FAFC',
                    color: dm ? '#94A3B8' : '#475569',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = dm ? '#293A62' : '#F1F5F9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = dm ? '#1A2540' : '#F8FAFC'; }}>
                  Cancelar
                </button>
                <button
                  onClick={addReminder}
                  className="flex items-center justify-center text-white transition-all duration-200"
                  style={{
                    height: '52px',
                    borderRadius: '16px',
                    background: pink,
                    fontSize: '15px',
                    fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(244,63,158,0.18)',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#DB2777'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = pink; e.currentTarget.style.transform = 'translateY(0)'; }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                  Guardar recordatorio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
