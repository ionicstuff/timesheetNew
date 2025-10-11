export type HolidayRegion = 'US' | 'IN';

// Minimal sample holiday sets. Extend as needed.
const HOLIDAYS: Record<HolidayRegion, { date: string; name: string }[]> = {
  US: [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-07-04', name: 'Independence Day' },
    { date: '2025-11-27', name: 'Thanksgiving Day' },
    { date: '2025-12-25', name: 'Christmas Day' },
  ],
  IN: [
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-11-12', name: 'Diwali' },
  ],
};

export function getHolidaysForMonth(region: HolidayRegion, year: number, month: number) {
  // month is 0-indexed
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  const rows = HOLIDAYS[region] || [];
  const byDate: Record<string, { date: string; name: string }> = {};
  for (const h of rows) {
    if (h.date.startsWith(prefix)) byDate[h.date] = h;
  }
  return byDate; // keyed by YYYY-MM-DD
}

export const DEFAULT_REGION: HolidayRegion = 'US';
