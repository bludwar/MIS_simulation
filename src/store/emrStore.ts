import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Patient, Medication, Encounter, Vital, LabResult, Appointment, Role
} from '../types';
import {
  seedPatients, seedMedications, seedEncounters,
  seedVitals, seedLabs, seedAppointments
} from '../data/seed';

interface EMRState {
  role: Role;
  learningMode: boolean;
  patients: Patient[];
  medications: Medication[];
  encounters: Encounter[];
  vitals: Vital[];
  labs: LabResult[];
  appointments: Appointment[];
  toast: string | null;

  setRole: (role: Role) => void;
  toggleLearningMode: () => void;
  setToast: (message: string | null) => void;

  addPatient: (patient: Patient) => void;
  addEncounter: (encounter: Encounter) => void;
  updateEncounter: (id: string, updates: Partial<Encounter>) => void;
  addMedication: (medication: Medication) => void;
  discontinueMedication: (id: string) => void;
  addVital: (vital: Vital) => void;
  addLab: (lab: LabResult) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  resetToSeedData: () => void;
}

const initialState = {
  role: 'doctor' as Role,
  learningMode: false,
  patients: seedPatients,
  medications: seedMedications,
  encounters: seedEncounters,
  vitals: seedVitals,
  labs: seedLabs,
  appointments: seedAppointments,
  toast: null,
};

export const useEMRStore = create<EMRState>()(
  persist(
    (set) => ({
      ...initialState,

      setRole: (role) => set({ role }),
      toggleLearningMode: () => set((s) => ({ learningMode: !s.learningMode })),
      setToast: (toast) => set({ toast }),

      addPatient: (patient) =>
        set((s) => ({ patients: [...s.patients, patient] })),

      addEncounter: (encounter) =>
        set((s) => ({ encounters: [...s.encounters, encounter] })),

      updateEncounter: (id, updates) =>
        set((s) => ({
          encounters: s.encounters.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      addMedication: (medication) =>
        set((s) => ({ medications: [...s.medications, medication] })),

      discontinueMedication: (id) =>
        set((s) => ({
          medications: s.medications.map((m) =>
            m.id === id ? { ...m, status: 'Discontinued' } : m
          ),
        })),

      addVital: (vital) =>
        set((s) => ({ vitals: [...s.vitals, vital] })),

      addLab: (lab) =>
        set((s) => ({ labs: [...s.labs, lab] })),

      addAppointment: (appointment) =>
        set((s) => ({ appointments: [...s.appointments, appointment] })),

      updateAppointmentStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      resetToSeedData: () => set({ ...initialState, toast: 'Demo data restored.' }),
    }),
    { name: 'emr-simulation-store' }
  )
);
