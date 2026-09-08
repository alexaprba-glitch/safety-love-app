import { BookOpen, MessageCircle, Sparkles } from 'lucide-react';

export default function Showcase() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-pink-50/30 py-20 sm:py-24">
      <div className="mx-auto grid w-[92%] max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Diseñada para acompañarte en cada momento
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Una experiencia sencilla, bella y pensada para cuidarte en cada paso del día.
          </p>
          <button className="mt-7 rounded-full border-2 border-pink-200 bg-white px-6 py-3 text-sm font-bold text-pink-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-50">
            Conoce más
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-pink-100 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] border border-pink-100 bg-[#fffafc] p-5 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="mt-4 text-center text-sm font-extrabold text-slate-800">Consejos</p>
              <div className="mt-4 rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-xs font-bold text-pink-500">Hoy</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">Haz una pausa de 3 minutos y respira con calma antes de tomar decisiones importantes.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-pink-100 bg-[#fffafc] p-5 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
                <MessageCircle className="h-5 w-5" />
              </div>
              <p className="mt-4 text-center text-sm font-extrabold text-slate-800">Blog</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  <p className="text-[11px] font-bold text-slate-700">Anónimo</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">Aprender a decir “no” me ayudó a cuidar mejor mi energía.</p>
                </div>
                <div className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
                  <p className="text-[11px] font-bold text-slate-700">Anónimo</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">¿Cómo manejo la ansiedad social en reuniones grandes?</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-pink-100 bg-[#fffafc] p-5 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-4 text-center text-sm font-extrabold text-slate-800">Versículo</p>
              <div className="mt-4 rounded-[1.25rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-xs font-bold text-violet-500">Versículo del día</p>
                <p className="mt-2 text-xs leading-5 text-slate-600">“No temas, porque yo estoy contigo.”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
