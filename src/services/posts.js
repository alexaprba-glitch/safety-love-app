import { supabase } from '../supabase';

export async function getPosts({ limit = 50, offset = 0, category = null } = {}) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'General') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPost({
  userId,
  authorName = null,
  content,
  category = 'General',
  isAnonymous = true,
  avatarInitials = null,
  avatarColor = null,
  imageUrl = null,
  mood = null,
}) {
  const entry = {
    user_id: isAnonymous ? null : userId,
    author_name: isAnonymous ? null : authorName,
    content,
    category,
    is_anonymous: isAnonymous,
    avatar_initials: avatarInitials,
    avatar_color: avatarColor,
    image_url: imageUrl,
    mood,
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(postId, userId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function getPostComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment({ postId, userId, authorName, content }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, author_name: authorName, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId, userId) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function getStudentPostsForPsychologist(studentIds) {
  if (!studentIds || studentIds.length === 0) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .in('user_id', studentIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
