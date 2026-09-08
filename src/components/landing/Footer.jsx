import { Heart, Camera, Play, Globe } from 'lucide-react';

const quickLinks = ['Inicio', 'Características', 'Beneficios', 'Testimonios', 'FAQ'];
const communityLinks = ['Blog anónimo', 'Consejos', 'Versículos', 'Ejercicios', 'Retos'];

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-300">
      <div className="mx-auto grid w-[92%] max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Heart className="h-5 w-5 text-pink-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-white">Safety Love</p>
              <p className="text-xs text-slate-400">Tu bienestar, tus relaciones, tu mejor versión</p>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <a href="#" className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"><Camera className="h-4 w-4" /></a>
            <a href="#" className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"><Play className="h-4 w-4" /></a>
            <a href="#" className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"><Globe className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">Enlaces rápidos</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item}><a href="#" className="transition hover:text-pink-300">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">Comunidad</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {communityLinks.map((item) => (
              <li key={item}><a href="#" className="transition hover:text-pink-300">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">Legal y contacto</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href="#" className="transition hover:text-pink-300">Política de privacidad</a></li>
            <li><a href="#" className="transition hover:text-pink-300">Términos</a></li>
            <li><a href="mailto:contacto@safetylove.app" className="transition hover:text-pink-300">contacto@safetylove.app</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 w-[92%] max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-400">
        © 2026 Safety Love. Todos los derechos reservados.
      </div>
    </footer>
  );
}
