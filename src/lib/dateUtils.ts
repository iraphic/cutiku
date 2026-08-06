export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

const fmtLong = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtShort = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

const fmtShortYear = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const fmtDay = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
});

export function formatLong(d: Date): string {
  return fmtLong.format(d);
}

export function formatShort(d: Date): string {
  return fmtShort.format(d);
}

export function formatShortYear(d: Date): string {
  return fmtShortYear.format(d);
}

export function formatDayName(d: Date): string {
  return fmtDay.format(d);
}

export function formatRange(start: Date, end: Date): string {
  if (start.getFullYear() !== end.getFullYear()) {
    return `${formatShortYear(start)} – ${formatShortYear(end)}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${formatShort(start)} – ${formatShortYear(end)}`;
  }
  if (start.getDate() === end.getDate()) return formatShortYear(start);
  return `${start.getDate()} – ${formatShortYear(end)}`;
}
