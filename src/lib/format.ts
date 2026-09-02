/** Interpreta 'YYYY-MM-DD' como data local, evitando o deslocamento de fuso do parser nativo. */
function parseLocalDate(dateLocal: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateLocal);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDayLabel(dateLocal: string, referenceDate: Date = new Date()): string {
  const date = parseLocalDate(dateLocal);
  if (!date) {
    return '—';
  }
  if (isSameDay(date, referenceDate)) {
    return 'Hoje';
  }
  return capitalize(new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date));
}

export function formatShortDate(dateLocal: string): string {
  const date = parseLocalDate(dateLocal);
  if (!date) {
    return '—';
  }
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
}

export function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }
  return `${Math.round(value)}%`;
}
