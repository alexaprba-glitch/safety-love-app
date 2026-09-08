import { Heart, Star, Clock, Shield } from 'lucide-react';

const stats = [
  { value: '98%', label: 'Usuarios satisfechos con la app', icon: Heart, accent: 'text-pink-500', bg: 'bg-pink-50' },
  { value: '7', label: 'Herramientas de bienestar', icon: Star, accent: 'text-amber-500', bg: 'bg-amber-50' },
  { value: '24/7', label: 'Acompañamiento disponible', icon: Clock, accent: 'text-violet-500', bg: 'bg-violet-50' },
  { value: '100%', label: 'Privacidad y seguridad garantizada', icon: Shield, accent: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function Stats() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="flex items-center gap-4 rounded-[1.5rem] border border-pink-50 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-800">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
