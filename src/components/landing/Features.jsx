import { Lightbulb, BookOpen, Smile, PenLine, MessageCircle, Bot } from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: 'Consejos diarios',
    desc: 'Recibe mensajes para inspirarte, mejorar tu día a día y motivarte.',
    color: 'text-amber-500',
    bg: 'bg-amber-100/60',
  },
  {
    icon: BookOpen,
    title: 'Versículo del día',
    desc: 'Palabra de Dios cada día para un mensaje de esperanza y sana fortaleza.',
    color: 'text-violet-500',
    bg: 'bg-violet-100/60',
  },
  {
    icon: Smile,
    title: 'Registro de emociones',
    desc: 'Entiende tus estados de ánimo y procesa lo que sientes con calma.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-100/60',
  },
  {
    icon: PenLine,
    title: 'Diario personal',
    desc: 'Escribe tus pensamientos y libérate de lo que llevas dentro.',
    color: 'text-pink-500',
    bg: 'bg-pink-100/60',
  },
  {
    icon: MessageCircle,
    title: 'Blog anónimo',
    desc: 'Comparte experiencias de forma segura con la comunidad.',
    color: 'text-blue-500',
    bg: 'bg-blue-100/60',
  },
  {
    icon: Bot,
    title: 'Asistente con IA',
    desc: 'Recibe acompañamiento inteligente para tu bienestar emocional.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-100/60',
  },
];

export default function Features() {
  return (
    <section id="caracteristicas" className="rounded-t-[3rem] bg-white py-20 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.08)] sm:py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Todo lo que necesitas para cuidar tu bienestar emocional
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-pink-50 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${feature.bg} ${feature.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-extrabold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
