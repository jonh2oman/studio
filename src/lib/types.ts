export interface EO {
  id: string;
  title: string;
  periods: number;
  type: 'mandatory' | 'complimentary';
  poId: string;
}

export interface PO {
  id: string;
  title: string;
  enablingObjectives: EO[];
}

export interface Phase {
  id: number;
  name: string;
  performanceObjectives: PO[];
}

export interface ScheduledItem {
  eo: EO;
  instructor: string;
  classroom: string;
}

export interface Schedule {
  [slotId: string]: ScheduledItem | undefined;
}

export interface Settings {
  trainingDay: number; // 0 for Sunday, 1 for Monday, etc.
  corpsName: string;
  instructors: string[];
  classrooms: string[];
}
