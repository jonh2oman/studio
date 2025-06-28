



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

export interface UpcomingActivity {
  id: string;
  activity: string;
  activityStart: string;
  activityEnd: string;
  location: string;
  dress: string;
  opi: string;
}

export interface WeeklyActivity {
  id: string;
  activity: string;
  dayOfWeek: number; // 0 for Sunday, 6 for Saturday
  startTime: string;
  endTime: string;
  location: string;
  dress: string;
  opi: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type StaffMemberType = 'Officer' | 'PO/NCM';

export interface StaffMember {
  id: string;
  type: StaffMemberType;
  rank: string;
  firstName: string;
  lastName:string;
  phone?: string;
  email?: string;
  primaryRole: string;
  additionalRoles: string[];
}

export interface DutySchedule {
    [date: string]: { 
        dutyOfficerId?: string;
        dutyPoId?: string;
        altDutyPoId?: string;
    }
}

export interface CustomEO {
  id: string;
  title: string;
  periods: number;
}

export interface Asset {
  id: string;
  assetId: string;
  name: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string; // YYYY-MM-DD
  purchasePrice?: number;
  status: 'In Stock' | 'Deployed' | 'In Repair' | 'Decommissioned';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  notes?: string;
}

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface Permission {
    email: string;
    role: UserRole;
}

export interface Settings {
  trainingDay: number;
  corpsName: string;
  corpsLogo?: string;
  staff: StaffMember[];
  staffRoles: string[];
  cadetRoles: string[];
  classrooms: string[];
  cadetRanks: string[];
  officerRanks: string[];
  weeklyActivities: WeeklyActivity[];
  ordersOfDress: {
      caf: string[];
      cadets: string[];
  };
  customEOs: CustomEO[];
  firstTrainingNight: string; // Dummy property for compatibility
  awards: Award[];
  assets: Asset[];
  assetCategories: string[];
  settingsCardOrder?: string[];
  generalSettingsCardOrder?: string[];
  planningResourcesCardOrder?: string[];
  cadetSettingsCardOrder?: string[];
  sidebarNavOrder?: Record<string, string[]>;
  dashboardCardOrder?: {
    categoryOrder: string[];
    itemOrder: Record<string, string[]>;
  };
  permissions: { [userId: string]: Permission };
}

export interface Cadet {
    id: string;
    rank: string;
    firstName: string;
    lastName: string;
    phase: number;
    role?: string;
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

export interface MealPlanItem {
    id: string;
    dateRequired: Date;
    timeRequired: string;
    mealType: 'boxed lunches' | 'Fresh Rations (corps/sqn)' | 'fresh Rations (RCSU)' | 'Hay Boxes' | 'IMP (Corps/sqn)' | 'IMP (RCSU)' | 'meal allowance' | 'Messing' | 'other' | '';
    mealTime: 'Between Meal Supplement' | 'Breakfast' | 'Lunch' | 'supper' | '';
    quantity: number;
    reservationHandledBy: 'Corps/Squadron' | 'RCSU' | 'Not Applicable' | '';
    quoteReceived: boolean;
    amount?: number;
    vendor?: string;
    comments?: string;
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
    mealPlan: MealPlanItem[];
    
    j4Plan: J4Plan;
}

export interface DayMetadata {
    csarRequired: boolean;
    csarSubmitted: boolean;
    csarApproved: boolean;
    csarDetails?: CsarDetails;
    dressOfTheDay?: {
        caf: string;
        cadets: string;
    };
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

export interface AdaPlannerData {
    id: string;
    name: string;
    eos: EO[];
}

export interface TrainingYearData {
    firstTrainingNight: string;
    dutySchedule: DutySchedule;
    cadets: Cadet[];
    schedule: Schedule;
    dayMetadata: DayMetadataState;
    attendance: AttendanceState;
    awardWinners: AwardWinner;
    csarDetails: CsarDetails;
    adaPlanners?: AdaPlannerData[];
}

export interface UserDocument {
    settings: Settings;
    trainingYears: {
        [year: string]: TrainingYearData;
    };
    pointerToCorpsData?: string;
    displayName?: string;
}

export interface Invite {
    id: string;
    corpsDataOwnerId: string;
    ownerEmail: string;
    inviteeEmail: string;
    role: 'editor' | 'viewer';
    status: 'pending' | 'accepted' | 'processed';
    acceptedBy?: string;
    acceptedAt?: Date;
}
