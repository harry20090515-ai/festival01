import { FestivalItem } from '../types';

/**
 * Extracts start and end dates from text or fields like USAGE_DAY or USAGE_DAY_WEEK_AND_TIME
 */
export function parseFestivalDates(item: FestivalItem): { startDate: string; endDate: string; status: 'ONGOING' | 'UPCOMING' | 'ENDED' } {
  const usageDay = item.USAGE_DAY || item.USAGE_DAY_WEEK_AND_TIME || '';
  
  // Try regex matching YYYY-MM-DD or YYYY.MM.DD
  const datePattern = /(\d{4})[.-](\d{1,2})[.-](\d{1,2})/g;
  const matches = [...usageDay.matchAll(datePattern)];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let startDateStr = '';
  let endDateStr = '';

  if (matches.length >= 2) {
    const sYear = matches[0][1];
    const sMonth = matches[0][2].padStart(2, '0');
    const sDay = matches[0][3].padStart(2, '0');
    startDateStr = `${sYear}-${sMonth}-${sDay}`;

    const eYear = matches[1][1];
    const eMonth = matches[1][2].padStart(2, '0');
    const eDay = matches[1][3].padStart(2, '0');
    endDateStr = `${eYear}-${eMonth}-${eDay}`;
  } else if (matches.length === 1) {
    const sYear = matches[0][1];
    const sMonth = matches[0][2].padStart(2, '0');
    const sDay = matches[0][3].padStart(2, '0');
    startDateStr = `${sYear}-${sMonth}-${sDay}`;
    endDateStr = `${sYear}-${sMonth}-${sDay}`;
  } else {
    // Fallback if no explicit date pattern found
    startDateStr = '2026-05-01';
    endDateStr = '2026-10-31';
  }

  let status: 'ONGOING' | 'UPCOMING' | 'ENDED' = 'UPCOMING';
  if (todayStr >= startDateStr && todayStr <= endDateStr) {
    status = 'ONGOING';
  } else if (todayStr > endDateStr) {
    status = 'ENDED';
  } else {
    status = 'UPCOMING';
  }

  return { startDate: startDateStr, endDate: endDateStr, status };
}

/**
 * Helper to check if festival occurs during a given month (1-12)
 */
export function isFestivalInMonth(item: FestivalItem, month: number): boolean {
  const dates = parseFestivalDates(item);
  const startMonth = parseInt(dates.startDate.split('-')[1], 10);
  const endMonth = parseInt(dates.endDate.split('-')[1], 10);

  if (startMonth <= endMonth) {
    return month >= startMonth && month <= endMonth;
  } else {
    // Crosses year boundary (e.g., Dec to Feb)
    return month >= startMonth || month <= endMonth;
  }
}

/**
 * Helper to check if festival occurs on a specific YYYY-MM-DD date
 */
export function isFestivalOnDate(item: FestivalItem, targetDate: string): boolean {
  if (!targetDate) return true;
  const dates = parseFestivalDates(item);
  return targetDate >= dates.startDate && targetDate <= dates.endDate;
}

export function formatDateRangeKorean(item: FestivalItem): string {
  if (item.USAGE_DAY_WEEK_AND_TIME) {
    return item.USAGE_DAY_WEEK_AND_TIME;
  }
  if (item.USAGE_DAY) {
    return item.USAGE_DAY;
  }
  const { startDate, endDate } = parseFestivalDates(item);
  return `${startDate} ~ ${endDate}`;
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
