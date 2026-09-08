import React from 'react';
import { User, Scissors, Shirt, Star } from 'lucide-react';

const CATEGORIES = [
  { id: 'apariencia', label: 'Apariencia', icon: User },
  { id: 'cabello', label: 'Cabello', icon: Scissors },
  { id: 'ropa', label: 'Ropa', icon: Shirt },
  { id: 'accesorios', label: 'Accesorios', icon: Star },
];

export default function CategorySidebar({ active, onSelect }) {
  return (
    <nav className="flex flex-col gap-3 w-44">
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition w-full text-left ${
              isActive ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={18} />
            <span>{c.label}</span>
          </button>
        );
      })}
    </nav>
  );
}