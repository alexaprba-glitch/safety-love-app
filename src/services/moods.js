import { supabase } from '../supabase';

export async function getMoodEntries(userId) {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('date, emoji, description, intensity')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function upsertMoodEntry(userId, { date, emoji, description, intensity = 2 }) {
  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      { user_id: userId, date, emoji, description, intensity },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMoodEntry(userId, date) {
  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw error;
}

export async function getStudentMoodsForPsychologist(studentIds) {
  if (!studentIds || studentIds.length === 0) return [];
  const { data, error } = await supabase
    .from('mood_entries')
    .select('user_id, date, emoji, description, intensity')
    .in('user_id', studentIds);
  if (error) throw error;
  return data;
}
