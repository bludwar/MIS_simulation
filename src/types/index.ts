export type Role = 'receptionist' | 'nurse' | 'doctor';

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  insurance: string;
  allergies: Allergy[];
  problems: Problem[];
}

export interface Allergy {
  substance: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface Problem {
  id: string;
  description: string;
  icd10: string;
  status: 'Active' | 'Resolved' | 'Chronic';
  onsetDate: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  status: 'Active' | 'Discontinued';
  interactions?: string[];
}

export interface Encounter {
  id: string;
  patientId: string;
  date: string;
  provider: string;
  visitType: string;
  reasonForVisit: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: 'Open' | 'Signed';
  icd10Codes: string[];
  cptCodes: string[];
}

export interface Vital {
  id: string;
  patientId: string;
  recordedAt: string;
  recordedBy: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  o2Sat: number;
  heightCm: number;
  weightKg: number;
}

export interface LabResult {
  id: string;
  patientId: string;
  orderedAt: string;
  resultAt: string;
  orderedBy: string;
  testName: string;
  value: string;
  unit: string;
  refLow: number;
  refHigh: number;
  status: 'Pending' | 'Final';
}

export interface Appointment {
  id: string;
  patientId: string;
  provider: string;
  date: string;
  time: string;
  visitType: string;
  status: 'Scheduled' | 'Checked-In' | 'Completed' | 'Cancelled';
}
