import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

export default function BottomBar({ onReset, onSave }) {
  const [toast, setToast] = useState(null);
  function save() {
    onSave && onSave();
    setToast('Avatar guardado correctamente');
    setTimeout(() => setToast(null), 2200);
  }
  return (
    <div className="shrink-0 px-4 pb-6 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50">
            <Shirt size={16} className="text-pink-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Tu avatar</div>
            <div className="text-xs text-gray-400">Personaliza tu compañero</div>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={onReset} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Restablecer</button>
          <button onClick={save} className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105">Guardar avatar</button>
        </div>
      </div>
      {toast ? (
        <div className="fixed left-1/2 top-6 -translate-x-1/2 z-50 rounded-full bg-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-lg">{toast}</div>
      ) : null}
    </div>
  );
}