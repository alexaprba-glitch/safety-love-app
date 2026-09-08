import React from 'react';

export default function AvatarPreview({ avatar }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-pink-50 p-0.5 flex items-center justify-center" style={{ background: avatar.skin }}>
        <div className="text-2xl">{avatar.mouth === 'happy' || avatar.mouth === 'smile' ? '😊' : '🙂'}</div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Así se verá tu avatar</p>
        <p className="text-xs text-gray-400">Puedes seguir personalizando cada detalle.</p>
      </div>
    </div>
  );
}