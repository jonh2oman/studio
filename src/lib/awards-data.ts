
import type { Award } from './types';

export const awardsData: Award[] = [
  // National Awards
  {
    id: 'nl-medal-excellence',
    name: 'Navy League Medal of Excellence',
    category: 'National',
    description: 'May be awarded annually to the most proficient Royal Canadian Sea Cadets within each Division.',
    criteria: [
      'Must be in at least their 4th year of cadet training.',
      'Must have fulfilled all mandatory training for their current phase.',
      'Must have participated in at least three optional training activities.',
      'Must be seen by peers and superiors as a role model.'
    ],
    eligibility: 'All cadets in 4th year or higher.',
    deadline: 'Jan/Feb each year',
    approval: 'Any staff member may nominate.'
  },
  {
    id: 'strathcona-medal',
    name: 'Lord Strathcona Medal',
    category: 'National',
    description: 'Bestowed upon a cadet in recognition of exemplary performance in physical and military training.',
    criteria: [
      'Exemplary performance in physical and military training.',
      'High level of physical fitness.',
      'Completed three years as a cadet.',
      'Good standing within the corps.'
    ],
    eligibility: 'Cadets with at least 3 years of service.',
    deadline: '28 Feb of each year'
  },
  {
    id: 'legion-medal-excellence',
    name: 'Legion Medal of Excellence',
    category: 'National',
    description: 'Awarded to a cadet in recognition for individual endeavours in citizenship that meet or enhance the aims and objectives of the cadet movement.',
    criteria: [
      'Active in community service activities.',
      'Demonstrates leadership in citizenship activities.',
      'Good standing within the corps.'
    ],
    eligibility: 'All cadets.',
    deadline: '28 Feb of each year'
  },
  {
    id: 'perron-award',
    name: 'The Colonel-Robert-Perron Award',
    category: 'National',
    description: 'A national award that is presented annually to the top male and female cadets who demonstrate the best physical fitness.',
    criteria: [
      'Based on the fitness components for the Cadet Fitness Assessment Incentive Program.',
      'Graded using the Perron Award Scoring Matrix.'
    ],
    eligibility: 'Top male and female cadets based on CFA.',
    deadline: '31 Mar of each year'
  },
  // Corps Awards
  {
    id: 'stuckless-award',
    name: 'Don Stuckless Outstanding Service Award',
    category: 'Corps',
    description: 'Top Senior Cadet who has given his or her all to the corps.',
    criteria: [
      'Given their all to the corps (extra activities, attitude, enthusiasm, overall effort).',
      'Exceptional leadership abilities.',
      'Good Self-Discipline.',
      'Good attendance (>=75%).',
      'Good rapport with both Officers and Cadets.'
    ],
    eligibility: 'Top Senior Cadet (Phase 3+).'
  },
  {
    id: 'hanrahan-shield',
    name: 'The Hanrahan Shield Award',
    category: 'Corps',
    description: 'Top Junior Cadet.',
    criteria: [
      'Top cadet in Phase 4.',
      'Meets standard for dress, drill and deportment.',
      'Good attendance (>=75%).',
      'Shows willingness to learn.'
    ],
    eligibility: 'Top cadet in Phase 4.'
  },
  {
    id: 'top-phase-3',
    name: 'The Top Phase 3 Cadet',
    category: 'Corps',
    description: 'Awarded to the top overall cadet in Phase 3.',
     criteria: [
      'Top cadet in Phase 3.',
      'Meets standard for dress, drill and deportment.',
      'Good attendance (>=75%).',
      'Shows willingness to learn.'
    ],
    eligibility: 'Cadets in Phase 3.'
  },
  {
    id: 'top-phase-2',
    name: 'The Top Phase 2 Cadet',
    category: 'Corps',
    description: 'Awarded to the top overall cadet in Phase 2.',
     criteria: [
      'Top cadet in Phase 2.',
      'Meets standard for dress, drill and deportment.',
      'Good attendance (>=75%).',
      'Shows willingness to learn.'
    ],
    eligibility: 'Cadets in Phase 2.'
  },
   {
    id: 'top-phase-1',
    name: 'The Top Phase 1 Cadet',
    category: 'Corps',
    description: 'Awarded to the top overall cadet in Phase 1.',
     criteria: [
      'Top cadet in Phase 1.',
      'Meets standard for dress, drill and deportment.',
      'Good attendance (>=75%).',
      'Shows willingness to learn.'
    ],
    eligibility: 'Cadets in Phase 1.'
  },
  {
    id: 'co-award',
    name: 'Commanding Officer’s Award',
    category: 'Corps',
    description: 'Awarded to a cadet or cadets who demonstrates a high level of dedication and commitment to the corps.',
    criteria: [
      'Good attendance (>=75%).',
      'High level of dedication and commitment.'
    ],
    eligibility: 'Open to all cadets.',
    approval: 'Commanding Officer'
  },
  {
    id: 'most-dedicated',
    name: 'Most Dedicated Award',
    category: 'Corps',
    description: 'Awarded to the cadet who is always ready, willing and able to take part in any Corps activity or volunteer work.',
    criteria: ['Always ready, willing and able to take part in any Corps activity or volunteer work for the corps.'],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'most-promising',
    name: 'Most Promising Cadet',
    category: 'Corps',
    description: 'Awarded to the cadet who displays self-confidence, self-discipline and potential for development.',
    criteria: ['Displays self-confidence, self-discipline and potential development.'],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'marksmanship-award',
    name: 'Gord Blundon Marksmanship Award',
    category: 'Corps',
    description: 'Top Marksman.',
    criteria: [
      'Excellent Marksman (one of the top shots).',
      'Good attendance (>=75%) for all corps mandatory training.',
      'Excellent attendance (>=90%) for marksmanship team practices/tryouts.',
      'Contributes positively to the overall atmosphere of the marksmanship team.'
    ],
    eligibility: 'Members of the unit marksmanship team, including spares.',
    approval: 'Marksmanship Officer'
  },
  {
    id: 'sponsor-award',
    name: 'Sponsor Award',
    category: 'Corps',
    description: 'Top Fundraiser.',
    criteria: ['Presented to cadet who raises most funds on corps fundraisers.'],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'most-enthusiastic',
    name: 'Most Enthusiastic Cadet',
    category: 'Corps',
    description: 'Awarded to the most spirited and devoted cadet.',
    criteria: [
      'Promotes the spirit of cadets in the Corps and helps keep the Corps morale high.',
      'Most enthusiastic cadet!',
      'Good attendance (>=75%).',
      'Is the most spirited, devoted to the corps.'
    ],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'recruiter-of-year',
    name: 'Recruiter of the Year',
    category: 'Corps',
    description: 'Awarded to the cadet who brings in the most potential recruits.',
    criteria: ['Person who brings in most potential recruits, or puts the most effort into recruiting.'],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'most-improved',
    name: 'Most Improved Cadet',
    category: 'Corps',
    description: 'The cadet who is seen to improve the most from the beginning of the training year to the end.',
    criteria: ['Seen to improve the most from last year (or beginning of training year) to the end of the year in all areas including attendance, dress, deportment, etc.'],
    eligibility: 'Open to all cadets.'
  },
  {
    id: 'band-award',
    name: 'Band Award',
    category: 'Corps',
    description: 'Top Cadet in the Parade Band.',
    criteria: [
      'Exceeds standard for dress, drill, deportment and musical ability.',
      'Good attendance (>75%).',
      'Strong willingness to learn.',
      'Has dedicated their time to the betterment of the Regular Parade Band.'
    ],
    eligibility: 'Member of the Regular Parade Band as of 1 Feb.',
    approval: 'Band officer'
  },
  {
    id: 'guard-award',
    name: 'Guard Award',
    category: 'Corps',
    description: 'Top Cadet in the Guard.',
    criteria: [
      'Exceeds standard for dress, drill, deportment.',
      'Good attendance (>75%).',
      'Strong willingness to learn.',
      'Has dedicated their time to the betterment of the Guard.'
    ],
    eligibility: 'Member of the Guard on Regular Parade as of 1 Feb.',
    approval: 'Guard/Parade Officer'
  },
  {
    id: 'division-award',
    name: 'Division Award',
    category: 'Corps',
    description: 'Top Cadet in the Division.',
    criteria: [
      'Exceeds standard for dress, drill, deportment.',
      'Good attendance (>75%).',
      'Strong willingness to learn.',
      'Has dedicated their time to the betterment of the Division.'
    ],
    eligibility: 'Member of the Division on Regular Parade as of 1 Feb.',
    approval: 'Divisional/Parade Officer'
  },
  {
    id: 'attendance-gold',
    name: 'Attendance Award (Gold)',
    category: 'Corps',
    description: '100% attendance for mandatory training.',
    criteria: ['100% attendance for mandatory training.'],
    eligibility: 'Open to all cadets.',
    approval: 'Commanding Officer'
  },
  {
    id: 'attendance-silver',
    name: 'Attendance Award (Silver)',
    category: 'Corps',
    description: '90% or more attendance for mandatory training.',
    criteria: ['Maintain a minimum of 90% attendance or more for the mandatory cadet training.'],
    eligibility: 'Open to all cadets.',
    approval: 'Commanding Officer'
  }
];
