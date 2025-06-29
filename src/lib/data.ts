
import type { Phase } from './types';

// SEA CADET DATA
const seaRawData = {
  "Phase 1": {
    "PO X01 - Participate in Citizenship Activities": {
      "M": [["MX01.01C", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - Perform Community Service": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 103 - Participate as a Member of a Team": {
      "M": [["M103.01", "Identify the Responsibilities of a Follower in a Team", 1], ["M103.03", "Participate in Team building Activities", 2]],
      "C": [["M103.02", "Map Personal Goals for the Training Year", 1], ["C103.01", "Participate in Icebreaker Activities", 1], ["C103.02", "Participate in Self-Introductions", 1], ["C103.03", "Participate in Team building Activities", 1]]
    },
    "PO X04 - Track Participation in Physical Activities": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3]],
      "C": [["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - Participate in Physical Activities": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 106 - Fire the Cadet Air Rifle": {
      "M": [["M106.01", "Identify the Parts and Characteristics of the Daisy 853C Air Rifle", 1], ["M106.02", "Carry out Safety Precautions on the Cadet Air Rifle", 1], ["M106.04", "Follow Rules and Commands on an Air Rifle Range", 1]],
      "C": [["M106.03", "Apply Basic Marksmanship Techniques", 2], ["M106.05", "Participate in Marksmanship Familiarization Using the Cadet Air Rifle", 3], ["C106.01", "Participate in a Recreational Marksmanship Activity", 3], ["C106.02", "Clean and Store the Cadet Air Rifle", 1]]
    },
    "PO 107 - Serve in a Sea Cadet Corps": {
      "M": [["M107.01", "Discuss Year One Training", 1], ["M107.02", "Identify Sea Cadet and Naval Officer Ranks", 1], ["M107.03", "Observe Rules and Procedures for the Paying of Compliments", 1], ["M107.04", "State the Army and Motto of the Sea Cadet Program", 1], ["M107.05", "Wear the Sea Cadet Uniform", 1]],
      "C": [["M107.06", "Discuss Summer Training Opportunities", 1], ["C107.01", "Maintain the Sea Cadet Uniform", 2], ["C107.02", "Participate in a Tour of the Corps", 1], ["C107.03", "Participate in an Activity about the History of the Corps", 1]]
    },
    "PO 108 - Perform Drill Movements": {
      "M": [["M108.01", "Adopt the Positions of Attention, Stand at Ease, and Stand Easy", 1], ["M108.02", "Execute a Salute at the Halt Without Arms", 1], ["M108.03", "Execute Turns at the Halt", 1], ["M108.04", "Close to the Right and Left", 1], ["M108.05", "Execute Paces Forward and to the Rear", 1], ["M108.06", "Execute the Movements Required for a Right Dress", 1], ["M108.07", "Execute an Open Order and Close Order March", 1], ["M108.08", "March and Halt in Quick Time", 1], ["M108.09", "Execute Marking Time, Forward, and Halting in Quick Time", 1], ["M108.11", "Pay Compliments with a Squad on the March", 1], ["M108.12", "Perform Drill Movements During an Annual Ceremonial Review", 3]],
      "C": [["M108.10", "Execute a Salute on the March", 1], ["C108.01", "Execute Supplementary Drill Movements", 6], ["C108.02", "Participate in a Drill Competition", 3]]
    },
    "PO 111 - Participate in Recreational Summer Biathlon activities": {
      "C": [["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Simulate Firing the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - Participate in CAF Familiarization": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 121 - Perform Basic Ropework": {
      "M": [["M121.01", "Tie Knots, Bends and Hitches", 6], ["M121.02", "Whip the End of a Line Using a Common Whipping", 3], ["M121.03", "Coil and Heave a Line", 3]],
      "C": [["C121.01", "Whip the End of a Line Using a West Country Whipping", 1], ["C121.02", "Whip the End of a Line Using a Sailmaker's Whipping", 2], ["C121.03", "Complete a Rolling Hitch", 1], ["C121.04", "Complete a Marlin Hitch", 1]]
    },
    "PO 123 - Respond to Basic Forms of Naval Communications": {
      "M": [["M123.01", "Define Basic Naval Terminology", 2], ["M123.02", "Identify Pipes and the Correct Responses", 2], ["M123.03", "Participate in a Review of Ship's Operations", 1]],
      "C": [["C123.01", "Read the 24-hour Clock", 1], ["C123.02", "Recite the Phonetic Alphabet", 2], ["C123.03", "Participate in a Semaphore Exercise", 5], ["C123.04", "Ring the Ship's Bell", 1]]
    },
    "PO X24 - Sail a Sailboat IAW Sail Canada CANSail Level 1": {
      "M": [["M124.01", "Prepare for a Sail Weekend", 1]],
      "C": [["M124.02", "Participate in a Sail Weekend", 18], ["C124.01", "Prepare for a Sail Weekend", 1]]
    },
    "PO X25 - Participate in a Nautical Training Weekend": {
      "M": [["C125.01", "Prepare for a Nautical Training Weekend", 1], ["C125.02", "Participate in a Nautical Training Weekend", 9]]
    },
    "PO M100 - PHASE": { "M": [["M100", "PHASE", 6]] },
    "PO ACR - Annual Ceremonial Review": { "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]] }
  },
  "Phase 2": {
    "PO X01 - Participate in Citizenship Activities": {
      "M": [["MX01.01C", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - Perform Community Service": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 203 - Demonstrate Leadership Attributes within a Peer Setting": {
      "M": [["M203.01", "Discuss Leadership Within a Peer Setting", 1], ["M203.02", "Discuss the Principles of Leadership", 1], ["M203.03", "Discuss Effective Communication in a Peer Setting", 1], ["M203.04", "Demonstrate Positive Group Dynamics", 2], ["M203.05", "Discuss Influence Behaviours", 1], ["M203.06", "Employ Problem Solving", 2], ["M203.07", "Discuss Personal Integrity as a Quality of Leadership", 1], ["M203.08", "Participate in Team-Building Activities", 1]],
      "C": [["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.03", "Discuss Characteristics of a Leader", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2]]
    },
    "PO X04 - Track Participation in Physical Activities": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3]],
      "C": [["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - Participate in Physical Activities": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 206 - Fire the Cadet Air Rifle": {
      "C": [["M206.01", "Participate in a Recreational Marksmanship Activity", 3], ["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in Recreational Air Rifle Marksmanship", 6]]
    },
    "PO 207 - Serve in a Sea Cadet Corps": {
      "M": [["M207.01", "Identify Phase Two Training Opportunities", 1], ["M207.03", "Recognize the Role and Responsibilities of the Local Sponsor", 1]],
      "C": [["M207.02", "Recognize Historical Aspects of the Royal Canadian Sea Cadets", 1], ["M207.04", "Identify Year Two CSTC Training Opportunities", 1], ["C207.01", "Identify the Rank Structure of the Royal Canadian Army and Air Cadets", 1], ["C207.02", "Visit a Local Cadet Corps or Squadron", 3], ["C207.03", "Describe the Affiliated Unit", 1], ["C207.04", "Participate in a Tour of the Affiliated Unit", 3], ["C107.03", "Participate in a Activity on the History of the Corps", 1]]
    },
    "PO 208 - Execute Drill as a Member of a Squad": {
      "M": [["M208.01", "Execute Left and Right Turns on the March", 2], ["M208.02", "Form Single File From the Halt", 1]],
      "C": [["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8], ["C108.01", "Execute Supplementary Drill Movements", 6]]
    },
    "PO 211 - Participate in Recreational Summer Biathlon activities": {
      "C": [["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle Using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6]]
    },
    "PO X20 - Participate in CAF Familiarization": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 221 - Rig Tackles": {
      "M": [["M221.01", "Use a Strop for Slinging", 3], ["M221.03", "Reeve a Block", 2], ["M221.04", "Identify Components of Tackles", 3], ["M221.05", "Rig Tackles", 6]],
      "C": [["M221.02", "Mouse a Hook", 2], ["C221.01", "Make a Back Splice", 2], ["C221.02", "Make an Eye Splice", 2], ["C221.03", "Make a Long Splice", 2], ["C121.01", "Whip the End of a Line using West Country Whipping", 1], ["C121.02", "Whip the End of a Line Using a Sailmaker's Whipping", 2], ["C121.03", "Complete a Rolling Hitch", 1], ["C121.04", "Complete a Marlin Hitch", 1]]
    },
    "PO 223 - Serve in a Naval Environment": {
      "M": [["M223.01", "Define Ship-Related Terms", 2], ["M223.02", "Identify the Watch System", 2], ["M223.03", "Execute Notes Using the Boatswain's Call", 2], ["M223.04", "Pipe the General Call", 1], ["M223.05", "Pipe the Still", 1], ["M223.06", "Pipe the Carry On", 1]],
      "C": [["M223.07", "Identify the Procedure for Berthing a Ship", 2], ["C223.01", "Define Naval Terminology", 1], ["C223.02", "Pipe the Side", 1], ["C123.01", "Read the 24-hour Clock", 1], ["C123.02", "Recite the Phonetic Alphabet", 2]]
    },
    "PO X24 - Sail a Sailboat IAW Sail Canada CANSail Level 1": {
      "M": [["MX24.01", "Prepare for a Sail Weekend", 1]],
      "C": [["MX24.02", "Participate in a Sail Weekend", 18]]
    },
    "PO X25 - Participate in a Nautical Training Weekend": {
      "M": [["CX25.01", "Prepare for a Nautical Training Weekend", 1], ["CX25.02", "Participate in a Nautical Training Weekend", 9]]
    },
    "PO M100 - PHASE": { "M": [["M100", "PHASE", 6]] },
    "PO ACR - Annual Ceremonial Review": { "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]] }
  },
  "Phase 3": {
    "PO X01 - Participate in Citizenship Activities": {
      "M": [["MX01.01C", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - Perform Community Service": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 303 - Perform the Role of a Team Leader": {
      "M": [["M303.01", "Define the Role of a Team Leader", 2], ["M303.02", "Participate in a Mentoring Relationship", 1], ["M303.03", "Practice Self-Assessment", 1], ["M303.04", "Communicate as a Team Leader", 2], ["M303.05", "Supervise Cadets", 2], ["M303.06", "Solve Problems", 2], ["M303.07", "Lead Cadets Through a Leadership Assignment", 2]],
      "C": [["C303.01", "Lead Team-Building Activities", 3], ["C303.02", "Deliver a Presentation About a Leader", 2], ["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2], ["C103.03", "Participate in Teambuilding Activities", 1]]
    },
    "PO X04 - Track Participation in Physical Activities": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3]],
      "C": [["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - Participate in Physical Activities": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 306 - Fire the Cadet Air Rifle": {
      "C": [["M306.01", "Participate in a Recreational Marksmanship Activity", 3], ["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 307 - Serve in a Sea Cadet Corps": {
      "M": [["M307.01", "Identify Phase Three Training Opportunities", 1], ["M307.03", "Recognize the Partnership Between the Navy League and DND in Support of the CCM", 1]],
      "C": [["M307.02", "Identify Year Three CSTC Training Opportunities", 1], ["C307.01", "Participate in a Presentation Given by a Guest Speaker From the Regional Cadet Support Unit (RCSU)", 2], ["C307.02", "Participate in a Presentation Given by the Cadet Liaison Officer (CLO)", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Navy League of Canada (NLC)", 2], ["C307.04", "Participate in a Presentation on the Duke of Edinburgh Award Program", 1]]
    },
    "PO 308 - Direct a Squad Prior to a Parade": {
      "M": [["M308.01", "Prepare a Squad for Parade", 3], ["M308.02", "Deliver Words of Command", 1]],
      "C": [["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 309 - Instruct a Lesson": {
      "M": [["M309.01", "Explain Principles of Instruction", 2], ["M309.02", "Identify Methods of Instruction", 2], ["M309.03", "Describe Effective Speaking Techniques", 1], ["M309.04", "Describe Questioning Techniques", 1], ["M309.05", "Select Appropriate Instructional Aids", 2], ["M309.06", "Plan a Lesson", 2], ["M309.07", "Instruct a 15-Minute Lesson", 3]],
      "C": [["C309.01", "Deliver a One-Minute Verbal Presentation", 2], ["C309.02", "Plan a Lesson", 2], ["C309.03", "Instruct a 15-Minute Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Plan a Drill Lesson", 2], ["C309.06", "Instruct a 15-Minute Drill Lesson", 3]]
    },
    "PO 311 - Participate in Recreational Summer Biathlon activities": {
      "C": [["C311.01", "Practice Aiming and Firing the Cadet Air Rifle Following Physical Activity", 3], ["C311.02", "Participate in a Recreational Summer Biathlon Activity", 6], ["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle Using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6], ["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Fire the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - Participate in CAF Familiarization": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 321 - Rig a Lifting Device": {
      "M": [["M321.01", "Describe Safety Procedures for Operating Lifting Devices", 1], ["M321.02", "Rig Sheers", 5]],
      "C": [["C321.01", "Rig Sheers", 4], ["C321.02", "Rig a Standing Derrick", 1], ["C321.03", "Rig a Gyn", 6], ["C321.04", "Make a Monkey's Fist", 3], ["C321.05", "Make a Turk's Head", 3], ["C221.01", "Make a Back Splice", 2], ["C221.02", "Make an Eye Splice", 2], ["C221.03", "Make a Long Splice", 2], ["C121.01", "Whip the End of a Line using West Country Whipping", 1], ["C121.02", "Whip the End of a Line Using a Sailmaker's Whipping", 2], ["C121.03", "Complete a Rolling Hitch", 1], ["C121.04", "Complete a Marlin Hitch", 1]]
    },
    "PO 322 - Attain a Pleasure Craft Operator Competency": { "M": [] },
    "PO 323 - Serve in a Naval Environment": {
      "M": [["M323.01", "Perform Corps Duties", 2]],
      "C": [["C323.01", "Communicate Using Flags and Pennants", 4], ["C323.02", "Pipe Wakey Wakey", 2], ["C323.03", "Pipe Hands to Dinner", 3], ["C223.01", "Define Naval Terminology", 1], ["C223.02", "Pipe the Side", 1], ["C123.01", "Read the 24-hour Clock", 1], ["C123.02", "Recite the Phonetic Alphabet", 2], ["C123.03", "Participate in a Semaphore Exercise", 5]]
    },
    "PO X24 - Sail a Sailboat IAW Sail Canada CANSail Level 1": { "C": [["MX24.02", "Participate in a Sail Weekend", 18]] },
    "PO X25 - Participate in a Nautical Training Weekend": {
      "M": [["CX25.01", "Prepare for a Nautical Training Weekend", 1]]
    },
    "PO M100 - PHASE": { "M": [["M100", "PHASE", 6]] },
    "PO ACR - Annual Ceremonial Review": { "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]] }
  },
  "Phase 4": {
    "PO X01 - Participate in Citizenship Activities": {
      "M": [["MX01.01C", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - Perform Community Service": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 403 - Leadership": {
      "M": [["M403.01", "Describe Needs and Expectations of Team Members", 1], ["M403.02", "Select a Leadership Approach", 2], ["M403.03", "Describe How to Motivate Team Members", 2], ["M403.04", "Provide Feedback to Team Members", 2], ["M403.05", "Participate in a Mentoring Relationship", 2], ["M403.06", "Act as a Team Leader During a Leadership Appointment", 1]],
      "C": [["C403.01", "Self-Assess Leadership Skills", 1], ["C403.02", "Participate in a Leadership Seminar", 12]]
    },
    "PO X04 - Track Participation in Physical Activities": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3]],
      "C": [["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - Participate in Physical Activities": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 406 - Fire the Cadet Air Rifle": {
      "C": [["M406.01", "Participate in a Recreational Marksmanship Activity", 3], ["C406.01", "Assist the Range Safety Officer (RSO)", 1], ["C406.02", "Score Air Rifle Marksmanship Targets", 1], ["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 407 - Serve in a Sea Cadet Corps": {
      "M": [["M407.01", "Identify Phase Four Training Opportunities", 1]],
      "C": [["C407.01", "Prepare for a Merit Review Board", 1], ["M407.02", "Identify Year Four CSTC Training Opportunities", 1], ["C307.01", "Participate in a Presentation Given by a Guest Speaker From the Regional Cadet Support Unit", 2], ["C307.02", "Participate in a Presentation Given by the Cadet Liaison Officer", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Navy League of Canada", 2]]
    },
    "PO 408 - Command a Squad": {
      "M": [["M408.01", "Discuss Commanding a Division on Parade", 1], ["M408.02", "Identify Parade Sequence", 1], ["M408.03", "Command a Squad", 1], ["M408.04", "Inspect a Cadet on Parade", 2]],
      "C": [["C408.01", "Discuss the History of Drill", 1], ["C408.02", "View a Re-Enactment That Demonstrates the History of Drill", 3], ["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C308.03", "Practice Voice for Calling Drill Commands", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 409 - Instruct A Lesson": {
      "M": [["M409.01", "Identify Methods of Instruction", 2], ["M409.02", "Identify Elements of a Positive Learning Environment", 2], ["M409.03", "Describe Learner Needs", 2], ["M409.04", "Explain Assessment", 1], ["M409.05", "Instruct a 30-Minute Lesson", 3]],
      "C": [["C409.01", "Plan a Lesson", 2], ["C409.02", "Instruct a 30-Minute Lesson", 3], ["C409.03", "Act as an Assistant Instructor", 3], ["C409.04", "Participate in a Creative Lesson Planning Workshop", 2], ["C409.05", "Act as an Assistant Drill Instructor", 3], ["C409.06", "Instruct a 30-Minute Drill Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Describe Drill Instructional Techniques", 2], ["C309.06", "Instruct a 15 Minute Drill Lesson", 3]]
    },
    "PO X20 - Participate in CAF Familiarization": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 421 - Seamanship": {
      "C": [["C421.01", "Make a Boatswain's Belt", 2], ["C421.02", "Make a Round Mat", 3], ["C421.03", "Make a Net Hammock", 3], ["C321.02", "Rig a Standing Derrick", 6], ["C321.03", "Rig a Gyn", 6], ["C321.04", "Make a Monkey's Fist", 3], ["C321.05", "Make a Turk's Head", 3]]
    },
    "PO 422 - Attain the ROC(M) with DSC Competency": {
      "M": [["C422", "Attain the Restricted Operator's Certificate (Maritime) (ROC[M]) With Digital Selective Calling (DSC) Endorsement", 16]]
    },
    "PO 423 - Serve in a Naval Environment": {
      "M": [["M423.01", "Identify Aspects of a Chart", 2], ["M423.02", "Use Navigation Instruments", 2], ["M423.03", "Describe Latitude and Longitude", 4], ["M423.04", "Plot a Fix", 2]],
      "C": [["C423.01", "Plot a Position Using a Three-Bearing Fix", 2], ["C423.02", "Plot a Position Using a Horizontal-Angle Fix", 2], ["C323.01", "Communicate Using Flags and Pennants", 4], ["C323.02", "Pipe Wakey Wakey", 2], ["C323.03", "Pipe Hands to Dinner", 3]]
    },
    "PO X24 - Sail a Sailboat IAW Sail Canada CANSail Level 1": {
      "M": [["MX24.01", "Prepare for a Sail Weekend", 1]],
      "C": [["X24.02", "Participate in a Sail Weekend", 1]]
    },
    "PO X25 - Participate in a Nautical Training Weekend": {
      "M": [["CX25.01", "Prepare for a Nautical Training Weekend", 1], ["CX25.02", "Participate in a Nautical Activity", 9]]
    },
    "PO M100 - PHASE": { "M": [["M100", "PHASE", 6]] },
    "PO ACR - Annual Ceremonial Review": { "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]] }
  }
};

// ARMY CADET DATA
const armyRawData = {
  "Green Star": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 3]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 1]]
    },
    "PO 103 - PARTICIPATE AS A MEMBER OF A TEAM": {
      "M": [["M103.01", "Identify the Responsibilities of a Follower in a Team", 1], ["M103.03", "Participate in Team building Activities", 2], ["M103.02", "Map Personal Goals for the Training Year", 1]],
      "C": [["C103.01", "Participate in Icebreaker Activities", 1], ["C103.02", "Participate in Self-Introductions", 1], ["C103.03", "Participate in Team building Activities", 3]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 9]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 3]]
    },
    "PO 106 - FIRE THE CADET AIR RIFLE": {
      "M": [["M106.01", "Identify the Parts and Characteristics of the Daisy 853C Air Rifle", 1], ["M106.02", "Carry out Safety Precautions on the Cadet Air Rifle", 1], ["M106.04", "Follow Rules and Commands on an Air Rifle Range", 1], ["M106.03", "Apply Basic Marksmanship Techniques", 1], ["M106.05", "Participate in Marksmanship Familiarization Using the Cadet Air Rifle", 2]],
      "C": [["C106.01", "Participate in a Recreational Marksmanship Activity", 1], ["C106.02", "Clean and Store the Cadet Air Rifle", 1]]
    },
    "PO 107 - SERVE IN AN ARMY CADET CORPS": {
      "M": [["M107.01", "Participate in a Discussion on Green Star Training", 1], ["M107.02", "Identify Army Cadet Ranks and Officer Ranks", 1], ["M107.03", "Observe Rules and Procedures for the Paying of Compliments", 1], ["M107.04", "State the Aims and Motto of the Army Cadet Program", 2], ["M107.05", "Wear the Army Cadet Uniform", 1], ["M107.06", "Participate in a Discussion on Year One Summer Training Opportunities", 2]],
      "C": [["C107.01", "Maintain the Army Cadet Uniform", 3], ["C107.02", "Participate in a Tour of the Cadet Corps", 3], ["C107.03", "Participate in an Activity on the History of the Cadet Corps", 1], ["C107.04", "Establish a Full Value Contract", 1]]
    },
    "PO 108 - PERFORM DRILL MOVEMENTS DURING AN ANNUAL CEREMONIAL REVIEW": {
      "M": [["M108.01", "Adopt the Positions of Attention, Stand at Ease, and Stand Easy", 1], ["M108.02", "Execute a Salute at the Halt Without Arms", 1], ["M108.03", "Execute Turns at the Halt", 1], ["M108.04", "Close to the Right and Left", 1], ["M108.05", "Execute Paces Forward and to the Rear", 1], ["M108.06", "Execute the Movements Required for a Right Dress", 1], ["M108.07", "Execute an Open Order and Close Order March", 1], ["M108.08", "March and Halt in Quick Time", 1], ["M108.09", "Execute Marking Time, Forward, and Halting in Quick Time", 1], ["M108.11", "Pay Compliments with a Squad on the March", 3], ["M108.12", "Perform Drill Movements During an Annual Ceremonial Review", 9], ["M108.10", "Execute a Salute on the March", 6]],
      "C": [["C108.01", "Execute Supplementary Drill Movements", 3], ["C108.02", "Participate in a Drill Competition", 3]]
    },
    "PO C111 - PARTICIPATE IN RECREATIONAL SUMMER BIATHLON ACTIVITIES": {
      "M": [],
      "C": [["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Simulate Firing the Cadet Air Rifle Following Physical Activity", 6], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 1]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 18]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 121 - PARTICIPATE AS A MEMBER OF A TEAM DURING AN OVERNIGHT BIVOUAC FIELD TRAINING EXERCISE (FTX)": {
      "M": [["M121.01", "Select Personal Equipment", 2], ["M121.02", "Transport Personal Equipment", 2], ["M121.03", "Tie Knots and Lashings", 3], ["M121.07", "Erect a Group Tent", 2], ["M121.08", "Apply \"Leave No Trace\" Camping", 1], ["M121.09", "Follow Camp Routine", 2], ["M121.04", "Assemble a Survival Kit", 1], ["M121.05", "Recognize Environmental Hazards", 1], ["M121.06", "Identify Environmental Injuries", 1]],
      "C": [["C121.01", "Construct Field Amenities", 4], ["C121.02", "Participate in a Discussion on Cold Climate Exposure", 1], ["C121.03", "Select Cold Weather Clothing", 1], ["C121.04", "Recognize the Effects of Cold Weather", 2], ["C121.05", "Participate in Cold Weather Training", 18]]
    },
    "PO 122 - IDENTIFY LOCATION USING A MAP": {
      "M": [["M122.01", "Identify Types of Maps", 1], ["M122.02", "Identify Marginal Information and Conventional Signs", 2], ["M122.03", "Interpret Contour Lines", 1], ["M122.04", "Orient a Map by Inspection", 1], ["M122.05", "Determine a Grid Reference", 2], ["M122.CA", "Follow a Route Led by a Section Commander", 9]],
      "C": [["C122.01", "Practice Navigation as a Member of a Team", 12]]
    },
    "PO 123 - PARTICIPATE IN A DAY HIKE": {
      "M": [["M123.01", "Select Hiking Clothing and Equipment", 1], ["M123.02", "Participate in a Day Hike", 9]],
      "C": [["C123.01", "Participate in Adventure Training", 18], ["C123.02", "Explain Snowshoe March Discipline", 1], ["C123.03", "Participate in a Snowshoeing Hike", 9]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Red Star": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 203 - DEMONSTRATE LEADERSHIP ATTRIBUTES WITHIN A PEER SETTING": {
      "M": [["M203.01", "Discuss Leadership Within a Peer Setting", 1], ["M203.02", "Discuss the Principles of Leadership", 1], ["M203.03", "Discuss Effective Communication in a Peer Setting", 1], ["M203.04", "Demonstrate Positive Group Dynamics", 2], ["M203.05", "Discuss Influence Behaviours", 1], ["M203.06", "Employ Problem Solving", 2], ["M203.07", "Discuss Personal Integrity as a Quality of Leadership", 1], ["M203.08", "Participate in Team-Building Activities", 1]],
      "C": [["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.03", "Discuss Characteristics of a Leader", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 206 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M206.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in Recreational Air Rifle Marksmanship", 6]]
    },
    "PO 207 - SERVE IN AN ARMY CADET CORPS": {
      "M": [["M207.01", "Identify Red Star Training Opportunities", 1], ["M207.03", "Recognize the Role and Responsibilities of the Local Sponsor", 1], ["M207.02", "Recognize the History of the Royal Canadian Army Cadets (RCAC)", 1], ["M207.04", "Identify Year Two CSTC Training Opportunities", 1]],
      "C": [["C207.01", "Identify the Rank Structure of the Royal Canadian Sea and Air Cadets", 1], ["C207.02", "Visit a Local Cadet Corps or Squadron", 3], ["C107.03", "Participate in an Activity on the History of the Cadet Corps", 2]]
    },
    "PO 208 - EXECUTE DRILL AS A MEMBER OF A SQUAD": {
      "M": [["M208.01", "Execute Left and Right Turns on the March", 2], ["M208.02", "Form Single File From the Halt", 1]],
      "C": [["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill With Arms", 8], ["C108.01", "Execute Supplementary Drill Movements", 6]]
    },
    "PO 211 - PARTICIPATE IN COMPETITIVE SUMMER BIATHLON ACTIVITIES": {
      "M": [],
      "C": [["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 221 - PERFORM THE DUTIES OF A TEAM MEMBER DURING AN OVERNIGHT FIELD TRAINING EXERCISE": {
      "M": [["M221.01", "Perform the Duties of a Section Member in the Field", 1], ["M221.02", "Identify Section Equipment", 2], ["M221.06", "Construct a Hoochie Shelter", 3], ["M221.07", "Use Section Equipment", 2], ["M221.08", "Prepare an Individual Meal Package (IMP)", 1], ["M221.09", "Maintain Section Equipment Following a Field Training Exercise (FTX)", 2], ["M221.03", "Identify Provincial/Territorial Wildlife", 2], ["M221.04", "Perform Basic First Aid", 1], ["M221.05", "Tie Knots", 3]],
      "C": [["C221.01", "Participate in a Discussion on Canada's Wilderness Conservation Efforts", 2], ["C221.02", "Construct Field Amenities", 6], ["C221.03", "Identify Species of Trees", 2], ["C121.02", "Participate in a Discussion on Cold Climate Exposure", 1], ["C121.03", "Select Cold Weather Clothing", 1], ["C121.04", "Recognize the Effects of Cold Weather", 2], ["C121.05", "Participate in Cold Weather Training", 18]]
    },
    "PO 222 - NAVIGATE ALONG A ROUTE USING A MAP AND COMPASS": {
      "M": [["M222.02", "Describe Bearings", 2], ["M222.03", "Identify Compass Parts", 1], ["M222.04", "Determine Distance Along a Route", 3], ["M222.05", "Orient a Map Using a Compass", 1], ["M222.06", "Follow a Magnetic Bearing Point to Point", 2], ["M222.01", "Review Green Star Navigation", 2]],
      "C": [["C222.01", "Practice Navigation Using a Map and Compass", 9]]
    },
    "PO 223 - HIKE ALONG A ROUTE AS PART OF A WEEKEND EXERCISE": {
      "M": [["M223.01", "Prepare for Trekking", 2]],
      "C": [["C123.01", "Participate in Adventure Training", 9], ["M223.02", "Identify Hiking/Trekking Associations", 1], ["M223.03", "Participate in a Discussion on Crossing Obstacles While Trekking", 2], ["C123.02", "Adhere to Snowshoe March Discipline", 1], ["C123.03", "Participate in Snowshoeing", 9]]
    },
    "PO 224 - IDENTIFY IMMEDIATE ACTIONS TO TAKE WHEN LOST": {
      "M": [["M224.01", "Describe Immediate Actions to Take When Lost", 2], ["M224.02", "Identify the Seven Enemies of Survival", 1], ["M224.04", "Identify Emergency Shelters", 2], ["M224.03", "Predict Weather Using Cloud Formations", 1], ["M224.05", "Prepare, Light, Maintain, and Extinguish a Fire", 3], ["M224.06", "Identify Methods of Signaling", 2]],
      "C": [["C224.01", "Cook in the Field", 2], ["C224.02", "Prepare a signal fire", 2]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Silver Star": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 3]]
    },
    "PO 303 - PERFORM THE ROLE OF A TEAM LEADER": {
      "M": [["M303.01", "Define the Role of a Team Leader", 2], ["M303.02", "Participate in a Mentoring Relationship", 1], ["M303.03", "Practice Self-Assessment", 1], ["M303.04", "Communicate as a Team Leader", 2], ["M303.05", "Supervise Cadets", 2], ["M303.06", "Solve Problems", 2], ["M303.07", "Lead Cadets Through a Leadership Assignment", 2]],
      "C": [["C303.01", "Lead Team-Building Activities", 3], ["C303.02", "Deliver a Presentation About a Leader", 2], ["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2], ["C103.03", "Participate in Teambuilding Activities", 1]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 306 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M306.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 307 - SERVE IN AN ARMY CADET CORPS": {
      "M": [["M307.01", "Identify Silver Star Training Opportunities", 1], ["M307.03", "Recognize the Partnership Between the Army Cadet League of Canada and the Department of National Defence", 1], ["M307.02", "Identify Year Three CSTC Training Opportunities", 1]],
      "C": [["C307.01", "Participate in a Presentation Given by a Guest Speaker From the RCSU", 2], ["C307.02", "Participate in a Presentation Given by the Cadet Liaison Officer", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Army Cadet League of Canada", 2]]
    },
    "PO 308 - DIRECT A SQUAD PRIOR TO A PARADE": {
      "M": [["M308.01", "Prepare a Squad for Parade", 3], ["M308.02", "Deliver Words of Command", 1]],
      "C": [["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 309 - INSTRUCT A LESSON": {
      "M": [["M309.01", "Explain Principles of Instruction", 2], ["M309.02", "Identify Methods of Instruction", 2], ["M309.03", "Describe Effective Speaking Techniques", 1], ["M309.04", "Describe Questioning Techniques", 1], ["M309.05", "Select Appropriate Instructional Aids", 2], ["M309.06", "Plan a Lesson", 2], ["M309.07", "Instruct a 15-Minute Lesson", 3]],
      "C": [["C309.01", "Deliver a One-Minute Verbal Presentation", 2], ["C309.02", "Plan a Lesson", 2], ["C309.03", "Instruct a 15-Minute Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Plan a Drill Lesson", 2], ["C309.06", "Instruct a 15-Minute Drill Lesson", 3]]
    },
    "PO 311 - PARTICIPATE IN A RECREATIONAL SUMMER BIATHLON ACTIVITY": {
      "M": [],
      "C": [["C311.01", "Practice Aiming and Firing the Cadet Air Rifle Following Physical Activity", 3], ["C311.02", "Participate in a Recreational Summer Biathlon Activity", 6], ["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle Using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6], ["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Fire the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 321 - PERFORM THE DUTIES OF A TEAM LEADER ON A WEEKEND BIVOUAC FTX": {
      "M": [["M321.01", "Perform the Duties of a Team Leader in the Field", 1], ["M321.02", "Construct Components of a Bivouac Site", 3]],
      "C": [["C321.01", "Identify Methods of Waste Disposal in the Field", 1], ["C321.02", "Identify Safety Considerations When Travelling Over Snow and Ice", 2], ["C321.03", "Construct Field Amenities", 6], ["C121.02", "Participate in a Discussion on Cold Climate Exposure", 1], ["C121.03", "Select Cold Weather Clothing", 1], ["C121.04", "Recognize the Effects of Cold Weather", 2], ["C121.05", "Participate in Cold Weather Training", 18]]
    },
    "PO 322 - PLOT LOCATION ON A TOPOGRAPHICAL MAP USING A GLOBAL POSITIONING SYSTEM (GPS) RECEIVER": {
      "M": [["M322.02", "Calculate Magnetic Declination", 2], ["M322.01", "Review Red Star Navigation", 1], ["M322.03", "Identify Components of a Global Positioning System", 1], ["M322.04", "Identify Features of a Global Positioning System Receiver", 1], ["M322.05", "Set a Map Datum on a Global Positioning System Receiver", 2], ["M322.06", "Identify Location Using a Global Positioning System Receiver", 4]],
      "C": [["C322.01", "Practice Navigation as a Member of a Small Group", 9], ["C322.02", "Identify Factors That Impact Navigation in the Winter", 4], ["C322.03", "Identify the Principles of Map-Making", 1], ["C322.04", "Draw a Map of an Area in the Local Training Facility", 1]]
    },
    "PO 323 - TREKKING": {
      "M": [],
      "C": [["C123.01", "Participate in Adventure Training", 9], ["C123.02", "Adhere to March Discipline", 1], ["C123.03", "Participate in Snowshoeing", 9]]
    },
    "PO 324 - SURVIVE WHEN LOST": {
      "M": [["M324.01", "Construct an Improvised Shelter", 3], ["M324.05", "Determine When to Self-Rescue", 1], ["M324.02", "Collect Drinking Water", 1], ["M324.03", "Light a Fire Without Matches", 4], ["M324.04", "Predict Weather", 1]],
      "C": [["C324.01", "Identify Animal and Insect Food Sources", 2], ["C324.02", "Construct Snares", 4], ["C324.03", "Catch a Fish", 3], ["C324.04", "Collect Edible Plants", 4], ["C324.05", "Prepare a Meal from Field Food Sources", 3], ["C224.01", "Cook in the Field", 2], ["C224.02", "Prepare a Signal Fire", 2]]
    },
    "PO 325 - IDENTIFY THE COMPETENCIES OF AN OUTDOOR LEADER": {
      "M": [["M325.01", "Participate in a Discussion on Army Cadet Expedition Training", 1], ["M325.02", "List the Competencies of an Outdoor Leader", 2], ["M325.03", "Discuss Self-Awareness and Professional Conduct as a Competency of an Outdoor Leader", 1]],
      "C": [["C325.01", "Communicate During an Expedition", 6], ["C325.02", "Participate in a Presentation on the Duke of Edinburgh Award Program", 1]]
    },
    "PO 326 - PERFORM EXPEDITION SKILLS": {
      "M": [["M326.01", "Prepare for Expedition Training", 1], ["M326.02a", "Paddle a Canoe (Note 2)", 6], ["M326.02b", "Ride a Mountain Bike (Note 2)", 6], ["M326.02c", "Hike Along a Route (Note 2)", 6], ["M326.03", "Practice Environmental Stewardship as a Team Leader", 1], ["M326.04", "Navigate Along a Route Using a Map and Compass", 2], ["M326.05", "Use Expedition Equipment", 2], ["M326.06", "Follow Daily Routine", 1], ["M326.07", "Record Entries in a Journal", 1]],
      "C": []
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Gold Star": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 403 - ACT AS A TEAM LEADER": {
      "M": [["M403.01", "Describe Needs and Expectations of Team Members", 1], ["M403.02", "Select a Leadership Approach", 2], ["M403.03", "Describe How to Motivate Team Members", 2], ["M403.04", "Provide Feedback to Team Members", 2], ["M403.05", "Participate in a Mentoring Relationship", 2], ["M403 06", "Act as a Team Leader During a Leadership Appointment", 1]],
      "C": [["C403.01", "Participate in a Leadership Seminar", 12], ["C303.01", "Lead a Team-Building Activity", 3], ["C303.02", "Deliver a Presentation About a leader", 2]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 406 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M406.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C406.01", "Assist the Range Safety Officer (RSO)", 1], ["C406.02", "Score Air Rifle Marksmanship Targets", 1], ["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 407 - SERVE IN AN ARMY CADET CORPS": {
      "M": [["M407.01", "Identify Gold Star Training Opportunities", 1], ["M407.02", "Identify Year Four CSTC Training Opportunities", 1], ["M407.03", "Identify the Structure of a Cadet Corps", 2]],
      "C": [["C407.01", "Prepare for a Merit Review Board", 1], ["C307.01", "Participate in a Presentation Given by a Guest Speaker From the Regional Cadet Support Unit", 2], ["C307.02", "Participate in a Presentation Given by the Cadet Liaison Officer", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Army Cadet League of Canada", 2]]
    },
    "PO 408 - COMMAND A PLATOON ON PARADE": {
      "M": [["M408.01", "Discuss Commanding a Platoon on Parade", 1], ["M408.02", "Identify Parade Sequence", 1], ["M408.03", "Command a Squad", 1], ["M408.04", "Inspect a Cadet on Parade", 2]],
      "C": [["C408.01", "Discuss the History of Drill", 1], ["C408.02", "View a Re-Enactment That Demonstrates the History of Drill", 3], ["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 409 - INSTRUCT A LESSON": {
      "M": [["M409.01", "Identify Methods of Instruction", 2], ["M409.02", "Identify Elements of a Positive Learning Environment", 2], ["M409.03", "Describe Learner Needs", 2], ["M409.04", "Explain Assessment", 1], ["M409.05", "Instruct a 30-Minute Lesson", 3]],
      "C": [["C409.01", "Plan a Lesson", 2], ["C409.02", "Instruct a 30-Minute Lesson", 3], ["C409.03", "Act as an Assistant Instructor", 3], ["C409.04", "Participate in a Creative Lesson Planning Workshop", 2], ["C409.05", "Act as an Assistant Drill Instructor", 3], ["C409.06", "Instruct a 30-Minute Drill Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Describe Drill Instructional Techniques", 2], ["C309.06", "Instruct a 15 Minute Drill Lesson", 3]]
    },
    "PO 411 - BIATHLON": {
      "M": [],
      "C": [["C311.01", "Practice Aiming and Firing the Cadet Air Rifle Following Physical Activity", 3], ["C311.02", "Participate in a Recreational Summer Biathlon Activity", 6], ["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6], ["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Fire the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 421 - FIELD TRAINING": {
      "M": [],
      "C": [["C123.01", "Participate in Adventure Training", 9], ["C121.02", "Participate in a Discussion on Cold Climate Exposure", 1], ["C121.03", "Select Cold Weather Clothing", 1], ["C121.04", "Recognize the Effects of Cold Weather", 2], ["C121.05", "Participate in Cold Weather Training", 18]]
    },
    "PO 422 - FOLLOW A MULTI-LEG ROUTE USING A GLOBAL POSITIONING SYSTEM (GPS) RECEIVER": {
      "M": [["M422.01", "Review Silver Star Navigation", 2], ["M422.02", "Set a Multi-Leg Route Using a GPS Receiver", 4], ["M422.03", "Follow a Multi-Leg Route Using a GPS Receiver", 3]],
      "C": [["C422.01", "Locate a Geocache", 1], ["C422.02", "Create a Geocache", 1], ["C422.03", "Discuss Map Software", 1], ["C422.04", "Measure a Grid Bearing With a Protractor", 3], ["C422.05", "Determine Location Using Resection", 2], ["C422.06", "Practice Navigation as a Member of a Small Group", 9], ["C322.02", "Identify Factors That Impact Navigation in the Winter", 4]]
    },
    "PO 423 - TREKKING": {
      "M": [],
      "C": [["C123.02", "Adhere to March Discipline", 1], ["C123.03", "Participate in Snowshoeing", 9]]
    },
    "PO 424 - EMPLOY NATURAL RESOURCES IN A SURVIVAL SITUATION": {
      "M": [["M424.01", "Sharpen a Survival Knife", 2], ["M424.02", "Employ the Improvising Process", 1], ["M424.03", "Weave Cordage", 3]],
      "C": [["C424.01", "Whittle Wood", 3], ["C424.02", "Boil Water Using Heated Rocks", 2], ["C424.03", "Employ Cattails", 2], ["C424.04", "Prepare Remedies for Common Ailments Using Medicinal Plants", 2], ["C324.01", "Identify Animal and Insect Food Sources", 2], ["C324.02", "Construct Snares", 4], ["C324.03", "Catch a Fish", 3], ["C324.04", "Collect Edible Plants", 4], ["C324.05", "Prepare a Meal from Field Food Sources", 3]]
    },
    "PO 425 - DEVELOP AN EXPEDITION PLAN": {
      "M": [["M425.01", "Establish Expedition Parameters", 1], ["M425.02", "Plan an Expedition Route", 3], ["M425.03", "Develop an Expedition Equipment List", 2], ["M425.04", "Develop an Expedition Ration Plan", 2]],
      "C": [["C425.01", "Discuss Actions Taken When a Person is Lost", 2], ["C425.02", "Analyze Problems Using an Expedition Case Study", 9], ["C325.01", "Communicate During an Expedition", 4], ["C325.02", "Participate in a Presentation on the Duke of Edinburgh Award Program", 1]]
    },
    "PO 426 - PERFORM EXPEDITION SKILLS": {
      "M": [["M426.01", "Prepare for Expedition Training", 1], ["M426.02a", "Paddle a Canoe", 9], ["M426.02b", "Ride a Mountain Bike", 9], ["M426.02c", "Hike Along a Route", 9], ["M426.02d", "Snowshoe Along a Route", 9], ["M426.02e", "Ski Along a Route", 9]],
      "C": []
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  }
};

// AIR CADET DATA
const airRawData = {
  "Level 1": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 103 - PARTICIPATE AS A MEMBER OF A TEAM": {
      "M": [["M103.01", "Identify the Responsibilities of a Follower in a Team", 1], ["M103.03", "Participate in Team building Activities", 2], ["M103.02", "Map Personal Goals for the Training Year", 1]],
      "C": [["C103.01", "Participate in Icebreaker Activities", 1], ["C103.02", "Participate in Self-Introductions", 1], ["C103.03", "Participate in Team building Activities", 1]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 106 - FIRE THE CADET AIR RIFLE": {
      "M": [["M106.01", "Identify the Parts and Characteristics of the Daisy 853C Air Rifle", 1], ["M106.02", "Carry out Safety Precautions on the Cadet Air Rifle", 1], ["M106.04", "Follow Rules and Commands on an Air Rifle Range", 1], ["M106.03", "Apply Basic Marksmanship Techniques", 2], ["M106.05", "Participate in Marksmanship Familiarization Using the Cadet Air Rifle", 3]],
      "C": [["C106.01", "Participate in a Recreational Marksmanship Activity", 3], ["C106.02", "Clean and Store the Cadet Air Rifle", 1]]
    },
    "PO 107 - SERVE IN AN AIR CADET SQUADRON": {
      "M": [["M107.01", "Discuss Year One Training", 1], ["M107.02", "Identify Air Cadet and RCAF Officer Ranks", 1], ["M107.03", "Observe Rules and Procedures for the Paying of Compliments", 1], ["M107.04", "State the Aim and Motto of the Air Cadet Program", 1], ["M107.05", "Wear the Air Cadet Uniform", 2], ["M107.06", "Discuss Summer Training Opportunities", 1]],
      "C": [["C107.01", "Maintain the Air Cadet Uniform", 2], ["C107.02", "Identify the RCAF NCM Rank Structure", 1], ["C107.03", "Tour the Squadron", 1], ["C107.04", "Participate in an Activity about the History of the Squadron", 2]]
    },
    "PO 108 - PERFORM DRILL MOVEMENTS DURING AN ANNUAL CEREMONIAL REVIEW": {
      "M": [["M108.01", "Adopt the Positions of Attention, Stand at Ease, and Stand Easy", 1], ["M108.02", "Execute a Salute at the Halt Without Arms", 1], ["M108.03", "Execute Turns at the Halt", 1], ["M108.04", "Close to the Right and Left", 1], ["M108.05", "Execute Paces Forward and to the Rear", 1], ["M108.06", "Execute the Movements Required for a Right Dress", 1], ["M108.07", "Execute an Open Order and Close Order March", 1], ["M108.08", "March and Halt in Quick Time", 1], ["M108.09", "Execute Marking Time, Forward, and Halting in Quick Time", 1], ["M108.11", "Pay Compliments with a Squad on the March", 1], ["M108.12", "Perform Drill Movements During an Annual Ceremonial Review", 3], ["M108.10", "Execute a Salute on the March", 1]],
      "C": [["C108.01", "Execute Supplementary Drill Movements", 6], ["C108.02", "Participate in a Drill Competition", 3]]
    },
    "PO 111 - PARTICIPATE IN RECREATIONAL SUMMER BIATHLON ACTIVITIES": {
      "M": [],
      "C": [["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Simulate Firing the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 121 - PARTICIPATE IN CANADIAN AVIATION, AEROSPACE, AERODROME OPERATIONS AND AIRCRAFT MANUFACTURING AND MAINTENANCE COMMUNITY FAMILIARIZATION ACTIVITIES": {
      "M": [["M121.01", "Discuss Aviation Opportunities", 1]],
      "C": [["C121.01", "Participate in a Presentation Given by a Member of the Canadian Aviation, Aerospace or Aerodrome Operations Community", 8]]
    },
    "PO 129 - COMMUNICATE USING THE PHONETIC ALPHABET AND NUMBERS": {
      "M": [["M129.01", "Recite the Phonetic Alphabet and Numbers", 1]],
      "C": []
    },
    "PO 130 - PARTICIPATE IN AVIATION ACTIVITIES": {
      "M": [["M130.01", "Identify Aircraft as Military, Civilian and Cadet", 2], ["M130.02", "Describe the Main Components of an Airplane", 1], ["M130.03", "Construct a Model Airplane", 2], ["M130.04", "Watch On Canadian Wings Video", 1]],
      "C": [["C130.01", "Participate in a Walk-Around Aircraft Inspection", 1], ["C130.02", "Identify International Aircraft", 1], ["C130.03", "Watch On Canadian Wings Video", 8], ["C130.04", "Tour a Local Aviation Museum", 3], ["C130.05", "Attend a Local Air Show", 6]]
    },
    "PO 140 - PARTICIPATE IN AEROSPACE ACTIVITIES": {
      "M": [["M140.01", "Launch a Water Rocket", 3]],
      "C": [["C140.01", "Launch a Foam Rocket", 2], ["C140.02", "Discuss Sleep Patterns in Space", 2]]
    },
    "PO 160 - PARTICIPATE IN AERODROME OPERATIONS ACTIVITIES": {
      "M": [["M160.01", "Identify Major Aerodrome Components", 1], ["M160.02", "Identify Features of a Runway", 1], ["M160.03", "Construct a Model Aerodrome", 2]],
      "C": [["C160.01", "Tour a Local Aerodrome", 3]]
    },
    "PO 170 - DISCUSS AIRCRAFT MAINTENANCE AND MANUFACTURING": {
      "M": [],
      "C": [["C170.01", "Watch How It's Made Segments", 2], ["C170.02", "Tour a Local Aviation Maintenance Facility", 3]]
    },
    "PO 190 - PARTICIPATE IN AN AIRCREW SURVIVAL EXERCISE": {
      "M": [["M190.01", "Pack Personal Equipment for a Field Exercise", 2], ["M190.02", "Maintain Personal Equipment and Hygiene in the Field", 1], ["M190.03", "Observe Site Policies and Procedures", 2], ["M190.04", "Discuss Survival Psychology", 2], ["M190.05", "Identify Types of Shelters", 1], ["M190.07", "Erect, Tear Down and Pack Tents", 3], ["M190.06", "Light, Maintain and Extinguish a Fire", 3]],
      "C": [["C190.02", "Tie Knots and Lashings", 2], ["C190.01", "Participate in a Presentation Given by a Member of a Survival Organization I Search and Rescue (SAR) Community", 2], ["C190.03", "Construct a Hootchie-Style Shelter", 3], ["C190.04", "Collect Drinking Water in the Field", 2], ["C190.05", "Identify Environmental Injuries", 1], ["C190.06", "Respect the Environment in the Field", 1], ["C190.07", "Identify Habitats of Animals and Insects", 1]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Level 2": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 203 - DEMONSTRATE LEADERSHIP ATTRIBUTES WITHIN A PEER SETTING": {
      "M": [["M203.01", "Discuss Leadership Within a Peer Setting", 1], ["M203.02", "Discuss the Principles of Leadership", 1], ["M203.03", "Discuss Effective Communication in a Peer Setting", 1], ["M203.04", "Demonstrate Positive Group Dynamics", 2], ["M203.05", "Discuss Influence Behaviours", 1], ["M203.06", "Employ Problem Solving", 2], ["M203.07", "Discuss Personal Integrity as a Quality of Leadership", 1], ["M203.08", "Participate in Team-Building Activities", 1]],
      "C": [["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.03", "Discuss Characteristics of a Leader", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 206 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M206.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in Recreational Air Rifle Marksmanship", 6]]
    },
    "PO 207 - SERVE IN AN AIR CADET SQUADRON": {
      "M": [["M207.01", "Identify Proficiency Level Two Training Opportunities", 1], ["M207.03", "Recognize the Role and Responsibilities of the Local Sponsor", 1], ["M207.02", "Recognize Historical Aspects of the Royal Canadian Air Cadets (RCAC)", 1], ["M207.04", "Identify Year Two CSTC Training Opportunities", 1]],
      "C": [["C207.01", "Identify the Rank Structure of the Royal Canadian Sea and Army Cadets", 1], ["C207.02", "Visit a Royal Canadian Sea I Army Cadet Corps or an Air Cadet Squadron", 3], ["C207.03", "Describe the Affiliated Unit", 1], ["C207.04", "Tour the Affiliated Unit", 3], ["C107.04", "Participate in an Activity about the History of the Squadron", 2]]
    },
    "PO 208 - EXECUTE DRILL AS A MEMBER OF A SQUAD": {
      "M": [["M208.01", "Execute Left and Right Turns on the March", 2], ["M208.02", "Form Single File From the Halt", 1]],
      "C": [["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill With Arms", 8], ["C108.01", "Execute Supplementary Drill Movements", 6]]
    },
    "PO C211 - PARTICIPATE IN COMPETITIVE SUMMER BIATHLON ACTIVITIES": {
      "M": [],
      "C": [["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 6]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 230 - DISCUSS CANADIAN AVIATION HISTORY": {
      "M": [["M230.01", "Discuss Aircraft Flown During WWI and WWII", 1], ["M230.02", "Discuss Significant Events in 20th Century Canadian Military History", 1]],
      "C": [["C230.01", "Participate in a Presentation Given by a Member of the Memory Project Speakers Bureau", 2], ["C230.02", "Tour a Local Aviation Museum", 3], ["C230.03", "Discuss Significant Canadian Historical Events Relative to Aviation", 1], ["C130.03", "Watch On Canadian Wings Video", 8]]
    },
    "PO 231 - EXPLAIN PRINCIPLES OF FLIGHT": {
      "M": [["M231.01", "Identify the Four Forces that Act Upon an Aircraft", 2], ["M231.02", "Describe the Production of Lift by an Aircraft Wing", 2], ["M231.03", "Describe the Types of Drag that Act Upon an Aircraft", 2], ["M231.04", "Describe the Axial Movements of an Aircraft", 1], ["M231.05", "Describe Aircraft Control Surfaces", 2]],
      "C": [["C231.01", "Operate an Experimental Wing", 2], ["C231.02", "Fly a Paper Colditz Glider", 2], ["C231.03", "Tour a Flight School", 3], ["C231.04", "Participate in a Presentation Given by a Guest Speaker from the Local Aviation Community", 2], ["C231.05", "Tour a Flight Simulator", 3], ["C231.06", "Tour a Local Air Show", 6]]
    },
    "PO 232 - IDENTIFY CHARACTERISTICS OF PISTON-POWERED AIRCRAFT": {
      "M": [["M232.01", "Identify Types of Aircraft Engines", 1], ["M232.02", "Identify the Components of Piston-Powered Internal Combustion Engines", 2], ["M232.03", "Explain the Cycles of a Four-Stroke Piston- Powered Engine", 2], ["M232.04", "Recognize the Functions of Oil in a Four-Stroke Piston-Powered Engine", 1]],
      "C": [["C232.01", "Identify the Characteristics of Gas Turbine Engines", 2], ["C232.02", "Identify the Characteristics of Gas Turbine Engines", 2], ["C232.03", "Identify the Characteristics of Helicopter Engines", 2]]
    },
    "PO 240 - PARTICIPATE IN AEROSPACE ACTIVITIES": {
      "M": [["M240.01", "Explore Current Advancements in Aerospace Technology", 1], ["M240.02", "Invent a Space Technology Item", 2], ["M240.03", "Participate in a Space Survival Scenario", 1]],
      "C": [["C240.03", "Identify Parts of a Rocket", 1], ["C240.01", "Participate in a Non-Verbal Communication Activity", 1], ["C240.02", "Invent a Communication System for Space", 2], ["C240.04", "Navigate with a Global Positioning System (GPS)", 3], ["C240.05", "Simulate Survival in Space", 2], ["C240.06", "Determine Direction Using Constellations on a Field Exercise", 1]]
    },
    "PO 260 - PARTICIPATE IN AERODROME OPERATIONS ACTIVITIES": {
      "M": [["M260.01", "Explain Aspects of Air Traffic Control (ATC)", 1], ["M260.02", "Identify Aspects of Basic Aerodrome Operations", 1]],
      "C": [["C260.04", "Perform Marshalling", 1], ["C260.01", "Tour an Aerodrome Security Facility", 3], ["C260.02", "Tour an Air Traffic Control (ATC) Tower", 3], ["C260.03", "Participate in a Presentation Given by an Employee of an Aerodrome", 2], ["C260.05", "Tour an Aerodrome", 3]]
    },
    "PO 270 - DISCUSS AIRCRAFT MANUFACTURING AND MAINTENANCE": {
      "M": [["M270.01", "Identify Aspects of Aircraft Manufacturing", 2], ["M270.02", "Identify Requirements for Aircraft Maintenance", 2], ["M270.03", "Discuss Education and Employment Opportunities in Aircraft Manufacturing and Maintenance", 2]],
      "C": [["C270.01", "Participate in a Presentation Given by an Employee in the Aircraft Manufacturing or Maintenance Industry", 2], ["C270.02", "Participate in a Presentation Given by an Employee in the Aircraft Manufacturing or Maintenance Industry", 1], ["C270.03", "Tour an Aircraft Manufacturing or Maintenance Facility", 3], ["C270.04", "Watch World's Biggest Airliner: The Airbus A380 - Coming Together", 2]]
    },
    "PO 290 - PARTICIPATE IN A FIELD EXERCISE": {
      "M": [["M290.01", "Construct, Light, Maintain and Extinguish a Signal Fire", 2], ["M290.02", "Construct a Lean-to-Style Shelter", 3], ["M290.03", "Construct a Simple Snare", 2], ["M290.04", "Construct Ground-to-Air Signals", 2], ["M290.05", "Identify Hiking Techniques", 2], ["M290.06", "Operate a Hand-Held Radio", 1]],
      "C": [["C290.01", "Participate in a Presentation Given by a Member of a Survival Organization", 2], ["C290.02", "Discuss Skinning and Cooking a Small Animal", 1], ["C290.03", "Construct a Snow Cave", 3], ["C290.04", "Collect Drinking Water Using a Solar Still", 2], ["C290.05", "Participate in a Hike", 6]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Level 3": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 303 - PERFORM THE ROLE OF A TEAM LEADER": {
      "M": [["M303.01", "Define the Role of a Team Leader", 2], ["M303.02", "Participate in a Mentoring Relationship", 1], ["M303.03", "Practice Self-Assessment", 1], ["M303.04", "Communicate as a Team Leader", 2], ["M303.05", "Supervise Cadets", 2], ["M303.06", "Solve Problems", 2], ["M303.07", "Lead Cadets Through a Leadership Assignment", 2]],
      "C": [["C303.01", "Lead Team-Building Activities", 3], ["C303.02", "Deliver a Presentation About a Leader", 2], ["C203.01", "Record Entries in a Reflective Journal", 3], ["C203.02", "Employ Problem Solving", 2], ["C203.04", "Participate in a Presentation Given by a Leader", 2], ["C203.05", "Participate in Trust-Building Activities", 1], ["C203.06", "Participate in Problem-Solving Activities", 2], ["C103.03", "Participate in Teambuilding Activities", 1]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 306 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M306.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C206.01", "Practice Holding Techniques", 1], ["C206.02", "Practice Aiming Techniques", 2], ["C206.03", "Practice Firing Techniques", 1], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 307 - SERVE IN AN AIR CADET SQUADRON": {
      "M": [["M307.01", "Identify Proficiency Level Three Training Opportunities", 1], ["M307.03", "Recognize the Partnership Between the Air Cadet League of Canada and the Department of National Defence", 1], ["M307.02", "Identify Year Three CSTC Training Opportunities", 1]],
      "C": [["C307.01", "Participate in a Presentation Given by a Guest Speaker From the Regional Cadet Support Unit", 2], ["C307.02", "Participate in a Presentation Guven by the Cadet Liaison Officer", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Air Cadet League of Canada", 2], ["C307.04", "Participate in a Presentation on the Duke of Edinburgh Award Program", 1]]
    },
    "PO 308 - DIRECT A SQUAD PRIOR TO A PARADE": {
      "M": [["M308.01", "Prepare a Squad for Parade", 3], ["M308.02", "Deliver Words of Command", 1]],
      "C": [["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 309 - INSTRUCT A LESSON": {
      "M": [["M309.01", "Explain Principles of Instruction", 2], ["M309.02", "Identify Methods of Instruction", 2], ["M309.03", "Describe Effective Speaking Techniques", 1], ["M309.04", "Describe Questioning Techniques", 1], ["M309.05", "Select Appropriate Instructional Aids", 2], ["M309.06", "Plan a Lesson", 2], ["M309.07", "Instruct a 15-Minute Lesson", 3]],
      "C": [["C309.01", "Deliver a One-Minute Verbal Presentation", 2], ["C309.02", "Plan a Lesson", 2], ["C309.03", "Instruct a 15-Minute Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Plan a Drill Lesson", 2], ["C309.06", "Instruct a 15-Minute Drill Lesson", 3]]
    },
    "PO 311 - PARTICIPATE IN A RECREATIONAL SUMMER BIATHLON ACTIVITY": {
      "M": [],
      "C": [["C311.01", "Practice Aiming and Firing the Cadet Air Rifle Following Physical Activity", 3], ["C311.02", "Participate in a Recreational Summer Biathlon Activity", 6], ["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle Using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6], ["C111.01", "Participate in a Biathlon Briefing", 1], ["C111.02", "Run Wind Sprints", 1], ["C111.03", "Fire the Cadet Air Rifle Following Physical Activity", 1], ["C111.04", "Participate in a Recreational Summer Biathlon Activity", 6]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION ACTIVITIES": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 331 - DESCRIBE PRINCIPLES OF FLIGHT": {
      "M": [["M331.01", "Describe Aircraft Stability", 2]],
      "C": [["C331.01", "Review Principles of Flight", 1], ["C331.02", "Read Pitot Static Instruments", 2], ["C331.03", "Identify Aspects of Helicopter Aerodynamics", 1], ["C331.04", "Demonstrate Attitudes and Movements in a Flight Simulator", 3], ["C331.05", "Participate in a Presentation Given by a Guest Speaker From the Local Aviation Community", 2]]
    },
    "PO 336 - IDENTIFY METEOROLOGICAL CONDITIONS": {
      "M": [["M336.01", "Describe Properties of the Atmosphere", 1], ["M336.02", "Explain the Formation of Clouds", 1], ["M336.03", "Explain the Effects of Air Pressure on Weather", 1], ["M336.04", "Explain the Effects of Humidity and Temperature on Weather", 2]],
      "C": [["C336.01", "Read an Aviation Routine Weather Report (METAR)", 2], ["C336.02", "Tour a Meteorological Facility", 3], ["C336.03", "Participate in a Presentation Given by an Flight Services Specialist", 2]]
    },
    "PO 337 - DEMONSTRATE AIR NAVIGATION SKILLS": {
      "M": [["M337.01", "Measure Distance Along a Route", 1], ["M337.02", "Determine a Position on a Visual Flight Rules (VFR) Navigation Chart (VNC)", 1]],
      "C": [["C337.01", "Operate a Radio for Aviation Transmission", 1], ["C337.03", "Practice Air Navigation Skills", 1]]
    },
    "PO 340 - IDENTIFY ASPECTS OF SPACE EXPLORATION": {
      "M": [["M340.01", "Identify Canadian Astronauts", 1], ["M340.02", "Discuss the History of Manned Space Exploration", 1]],
      "C": [["C340.02", "Discuss the Canadian Space Program", 1], ["C340.06", "Launch a Water Rocket", 3], ["C340.01", "Identify Canadian Astronauts", 2], ["C340.03", "Discuss Unmanned Space Exploration", 2], ["C340.04", "Describe Elements of the Night Sky", 1], ["C340.05", "Simulate Life in Space", 3], ["C340.07", "Identify Global Position System (GPS) Components", 2], ["C340.08", "Describe Aspects of the International Space Station (ISS)", 1], ["C340.09", "Participate in a Presentation Given by a Guest Speaker from the Astronomy Community or Aerospace Industry", 2], ["C340.10", "Identify Online Stargazing Programs", 1]]
    },
    "PO 360 - RECOGNIZE ASPECTS OF AERODROME OPERATIONS": {
      "M": [],
      "C": [["C360.01", "Identify Types of Aerodromes", 1], ["C360.02", "Explain Aspects of Aerodrome Lighting", 1], ["C360.03", "Construct a Model of the Airspace at an Aerodrome", 3], ["C360.04", "Identify How Equipment is Used at an Aerodrome", 1], ["C360.05", "Identify Aspects of Emergency Response and Aerodrome Security", 1], ["C360.06", "Explain Aspects of Air Traffic Services (ATS)", 1]]
    },
    "PO 370 - RECOGNIZE ASPECTS OF AIRCRAFT MANUFACTURING AND MAINTENANCE": {
      "M": [["M370.01", "Identify Components of the Pitot Static System", 1], ["M370.02", "Identify Aircraft Manufacturers", 1], ["M370.03", "Describe Routine Aircraft Inspection Procedures", 1]],
      "C": [["C370.01", "Identify Tasks Required to Maintain Aircraft", 1], ["C370.02", "Describe Materials Used in Aircraft Construction", 1], ["C370.03", "Identify Basic Power Tools Used in Aircraft Manufacturing and Maintenance", 1], ["C370.04", "Construct an Aluminium Model Biplane", 12], ["C370.05", "Tour an Aircraft Restoration Project", 3], ["C270.01", "Participate in a Presentation Given by an Employee From the Aircraft Manufacturing and Maintenance Industry", 2], ["C270.03", "Tour an Aircraft Manufacturing or Maintenance Facility", 3]]
    },
    "PO 390 - NAVIGATE A ROUTE USING A MAP AND COMPASS": {
      "M": [["M390.01", "Identify Parts of the Compass", 1], ["M390.02", "Identify Marginal Information and Conventional Signs", 2], ["M390.03", "Determine Grid References (GRs)", 2], ["M390.04", "Determine Distance on a Map and on the Ground", 3], ["M390.05", "Determine Bearings on a Map and on the Ground", 2]],
      "C": [["C390.01", "Identify Types of Maps", 1], ["C390.02", "Interpret Contour Lines", 1], ["C390.03", "Orient a Map by Inspection", 1], ["C390.04", "Orient a Map Using a Compass", 1], ["C390.05", "Calculate Magnetic Declination", 2], ["C390.06", "Determine Direction Using the Sun", 1], ["C390.07", "Determine Direction at Night", 1], ["C390.08", "Use Blazing Techniques", 1], ["C390.09", "Identify Elements of the Night Sky", 4], ["C390.10", "Identify Methods of Preparing and Cooking a Small Animal or Fish", 2], ["C390.11", "Construct Camp Crafts", 4], ["C390.12", "Perform Minor First Aid in a Field Setting", 4], ["C390.13", "Act as a Member of a Ground Search and Rescue (SAR) Party", 4], ["C390.14", "Participate in a Presentation Given by a Guest Speaker from the Search and Rescue (SAR) Community", 2], ["C290.04", "Collect Drinking Water Using a Solar Still", 2]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  },
  "Level 4": {
    "PO 100 - PARTICIPATE IN PHASE": {
      "M": [["M100", "PHASE", 6]],
      "C": []
    },
    "PO X01 - PARTICIPATE IN CITIZENSHIP ACTIVITIES": {
      "M": [["MX01.01", "Participate in Citizenship Activities", 3]],
      "C": [["CX01.01", "Participate in Citizenship Activities", 18]]
    },
    "PO X02 - PERFORM COMMUNITY SERVICE": {
      "M": [["MX02.01", "Perform Community Service", 9]],
      "C": [["CX02.01", "Perform Community Service", 18]]
    },
    "PO 403 - ACT AS A TEAM LEADER": {
      "M": [["M403.01", "Describe Needs and Expectations of Team Members", 1], ["M403.02", "Select a Leadership Approach", 2], ["M403.03", "Describe How to Motivate Team Members", 2], ["M403.04", "Provide Feedback to Team Members", 2], ["M403.05", "Participate in a Mentoring Relationship", 2], ["M403 06", "Act as a Team Leader During a Leadership Appointment", 1]],
      "C": [["C403.01", "Participate in a Leadership Seminar", 12], ["C303.01", "Lead a Team-Building Activity", 3], ["C303.02", "Deliver a Presentation About a Leader", 2]]
    },
    "PO X04 - TRACK PARTICIPATION IN PHYSICAL ACTIVITIES": {
      "M": [["MX04.01", "Participate in 60 Minutes of Moderate to Vigorous Intensity Physical Activity (MVPA) and Track Participation in Physical Activities", 3], ["MX04.02", "Identify Strategies to Improve Participation in Physical Activities and Participate in the Cadet Fitness Assessment (CFA)", 3], ["MX04.03", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3]],
      "C": [["CX04.01", "Participate in the CFA and Identify Strategies for Improving Personal Physical Fitness", 3], ["CX04.02", "Participate in Activities that Reinforce the Three Components of Physical Fitness", 3], ["CX04.03", "Participate in a Cooking Class", 3], ["CX04.04", "Attend a Personal Fitness and Healthy Living Presentation", 3], ["CX04.05", "Attend a Local Amateur Sporting Event", 3]]
    },
    "PO X05 - PARTICIPATE IN PHYSICAL ACTIVITIES": {
      "M": [["MX05.01", "Participate in Physical Activities", 9]],
      "C": [["CX05.01", "Participate in Physical Activities", 9], ["CX05.02", "Participate in a Tournament", 9]]
    },
    "PO 406 - FIRE THE CADET AIR RIFLE DURING RECREATIONAL MARKSMANSHIP": {
      "M": [["M406.01", "Participate in a Recreational Marksmanship Activity", 3]],
      "C": [["C406.01", "Assist the Range Safety Officer (RSO)", 1], ["C406.02", "Score Air Rifle Marksmanship Targets", 1], ["C306.01", "Identify Civilian Marksmanship Organizations", 1], ["C306.02", "Correct Marksmanship Error", 2], ["C306.03", "Fire the Cadet Air Rifle from the Standing Position", 2], ["C106.01", "Participate in a Recreational Marksmanship Activity", 6]]
    },
    "PO 407 - SERVE IN AN AIR CADET SQUADRON": {
      "M": [["M407.01", "Discuss Proficiency Level Four Training Opportunities", 1], ["M407.02", "Discuss Year Four Cadet Summer Training Centre (CSTC) Training Opportunities", 1]],
      "C": [["C407.01", "Prepare for a Selection Board", 3], ["C407.02", "Describe the Application Procedure for National Courses and Exchanges", 1], ["C307.01", "Participate in a Presentation Given by a Guest Speaker From the Regional Cadet Support Unit (RCSU)", 2], ["C307.02", "Participate in a Presentation Given by the Cadet Liaison Officer (CLO)", 2], ["C307.03", "Participate in a Presentation Given by a Guest Speaker from the Air Cadet League of Canada (ACLC)", 2], ["C307.04", "Identify the Application Procedures for the Glider and Power Scholarships", 2], ["C307.05", "Participate in a Presentation on the Duke of Edinburgh Award Program", 1]]
    },
    "PO 408 - COMMAND A FLIGHT ON PARADE": {
      "M": [["M408.01", "Discuss Commanding a Flight on Parade", 1], ["M408.02", "Identify Parade Sequence", 1], ["M408.03", "Command a Squad", 1], ["M408.04", "Inspect a Cadet on Parade", 2]],
      "C": [["C408.01", "Discuss the History of Drill", 1], ["C408.02", "View a Re-Enactment That Demonstrates the History of Drill", 3], ["C308.01", "Execute Flag Party Drill", 4], ["C308.02", "Deliver Words of Command", 2], ["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill with Arms", 8]]
    },
    "PO 409 - INSTRUCT A LESSON": {
      "M": [["M409.01", "Identify Methods of Instruction", 2], ["M409.02", "Identify Elements of a Positive Learning Environment", 2], ["M409.03", "Describe Learner Needs", 2], ["M409.04", "Explain Assessment", 1], ["M409.05", "Instruct a 30-Minute Lesson", 3]],
      "C": [["C409.01", "Plan a Lesson", 2], ["C409.02", "Instruct a 30-Minute Lesson", 3], ["C409.03", "Act as an Assistant Instructor", 3], ["C409.04", "Participate in a Creative Lesson Planning Workshop", 2], ["C409.05", "Act as an Assistant Drill Instructor", 3], ["C409.06", "Instruct a 30-Minute Drill Lesson", 3], ["C309.04", "Identify Formations for Drill Instruction", 1], ["C309.05", "Describe Drill Instructional Techniques", 2], ["C309.06", "Instruct a 15 Minute Drill Lesson", 3]]
    },
    "PO X20 - PARTICIPATE IN CAF FAMILIARIZATION": {
      "M": [["MX20.01", "Participate in a CAF Engagement Activity", 9]],
      "C": [["CX20.01", "Participate in CAF Familiarization Activities", 18]]
    },
    "PO 429 - COMMUNICATE USING RADIO PROCEDURES FOR AVIATION TRANSMISSION": {
      "M": [],
      "C": [["C429.01", "Explain Regulations and Operating Procedures for Aviation Transmission and Licensing", 1], ["C429.02", "Communicate Using Radio Procedures for Aviation Transmission", 1], ["C429.03", "Describe Radio Wavelengths, Signals, Licences and Equipment", 1], ["C429.04", "Explain Emergency, Urgency and Safety Communications", 1]]
    },
    "PO 431 - EXPLAIN PRINCIPLES OF FLIGHT": {
      "M": [["M431.01", "Explain Features of Wing Design", 1], ["M431.02", "Describe Flight Instruments", 2]],
      "C": [["C431.01", "Explain Flight Performance Factors", 2], ["C431.02", "Demonstrate Turns, Climbs and Descents in a Flight Simulator", 3], ["C431.03", "Fly a Radio-Controlled Aircraft", 3]]
    },
    "PO 432 - DESCRIBE AERO ENGINE SYSTEMS": {
      "M": [["M432.01", "Describe Fuel Systems", 1], ["M432.02", "Describe Propeller Systems", 1], ["M432.03", "Describe Engine Instruments", 1]],
      "C": [["C432.01", "Describe Ignition and Electrical Systems", 1], ["C432.02", "Describe Turbocharging and Supercharging Systems", 1], ["C432.03", "Describe Gas Turbine Engines", 1]]
    },
    "PO 436 - EXPLAIN ASPECTS OF METEOROLOGY": {
      "M": [["M436.01", "Explain Winds", 1], ["M436.02", "Describe Air Masses and Fronts", 3]],
      "C": [["C436.01", "Explain Fog", 1], ["C436.02", "Describe Severe Weather Conditions", 1], ["C436.03", "Analyze Weather Information", 3]]
    },
    "PO 437 - EXPLAIN ASPECTS OF AIR NAVIGATION": {
      "M": [["M437.01", "Define Air Navigation Terms", 2], ["M437.02", "Describe the Magnetic Compass", 1]],
      "C": [["C437.01", "Solve Navigation Problems with a Manual Flight Computer", 2], ["C437.02", "Use a Visual Flight Rules (VFR) Navigation Chart (VNC)", 2]]
    },
    "PO 440 - DISCUSS AEROSPACE STRUCTURES": {
      "M": [["M440.01", "Identify Aerospace Materials", 1], ["M440.02", "Describe Canadian Satellites", 1]],
      "C": [["C440.01", "Describe Model Rocketry", 2], ["C440.02", "Launch a Small Model Rocket", 3], ["C440.03", "Discuss Characteristics of the Planets in the Solar System", 2], ["C440.04", "Apply the Material Science of Trusses", 3], ["C440.05", "Describe Robotics", 1], ["C440.06", "Use Star Charts", 2], ["C440.07", "Operate a Telescope", 2], ["C440.08", "Watch BLAST! (Balloon-Borne Large Apenure Sub-Millimetre Telescope)", 3], ["C440.09", "Describe the Relationship Between Gravity and Space-Time", 2], ["C440.10", "Discuss Kinetic and Potential Energy", 1], ["C440.11", "Watch Einstein 's Big Idea", 5]]
    },
    "PO 460 - DESCRIBE AERODROME OPERATIONS CAREER OPPORTUNITIES": {
      "M": [],
      "C": [["C460.01", "Describe Aerodrome Operations Career Opportunities", 1], ["C460.02", "Describe Air Traffic Control (ATC) Career Opportunities", 1], ["C460.03", "Describe Airport Security Career Opportunities", 1]]
    },
    "PO 470 - DISCUSS ASPECTS OF AIRCRAFT MANUFACTURING AND MAINTENANCE": {
      "M": [],
      "C": [["C470.01", "Discuss Aircraft Manufacturers", 1], ["C470.02", "Discuss Aircraft Assembly", 1], ["C470.03", "Identify Aviation Hardware", 1], ["C470.04", "Disassemble and Reassemble a Small Engine", 3]]
    },
    "PO 490 - PARTICIPATE IN AN AIRCREW SURVIVAL EXERCISE": {
      "M": [["M490.01", "Assemble an Emergency Survival Kit", 1], ["M490.02", "Operate a Stove and a Lantern", 3], ["M490.03", "Tie Knots and Lashings", 2], ["M490.04", "Navigate to a Waypoint Using a Global Positioning System (GPS) Receiver", 4], ["M490.05", "Light Fires Using Improvised Ignition", 4]],
      "C": [["C490.01", "Describe Climatic and Seasonal Concerns", 1], ["C490.02", "Improvise Tools for Use in a Survival Situation", 2], ["C490.03", "Move a Casualty to Shelter", 3], ["C490.04", "Practice Safe Toolcraft", 3], ["C490.05", "Navigate a Route Using a Map and Compass", 4], ["C490.06", "Erect, Tear Down and Pack Tents", 4], ["C490.07", "Construct a Hootchie or Lean-to-Style Shelter", 3]]
    },
    "PO ACR - Annual Ceremonial Review": {
      "M": [],
      "C": [["ACR", "Participate in the Annual Ceremonial Review (ACR)", 3]]
    }
  }
};

const parseRawData = (rawData: any): Phase[] => {
  return Object.entries(rawData).map(([phaseName, pos], phaseIndex) => {
    const phaseId = phaseIndex + 1;
    return {
      id: phaseId,
      name: phaseName,
      performanceObjectives: Object.entries(pos as any).map(([poTitle, eos]) => {
        const poId = poTitle.split(' - ')[0];
        const mandatoryEOs = ((eos as any).M || []).map(([id, title, periods]: [string, string, number]) => ({
          id: `${phaseId}-${id}`,
          title: title,
          periods: periods,
          type: 'mandatory' as const,
          poId: poId,
        }));
        const complimentaryEOs = ((eos as any).C || []).map(([id, title, periods]: [string, string, number]) => ({
          id: `${phaseId}-${id}`,
          title: title,
          periods: periods,
          type: 'complimentary' as const,
          poId: poId,
        }));
        return {
          id: poId,
          title: poTitle.substring(poTitle.indexOf(' - ') + 3),
          enablingObjectives: [...mandatoryEOs, ...complimentaryEOs],
        };
      }),
    };
  });
};

export const elementalTrainingData = {
  Sea: parseRawData(seaRawData),
  Army: parseRawData(armyRawData),
  Air: parseRawData(airRawData),
};
