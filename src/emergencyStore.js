const STORAGE_KEY = 'safetyLove_emergency_requests';

export function getRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event('emergency-update'));
}

export function addEmergencyRequest(studentName) {
  const requests = getRequests();
  const newRequest = {
    id: Date.now(),
    student: studentName || 'Estudiante',
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    read: false,
  };
  requests.unshift(newRequest);
  saveRequests(requests);
  return newRequest;
}

export function getUnreadCount() {
  return getRequests().filter(r => !r.read).length;
}

export function markAsRead(id) {
  const requests = getRequests().filter(r => r.id !== id);
  saveRequests(requests);
}

export function markAllRead() {
  saveRequests([]);
}

export function clearAll() {
  saveRequests([]);
}

export function listenToEmergencyUpdates(callback) {
  const handler = () => callback(getRequests());
  window.addEventListener('emergency-update', handler);
  return () => window.removeEventListener('emergency-update', handler);
}
