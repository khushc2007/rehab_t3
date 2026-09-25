export interface ClinicalScores {
  fuglMeyerBaseline?: number | null
  fuglMeyerLatest?: number | null
  barthel?: number | null
  mmse?: number | null
  updrs?: number | null
}

export interface SessionSummary { date: string; rom: number; consistency: number; reps: number; duration: string }

export interface IndianPatient {
  id: string
  name: string
  nameLocal?: string | null
  age: number
  gender: 'Male' | 'Female'
  photo: string | null
  phone: string
  city: string
  state: string
  hospital: string
  referringDoctor: string
  diagnosis: string
  affectedHand: string
  dominantHand: string
  occupation: string
  language: string
  programStart: string
  programWeeks: number
  sessionsCompleted: number
  sessionsTarget: number
  nextSession: string
  status: 'Active' | 'Completed' | 'On Hold'
  avatar: { bg: string; initials: string }
  emergency: { name: string; phone: string }
  insurance: string
  uhid: string
  comorbidities: string[]
  medications: string[]
  clinicalScores: ClinicalScores
  sessions: SessionSummary[]
  notes: string
}

const romTrend = (start: number, end: number, n: number): SessionSummary[] =>
  Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 1 : i / (n - 1)
    const rom = Math.round(start + (end - start) * t + (Math.random() - 0.5) * 3)
    return {
      date: new Date(Date.now() - (n - i) * 3 * 86400000).toISOString().slice(0, 10),
      rom,
      consistency: Math.round(60 + t * 32 + (Math.random() - 0.5) * 4),
      reps: 8 + Math.round(t * 2),
      duration: `${4 + (i % 2)}:${String(10 + i).padStart(2, '0')}`,
    }
  })

export const INDIAN_PATIENTS: IndianPatient[] = [
  {
    id: 'PT-001', name: 'Rajesh Kumar', nameLocal: 'राजेश कुमार', age: 58, gender: 'Male', photo: null,
    phone: '+91 98765 43210', city: 'Bengaluru', state: 'Karnataka', hospital: 'Manipal Hospital',
    referringDoctor: 'Dr. Priya Sharma', diagnosis: 'Post-stroke (Right hemiplegia)', affectedHand: 'Right',
    dominantHand: 'Right', occupation: 'Retired Engineer', language: 'Kannada / Hindi',
    programStart: '2026-08-12', programWeeks: 6, sessionsCompleted: 18, sessionsTarget: 24, nextSession: '2026-09-27',
    status: 'Active', avatar: { bg: '#0F6E5E', initials: 'RK' },
    emergency: { name: 'Sunita Kumar (Wife)', phone: '+91 98765 43211' }, insurance: 'Star Health', uhid: 'MH-2026-04521',
    comorbidities: ['Hypertension', 'Type 2 Diabetes'], medications: ['Aspirin 75mg', 'Amlodipine 5mg', 'Metformin 500mg'],
    clinicalScores: { fuglMeyerBaseline: 24, fuglMeyerLatest: 31, barthel: 72, mmse: 28 },
    sessions: romTrend(38, 61, 8),
    notes: 'Patient motivated, regular attendee. Mild cognitive impairment noted.',
  },
  {
    id: 'PT-002', name: 'Meera Nair', nameLocal: null, age: 44, gender: 'Female', photo: null,
    phone: '+91 94560 12345', city: 'Chennai', state: 'Tamil Nadu', hospital: 'Apollo Hospital',
    referringDoctor: 'Dr. Suresh Iyer', diagnosis: 'Rheumatoid Arthritis — Hand involvement', affectedHand: 'Bilateral',
    dominantHand: 'Right', occupation: 'School Teacher', language: 'Tamil',
    programStart: '2026-09-01', programWeeks: 4, sessionsCompleted: 8, sessionsTarget: 16, nextSession: '2026-09-28',
    status: 'Active', avatar: { bg: '#8b5cf6', initials: 'MN' },
    emergency: { name: 'Arun Nair (Husband)', phone: '+91 94560 12346' }, insurance: 'ICICI Lombard', uhid: 'AP-2026-09187',
    comorbidities: ['Rheumatoid Arthritis'], medications: ['Methotrexate 15mg weekly', 'Folic Acid', 'Hydroxychloroquine'],
    clinicalScores: { fuglMeyerBaseline: null, fuglMeyerLatest: null, barthel: 85, mmse: null },
    sessions: romTrend(48, 58, 6),
    notes: 'Morning stiffness significant. Sessions scheduled post-10am.',
  },
  {
    id: 'PT-003', name: 'Amit Patel', nameLocal: null, age: 35, gender: 'Male', photo: null,
    phone: '+91 99870 23456', city: 'Ahmedabad', state: 'Gujarat', hospital: 'CIMS Hospital',
    referringDoctor: 'Dr. Hemant Desai', diagnosis: 'Carpal Tunnel Syndrome (Bilateral)', affectedHand: 'Bilateral (Right worse)',
    dominantHand: 'Right', occupation: 'Software Engineer', language: 'Gujarati / English',
    programStart: '2026-09-10', programWeeks: 3, sessionsCompleted: 5, sessionsTarget: 9, nextSession: '2026-09-26',
    status: 'Active', avatar: { bg: '#0ea5e9', initials: 'AP' },
    emergency: { name: 'Nisha Patel (Wife)', phone: '+91 99870 23457' }, insurance: 'Self-pay', uhid: 'CIMS-2026-1187',
    comorbidities: ['None'], medications: ['Ibuprofen PRN'],
    clinicalScores: { barthel: 95 },
    sessions: romTrend(60, 70, 5),
    notes: 'Work-related repetitive strain. WFH setup assessment recommended.',
  },
  {
    id: 'PT-004', name: 'Lakshmi Devi', nameLocal: 'లక్ష్మి దేవి', age: 67, gender: 'Female', photo: null,
    phone: '+91 87654 32109', city: 'Hyderabad', state: 'Telangana', hospital: 'Yashoda Hospital',
    referringDoctor: 'Dr. Ravi Reddy', diagnosis: "Parkinson's Disease (Stage 2)", affectedHand: 'Left (tremor dominant)',
    dominantHand: 'Right', occupation: 'Homemaker', language: 'Telugu',
    programStart: '2026-07-15', programWeeks: 10, sessionsCompleted: 28, sessionsTarget: 40, nextSession: '2026-09-26',
    status: 'Active', avatar: { bg: '#8b5cf6', initials: 'LD' },
    emergency: { name: 'Krishna Rao (Son)', phone: '+91 87654 32110' }, insurance: 'Ayushman Bharat', uhid: 'YH-2026-05532',
    comorbidities: ["Parkinson's Disease", 'Mild Depression'], medications: ['Levodopa/Carbidopa 100/25mg TID', 'Sertraline 50mg'],
    clinicalScores: { updrs: 28, barthel: 68, mmse: 26 },
    sessions: romTrend(44, 55, 10),
    notes: 'Medication timing affects session performance. Best window: 1hr post-Levodopa dose.',
  },
  {
    id: 'PT-005', name: 'Arjun Singh', nameLocal: 'अर्जुन सिंह', age: 29, gender: 'Male', photo: null,
    phone: '+91 76543 21098', city: 'Delhi', state: 'Delhi', hospital: 'AIIMS Delhi',
    referringDoctor: 'Dr. Anjali Gupta', diagnosis: 'Traumatic Brain Injury — Motor Recovery', affectedHand: 'Right',
    dominantHand: 'Right', occupation: 'Army Officer (on medical leave)', language: 'Hindi / English',
    programStart: '2026-06-01', programWeeks: 16, sessionsCompleted: 45, sessionsTarget: 64, nextSession: '2026-09-27',
    status: 'Active', avatar: { bg: '#f97316', initials: 'AS' },
    emergency: { name: 'Col. Singh (Father)', phone: '+91 76543 21099' }, insurance: 'ECHS', uhid: 'AIIMS-2026-2201',
    comorbidities: ['TBI', 'PTSD'], medications: ['Various — see medical record'],
    clinicalScores: { fuglMeyerBaseline: 18, fuglMeyerLatest: 38, barthel: 76 },
    sessions: romTrend(26, 64, 12),
    notes: 'Excellent progress. High motivation. Psychological support ongoing.',
  },
  {
    id: 'PT-006', name: 'Ishaan Verma', nameLocal: 'ईशान वर्मा', age: 12, gender: 'Male', photo: null,
    phone: '+91 90210 55667', city: 'Pune', state: 'Maharashtra', hospital: 'Sahyadri Hospital',
    referringDoctor: 'Dr. Neha Kulkarni', diagnosis: 'Cerebral Palsy (Spastic, Hemiplegic)', affectedHand: 'Left',
    dominantHand: 'Right', occupation: 'Student (Class 7)', language: 'Marathi / English',
    programStart: '2026-05-04', programWeeks: 20, sessionsCompleted: 52, sessionsTarget: 80, nextSession: '2026-09-29',
    status: 'Active', avatar: { bg: '#a855f7', initials: 'IV' },
    emergency: { name: 'Priya Verma (Mother)', phone: '+91 90210 55668' }, insurance: 'HDFC ERGO', uhid: 'SH-2026-07740',
    comorbidities: ['Cerebral Palsy'], medications: ['Baclofen 5mg BID'],
    clinicalScores: { barthel: 74 },
    sessions: romTrend(28, 42, 9),
    notes: 'Sessions gamified to hold attention. Parent present throughout.',
  },
  {
    id: 'PT-007', name: 'Sunil Ghosh', nameLocal: 'সুনীল ঘোষ', age: 61, gender: 'Male', photo: null,
    phone: '+91 98300 11223', city: 'Kolkata', state: 'West Bengal', hospital: 'AMRI Hospital',
    referringDoctor: 'Dr. Debashree Roy', diagnosis: 'Distal Radius Fracture (Post-op, 8 weeks)', affectedHand: 'Right',
    dominantHand: 'Right', occupation: 'Bank Manager', language: 'Bengali / Hindi',
    programStart: '2026-08-25', programWeeks: 5, sessionsCompleted: 11, sessionsTarget: 20, nextSession: '2026-09-26',
    status: 'Active', avatar: { bg: '#0ea5e9', initials: 'SG' },
    emergency: { name: 'Ruma Ghosh (Wife)', phone: '+91 98300 11224' }, insurance: 'Star Health', uhid: 'AMRI-2026-3390',
    comorbidities: ['Osteopenia'], medications: ['Calcium + Vitamin D3'],
    clinicalScores: { barthel: 88 },
    sessions: romTrend(30, 52, 7),
    notes: 'Plate removal scheduled next month; ROM gains ahead of plan.',
  },
  {
    id: 'PT-008', name: 'Kavita Rathore', nameLocal: 'कविता राठौड़', age: 52, gender: 'Female', photo: null,
    phone: '+91 94141 66778', city: 'Jaipur', state: 'Rajasthan', hospital: 'Fortis Escorts',
    referringDoctor: 'Dr. Vikram Chauhan', diagnosis: 'Diabetic Peripheral Neuropathy', affectedHand: 'Bilateral',
    dominantHand: 'Right', occupation: 'Tailor', language: 'Rajasthani / Hindi',
    programStart: '2026-07-28', programWeeks: 8, sessionsCompleted: 15, sessionsTarget: 32, nextSession: '2026-09-30',
    status: 'On Hold', avatar: { bg: '#84cc16', initials: 'KR' },
    emergency: { name: 'Mohan Rathore (Husband)', phone: '+91 94141 66779' }, insurance: 'Self-pay', uhid: 'FE-2026-08814',
    comorbidities: ['Type 2 Diabetes', 'Diabetic Retinopathy'], medications: ['Metformin 1000mg', 'Gabapentin 300mg', 'Insulin Glargine'],
    clinicalScores: { barthel: 80 },
    sessions: romTrend(50, 57, 5),
    notes: 'On hold — HbA1c elevated, endocrinology review before resuming intensive sessions.',
  },
]

export const CITIES = Array.from(new Set(INDIAN_PATIENTS.map(p => p.city))).sort()
export const HOSPITALS = Array.from(new Set(INDIAN_PATIENTS.map(p => p.hospital))).sort()
export const getPatient = (id: string) => INDIAN_PATIENTS.find(p => p.id === id)
