const fs = require('fs');

const content = fs.readFileSync('src/DashboardEscritorio.jsx', 'utf8');
const lines = content.split('\n');

const newHomeSection = `              {/* Header */}
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-[24px] font-bold text-gray-900 flex items-center gap-2">
                    Hola de nuevo, Miguel <span className="text-pink-400">❤</span>
                  </h1>
                  <p className="text-[14px] text-gray-600 mt-1">¿Qué te gustaría cultivar hoy?</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 bg-pink-50 text-pink-500 px-4 py-2 rounded-full font-bold text-sm hover:bg-pink-100 transition">
                    <span className="text-lg">⭐</span> Reto del día
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm text-gray-400 hover:text-pink-500 transition">
                    <Bell size={18} />
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Columna Izquierda */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-pink-500 shadow-sm mb-2 border border-pink-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span> Tu bienestar es importante
                    </span>
                  </div>
                  
                  <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                    <img src="/pink_hoodie_cat.jpg" alt="Pet Mascot" className="w-full max-w-[320px] h-auto object-contain drop-shadow-xl animate-float relative z-10 rounded-[32px]" />
                  </div>

                  <div className="bg-white rounded-[24px] p-5 shadow-sm mt-4 relative z-20 border border-gray-50">
                     <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold text-xs">Lv.5</div>
                         <span className="font-bold text-sm text-gray-800">Bumi</span>
                       </div>
                       <button className="text-[10px] font-bold text-pink-400 uppercase tracking-wider bg-pink-50 px-2 py-1 rounded-full">Cambiar mascota</button>
                     </div>
                     <p className="text-xs text-gray-400 font-medium mb-3">Estoy muy feliz de verte hoy! 🐾</p>
                     
                     <div className="flex items-center gap-3 mb-6">
                       <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-[#FF4B82] to-[#FF8FA3] rounded-full shadow-[0_0_10px_rgba(255,75,130,0.5)]" style={{width: '78%'}}></div>
                       </div>
                       <span className="text-xs font-bold text-pink-500">78/100 EXP</span>
                     </div>
                     
                     <div className="flex justify-between items-center text-center px-2">
                       <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100/50"><Smile size={18} /></div>
                         <div className="text-left">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Felicidad</p>
                           <p className="text-sm font-bold text-gray-800">Alta</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50"><Zap size={18} /></div>
                         <div className="text-left">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Energía</p>
                           <p className="text-sm font-bold text-gray-800">Media</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-sm border border-green-100/50"><Heart size={18} /></div>
                         <div className="text-left">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Afecto</p>
                           <p className="text-sm font-bold text-gray-800">Max</p>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Racha de inicio de sesión */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm relative overflow-visible border border-gray-50">
                     <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl flex items-center justify-center shadow-sm border border-white">
                           <Flame size={24} className="text-pink-500" />
                         </div>
                         <h3 className="font-extrabold text-gray-800 text-xl">Racha de inicio de sesión</h3>
                       </div>
                       
                       <div className="absolute right-8 top-[-5px]">
                         <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M0 0H60V70L30 55L0 70V0Z" fill="url(#paint0_linear)"/>
                           <defs>
                             <linearGradient id="paint0_linear" x1="30" y1="0" x2="30" y2="70" gradientUnits="userSpaceOnUse">
                               <stop stopColor="#FF4B82"/>
                               <stop offset="1" stopColor="#FF8FA3"/>
                             </linearGradient>
                           </defs>
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Días</span>
                           <span className="text-2xl font-black leading-none drop-shadow-sm">4</span>
                         </div>
                       </div>
                     </div>
                     <p className="text-sm text-gray-400 font-medium mb-8">¡Estás en racha! Inicia sesión 3 días más para ganar una recompensa.</p>
                     
                     <div className="flex justify-between items-center mb-6 relative px-2">
                       <div className="absolute top-1/2 left-6 right-6 h-1 bg-pink-50 -z-10 -translate-y-1/2 rounded-full"></div>
                       {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'].map((day, idx) => {
                         const isPast = idx < 6;
                         const isToday = idx === 6;
                         return (
                         <div key={day} className="flex flex-col items-center gap-3 bg-white px-1">
                           <div className={\`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 \${isPast ? 'bg-pink-100 text-pink-500' : isToday ? 'bg-[#FF4B82] text-white shadow-md shadow-pink-200' : 'bg-gray-50 text-gray-300 border border-gray-100'}\`}>
                             {isToday ? (
                               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4B82] to-[#FF8FA3] flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,75,130,0.4)] ring-4 ring-pink-50">
                                 4
                               </div>
                             ) : isPast ? (
                               <Check size={16} strokeWidth={3} />
                             ) : (
                               <span className="text-xs font-bold">{idx + 1}</span>
                             )}
                           </div>
                           <span className={\`text-[11px] font-bold uppercase tracking-wider \${isToday ? 'text-[#FF4B82]' : 'text-gray-400'}\`}>{day}</span>
                         </div>
                       )})}
                     </div>
                     <p className="text-[11px] font-bold text-center text-gray-400 uppercase tracking-wider">Completa tu racha de 7 días para desbloquear el tema "Galaxia"</p>
                  </div>

                  {/* Tu compañero está aquí */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm flex-1 border border-gray-50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl flex items-center justify-center shadow-sm border border-white">
                         <MessageCircle size={24} className="text-pink-500" />
                       </div>
                       <h3 className="font-extrabold text-gray-800 text-xl">Tu compañero está aquí</h3>
                     </div>
                     <p className="text-sm text-gray-400 font-medium mb-6">Interactúa con Bumi para mejorar su estado de ánimo y ganar experiencia.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <button className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-pink-50 hover:border-pink-100 transition group text-center">
                         <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform duration-300">
                            🍖
                         </div>
                         <div>
                           <p className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">Alimentar</p>
                           <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mt-1">+10 EXP</p>
                         </div>
                       </button>
                       
                       <button className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-pink-50 hover:border-pink-100 transition group text-center">
                         <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform duration-300">
                            🎾
                         </div>
                         <div>
                           <p className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">Jugar</p>
                           <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mt-1">+15 EXP</p>
                         </div>
                       </button>

                       <button className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-pink-50 hover:border-pink-100 transition group text-center">
                         <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm text-2xl group-hover:scale-110 transition-transform duration-300">
                            💤
                         </div>
                         <div>
                           <p className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">Dormir</p>
                           <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider mt-1">+5 EXP</p>
                         </div>
                       </button>
                     </div>
                  </div>
                </div>
              </div>`;

// Safely splice lines 2259 to 2382 (0-indexed lines 2258 to 2381)
lines.splice(2259, 2382 - 2259 + 1, newHomeSection);

fs.writeFileSync('src/DashboardEscritorio.jsx', lines.join('\n'), 'utf8');
console.log('Replaced lines safely');
