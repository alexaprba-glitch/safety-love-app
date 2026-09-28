import { supabase } from '../supabase';

export async function getChatSessions(userId) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, preview, updated_at, created_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function createChatSession(userId, title = 'Chat sin título') {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select('id, title, preview, updated_at, created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function updateChatSession(sessionId, { title, preview }) {
  const updates = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (preview !== undefined) updates.preview = preview;

  const { data, error } = await supabase
    .from('chat_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select('id, title, preview, updated_at, created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChatSession(sessionId) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);
  if (error) throw error;
}

export async function getChatMessages(sessionId, { limit = 100, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function addChatMessage({ sessionId, userId, role, content }) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, user_id: userId, role, content })
    .select('id, role, content, created_at')
    .single();
  if (error) throw error;
  return data;
}
