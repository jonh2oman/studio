

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
  accessLevel: 'Admin' | 'Member';
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
  status: 'In Stock' | 'Deployed' | 'In Repair' | 'Decommissioned' | 'On Loan';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  notes?: string;
  loanedToCadetId?: string;
  loanDate?: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
}

export interface LsaWishListItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  link?: string;
  priceScreenshot?: string; // base64 data URI
}

export interface UniformItem {
  id: string;
  name: string;
  category: string;
  size: string;
  quantity: number;
  notes?: string;
}

export interface IssuedUniformItem {
  id: string;
  cadetId: string;
  uniformItemId: string; // The ID of the UniformItem
  issueDate: string; // YYYY-MM-DD
  notes?: string;
}


export type CadetElement = 'Sea' | 'Army' | 'Air';

export interface Cadet {
    id: string;
    rank: string;
    firstName: string;
    lastName: string;
    phase: number;
    role?: string;
    dateOfBirth?: string; // YYYY-MM-DD
    isBiathlonTeamMember?: boolean;
    isMarksmanshipTeamMember?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface Transaction {
  id: string;
  cadetId: string;
  amount: number; // positive for credit, negative for debit
  reason: string;
  timestamp: string; // ISO 8601 string
  staffId: string; // user.email of the staff member who made the transaction
}

export interface Settings {
  element: CadetElement;
  corpsName: string;
  corpsLogo?: string;
  staff: StaffMember[];
  cadets: Cadet[];
  staffRoles: string[];
  poNcmRoles: string[];
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
  awards: Award[];
  assets: Asset[];
  assetCategories: string[];
  lsaWishList: LsaWishListItem[];
  uniformInventory: UniformItem[];
  issuedUniforms: IssuedUniformItem[];
  uniformCategories: string[];
  settingsCardOrder?: string[];
  generalSettingsCardOrder?: string[];
  planningResourcesCardOrder?: string[];
  cadetSettingsCardOrder?: string[];
  sidebarNavOrder?: Record<string, string[]>;
  dashboardCardOrder?: {
    categoryOrder: string[];
    itemOrder: Record<string, string[]>;
  };
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

export type MarksmanshipClassification = "Distinguished Marksman" | "Expert Marksman" | "First Class Marksman" | "Marksman" | "Unclassified";

export interface MarksmanshipRecord {
    id: string;
    cadetId: string;
    date: string; // YYYY-MM-DD
    targetType: 'grouping' | 'competition';
    grouping1_cm?: number;
    grouping2_cm?: number;
    competitionScores?: number[]; // Array of 10 scores
    notes?: string;
}

export type BiathlonCategory = 'Junior' | 'Senior' | 'Youth' | 'N/A';
export type BiathlonRaceType = 'Individual' | 'Sprint' | 'Pursuit' | 'Mass Start' | 'Relay' | 'Patrol' | 'Short Sprint' | 'Team Sprint';

export interface BiathlonResult {
  id: string;
  cadetId: string;
  competitionName: string;
  date: string; // YYYY-MM-DD
  raceType: BiathlonRaceType;
  skiTime: string; // "MM:SS" format
  proneScores: string; // comma-separated hits, e.g. "5, 4, 3"
  standingScores: string; // comma-separated hits, e.g. "2, 1, 0"
  finalRank?: number;
  notes?: string;
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
    activityStartDate?: string; // YYYY-MM-DD
    activityEndDate?: string; // YYYY-MM-DD
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

export interface DayPlannerData {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    schedule: Schedule;
}

export interface TrainingYearData {
    firstTrainingNight: string;
    element: CadetElement;
    trainingDay: number;
    dutySchedule: DutySchedule;
    schedule: Schedule;
    dayMetadata: DayMetadataState;
    attendance: AttendanceState;
    awardWinners: AwardWinner;
    csarDetails: CsarDetails;
    adaPlanners?: AdaPlannerData[];
    dayPlanners?: DayPlannerData[];
    marksmanshipRecords?: MarksmanshipRecord[];
    biathlonResults?: BiathlonResult[];
    storeInventory?: StoreItem[];
    transactions?: Transaction[];
}

export interface ZtoReviewedPlan {
    id: string;
    corpsName: string;
    trainingYear: string;
    planData: TrainingYearData;
    element: CadetElement;
}

// Represents the data stored at /corps/{corpsId}
export interface CorpsData {
    id: string;
    settings: Settings;
    trainingYears: {
        [year: string]: TrainingYearData;
    };
    ztoReviewedPlans?: ZtoReviewedPlan[];
}

// Represents the data stored at /users/{userId}
export interface UserData {
    email: string;
    corpsId: string | null;
    displayName?: string;
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: string[];
}
