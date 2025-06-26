

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

// Global settings, not year-specific
export interface Settings {
  trainingDay: number; // 0 for Sunday, 1 for Monday, etc.
  corpsName: string;
  instructors: string[];
  classrooms: string[];
  ranks: string[];
}

// Settings that are specific to a training year
export interface YearSpecificSettings {
    firstTrainingNight: string; // YYYY-MM-DD
}

// The object that stores settings for all years
export interface TrainingYearSettings {
    [year: string]: YearSpecificSettings;
}

export interface Cadet {
    id: string;
    rank: string;
    firstName: string;
    lastName: string;
    phase: number;
}

export interface CadetWithAttendance extends Cadet {
    attendancePercentage: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord {
    cadetId: string;
    status: AttendanceStatus;
    arrivedLate: boolean;
    leftEarly: boolean;
}

export interface AttendanceState {
    [date: string]: AttendanceRecord[];
}

export interface J4Item {
    id: string;
    description: string;
    quantity: number;
}

export interface J4Plan {
    quartermasterLocation?: string;
    items: J4Item[];
    submitted: boolean;
    approved: boolean;
}

export interface CsarDetails {
    activityName: string;
    activityType?: 'discretionary_supported' | 'elemental_training' | 'fundamental_supported' | '';
    activityLocation: string;
    startTime: string; 
    endTime: string; 
    isMultiUnit: boolean;
    multiUnitDetails?: string;
    
    numCadetsMale: number;
    numCadetsFemale: number;
    numStaffMale: number;
    numStaffFemale: number;

    transportRequired: boolean;
    transportation: {
        schoolBus44: number;
        cruiser55: number;
    };

    supportVehiclesRequired: boolean;
    supportVehicles: {
        van8: number;
        crewCab: number;
        cubeVan: number;
        miniVan7: number;
        panelVan: number;
        staffCar: number;
    };

    fuelCardRequired: boolean;

    accommodationsRequired: boolean;
    accommodation: {
        type?: 'military' | 'commercial' | 'private' | '';
        cost: number;
    };

    mealsRequired: boolean;
    mealPlanDetails?: string; 
    
    j4Plan: J4Plan;
}

export interface DayMetadata {
    csarRequired: boolean;
    csarSubmitted: boolean;
    csarApproved: boolean;
    csarDetails?: CsarDetails;
}

export interface DayMetadataState {
    [date: string]: DayMetadata;
}

export interface Award {
  id: string;
  name: string;
  category: 'National' | 'Corps';
  description: string;
  criteria: string[];
  eligibility: string;
  deadline?: string;
  approval?: string;
}

export interface AwardWinner {
    [awardId: string]: string[]; // awardId: array of cadetIds
}
