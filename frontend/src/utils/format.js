export function formatDate(dateString) {
  if (!dateString || dateString.startsWith('0001-01-01')) {
    return 'Sin registrar';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Sin registrar';
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function clampProgress(value) {
  return Math.min(100, Math.max(0, value ?? 0));
}

export function priorityClass(priority) {
  const normalized = (priority ?? '').toLowerCase();
  if (normalized.includes('alta')) return 'badge--high';
  if (normalized.includes('baja')) return 'badge--low';
  return 'badge--medium';
}

export function statusClass(status) {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('complet')) return 'badge--success';
  if (normalized.includes('paus')) return 'badge--warning';
  if (normalized.includes('activ')) return 'badge--info';
  return 'badge--neutral';
}

export function getEstimatedLevel(progress) {
  const value = progress ?? 0;
  if (value <= 20) return 'Principiante';
  if (value <= 50) return 'Intermedio';
  if (value <= 80) return 'Avanzado';
  return 'Experto';
}

export function formatHours(totalMinutes) {
  const hours = (totalMinutes ?? 0) / 60;
  return hours >= 10 ? hours.toFixed(1) : hours.toFixed(2);
}

export function getMedal(position) {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  return null;
}
