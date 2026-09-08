import React, { useState, useEffect } from 'react';
import { Calendar, X, Pencil } from 'lucide-react';

export default function EmotionDayModal({
  darkMode = false,
  show,
  selectedDay,
  calYear,
  calMonth,
  monthNames,
  moodEmojis,
  getMoodForDay,
  saveMood,
  saveDayRecord,
  onSaveNote,
  onClose,
}) {
  const dm = darkMode;

  const [localNote, setLocalNote] = useState('');
  const [localMood, setLocalMood] = useState(null);

  useEffect(() => {
    if (!show || !selectedDay) {
      setLocalNote('');
      setLocalMood(null);
      return;
    }
    const key = `${calYear}-${calMonth}-${selectedDay}`;
    const existing = getMoodForDay(selectedDay);
    setLocalMood(existing || null);
  }, [show, selectedDay, calYear, calMonth]);

  if (!show || !selectedDay) return null;

  const currentMood = localMood;
  const dateLabel = `${selectedDay} de ${monthNames[calMonth]}`;

  const handleMoodSelect = (emoji) => {
    setLocalMood(emoji);
    saveMood(emoji);
  };

  const handleSave = () => {
    if (localNote.trim() && onSaveNote) {
      onSaveNote(localNote);
    }
    saveDayRecord();
    onClose();
  };

  const MAX_CHARS = 500;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ background: dm ? 'rgba(7, 13, 28, 0.7)' : 'rgba(23, 32, 51, 0.25)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: '780px',
          maxHeight: '90vh',
          borderRadius: '28px',
          background: dm ? '#101A2D' : '#FFFFFF',
          boxShadow: dm ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(23, 32, 51, 0.12)',
          border: dm ? '1px solid #293A62' : '1px solid rgba(244, 63, 158, 0.08)',
          animation: 'emotionModalIn 0.22s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes emotionModalIn {
            from { opacity: 0; transform: scale(0.97) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 z-10"
          style={{
            background: dm ? 'rgba(255,255,255,0.05)' : '#FFF7FA',
            border: dm ? '1px solid #293A62' : '1px solid #FCE7F3',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.1)' : '#FFF1F7'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : '#FFF7FA'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={18} className={dm ? 'text-[#F83B91]' : 'text-[#F43F9E]'} />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: '90vh', padding: '36px 40px 32px' }}>

          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7' }}
              >
                <Calendar size={24} className={dm ? 'text-[#F83B91]' : 'text-[#F43F9E]'} />
              </div>
            </div>
            <p
              className="text-[15px] font-medium mb-1"
              style={{ color: dm ? '#94A3B8' : '#64748B' }}
            >
              {dateLabel}
            </p>
            <h2
              className="font-extrabold mb-1"
              style={{ fontSize: '32px', color: dm ? '#F8FAFC' : '#172033', lineHeight: 1.2 }}
            >
              ¿Cómo te sientes hoy?
            </h2>
            <p
              className="text-[15px]"
              style={{ color: dm ? '#64748B' : '#94A3B8' }}
            >
              Selecciona un emoji
            </p>
          </header>

          {/* Emotion grid */}
          <div
            className="grid grid-cols-3 gap-4 mb-2"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            {moodEmojis.map((m) => {
              const isSelected = currentMood === m.emoji;
              return (
                <button
                  key={m.emoji}
                  onClick={() => handleMoodSelect(m.emoji)}
                  aria-label={`Emoción: ${m.label}`}
                  aria-pressed={isSelected}
                  className="relative flex flex-col items-center justify-center transition-all duration-200"
                  style={{
                    height: '130px',
                    borderRadius: '20px',
                    background: isSelected
                      ? dm ? 'rgba(248,59,145,0.12)' : '#FFF1F7'
                      : dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                    border: isSelected
                      ? dm ? '2px solid #F83B91' : '2px solid #F43F9E'
                      : dm ? '1px solid #293A62' : '1px solid #FCE7F3',
                    boxShadow: isSelected
                      ? dm ? '0 8px 24px rgba(248,59,145,0.15)' : '0 8px 24px rgba(244, 63, 158, 0.12)'
                      : 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.06)' : '#FFF7FA';
                      e.currentTarget.style.borderColor = dm ? '#34466F' : '#F9A8D4';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = dm ? '0 8px 20px rgba(0,0,0,0.2)' : '0 8px 20px rgba(244, 63, 158, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : '#FFFFFF';
                      e.currentTarget.style.borderColor = dm ? '#293A62' : '#FCE7F3';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = isSelected
                      ? dm ? '0 8px 24px rgba(248,59,145,0.15)' : '0 8px 24px rgba(244, 63, 158, 0.12)'
                      : dm ? '0 0 0 3px rgba(248,59,145,0.2)' : '0 0 0 3px rgba(244, 63, 158, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = isSelected
                      ? dm ? '0 8px 24px rgba(248,59,145,0.15)' : '0 8px 24px rgba(244, 63, 158, 0.12)'
                      : 'none';
                  }}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div
                      className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: dm ? '#F83B91' : '#F43F9E' }}
                    >
                      ✓
                    </div>
                  )}
                  <span
                    className="leading-none"
                    style={{
                      fontSize: isSelected ? '46px' : '42px',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {m.emoji}
                  </span>
                  <span
                    className="mt-2 font-semibold"
                    style={{
                      fontSize: '14px',
                      color: isSelected
                        ? dm ? '#F83B91' : '#F43F9E'
                        : dm ? '#CBD5E1' : '#334155',
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Textarea section */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-3">
              <Pencil size={14} className={dm ? 'text-[#F83B91]' : 'text-[#F43F9E]'} />
              <span
                className="font-bold uppercase"
                style={{
                  fontSize: '13px',
                  color: dm ? '#F83B91' : '#F43F9E',
                  letterSpacing: '0.03em',
                }}
              >
                Escribe cómo te sientes
              </span>
            </div>
            <div className="relative">
              <textarea
                value={localNote}
                onChange={(e) => setLocalNote(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Exprésate libremente... ¿Qué hay en tu mente y corazón hoy?"
                rows={6}
                className="w-full resize-none outline-none transition-all duration-200"
                style={{
                  borderRadius: '20px',
                  background: dm ? 'rgba(255,255,255,0.03)' : '#FFFCFD',
                  border: dm ? '1px solid #293A62' : '1px solid #FCE7F3',
                  padding: '20px',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: dm ? '#F8FAFC' : '#172033',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = dm ? '#F83B91' : '#F43F9E';
                  e.currentTarget.style.boxShadow = dm ? '0 0 0 4px rgba(248,59,145,0.1)' : '0 0 0 4px rgba(244, 63, 158, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = dm ? '#293A62' : '#FCE7F3';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <div
                className="flex justify-between items-center px-5 pb-1"
                style={{ marginTop: '6px' }}
              >
                <span style={{ fontSize: '13px', color: dm ? '#64748B' : '#94A3B8' }}>
                  {localNote.length} / {MAX_CHARS}
                </span>
                {localNote && (
                  <button
                    onClick={() => setLocalNote('')}
                    className="font-semibold transition"
                    style={{ fontSize: '13px', color: dm ? '#64748B' : '#94A3B8' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = dm ? '#F83B91' : '#F43F9E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = dm ? '#64748B' : '#94A3B8'; }}
                  >
                    Borrar texto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full font-bold text-white transition-all duration-200"
            style={{
              marginTop: '24px',
              height: '56px',
              borderRadius: '16px',
              background: dm ? '#F83B91' : '#F43F9E',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = dm ? '#E02D7C' : '#DB2777';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = dm ? '#F83B91' : '#F43F9E';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
