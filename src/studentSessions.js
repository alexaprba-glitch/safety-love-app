// Sesiones que el psicólogo agenda con cada estudiante.
// La agenda (rol psicólogo) escribe aquí y la vista del estudiante
// ("Habla con tu psicólogo") las lee: solo aparece lo agendado de verdad.

const KEY = 'safetyLove_studentSessions';
export const STUDENT_SESSIONS_EVENT = 'student-sessions-changed';

export function normalizeName(name) {
  return (name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

export function loadStudentSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent(STUDENT_SESSIONS_EVENT));
  } catch {}
}

export function saveStudentSession(session) {
  const all = loadStudentSessions();
  const entry = { id: Date.now(), createdAt: new Date().toISOString(), ...session };
  writeSessions([...all, entry]);
  return entry;
}

export function removeStudentSession(id) {
  writeSessions(loadStudentSessions().filter((s) => s.id !== id));
}

export function removeStudentSessionsWhere(predicate) {
  writeSessions(loadStudentSessions().filter((s) => !predicate(s)));
}

// Sesiones de un estudiante concreto (por nombre).
export function getSessionsForStudent(studentName) {
  const target = normalizeName(studentName);
  if (!target) return [];
  return loadStudentSessions().filter((s) => normalizeName(s.student) === target);
}
