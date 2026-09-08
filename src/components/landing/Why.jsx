import { HeartHandshake, Users, SmilePlus, Sparkles, Shield, Bot } from 'lucide-react';

const reasons = [
  { icon: HeartHandshake, title: 'Fortalece tu autoestima', desc: 'Reconoce tu valor y cuida tu bienestar emocional.' },
  { icon: Users, title: 'Aprende sobre relaciones saludables', desc: 'Descubre cómo construir vínculos seguros y equilibrados.' },
  { icon: SmilePlus, title: 'Expresa tus emociones', desc: 'Encuentra un espacio para nombrar y comprender lo que sientes.' },
  { icon: Sparkles, title: 'Encuentra inspiración diaria', desc: 'Mensajes que acompañan tu crecimiento con calma y ánimo.' },
  { icon: Shield, title: 'Comparte experiencias de forma anónima', desc: 'Tu información permanece privada y protegida.' },
  { icon: Bot, title: 'Recibe acompañamiento inteligente', desc: 'Usa IA para conversar, reflexionar y empoderarte.' },
];

export default function Why() {
  return (
    <section id="beneficios" className="bg-[#fff9fb] py-20 sm:py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            ¿Por qué Safety Love?
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <article key={reason.title} className="rounded-[1.5rem] bg-white p-6 text-center shadow-sm ring-1 ring-pink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-slate-800">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{reason.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
