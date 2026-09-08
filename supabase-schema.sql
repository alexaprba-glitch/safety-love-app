-- ============================================================
-- Safety Love — Esquema completo de Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Tabla de perfiles de usuario (se crea al registrarse)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'adolescente' CHECK (role IN ('adolescente', 'psicologo')),
  gender_theme TEXT DEFAULT 'mujer' CHECK (gender_theme IN ('mujer', 'hombre')),
  avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniela',
  specialty TEXT,
  mascot_type TEXT DEFAULT 'gato' CHECK (mascot_type IN ('vaca', 'gato', 'oso')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de publicaciones del blog
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  avatar_initials TEXT,
  avatar_color TEXT,
  reactions JSONB DEFAULT '{"likes": 0, "apoyos": 0}',
  mood TEXT,
  is_edited BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de comentarios del blog
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de estados de ánimo (calendario emocional)
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  emoji TEXT,
  description TEXT,
  intensity INTEGER DEFAULT 2 CHECK (intensity BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 5. Relación estudiante-psicólogo
CREATE TABLE IF NOT EXISTS public.student_psychologist (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  psychologist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(student_id)
);

-- 6. Sesiones de chat con IA
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Chat sin título',
  preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Mensajes del chat con IA
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabla de mensajes guardados
CREATE TABLE IF NOT EXISTS public.saved_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image TEXT,
  quote TEXT,
  text TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabla de versículos guardados
CREATE TABLE IF NOT EXISTS public.saved_verses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  verse TEXT,
  ref TEXT,
  reflection TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabla de cartas
CREATE TABLE IF NOT EXISTS public.letters (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'carta',
  content TEXT,
  expiry TEXT DEFAULT '1 day',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_psychologist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Psychologists can view assigned students" ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.student_psychologist
      WHERE student_psychologist.student_id = public.profiles.id
      AND student_psychologist.psychologist_id = auth.uid()
      AND student_psychologist.status = 'active'
    )
  );

-- Posts: todos pueden leer, solo el autor puede modificar
CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authors can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Anyone can read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Mood entries: solo el usuario dueño + su psicólogo asignado
CREATE POLICY "Users can read own moods" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own moods" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own moods" ON public.mood_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own moods" ON public.mood_entries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Psychologists can view student moods" ON public.mood_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.student_psychologist
      WHERE student_psychologist.student_id = public.mood_entries.user_id
      AND student_psychologist.psychologist_id = auth.uid()
      AND student_psychologist.status = 'active'
    )
  );

-- Student-Psychologist relationship
CREATE POLICY "Students can view own assignment" ON public.student_psychologist FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Psychologists can view own assignments" ON public.student_psychologist FOR SELECT USING (auth.uid() = psychologist_id);
CREATE POLICY "Students can assign themselves" ON public.student_psychologist FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Chat sessions: solo el usuario dueño
CREATE POLICY "Users can read own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Chat messages: solo el usuario dueño
CREATE POLICY "Users can read own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat messages" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);

-- Saved messages
CREATE POLICY "Users can read own saved messages" ON public.saved_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved messages" ON public.saved_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved messages" ON public.saved_messages FOR DELETE USING (auth.uid() = user_id);

-- Saved verses
CREATE POLICY "Users can read own saved verses" ON public.saved_verses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved verses" ON public.saved_verses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved verses" ON public.saved_verses FOR DELETE USING (auth.uid() = user_id);

-- Letters
CREATE POLICY "Users can read own letters" ON public.letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own letters" ON public.letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own letters" ON public.letters FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: crear perfil automáticamente al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, gender_theme, avatar, mascot_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'adolescente'),
    COALESCE(NEW.raw_user_meta_data->>'gender_theme', 'mujer'),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniela',
    'gato'
  );

  -- Si el estudiante seleccionó un psicólogo, crear la relación
  IF (NEW.raw_user_meta_data->>'psychologist_id') IS NOT NULL THEN
    INSERT INTO public.student_psychologist (student_id, psychologist_id)
    VALUES (NEW.id, (NEW.raw_user_meta_data->>'psychologist_id')::UUID);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON public.mood_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_student_psychologist_student ON public.student_psychologist(student_id);
CREATE INDEX IF NOT EXISTS idx_student_psychologist_psychologist ON public.student_psychologist(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
