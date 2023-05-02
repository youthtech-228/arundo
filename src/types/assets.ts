import { Unit } from '~/utils/time';

export interface AssetFilter {
  start: Date;
  end?: Date;
  by?: Unit;
  steps?: number;
}

export interface TimeseriesData {
  timestamp: string;
  value: number;
}

export interface TagData {
  units: string;
  baseUnits: string;
  data: Array<TimeseriesData>;
}
