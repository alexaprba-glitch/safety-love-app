import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'María G.',
    quote: 'Safety Love me ayudó a organizar mi día y a escucharme mejor. Lo recomiendo totalmente.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'Daniela R.',
    quote: 'La parte del blog anónimo y el diario personal me dieron un espacio seguro para respirar.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Juan F.',
    quote: 'La app me ayudó a conectar con mi bienestar emocional de forma práctica y sencilla.',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
              Lo que dicen nuestros usuarios
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full border border-pink-100 bg-white p-2 text-slate-700 transition hover:bg-pink-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="rounded-full border border-pink-100 bg-white p-2 text-slate-700 transition hover:bg-pink-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-[1.5rem] border border-pink-50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-extrabold text-slate-800">{item.name}</p>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">“{item.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
