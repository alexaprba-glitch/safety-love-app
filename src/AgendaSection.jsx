import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, CheckCircle, Plus, ChevronLeft, ChevronRight,
  Video, ArrowRight, User, X
} from 'lucide-react';

const GRADES = [
  { id: '7mo', label: '7° Primaria' },
  { id: '8vo', label: '8° Primaria' },
  { id: '9no', label: '1° Secundaria' },
  { id: '10mo', label: '2° Secundaria' },
  { id: '11mo', label: '3° Secundaria' },
];

const STUDENTS_BY_GRADE = {
  '7mo': ['Miguel Álvarez', 'Sofía Martínez', 'Camila Restrepo'],
  '8vo': ['Samuel Torres', 'Valeria Gómez', 'Daniel Ospina'],
  '9no': ['Juan Camilo Ruiz', 'Isabella Moreno', 'Sebastián Pérez'],
  '10mo': ['Luciana Vargas', 'Mateo Arias'],
  '11mo': ['Alejandra Ríos', 'Nicolás Duque', 'Paula Castillo'],
};

const HOURS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

const EVENTS = [
  { day: 0, startHour: 2, duration: 1, name: 'Miguel Álvarez', type: 'Videollamada', color: 'pink', time: '9:00 AM' },
  { day: 0, startHour: 4, duration: 1, name: 'Sofía Martínez', type: 'Presencial', color: 'pink', time: '11:00 AM' },
  { day: 0, startHour: 7, duration: 1, name: 'Valeria Gómez', type: 'Videollamada', color: 'purple', time: '2:00 PM' },
  { day: 1, startHour: 3, duration: 1, name: 'Samuel Torres', type: 'Videollamada', color: 'blue', time: '10:00 AM' },
  { day: 1, startHour: 9, duration: 1, name: 'Juan Camilo Ruiz', type: 'Presencial', color: 'blue', time: '4:00 PM' },
  { day: 2, startHour: 3, duration: 1, name: 'Sofía Martínez', type: 'Presencial', color: 'pink', time: '10:00 AM' },
  { day: 2, startHour: 6, duration: 1, name: 'Samuel Torres', type: 'Videollamada', color: 'pink', time: '1:00 PM' },
  { day: 3, startHour: 2, duration: 1, name: 'Miguel Álvarez', type: 'Videollamada', color: 'pink', time: '9:00 AM' },
  { day: 4, startHour: 3, duration: 1, name: 'Valeria Gómez', type: 'Presencial', color: 'pink', time: '10:00 AM' },
];

function getWeekDates(offset = 0) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + (offset * 7));
  const days = [];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push({
      short: dayNames[i],
      num: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isToday: date.toDateString() === today.toDateString(),
      date: date
    });
  }
  return days;
}

const eventColors = {
  pink: { bg: 'rgba(244,63,143,0.08)', border: 'rgba(244,63,143,0.3)', text: '#EC4899', accent: '#F43F8F' },
  purple: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.3)', text: '#A855F7', accent: '#A855F7' },
  blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#3B82F6', accent: '#3B82F6' },
  green: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', text: '#10B981', accent: '#10B981' },
};

const eventColorsDark = {
  pink: { bg: 'rgba(244,63,143,0.15)', border: 'rgba(244,63,143,0.4)', text: '#F472B6', accent: '#F43F8F' },
  purple: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#C084FC', accent: '#A855F7' },
  blue: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#60A5FA', accent: '#3B82F6' },
  green: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34D399', accent: '#10B981' },
};

export default function AgendaSection({ darkMode = false, onSessionCreated }) {
  const dm = darkMode;
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({ grade: '', student: '', date: '', time: '', type: 'Videollamada' });
  const [events, setEvents] = useState(EVENTS);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth] = useState(7);
  const [calYear, setCalYear] = useState(2026);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();

  const currentWeek = getWeekDates(weekOffset);
  const weekStartDate = currentWeek[0].date;
  const weekEndDate = currentWeek[6].date;

  const getDateRangeLabel = () => {
    const startDay = weekStartDate.getDate();
    const endDay = weekEndDate.getDate();
    const month = monthNames[weekStartDate.getMonth()];
    const year = weekStartDate.getFullYear();
    if (weekStartDate.getMonth() === weekEndDate.getMonth()) {
      return `${startDay} - ${endDay} de ${month}, ${year}`;
    } else {
      const endMonth = monthNames[weekEndDate.getMonth()];
      return `${startDay} de ${month} - ${endDay} de ${endMonth}, ${year}`;
    }
  };

  const handleDateSelect = (day) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setNewSession({ ...newSession, date: dateStr });
    setShowCalendar(false);
  };

  const handleCancelSession = () => {
    if (!selectedSession) return;
    const cancelled = {
      id: Date.now(),
      name: selectedSession.name,
      type: selectedSession.type,
      date: selectedSession.date,
      time: selectedSession.time,
      cancelledAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('safetyLove_cancelledSessions')) ?? [];
      localStorage.setItem('safetyLove_cancelledSessions', JSON.stringify([cancelled, ...existing]));
    } catch {}
    setEvents(prev => prev.filter(e => !(e.name === selectedSession.name && e.date === selectedSession.date && e.time === selectedSession.time)));
    setSelectedSession(null);
    alert(`Sesión cancelada: ${cancelled.name}`);
  };

  const handleSaveSession = () => {
    if (newSession.student && newSession.date && newSession.time) {
      const dateObj = new Date(newSession.date);
      const dayOfWeek = dateObj.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const hourIndex = HOURS.indexOf(newSession.time);
      const colors = ['pink', 'purple', 'blue', 'green'];
      const newEvent = {
        day: adjustedDay,
        startHour: hourIndex >= 0 ? hourIndex : 0,
        duration: 1,
        name: newSession.student,
        type: newSession.type,
        color: colors[Math.floor(Math.random() * colors.length)],
        time: newSession.time,
        date: newSession.date
      };
      setEvents([...events, newEvent]);

      if (onSessionCreated) {
        const gradeLabel = GRADES.find(g => g.id === newSession.grade)?.label || '';
        const dateDisplay = new Date(newSession.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        const psychColors = ['bg-blue-100 text-blue-600', 'bg-pink-100 text-pink-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600'];
        onSessionCreated({
          name: newSession.student,
          type: `${gradeLabel} · ${newSession.type}`,
          date: dateDisplay,
          time: newSession.time,
          color: psychColors[Math.floor(Math.random() * psychColors.length)],
        });
      }

      setShowNewSession(false);
      setNewSession({ grade: '', student: '', date: '', time: '', type: 'Videollamada' });
      alert(`Sesión creada: ${newSession.student} - ${newSession.date} ${newSession.time}`);
    }
  };

  // ── Dark mode color tokens ──
  const C = {
    pageBg: dm ? '#070D1C' : '#F8FAFC',
    cardBg: dm ? '#0F1A2E' : '#FFFFFF',
    cardBg2: dm ? '#162032' : '#F8FAFC',
    border: dm ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
    borderLight: dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
    textPrimary: dm ? '#F1F5F9' : '#111827',
    textSecondary: dm ? '#94A3B8' : '#64748B',
    textMuted: dm ? '#64748B' : '#94A3B8',
    hoverBg: dm ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
    todayBg: dm ? 'rgba(246,51,147,0.12)' : '#FFF1F5',
    todayGridBg: dm ? 'rgba(246,51,147,0.06)' : 'rgba(246,51,147,0.02)',
    inputBg: dm ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
    shadow: dm ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
    shadowHover: dm ? '0 4px 12px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.06)',
    modalOverlay: dm ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.4)',
    modalShadow: dm ? '0 24px 64px rgba(0,0,0,0.4)' : '0 24px 64px rgba(0,0,0,0.12)',
    calPopupBg: dm ? '#0F1A2E' : '#FFFFFF',
    cancelBg: dm ? 'rgba(239,68,68,0.12)' : '#FEF2F2',
    cancelHover: dm ? 'rgba(239,68,68,0.2)' : '#FEE2E2',
    closeBtnBg: dm ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
    closeBtnHover: dm ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
  };

  const selectStyle = {
    width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px',
    border: `1px solid ${C.border}`, background: C.inputBg, color: C.textPrimary,
    fontSize: '14px', fontWeight: 500, outline: 'none', cursor: 'pointer',
    appearance: 'none', transition: 'all 200ms ease',
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: '8px' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* ═══ HEADER ═══ */}
        <header style={{ padding: '24px 40px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                Agenda
              </h1>
              <p style={{ fontSize: '14px', color: C.textSecondary, marginTop: '6px', fontWeight: 500 }}>
                Organiza tus sesiones y mantén todo bajo control.
              </p>
            </div>
            <button
              onClick={() => setShowNewSession(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0 20px', borderRadius: '12px',
                background: '#F63393', color: '#fff', border: 'none',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(246,51,147,0.25)',
                transition: 'all 200ms ease', height: '46px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(246,51,147,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#F63393'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(246,51,147,0.25)'; }}
            >
              <Plus size={18} strokeWidth={2.5} /> Nueva sesión
            </button>
          </div>

          {/* ═══ DATE SELECTOR ═══ */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: C.cardBg, border: `1px solid ${C.border}`,
            borderRadius: '14px', padding: '6px 8px', marginBottom: '24px',
            boxShadow: C.shadow,
          }}>
            <button onClick={() => setWeekOffset(prev => prev - 1)} style={{
              width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', color: C.textSecondary, transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px' }}>
              <Calendar size={16} style={{ color: '#F63393' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary, minWidth: '240px', textAlign: 'center' }}>
                {getDateRangeLabel()}
              </span>
            </div>
            <button onClick={() => setWeekOffset(prev => prev + 1)} style={{
              width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', color: C.textSecondary, transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <ChevronRight size={18} />
            </button>
            {weekOffset !== 0 && (
              <button onClick={() => setWeekOffset(0)} style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: '#FCE7F3', color: '#F63393', fontSize: '12px', fontWeight: 700,
                transition: 'all 200ms ease', marginLeft: '4px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FBCFE8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FCE7F3'; }}
              >
                Hoy
              </button>
            )}
          </div>

          {/* ═══ STATS CARDS ═══ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { value: '0', label: 'Sesiones esta semana', sub: 'Sesiones programadas', icon: <Calendar size={18} />, accent: '#F63393', accentBg: dm ? 'rgba(246,51,147,0.12)' : '#FCE7F3' },
              { value: '0', label: 'Confirmadas', sub: 'Sesiones confirmadas', icon: <Clock size={18} />, accent: '#3B82F6', accentBg: dm ? 'rgba(59,130,246,0.12)' : '#EFF6FF' },
              { value: '0', label: 'Completadas', sub: 'Sesiones completadas', icon: <CheckCircle size={18} />, accent: '#10B981', accentBg: dm ? 'rgba(16,185,129,0.12)' : '#ECFDF5' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '18px',
                padding: '20px 22px', minHeight: '90px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'all 200ms ease',
                boxShadow: C.shadow,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {stat.label}
                  </span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '12px',
                    background: stat.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: stat.accent,
                  }}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '30px', fontWeight: 800, color: C.textPrimary, lineHeight: 1, margin: 0, letterSpacing: '-0.02em', fontFamily: "'Poppins', sans-serif" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: C.textMuted, marginTop: '6px' }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* ═══ CALENDAR ═══ */}
        <div className="custom-scrollbar" style={{ flex: 1, overflow: 'auto', padding: '0 40px 32px', minHeight: 0 }}>
          <div style={{
            background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: '18px',
            overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
            boxShadow: C.shadow,
          }}>
            {/* Day Headers - CSS Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(7, 1fr)',
              borderBottom: `1px solid ${C.border}`,
              flexShrink: 0,
            }}>
              <div style={{ borderRight: `1px solid ${C.border}` }} />
              {currentWeek.map((day, i) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '14px 0',
                  borderRight: i < 6 ? `1px solid ${C.borderLight}` : 'none',
                  background: day.isToday ? C.todayBg : 'transparent',
                  transition: 'background 200ms ease',
                }}>
                  <p style={{
                    fontSize: '11px', fontWeight: 700, margin: 0,
                    color: day.isToday ? '#F63393' : C.textMuted,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {day.short}
                  </p>
                  <p style={{
                    fontSize: '20px', fontWeight: 800, margin: '4px 0 0',
                    color: day.isToday ? '#F63393' : C.textPrimary,
                    position: 'relative', display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    {day.num}
                    {day.isToday && (
                      <span style={{
                        position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)',
                        width: '18px', height: '3px', borderRadius: '2px', background: '#F63393',
                      }} />
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Grid - CSS Grid */}
            <div className="custom-scrollbar" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
              {HOURS.map((hour, hi) => (
                <div key={hour} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px repeat(7, 1fr)',
                  borderBottom: `1px solid ${C.borderLight}`,
                  minHeight: '48px',
                }}>
                  <div style={{
                    borderRight: `1px solid ${C.border}`,
                    padding: '12px 12px 12px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: C.textMuted }}>{hour}</span>
                  </div>
                  {currentWeek.map((day, di) => (
                    <div key={di} style={{
                      borderRight: di < 6 ? `1px solid ${C.borderLight}` : 'none',
                      background: day.isToday ? C.todayGridBg : 'transparent',
                      position: 'relative',
                    }} />
                  ))}
                </div>
              ))}

              {/* Event Overlays */}
              {events.filter(evt => {
                if (!evt.date) return true;
                const evtDate = new Date(evt.date + 'T12:00:00');
                return evtDate >= weekStartDate && evtDate <= weekEndDate;
              }).map((evt, i) => {
                const evtDate = new Date(evt.date + 'T12:00:00');
                const dayIndex = currentWeek.findIndex(d =>
                  d.date.getDate() === evtDate.getDate() &&
                  d.date.getMonth() === evtDate.getMonth() &&
                  d.date.getFullYear() === evtDate.getFullYear()
                );
                if (dayIndex === -1) return null;
                const ec = (dm ? eventColorsDark : eventColors)[evt.color] || (dm ? eventColorsDark.pink : eventColors.pink);
                const colStart = dayIndex + 2;
                const topPx = evt.startHour * 48;
                const heightPx = 46;
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedSession(evt)}
                    style={{
                      position: 'absolute',
                      left: `calc(80px + (100% - 80px) * ${dayIndex} / 7 + 4px)`,
                      width: `calc((100% - 80px) / 7 - 8px)`,
                      top: topPx + 2,
                      height: heightPx,
                      background: ec.bg,
                      borderLeft: `3px solid ${ec.accent}`,
                      borderRadius: '10px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = `0 4px 12px ${ec.bg}`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <p style={{ fontSize: '10px', fontWeight: 700, color: ec.text, lineHeight: 1.2, margin: 0 }}>{evt.time}</p>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.2, marginTop: '3px' }}>{evt.name}</p>
                    <p style={{ fontSize: '10px', fontWeight: 500, color: C.textMuted, lineHeight: 1.2, marginTop: '2px' }}>{evt.type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MODAL: NUEVA SESIÓN ═══ */}
      {showNewSession && (
        <div style={{ position: 'fixed', inset: 0, background: C.modalOverlay, backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowNewSession(false)}>
          <div style={{
            background: C.cardBg, borderRadius: '24px', width: '100%', maxWidth: '440px',
            border: `1px solid ${C.border}`, boxShadow: C.modalShadow,
            overflow: 'hidden',
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: `1px solid ${C.borderLight}` }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>Nueva sesión</h3>
              <button onClick={() => setShowNewSession(false)} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.closeBtnBg, color: C.textSecondary, transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.closeBtnHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.closeBtnBg; }}
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Grado escolar</label>
                <select
                  value={newSession.grade}
                  onChange={(e) => setNewSession({ ...newSession, grade: e.target.value, student: '' })}
                  style={selectStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#F63393'; e.target.style.boxShadow = '0 0 0 3px rgba(246,51,147,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="">Seleccionar grado</option>
                  {GRADES.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </div>
              {newSession.grade && (
                <div>
                  <label style={labelStyle}>Estudiante</label>
                  <select
                    value={newSession.student}
                    onChange={(e) => setNewSession({ ...newSession, student: e.target.value })}
                    style={selectStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#F63393'; e.target.style.boxShadow = '0 0 0 3px rgba(246,51,147,0.08)'; }}
                    onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Seleccionar estudiante</option>
                    {(STUDENTS_BY_GRADE[newSession.grade] || []).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Fecha</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    width: '100%', height: '48px', padding: '0 16px', borderRadius: '12px',
                    border: `1px solid ${C.border}`, background: C.inputBg, color: C.textPrimary,
                    fontSize: '14px', fontWeight: 500, outline: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 200ms ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#F63393'; e.target.style.boxShadow = '0 0 0 3px rgba(246,51,147,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                >
                  <span style={{ color: newSession.date ? C.textPrimary : C.textMuted }}>
                    {newSession.date ? new Date(newSession.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Seleccionar fecha'}
                  </span>
                  <Calendar size={16} style={{ color: C.textMuted }} />
                </button>
                {showCalendar && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                    background: C.calPopupBg, border: `1px solid ${C.border}`, borderRadius: '16px',
                    padding: '16px', zIndex: 100, boxShadow: dm ? '0 12px 32px rgba(0,0,0,0.3)' : '0 12px 32px rgba(0,0,0,0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <button type="button" onClick={() => setCalMonth(prev => prev === 0 ? 11 : prev - 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.closeBtnBg, color: C.textSecondary, transition: 'all 200ms ease' }}>
                        <ChevronLeft size={14} />
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{monthNames[calMonth]} {calYear}</span>
                      <button type="button" onClick={() => setCalMonth(prev => prev === 11 ? 0 : prev + 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.closeBtnBg, color: C.textSecondary, transition: 'all 200ms ease' }}>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                      {['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'].map(d => (
                        <div key={d} style={{ fontSize: '10px', fontWeight: 700, color: C.textMuted, textAlign: 'center', padding: '4px 0' }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ height: '32px' }} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = newSession.date === dateStr;
                        const isToday = new Date().getDate() === day && new Date().getMonth() === calMonth && new Date().getFullYear() === calYear;
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            style={{
                              height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '12px', fontWeight: 600, transition: 'all 200ms ease',
                              background: isSelected ? '#F63393' : isToday ? '#FCE7F3' : 'transparent',
                              color: isSelected ? '#fff' : isToday ? '#F63393' : C.textSecondary,
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Hora</label>
                <select
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  style={selectStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#F63393'; e.target.style.boxShadow = '0 0 0 3px rgba(246,51,147,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                >
                  <option value="">Seleccionar hora</option>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tipo de sesión</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['Videollamada', 'Presencial'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewSession({ ...newSession, type })}
                      style={{
                        height: '48px', borderRadius: '12px',
                        border: newSession.type === type ? '2px solid #F63393' : `1px solid ${C.border}`,
                        background: newSession.type === type ? (dm ? 'rgba(246,51,147,0.12)' : '#FFF1F5') : C.inputBg,
                        color: newSession.type === type ? '#F63393' : C.textSecondary,
                        fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms ease',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div style={{ padding: '0 28px 28px' }}>
              <button
                onClick={handleSaveSession}
                disabled={!newSession.student || !newSession.date || !newSession.time}
                style={{
                  width: '100%', height: '50px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                  background: '#F63393', color: '#fff', fontSize: '15px', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(246,51,147,0.25)',
                  transition: 'all 200ms ease',
                  opacity: (!newSession.student || !newSession.date || !newSession.time) ? 0.4 : 1,
                  pointerEvents: (!newSession.student || !newSession.date || !newSession.time) ? 'none' : 'auto',
                }}
                onMouseEnter={(e) => { if (newSession.student && newSession.date && newSession.time) { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F63393'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Crear sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: DETALLES SESIÓN ═══ */}
      {selectedSession && (
        <div style={{ position: 'fixed', inset: 0, background: C.modalOverlay, backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setSelectedSession(null)}>
          <div style={{
            background: C.cardBg, borderRadius: '24px', width: '100%', maxWidth: '420px',
            border: `1px solid ${C.border}`, boxShadow: C.modalShadow,
            overflow: 'hidden',
          }} onClick={(e) => e.stopPropagation()}>
            {/* Session Header */}
            <div style={{
              padding: '28px', textAlign: 'center',
              background: ((dm ? eventColorsDark : eventColors)[selectedSession.color] || (dm ? eventColorsDark.pink : eventColors.pink)).bg,
              borderBottom: `1px solid ${C.borderLight}`,
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '18px',
                background: C.cardBg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px', boxShadow: dm ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <User size={28} style={{ color: ((dm ? eventColorsDark : eventColors)[selectedSession.color] || (dm ? eventColorsDark.pink : eventColors.pink)).text }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "'Poppins', sans-serif" }}>{selectedSession.name}</h3>
              <span style={{ fontSize: '14px', fontWeight: 500, color: C.textSecondary, marginTop: '4px', display: 'block' }}>{selectedSession.type}</span>
            </div>
            {/* Session Details */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', background: C.cardBg2, border: `1px solid ${C.borderLight}` }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dm ? 'rgba(246,51,147,0.12)' : '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F63393' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: C.textMuted, fontWeight: 600, margin: 0 }}>Hora</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0, marginTop: '2px' }}>{selectedSession.time}</p>
                </div>
              </div>
              {selectedSession.date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', background: C.cardBg2, border: `1px solid ${C.borderLight}` }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dm ? 'rgba(59,130,246,0.12)' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: C.textMuted, fontWeight: 600, margin: 0 }}>Fecha</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0, marginTop: '2px' }}>
                      {new Date(selectedSession.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', background: C.cardBg2, border: `1px solid ${C.borderLight}` }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dm ? 'rgba(168,85,247,0.12)' : '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A855F7' }}>
                  {selectedSession.type === 'Videollamada' ? <Video size={20} /> : <User size={20} />}
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: C.textMuted, fontWeight: 600, margin: 0 }}>Tipo</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0, marginTop: '2px' }}>{selectedSession.type}</p>
                </div>
              </div>
            </div>
            {/* Session Footer */}
            <div style={{ padding: '0 28px 28px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedSession(null)}
                style={{
                  flex: 1, height: '46px', borderRadius: '12px', border: `1px solid ${C.border}`,
                  background: C.cardBg, color: C.textSecondary, fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.cardBg; }}
              >
                Cerrar
              </button>
              <button
                onClick={handleCancelSession}
                style={{
                  height: '46px', borderRadius: '12px', border: 'none',
                  background: C.cancelBg, color: '#EF4444', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 200ms ease', padding: '0 18px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.cancelHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.cancelBg; }}
              >
                Cancelar sesión
              </button>
              <button style={{
                height: '46px', borderRadius: '12px', border: 'none',
                background: '#F63393', color: '#fff', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(246,51,147,0.25)',
                transition: 'all 200ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 18px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#F63393'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Iniciar sesión <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
