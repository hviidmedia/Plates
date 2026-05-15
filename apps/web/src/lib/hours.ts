/**
 * Today's hours helpers for tenant location displays.
 *
 * `opening_hours` stores day_of_week (0 = Sun … 6 = Sat) and
 * open/close as minutes from midnight in the location's timezone.
 */

export type OpeningHour = {
  dayOfWeek: number;
  openMinutes: number;
  closeMinutes: number;
};

export type TodayHoursStatus = {
  isOpen: boolean;
  label: string;
  /** e.g. "10:30 – 22:00" */
  range: string | null;
};

const DAY_NAMES_DA = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Compute today's open/close window + whether the location is currently
 * open. Times are interpreted in the location's timezone; for the demo
 * we just use the server's local clock — accurate enough for the UI.
 */
export function getTodayHours(
  hours: OpeningHour[],
  now: Date = new Date(),
): TodayHoursStatus {
  const dow = now.getDay();
  const todays = hours.find((h) => h.dayOfWeek === dow);
  if (!todays) {
    return { isOpen: false, label: `Lukket i dag (${DAY_NAMES_DA[dow]})`, range: null };
  }
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isOpen =
    nowMin >= todays.openMinutes && nowMin < todays.closeMinutes;
  const range = `${formatMinutes(todays.openMinutes)} – ${formatMinutes(todays.closeMinutes)}`;
  const label = isOpen
    ? `Åbent nu · lukker ${formatMinutes(todays.closeMinutes)}`
    : `Lukket nu · åbner ${formatMinutes(todays.openMinutes)}`;
  return { isOpen, label, range };
}

export function formatDayName(dow: number): string {
  return DAY_NAMES_DA[dow] ?? "";
}
