export const second = 1000;
export const minute = 60 * second;
export const hour = 60 * minute;
export const day = 24 * hour;
export const week = 7 * day;
export const month = 30 * day;

export interface Period {
  ms: number;
  slug: '30m' | '1h' | '6h' | '1d' | '7d' | '1mo' | '6mo';
  label: string;
  isDefault?: boolean;
}

export const periods: Period[] = [
  { ms: minute * 30, slug: '30m', label: '30 minutes' },
  { ms: hour, slug: '1h', label: '1 hour' },
  { ms: hour * 6, slug: '6h', label: '6 hours' },
  { ms: day, slug: '1d', label: '1 day', isDefault: true },
  { ms: week, slug: '7d', label: '7 days' },
  { ms: month, slug: '1mo', label: '1 month' },
  { ms: month * 6, slug: '6mo', label: '6 months' },
];

export interface Unit {
  ms: number;
  label: string;
  window?:
    | 'oneMinute'
    | 'fiveMinutes'
    | 'oneHour'
    | 'threeHours'
    | 'sixHours'
    | 'oneDay';
  isDefault?: boolean;
}

export const units: Unit[] = [
  { ms: second, label: '1 second' },
  { ms: minute, label: '1 minute', window: 'oneMinute' },
  { ms: minute * 5, label: '5 minute', window: 'fiveMinutes' },
  { ms: hour, label: '1 hour', window: 'oneHour' },
  { ms: hour * 3, label: '3 hour', window: 'threeHours' },
  { ms: hour * 6, label: '6 hour', window: 'sixHours' },
  { ms: day, label: '1 day', window: 'oneDay' },
  { ms: month, label: '1 month', window: 'oneDay', isDefault: true },
];

// find the closest unit { label, ms } to a ms duration
export const getLargerPeriod = (duration: number): Period => {
  for (const period of periods) {
    if (period.ms > duration) return period;
  }

  return periods.find((p) => p.isDefault);
};

// find the closest unit { label, ms } to a ms duration
export const getClosestUnit = (duration: number, steps = 400): Unit => {
  // console.log('getClosestUnit', { duration, steps })
  if (duration < hour) {
    // console.log('period is less than an hour, use seconds', duration / second, 'steps')
    return units.find((p) => p.ms === second);
  }

  return (
    units.reduce((best, period) => {
      const segments = duration / period.ms;
      // console.log('analyzing period', period, 'determined to have', segments, 'steps')

      return !best ||
        Math.abs(steps - segments) < Math.abs(steps - duration / best.ms)
        ? period
        : best;
    }, undefined) || units.find((u) => u.isDefault)
  );
};

// crop date (remove ms, seconds, minutes, hour, etc) based on target duration (ms)
export const crop = (date: Date | string, duration = minute): Date => {
  const cropped = new Date(date);

  // always remove at least the milliseconds
  cropped.setMilliseconds(0);

  // then remove the trailing bits depending on the target duration
  duration > second && cropped.setSeconds(0);
  duration > minute && cropped.setMinutes(0);

  const timezoneOffsetHours = new Date(date).getTimezoneOffset() / 60;
  duration > hour && cropped.setHours(-timezoneOffsetHours);

  return cropped;
};

interface RangeOptions {
  start: Date;
  end?: Date;
}

export const getRange = ({
  start,
  end = new Date(),
}: RangeOptions): string[] => {
  const duration = +end - +start;

  const closestUnit = getClosestUnit(duration);

  start = crop(start, closestUnit.ms);
  end = crop(end, closestUnit.ms);

  const range = [];
  for (let cursor = +end; cursor > +start; cursor -= closestUnit.ms) {
    range.unshift(new Date(cursor).toISOString());
  }

  return range;
};
