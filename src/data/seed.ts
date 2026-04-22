import type {
  Patient, Medication, Encounter, Vital, LabResult, Appointment
} from '../types';

export const seedPatients: Patient[] = [
  {
    id: 'p1', mrn: 'MRN-10001',
    firstName: 'Margaret', lastName: 'Chen',
    dob: '1958-03-12', gender: 'Female',
    phone: '555-234-5678', email: 'mchen@email.com',
    insurance: 'Blue Cross PPO',
    allergies: [
      { substance: 'Penicillin', reaction: 'Hives', severity: 'Moderate' },
      { substance: 'Sulfa drugs', reaction: 'Rash', severity: 'Mild' },
    ],
    problems: [
      { id: 'pr1', description: 'Type 2 Diabetes Mellitus', icd10: 'E11.9', status: 'Chronic', onsetDate: '2010-06-01' },
      { id: 'pr2', description: 'Hypertension', icd10: 'I10', status: 'Chronic', onsetDate: '2012-01-15' },
      { id: 'pr3', description: 'Hyperlipidemia', icd10: 'E78.5', status: 'Active', onsetDate: '2015-03-20' },
    ],
  },
  {
    id: 'p2', mrn: 'MRN-10002',
    firstName: 'James', lastName: 'Okafor',
    dob: '1975-07-28', gender: 'Male',
    phone: '555-345-6789', email: 'jokafor@email.com',
    insurance: 'Aetna HMO',
    allergies: [
      { substance: 'Aspirin', reaction: 'GI bleeding', severity: 'Severe' },
    ],
    problems: [
      { id: 'pr4', description: 'Asthma', icd10: 'J45.909', status: 'Chronic', onsetDate: '1995-08-10' },
      { id: 'pr5', description: 'GERD', icd10: 'K21.0', status: 'Active', onsetDate: '2018-02-14' },
    ],
  },
  {
    id: 'p3', mrn: 'MRN-10003',
    firstName: 'Rosa', lastName: 'Martinez',
    dob: '1990-11-05', gender: 'Female',
    phone: '555-456-7890', email: 'rmartinez@email.com',
    insurance: 'Cigna PPO',
    allergies: [],
    problems: [
      { id: 'pr6', description: 'Major Depressive Disorder', icd10: 'F32.1', status: 'Active', onsetDate: '2019-04-01' },
      { id: 'pr7', description: 'Hypothyroidism', icd10: 'E03.9', status: 'Chronic', onsetDate: '2017-09-22' },
    ],
  },
  {
    id: 'p4', mrn: 'MRN-10004',
    firstName: 'Harold', lastName: 'Nguyen',
    dob: '1942-01-30', gender: 'Male',
    phone: '555-567-8901', email: 'hnguyen@email.com',
    insurance: 'Medicare Part B',
    allergies: [
      { substance: 'Codeine', reaction: 'Respiratory depression', severity: 'Severe' },
      { substance: 'Latex', reaction: 'Urticaria', severity: 'Moderate' },
    ],
    problems: [
      { id: 'pr8', description: 'Chronic kidney disease, stage 3', icd10: 'N18.3', status: 'Chronic', onsetDate: '2016-05-10' },
      { id: 'pr9', description: 'Atrial fibrillation', icd10: 'I48.91', status: 'Chronic', onsetDate: '2014-11-07' },
      { id: 'pr10', description: 'Osteoarthritis, knee', icd10: 'M17.11', status: 'Active', onsetDate: '2013-03-15' },
    ],
  },
  {
    id: 'p5', mrn: 'MRN-10005',
    firstName: 'Aisha', lastName: 'Patel',
    dob: '2005-09-17', gender: 'Female',
    phone: '555-678-9012', email: 'apatel@email.com',
    insurance: 'United Healthcare',
    allergies: [
      { substance: 'Tree nuts', reaction: 'Anaphylaxis', severity: 'Severe' },
    ],
    problems: [
      { id: 'pr11', description: 'Type 1 Diabetes Mellitus', icd10: 'E10.9', status: 'Chronic', onsetDate: '2012-06-01' },
      { id: 'pr12', description: 'Celiac disease', icd10: 'K90.0', status: 'Active', onsetDate: '2014-02-20' },
    ],
  },
];

export const seedMedications: Medication[] = [
  { id: 'm1', patientId: 'p1', name: 'Metformin', dose: '1000 mg', route: 'Oral', frequency: 'Twice daily', prescriber: 'Dr. Williams', startDate: '2010-06-15', status: 'Active' },
  { id: 'm2', patientId: 'p1', name: 'Lisinopril', dose: '10 mg', route: 'Oral', frequency: 'Once daily', prescriber: 'Dr. Williams', startDate: '2012-02-01', status: 'Active' },
  { id: 'm3', patientId: 'p1', name: 'Atorvastatin', dose: '40 mg', route: 'Oral', frequency: 'Once daily at bedtime', prescriber: 'Dr. Williams', startDate: '2015-04-01', status: 'Active' },
  { id: 'm4', patientId: 'p2', name: 'Albuterol inhaler', dose: '90 mcg', route: 'Inhaled', frequency: 'As needed', prescriber: 'Dr. Kim', startDate: '2000-01-01', status: 'Active' },
  { id: 'm5', patientId: 'p2', name: 'Fluticasone inhaler', dose: '110 mcg', route: 'Inhaled', frequency: 'Twice daily', prescriber: 'Dr. Kim', startDate: '2015-06-01', status: 'Active' },
  { id: 'm6', patientId: 'p2', name: 'Omeprazole', dose: '20 mg', route: 'Oral', frequency: 'Once daily before breakfast', prescriber: 'Dr. Kim', startDate: '2018-03-01', status: 'Active' },
  { id: 'm7', patientId: 'p3', name: 'Sertraline', dose: '100 mg', route: 'Oral', frequency: 'Once daily', prescriber: 'Dr. Patel', startDate: '2019-04-15', status: 'Active' },
  { id: 'm8', patientId: 'p3', name: 'Levothyroxine', dose: '75 mcg', route: 'Oral', frequency: 'Once daily on empty stomach', prescriber: 'Dr. Patel', startDate: '2017-10-01', status: 'Active' },
  { id: 'm9', patientId: 'p4', name: 'Warfarin', dose: '5 mg', route: 'Oral', frequency: 'Once daily', prescriber: 'Dr. Johnson', startDate: '2014-12-01', status: 'Active', interactions: ['NSAIDs increase bleeding risk', 'Avoid vitamin K-rich foods'] },
  { id: 'm10', patientId: 'p4', name: 'Metoprolol', dose: '25 mg', route: 'Oral', frequency: 'Twice daily', prescriber: 'Dr. Johnson', startDate: '2014-11-15', status: 'Active' },
  { id: 'm11', patientId: 'p5', name: 'Insulin glargine', dose: '20 units', route: 'Subcutaneous', frequency: 'Once daily at bedtime', prescriber: 'Dr. Singh', startDate: '2012-06-15', status: 'Active' },
  { id: 'm12', patientId: 'p5', name: 'Insulin lispro', dose: 'Per sliding scale', route: 'Subcutaneous', frequency: 'With meals', prescriber: 'Dr. Singh', startDate: '2012-06-15', status: 'Active' },
];

export const seedEncounters: Encounter[] = [
  {
    id: 'e1', patientId: 'p1', date: '2026-04-10', provider: 'Dr. Williams',
    visitType: 'Office Visit', reasonForVisit: 'Diabetes follow-up',
    subjective: 'Patient reports blood sugars running slightly higher in the mornings. No hypoglycemic episodes. Compliant with diet.',
    objective: 'BP 138/84, HR 72, Wt 78 kg. A1c today 7.8% (up from 7.2% 3 months ago).',
    assessment: 'Type 2 DM, suboptimally controlled. Hypertension, stable.',
    plan: 'Increase Metformin to 1000mg BID. Recheck A1c in 3 months. Referral to diabetes educator. Continue Lisinopril.',
    status: 'Signed', icd10Codes: ['E11.9', 'I10'], cptCodes: ['99214'],
  },
  {
    id: 'e2', patientId: 'p1', date: '2026-01-15', provider: 'Dr. Williams',
    visitType: 'Office Visit', reasonForVisit: 'Annual wellness exam',
    subjective: 'Patient feels well overall. No new complaints.',
    objective: 'BP 130/80, HR 68, Wt 77 kg. A1c 7.2%.',
    assessment: 'Diabetes and hypertension, both well controlled. Due for mammogram.',
    plan: 'Continue current medications. Mammogram order placed. Flu vaccine administered.',
    status: 'Signed', icd10Codes: ['Z00.00', 'E11.9', 'I10'], cptCodes: ['99395'],
  },
  {
    id: 'e3', patientId: 'p2', date: '2026-03-22', provider: 'Dr. Kim',
    visitType: 'Urgent Care', reasonForVisit: 'Wheezing and shortness of breath',
    subjective: 'Patient reports worsening shortness of breath and wheezing for past 2 days. Increased albuterol use to 4x/day.',
    objective: 'O2 sat 94%, RR 22, diffuse expiratory wheezes on auscultation.',
    assessment: 'Asthma exacerbation, moderate.',
    plan: 'Nebulized albuterol x2, oral prednisone 40mg x5 days. Increase fluticasone to 220 mcg BID. Follow up in 1 week.',
    status: 'Signed', icd10Codes: ['J45.41'], cptCodes: ['99213', '94640'],
  },
  {
    id: 'e4', patientId: 'p3', date: '2026-04-18', provider: 'Dr. Patel',
    visitType: 'Office Visit', reasonForVisit: 'Medication management - depression',
    subjective: 'Patient reports improved mood but still experiencing morning fatigue and low motivation.',
    objective: 'Appropriately dressed. Mood mildly depressed, affect constricted. PHQ-9 score: 11.',
    assessment: 'Major depressive disorder, moderate, partially responding to sertraline.',
    plan: 'Increase sertraline to 150mg. Referral to therapist. Follow up in 4 weeks.',
    status: 'Open', icd10Codes: ['F32.1'], cptCodes: ['99214'],
  },
];

export const seedVitals: Vital[] = [
  { id: 'v1', patientId: 'p1', recordedAt: '2026-04-10T09:00:00', recordedBy: 'Nurse Adams', systolic: 138, diastolic: 84, heartRate: 72, respiratoryRate: 16, temperature: 36.8, o2Sat: 98, heightCm: 162, weightKg: 78 },
  { id: 'v2', patientId: 'p1', recordedAt: '2026-01-15T10:30:00', recordedBy: 'Nurse Adams', systolic: 130, diastolic: 80, heartRate: 68, respiratoryRate: 14, temperature: 36.6, o2Sat: 99, heightCm: 162, weightKg: 77 },
  { id: 'v3', patientId: 'p2', recordedAt: '2026-03-22T14:00:00', recordedBy: 'Nurse Chen', systolic: 122, diastolic: 78, heartRate: 96, respiratoryRate: 22, temperature: 37.1, o2Sat: 94, heightCm: 178, weightKg: 82 },
  { id: 'v4', patientId: 'p3', recordedAt: '2026-04-18T11:00:00', recordedBy: 'Nurse Adams', systolic: 118, diastolic: 74, heartRate: 78, respiratoryRate: 15, temperature: 36.7, o2Sat: 99, heightCm: 165, weightKg: 62 },
  { id: 'v5', patientId: 'p4', recordedAt: '2026-04-05T09:30:00', recordedBy: 'Nurse Chen', systolic: 148, diastolic: 92, heartRate: 88, respiratoryRate: 17, temperature: 36.9, o2Sat: 96, heightCm: 170, weightKg: 85 },
  { id: 'v6', patientId: 'p5', recordedAt: '2026-04-12T13:00:00', recordedBy: 'Nurse Lee', systolic: 110, diastolic: 68, heartRate: 82, respiratoryRate: 15, temperature: 36.5, o2Sat: 100, heightCm: 155, weightKg: 52 },
];

export const seedLabs: LabResult[] = [
  { id: 'l1', patientId: 'p1', orderedAt: '2026-04-10T09:00:00', resultAt: '2026-04-10T14:00:00', orderedBy: 'Dr. Williams', testName: 'HbA1c', value: '7.8', unit: '%', refLow: 4, refHigh: 5.7, status: 'Final' },
  { id: 'l2', patientId: 'p1', orderedAt: '2026-04-10T09:00:00', resultAt: '2026-04-10T14:00:00', orderedBy: 'Dr. Williams', testName: 'Creatinine', value: '0.9', unit: 'mg/dL', refLow: 0.6, refHigh: 1.2, status: 'Final' },
  { id: 'l3', patientId: 'p1', orderedAt: '2026-04-10T09:00:00', resultAt: '2026-04-10T14:00:00', orderedBy: 'Dr. Williams', testName: 'LDL Cholesterol', value: '112', unit: 'mg/dL', refLow: 0, refHigh: 100, status: 'Final' },
  { id: 'l4', patientId: 'p2', orderedAt: '2026-03-22T14:00:00', resultAt: '', orderedBy: 'Dr. Kim', testName: 'Spirometry (FEV1)', value: '', unit: 'L', refLow: 3.0, refHigh: 5.0, status: 'Pending' },
  { id: 'l5', patientId: 'p3', orderedAt: '2026-04-18T11:00:00', resultAt: '2026-04-18T16:00:00', orderedBy: 'Dr. Patel', testName: 'TSH', value: '3.2', unit: 'mIU/L', refLow: 0.4, refHigh: 4.0, status: 'Final' },
  { id: 'l6', patientId: 'p4', orderedAt: '2026-04-05T09:30:00', resultAt: '2026-04-05T15:00:00', orderedBy: 'Dr. Johnson', testName: 'INR', value: '2.8', unit: '', refLow: 2.0, refHigh: 3.0, status: 'Final' },
  { id: 'l7', patientId: 'p4', orderedAt: '2026-04-05T09:30:00', resultAt: '2026-04-05T15:00:00', orderedBy: 'Dr. Johnson', testName: 'eGFR', value: '42', unit: 'mL/min/1.73m²', refLow: 60, refHigh: 120, status: 'Final' },
  { id: 'l8', patientId: 'p5', orderedAt: '2026-04-12T13:00:00', resultAt: '2026-04-12T18:00:00', orderedBy: 'Dr. Singh', testName: 'Fasting Glucose', value: '148', unit: 'mg/dL', refLow: 70, refHigh: 100, status: 'Final' },
];

export const seedAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', provider: 'Dr. Williams', date: '2026-07-10', time: '09:00', visitType: 'Follow-up', status: 'Scheduled' },
  { id: 'a2', patientId: 'p2', provider: 'Dr. Kim', date: '2026-04-29', time: '10:30', visitType: 'Follow-up', status: 'Scheduled' },
  { id: 'a3', patientId: 'p3', provider: 'Dr. Patel', date: '2026-05-16', time: '14:00', visitType: 'Office Visit', status: 'Scheduled' },
  { id: 'a4', patientId: 'p4', provider: 'Dr. Johnson', date: '2026-07-21', time: '11:00', visitType: 'Lab Review', status: 'Scheduled' },
  { id: 'a5', patientId: 'p5', provider: 'Dr. Singh', date: '2026-05-01', time: '15:30', visitType: 'Office Visit', status: 'Scheduled' },
];
