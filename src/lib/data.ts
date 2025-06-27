import type { Phase } from './types';

const rawData = {
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
      "C": [["C208.01", "Practice Ceremonial Drill as a Review", 2], ["C208.02", "Execute Drill With Arms", 8], ["C108.01", "Execute Supplementary Drill Movements", 6]]
    },
    "PO 211 - Participate in Recreational Summer Biathlon activities": {
      "C": [["C211.01", "Identify Civilian Biathlon Opportunities", 1], ["C211.02", "Run on Alternate Terrain", 1], ["C211.03", "Fire the Cadet Air Rifle using a Sling Following Physical Activity", 1], ["C211.04", "Participate in a Competitive Summer Biathlon Activity", 6]]
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
      "M": [["M323.01", "Discuss Shipboard Routines and Procedures", 2]],
      "C": [["C323.01", "Communicate Using Flags and Pennants", 4], ["C323.02", "Pipe Wakey Wakey", 2], ["C323.03", "Pipe Hands to Dinner", 3], ["C223.01", "Define Naval Terminology", 1], ["C223.02", "Pipe the Side", 1], ["C123.01", "Read the 24-hour Clock", 1], ["C123.02", "Recite the Phonetic Alphabet", 2], ["C123.03", "Participate in a Semaphore Exercise", 5]]
    },
    "PO X24 - Sail a Sailboat IAW Sail Canada CANSail Level 1": { "C": [["MX24.02", "Participate in a Sail Weekend", 18]] },
    "PO X25 - Participate in a Nautical Training Weekend": { "M": [] },
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

export const trainingData: Phase[] = Object.entries(rawData).map(([phaseName, pos], phaseIndex) => {
  const phaseId = phaseIndex + 1;
  return {
    id: phaseId,
    name: phaseName,
    performanceObjectives: Object.entries(pos).map(([poTitle, eos]) => {
      const poId = poTitle.split(' - ')[0];
      const mandatoryEOs = (eos.M || []).map(([id, title, periods]) => ({
        id: `${phaseId}-${id as string}`,
        title: title as string,
        periods: periods as number,
        type: 'mandatory' as const,
        poId: poId,
      }));
      const complimentaryEOs = (eos.C || []).map(([id, title, periods]) => ({
        id: `${phaseId}-${id as string}`,
        title: title as string,
        periods: periods as number,
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
