import React from 'react';
import { Check } from 'lucide-react';

const FACES = [
  { id: 'round', label: 'Redondo' },
  { id: 'oval', label: 'Ovalado' },
  { id: 'square', label: 'Cuadrado' },
  { id: 'rectangular', label: 'Rectangular' },
];

const SKIN_TONES = ['#ffe0bd', '#f6c9a6', '#e5ad7c', '#f0b68a', '#c68642', '#8d5524'];

const EXPRESSIONS = [
  { id: 'happy', label: 'Felices', emoji: '😊' },
  { id: 'relaxed', label: 'Relajado', emoji: '😌' },
  { id: 'sleepy', label: 'Soñoliento', emoji: '😴' },
  { id: 'smile', label: 'Sonrisa', emoji: '🙂' },
  { id: 'neutral', label: 'Neutra', emoji: '😐' },
  { id: 'serious', label: 'Seria', emoji: '😑' },
  { id: 'surprised', label: 'Sorprendida', emoji: '😲' },
  { id: 'winky', label: 'Guiño', emoji: '😉' },
];

function StyleCard({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 transition w-full ${
        active ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

export default function AppearancePanel({ avatar, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs uppercase text-gray-400 font-semibold mb-3">Forma de rostro</h4>
        <div className="grid grid-cols-4 gap-3">
          {FACES.map((f) => (
            <StyleCard key={f.id} active={avatar.face === f.id} onClick={() => onChange({ face: f.id })}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: avatar.skin }}>
                {/* simple visual */}
                <div className="w-8 h-8 rounded" style={{ background: '#ffffff', opacity: 0.06 }} />
              </div>
              <div className={`text-xs font-bold ${avatar.face === f.id ? 'text-pink-600' : 'text-gray-600'}`}>{f.label}</div>
              {avatar.face === f.id ? (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px]">
                  <Check size={12} />
                </div>
              ) : null}
            </StyleCard>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase text-gray-400 font-semibold mb-3">Tono de piel</h4>
        <div className="flex items-center gap-3">
          {SKIN_TONES.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ skin: c })}
              className={`w-9 h-9 rounded-full border shadow-sm transition ${avatar.skin === c ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase text-gray-400 font-semibold mb-3">Expresión</h4>
        <div className="grid grid-cols-4 gap-3">
          {EXPRESSIONS.map((ex) => (
            <StyleCard key={ex.id} active={avatar.mouth === ex.id} onClick={() => onChange({ mouth: ex.id, eyes: ex.id })}>
              <div className="text-2xl">{ex.emoji}</div>
              <div className={`text-xs ${avatar.mouth === ex.id ? 'text-pink-600' : 'text-gray-600'}`}>{ex.label}</div>
            </StyleCard>
          ))}
        </div>
      </div>
    </div>
  );
}