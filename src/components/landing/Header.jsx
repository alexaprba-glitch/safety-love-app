import { Heart, Menu } from 'lucide-react';

export default function Header({ onEnterApp, mobileMenu, setMobileMenu }) {
  const navItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Características', href: '#caracteristicas' },
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-pink-100/80 bg-slate-50/90 backdrop-blur-md">
      <div className="mx-auto flex w-[92%] max-w-7xl items-center justify-between gap-4 py-4">
        <a href="#inicio" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-pink-100">
            <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800">Safety Love</h1>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
              Tu bienestar, tus relaciones, tu mejor versión
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-pink-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={onEnterApp}
            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Descargar App
          </button>
        </div>

        <button
          className="rounded-full border border-pink-100 bg-white p-2 text-slate-700 lg:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileMenu && (
        <div className="mx-auto flex w-[92%] max-w-7xl flex-col gap-3 border-t border-pink-100 bg-white py-4 lg:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-pink-50 hover:text-pink-500"
              onClick={() => setMobileMenu(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenu(false);
              onEnterApp();
            }}
            className="mt-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3 text-sm font-bold text-white"
          >
            Descargar App
          </button>
        </div>
      )}
    </header>
  );
}
