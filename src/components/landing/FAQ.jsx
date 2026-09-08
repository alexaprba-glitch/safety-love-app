import { ChevronDown, Heart } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: '¿Qué es Safety Love?',
    answer: 'Safety Love es una app de bienestar emocional y relaciones sanas, diseñada para acompañarte con herramientas, apoyo diario y comunidad segura.',
  },
  {
    question: '¿La información es privada y segura?',
    answer: 'Sí. Tu información se procesa con enfoque en privacidad y seguridad, y tu experiencia es pensada para ser segura y confidencial.',
  },
  {
    question: '¿Funciona sin internet?',
    answer: 'Algunas funciones pueden requerir conexión para sincronizar contenido, pero la experiencia principal está diseñada para ser útil y accesible.',
  },
  {
    question: '¿Tiene algún costo?',
    answer: 'Safety Love ofrece una experiencia de prueba y acceso con opciones según tu plan de uso.',
  },
  {
    question: '¿Incluye contenido cristiano?',
    answer: 'Sí, incluye mensajes, reflexiones y contenido basado en principios cristianos dentro del enfoque de bienestar emocional.',
  },
  {
    question: '¿Cómo puedo crear una cuenta?',
    answer: 'Puedes empezar desde la landing o la pantalla de acceso con un registro rápido y sencillo.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[#fff9fb] py-20 sm:py-24">
      <div className="mx-auto grid w-[92%] max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500 lg:mx-0">
            <Heart className="h-9 w-9" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Todo lo que necesitas saber para comenzar tu experiencia con Safety Love.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-extrabold text-slate-800">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 text-pink-500 transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-6 text-slate-600">{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
