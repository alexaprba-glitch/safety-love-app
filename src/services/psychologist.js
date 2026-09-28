import { supabase } from '../supabase';

export async function getAssignedStudents(psychologistId) {
  const { data, error } = await supabase
    .from('student_psychologist')
    .select('student_id, assigned_at, status, profiles!student_psychologist_student_id_fkey(id, name, email, avatar, role)')
    .eq('psychologist_id', psychologistId)
    .eq('status', 'active');
  if (error) throw error;
  return data;
}

export async function getStudentPsychologist(studentId) {
  const { data, error } = await supabase
    .from('student_psychologist')
    .select('psychologist_id, profiles!student_psychologist_psychologist_id_fkey(id, name, email, avatar)')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function assignStudentToPsychologist(studentId, psychologistId) {
  const { data, error } = await supabase
    .from('student_psychologist')
    .upsert(
      { student_id: studentId, psychologist_id: psychologistId, status: 'active' },
      { onConflict: 'student_id' }
    )
    .select('student_id, psychologist_id, assigned_at, status')
    .single();
  if (error) throw error;
  return data;
}

export async function unassignStudent(studentId) {
  const { error } = await supabase
    .from('student_psychologist')
    .update({ status: 'inactive' })
    .eq('student_id', studentId);
  if (error) throw error;
}
