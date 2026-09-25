export const PATIENTS = [
  { id: '024', name: 'John Doe', age: 52, hand: 'Right', diagnosis: 'Post-stroke', weeks: 6 },
  { id: '031', name: 'Sarah K.', age: 38, hand: 'Left', diagnosis: 'Tendon injury', weeks: 3 },
  { id: '019', name: 'M. Patel', age: 67, hand: 'Right', diagnosis: 'Arthritis rehab', weeks: 12 },
]

export const SESSIONS = [
  { date: 'Sep 18', rom: 61, consistency: 72, reps: 8, duration: '4:02', notes: 'Fair' },
  { date: 'Sep 20', rom: 67, consistency: 78, reps: 10, duration: '4:15', notes: 'Good' },
  { date: 'Sep 22', rom: 71, consistency: 84, reps: 10, duration: '4:18', notes: 'Good' },
  { date: 'Sep 23', rom: 74, consistency: 87, reps: 10, duration: '4:21', notes: 'Very good' },
  { date: 'Sep 25', rom: 76, consistency: 91, reps: 10, duration: '4:23', notes: 'Excellent' },
]

export const FINGER_BREAKDOWN = [
  { name: 'INDEX', reps: 10, rom: 77, consistency: 92, emgSync: true },
  { name: 'MIDDLE', reps: 10, rom: 79, consistency: 90, emgSync: true },
  { name: 'RING', reps: 10, rom: 74, consistency: 88, emgSync: true },
  { name: 'PINKY', reps: 10, rom: 72, consistency: 85, emgSync: true },
  { name: 'THUMB', reps: 0, rom: 0, consistency: 0, emgSync: false },
]

export const FINGER_SESSIONS = {
  index: [62, 68, 71, 74, 75, 76, 77, 78],
  middle: [65, 70, 73, 76, 77, 78, 79, 80],
  ring: [60, 65, 68, 71, 73, 74, 75, 76],
  pinky: [58, 62, 65, 68, 70, 71, 72, 73],
}

export const DATES = ['Sep 8', 'Sep 10', 'Sep 13', 'Sep 15', 'Sep 18', 'Sep 20', 'Sep 22', 'Sep 25']
export const CONSISTENCY = [68, 72, 78, 82, 84, 86, 88, 91]
export const REPS_DONE = [7, 8, 9, 10, 10, 10, 10, 10]
export const REPS_TARGET = [10, 10, 10, 10, 10, 10, 10, 10]

export const ALL_SESSIONS_EXTENDED = [
  { date: 'Sep 1', time: '10:15 AM', exercise: 'Finger Flexion', reps: 8, rom: 58, consistency: 65, duration: '4:01', notes: 'Initial' },
  { date: 'Sep 3', time: '2:30 PM', exercise: 'Finger Flexion', reps: 8, rom: 62, consistency: 70, duration: '4:05', notes: 'Steady' },
  { date: 'Sep 5', time: '10:00 AM', exercise: 'Finger Flexion', reps: 9, rom: 65, consistency: 74, duration: '4:08', notes: 'Improving' },
  { date: 'Sep 8', time: '2:15 PM', exercise: 'Finger Flexion', reps: 9, rom: 68, consistency: 77, duration: '4:10', notes: 'Good' },
  { date: 'Sep 10', time: '10:30 AM', exercise: 'Finger Flexion', reps: 10, rom: 71, consistency: 81, duration: '4:12', notes: 'Excellent' },
  { date: 'Sep 13', time: '3:00 PM', exercise: 'Finger Flexion', reps: 10, rom: 73, consistency: 83, duration: '4:14', notes: 'Consistent' },
  { date: 'Sep 15', time: '11:00 AM', exercise: 'Finger Flexion', reps: 10, rom: 75, consistency: 85, duration: '4:16', notes: 'Very good' },
  { date: 'Sep 18', time: '2:45 PM', exercise: 'Finger Flexion', reps: 8, rom: 61, consistency: 72, duration: '4:02', notes: 'Fair' },
  { date: 'Sep 20', time: '10:20 AM', exercise: 'Finger Flexion', reps: 10, rom: 67, consistency: 78, duration: '4:15', notes: 'Good' },
  { date: 'Sep 22', time: '1:50 PM', exercise: 'Finger Flexion', reps: 10, rom: 71, consistency: 84, duration: '4:18', notes: 'Good' },
  { date: 'Sep 23', time: '2:54 PM', exercise: 'Finger Flexion', reps: 10, rom: 74, consistency: 87, duration: '4:21', notes: 'Very good' },
  { date: 'Sep 25', time: '2:47 PM', exercise: 'Finger Flexion', reps: 10, rom: 76, consistency: 91, duration: '4:23', notes: 'Excellent' },
]
