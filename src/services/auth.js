import { supabase } from '../supabase';

export async function signUp({ email, password, name, role = 'adolescente', genderTheme = 'mujer', psychologistId = null, grade = null }) {
  const metadata = { name, role, gender_theme: genderTheme };
  if (psychologistId) metadata.psychologist_id = String(psychologistId);
  if (grade) metadata.grade = grade;

  console.log('[Auth] signUp attempt:', { email, role });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  console.log('[Auth] signUp result:', { data, error });
  if (error) throw error;

  if (data?.user) {
    const profileData = {
      id: data.user.id,
      name: name,
      email: email,
      role: role,
      gender_theme: genderTheme || 'mujer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(name || 'User'),
      mascot_type: 'gato'
    };
    if (grade) profileData.grade = grade;
    const { error: profileError } = await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
    console.log('[Auth] profile upsert:', profileError ? 'ERROR: ' + profileError.message : 'OK');

    if (role === 'adolescente' && psychologistId) {
      const { error: relError } = await supabase.from('student_psychologist').upsert({
        student_id: data.user.id,
        psychologist_id: psychologistId
      }, { onConflict: 'student_id' });
      console.log('[Auth] student_psychologist upsert:', relError ? 'ERROR: ' + relError.message : 'OK');
    }
  }

  return data;
}

export async function signIn({ email, password }) {
  console.log('[Auth] signIn attempt:', { email });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log('[Auth] signIn result:', { data, error });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
