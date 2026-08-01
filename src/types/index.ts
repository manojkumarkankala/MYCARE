export type UserRole = 'patient' | 'doctor' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Patient extends BaseUser {
  role: 'patient';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  height: number;
  weight: number;
  mobile: string;
  emergencyContact: string;
  address: string;
  preferredLanguage: 'English' | 'Hindi' | 'Telugu';
  medicalHistory: string;
  allergies: string;
}

export interface Doctor extends BaseUser {
  role: 'doctor';
  qualification: string;
  specialization: string;
  hospital: string;
  experience: number;
  registrationNumber: string;
  clinicAddress: string;
  phone: string;
  consultationFee: number;
  timings: string;
  rating: number;
  approved: boolean;
  whatsapp?: string;
}

export interface Admin extends BaseUser {
  role: 'admin';
}

export type AppUser = Patient | Doctor | Admin;

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
  fee: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  doctorQualification: string;
  hospital: string;
  date: string;
  symptoms: string;
  summary: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; instructions: string }[];
  nextVisit: string;
}

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  composition: string;
  uses: string;
  sideEffects: string;
  warnings: string;
  dosage: string;
  price: number;
  manufacturer: string;
  prescriptionRequired: boolean;
  image: string;
  category: string;
}

export interface MedicalInstrument {
  id: string;
  name: string;
  category: string;
  description: string;
  uses: string;
  howToUse: string[];
  precautions: string;
  cleaningGuide: string;
  maintenance: string;
  image: string;
  videoUrl?: string;
}

export interface HealthUpdate {
  id: string;
  doctorId: string;
  doctorName: string;
  title: string;
  coverImage: string;
  description: string;
  whySuggested: string;
  category: string;
  date: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Blood Test' | 'Prescription' | 'Lab Report';
  date: string;
  doctorName: string;
  hospital: string;
  summary: string;
  findings: { test: string; value: string; range: string; status: 'normal' | 'abnormal' | 'borderline' }[];
}

export interface AIConversation {
  id: string;
  patientId: string;
  date: string;
  messages: { role: 'ai' | 'user'; text: string; timestamp: string }[];
  assessment?: {
    possibleConditions: string[];
    riskLevel: 'Low' | 'Moderate' | 'High';
    recommendedSpecialist: string;
    testsToConsider: string[];
    generalCare: string[];
    emergencyWarning?: string;
  };
}

export interface MedicineScan {
  id: string;
  patientId: string;
  date: string;
  medicineName: string;
  brand: string;
  composition: string;
  genericName: string;
  manufacturer: string;
  category: string;
  image: string;
  uses: string;
  dosage: string;
  sideEffects: string;
  warnings: string;
  interactions: string;
  storage: string;
  prescriptionRequired: boolean;
  estimatedPrice: number;
  confidenceScore: number;
  similarMedicines: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'medicine_reminder' | 'appointment_reminder' | 'doctor_reply' | 'health_update' | 'lab_report';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Feedback {
  id: string;
  patientId: string;
  patientName: string;
  rating: number;
  message: string;
  date: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Laboratory';
  image: string;
  address: string;
  phone: string;
  distance: string;
  rating: number;
  openHours: string;
  lat: number;
  lng: number;
}
