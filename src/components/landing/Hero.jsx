import {
  Heart,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Smile,
  PenLine,
  MessageCircle,
  Bot,
} from 'lucide-react';

const floatingCards = [
  { icon: Lightbulb, label: 'Consejos diarios', color: 'text-amber-500', bg: 'bg-amber-100/60' },
  { icon: BookOpen, label: 'Versículo del día', color: 'text-violet-500', bg: 'bg-violet-100/60' },
  { icon: Smile, label: 'Registro de emociones', color: 'text-emerald-500', bg: 'bg-emerald-100/60' },
  { icon: PenLine, label: 'Diario personal', color: 'text-pink-500', bg: 'bg-pink-100/60' },
  { icon: MessageCircle, label: 'Blog anónimo', color: 'text-blue-500', bg: 'bg-blue-100/60' },
  { icon: Bot, label: 'Asistente con IA', color: 'text-indigo-500', bg: 'bg-indigo-100/60' },
];

export default function Hero({ onEnterApp }) {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-pink-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[20rem] w-[20rem] rounded-full bg-violet-100/60 blur-3xl" />
      </div>

      <div className="mx-auto grid w-[92%] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <span className="inline-flex rounded-full bg-pink-100 px-4 py-1.5 text-[11px] font-bold tracking-[0.24em] text-pink-600">
            BIENESTAR EMOCIONAL
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-900 sm:text-5xl lg:text-[4.6rem]">
            Construye relaciones <span className="text-pink-500">más sanas</span>, comenzando por ti. <span className="text-4xl">💖</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
            Safety Love te acompaña con herramientas de bienestar, emociones, hábito saludable y comunidad segura para cuidar tu mente y tus relaciones.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Comenzar ahora <ChevronRight className="h-4 w-4" />
            </button>
            <a
              href="#caracteristicas"
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3.5 text-sm font-bold text-pink-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-50"
            >
              Ver funciones <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/150?img=47" alt="Usuario" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              <img src="https://i.pravatar.cc/150?img=44" alt="Usuario" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              <img src="https://i.pravatar.cc/150?img=11" alt="Usuario" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              <span className="font-extrabold text-slate-800">+10K personas</span> ya están transformando su vida.
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center lg:max-w-[560px]">
          <div className="relative w-[290px] rounded-[3rem] border-[10px] border-slate-900 bg-white shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)] sm:w-[320px]">
            <div className="absolute left-1/2 top-0 h-[1.75rem] w-[9rem] -translate-x-1/2 rounded-b-[1.25rem] bg-slate-900" />
            <div className="rounded-[2.2rem] bg-[#fffafc] px-4 pb-6 pt-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-extrabold text-slate-800">Hola Miguel</p>
                  <p className="text-xs font-medium text-slate-500">Tu bienestar empieza hoy.</p>
                </div>
                <img src="https://i.pravatar.cc/150?img=11" alt="Perfil" className="h-10 w-10 rounded-2xl object-cover" />
              </div>

              <div className="mt-4 rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-pink-100">
                <p className="text-[11px] font-extrabold tracking-[0.22em] text-pink-500">PENSAMIENTO DEL DÍA</p>
                <h3 className="mt-2 text-[15px] font-extrabold leading-6 text-slate-800">
                  “El amor no se mendiga, se cultiva y se cuida con paciencia.”
                </h3>
                <p className="mt-2 text-[11px] font-semibold text-slate-400">Hace 2 horas</p>
              </div>

              <div className="mt-4 rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-pink-100">
                <p className="text-sm font-extrabold text-slate-800">Recordatorios</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold text-pink-600">Respirar profundo</span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-600">Tomar agua</span>
                </div>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm font-extrabold text-slate-800">¿Cómo te sientes?</p>
                <div className="mt-3 flex items-center justify-between px-1">
                  {['😢', '😐', '🙂', '😄'].map((emoji) => (
                    <div key={emoji} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-slate-100">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {floatingCards.map((card, idx) => {
            const Icon = card.icon;
            const positions = [
              'left-[-0.5rem] top-[10%] sm:left-[-2rem]',
              'left-[-1rem] top-[38%] sm:left-[-3rem]',
              'left-[-0.75rem] bottom-[18%] sm:left-[-2.5rem]',
              'right-[-0.75rem] top-[18%] sm:right-[-2.5rem]',
              'right-[-1rem] top-[54%] sm:right-[-3rem]',
              'right-[-0.5rem] bottom-[20%] sm:right-[-2.5rem]',
            ];

            return (
              <div
                key={card.label}
                className={`absolute hidden items-center gap-3 rounded-2xl border border-pink-50 bg-white px-4 py-3 shadow-lg shadow-pink-100/50 sm:flex ${positions[idx]}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[12px] font-extrabold leading-tight text-slate-700">{card.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
