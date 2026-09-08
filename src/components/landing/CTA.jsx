import { Apple, Play } from 'lucide-react';

export default function CTA() {
  return (
    <section className="px-4 py-20 sm:py-24">
      <div className="mx-auto grid w-[92%] max-w-7xl items-center gap-8 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-pink-500 to-violet-500 p-8 text-white shadow-xl shadow-pink-200/40 lg:grid-cols-[1fr_0.9fr] lg:p-12">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-[11px] font-bold tracking-[0.24em] text-white/90">
            DESCARGA YA
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empieza hoy a construir relaciones más saludables
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-pink-50 sm:text-base">
            Descarga Safety Love y lleva tu bienestar emocional a otro nivel con acompañamiento, inspiración y comunidad.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5">
              <Apple className="h-5 w-5" />
              App Store
            </button>
            <button className="flex items-center gap-3 rounded-full border border-white/50 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
              <Play className="h-5 w-5" />
              Google Play
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-[250px] rounded-[2.5rem] border-[8px] border-slate-900 bg-white shadow-2xl">
            <div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-b-[1rem] bg-slate-900" />
            <div className="rounded-[1.7rem] bg-[#fffafc] px-4 pb-5 pt-8">
              <div className="rounded-[1.4rem] bg-white p-4 shadow-sm ring-1 ring-pink-100">
                <p className="text-[11px] font-extrabold tracking-[0.22em] text-pink-500">SAFE-LOVE</p>
                <h3 className="mt-2 text-[15px] font-extrabold text-slate-800">Tu acompañamiento emocional</h3>
                <p className="mt-2 text-[11px] leading-5 text-slate-600">Respaldo, inspiración y claridad para cada día.</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-3 hidden h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-lg sm:flex">💖</div>
        </div>
      </div>
    </section>
  );
}
