import React, { useState } from 'react';

export default function AnonymousChatSection({ darkMode }) {
  const [newPostText, setNewPostText] = useState('');
  const [category, setCategory] = useState('Todos');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('Recientes');
  const [posts, setPosts] = useState([]);

  // Fake current user for demo purposes. Avatar will be rendered from AvatarPortrait (which reads saved avatar config).
  const currentUser = {
    id: 'me',
    name: 'Tú'
  };

  function makeId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function handlePublish(e) {
    e && e.preventDefault();
    if (!newPostText.trim()) return;

    const post = {
      id: makeId(),
      author: isAnonymous ? null : currentUser.name,
      avatarUrl: isAnonymous ? null : currentUser.avatarUrl,
      text: newPostText.trim(),
      category,
      created_at: new Date().toLocaleString(),
      likes: 0,
      comments: 0,
      views: 0,
    };

    // optimistic UI: add locally immediately
    setPosts(prev => [post, ...prev]);
    setNewPostText('');

    // TODO: persist to backend (Supabase) if available. Keep optimistic local update on failure.
  }

  function renderAvatar(post) {
    // if post explicitly anonymous or no post provided, show the anonymous silhouette
    if (!post || post.isAnonymous || post.avatarUrl === null || post.avatarUrl === undefined) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-pink-50 shadow-inner">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0" />
          </svg>
        </div>
      );
    }

    // public: render the saved avatar portrait (reads localStorage 'safetyLoveAvatar' so matches settings)
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
        <AvatarPortrait variant="head" className="w-full h-full" />
      </div>
    );
  }

  const categories = ['Todos','Relaciones','Consejos','Superación','Ansiedad','Autoestima','Apoyo'];

  const visiblePosts = posts.filter(p => activeFilter === 'Todos' ? true : p.category === activeFilter);

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-[#0f1724]' : 'bg-[#FAF6F6]'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <main className="lg:col-span-2">
            <div className="mb-4">
              {/* Replaced search with compose card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={`text-2xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Blog Anónimo</h1>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comparte tus experiencias de forma segura.</p>
                </div>
              </div>

              <form onSubmit={handlePublish} className="mb-4">
                {/* Compose card: pale pink background, rounded, with icons and publish button on the right */}
                <div className={`bg-[#FFF5F8] rounded-xl p-4 shadow-sm border ${darkMode ? 'border-gray-800' : 'border-pink-50'} flex items-start gap-4`}>
                  <div className="w-12 h-12" />

                  <div className="flex-1">
                    <div className="bg-white/60 rounded-lg p-3">
                      <textarea value={newPostText} onChange={(e) => setNewPostText(e.target.value)} placeholder="¿Qué hay en tu corazón hoy? Compártelo anónimamente..." className="w-full min-h-[90px] resize-none text-sm bg-transparent outline-none" />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {/* Action icons similar to the design: emoji, image, link */}
                        <div className="flex items-center gap-2">
                          <button type="button" className="p-2 rounded-md bg-white border border-transparent hover:bg-white/80 text-pink-500">😊</button>
                          <button type="button" className="p-2 rounded-md bg-white border border-transparent hover:bg-white/80 text-pink-500">🖼️</button>
                          <button type="button" className="p-2 rounded-md bg-white border border-transparent hover:bg-white/80 text-pink-500">🔗</button>
                        </div>

                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <label className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="accent-pink-500" />
                          <span className="text-xs text-gray-600">Publicar anónimamente</span>
                        </label>
                      </div>

                      <button type="submit" className="px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-400 text-white rounded-full font-semibold shadow">Publicar</button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {['Recientes','Más gustadas','Historias destacadas'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === tab ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-white text-gray-600 border border-gray-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {visiblePosts.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">Aún no hay anécdotas. Sé el primero en compartir.</div>
                ) : visiblePosts.map(msg => (
                  <article key={msg.id} className="bg-white rounded-xl shadow-sm border border-pink-50 p-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-gray-800">{msg.author || 'Anónimo'}</div>
                            <div className="text-xs text-gray-400">{msg.created_at}</div>
                          </div>
                          <div className="text-gray-300">⋯</div>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{msg.text}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button className="flex items-center gap-2 text-pink-500">❤ <span className="text-xs">{msg.likes ?? 0}</span></button>
                            <button className="flex items-center gap-2">💬 <span className="text-xs">{msg.comments ?? 0}</span></button>
                          </div>
                          <div className="text-xs text-gray-400">{msg.views ? `${msg.views} vistas` : ''}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-6">
                <button className="px-4 py-2 bg-white border border-pink-100 text-pink-600 rounded-full text-sm font-semibold">Cargar más publicaciones</button>
              </div>

            </div>
          </main>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-bold uppercase tracking-wider text-pink-500 shadow-sm mb-2 border border-pink-50">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span> Tu bienestar es importante
              </span>
              <p className="text-xs text-gray-500 mt-2">Si te sientes mal, recuerda que pedir ayuda es valiente. Encuentra recursos y pasos para cuidarte.</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-[15px] font-bold text-slate-800 mb-3">Guía rápida</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-pink-500">•</span> Comparte con respeto.</li>
                <li className="flex items-start gap-2"><span className="text-pink-500">•</span> Evita detalles personales.</li>
                <li className="flex items-start gap-2"><span className="text-pink-500">•</span> Si necesitas, busca ayuda profesional.</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[15px] font-bold text-slate-800">Usuarios solidarios</div>
                <button className="text-xs text-pink-500 font-semibold">Ver todos</button>
              </div>
              <div className="flex items-center gap-3">
                {[1,2,3,4,5].map(i => (
                                  <div key={i} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm bg-pink-50" />
                                ))}
              </div>
            </div>
          </aside>

        </div>

        <button onClick={() => document.querySelector('textarea')?.focus()} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-400 text-white shadow-lg flex items-center justify-center text-2xl">+</button>
      </div>
    </div>
  );
}
