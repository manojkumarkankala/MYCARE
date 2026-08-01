import type {
  Patient, Doctor, Admin, Appointment, Prescription, Medicine,
  MedicalInstrument, HealthUpdate, MedicalReport, Notification, Feedback, Hospital,
} from '@/types';

export const seedDoctors: Doctor[] = [
  {
    id: 'doc-1', email: 'dr.sarah@mycare.health', name: 'Dr. Sarah Chen',
    role: 'doctor', avatar: 'https://i.pravatar.cc/150?img=47',
    qualification: 'MD, Internal Medicine', specialization: 'Cardiologist',
    hospital: 'MYCARE Heart Institute', experience: 12, registrationNumber: 'MCI-2012-4521',
    clinicAddress: '4th Avenue, Medical District', phone: '+919876543210',
    consultationFee: 800, timings: 'Mon-Sat, 9:00 AM - 5:00 PM', rating: 4.9, approved: true,
    whatsapp: '919876543210',
  },
  {
    id: 'doc-2', email: 'dr.rajesh@mycare.health', name: 'Dr. Rajesh Kumar',
    role: 'doctor', avatar: 'https://i.pravatar.cc/150?img=12',
    qualification: 'MD, Pediatrics', specialization: 'Pediatrician',
    hospital: 'MYCARE Children Hospital', experience: 9, registrationNumber: 'MCI-2015-8830',
    clinicAddress: 'Park Road, Central Plaza', phone: '+919876543211',
    consultationFee: 600, timings: 'Mon-Fri, 10:00 AM - 6:00 PM', rating: 4.8, approved: true,
    whatsapp: '919876543211',
  },
  {
    id: 'doc-3', email: 'dr.anita@mycare.health', name: 'Dr. Anita Reddy',
    role: 'doctor', avatar: 'https://i.pravatar.cc/150?img=45',
    qualification: 'MD, Dermatology', specialization: 'Dermatologist',
    hospital: 'MYCARE Skin Clinic', experience: 7, registrationNumber: 'MCI-2017-2210',
    clinicAddress: 'Lake View, North Block', phone: '+919876543212',
    consultationFee: 500, timings: 'Tue-Sun, 11:00 AM - 7:00 PM', rating: 4.7, approved: true,
    whatsapp: '919876543212',
  },
  {
    id: 'doc-4', email: 'dr.vikram@mycare.health', name: 'Dr. Vikram Singh',
    role: 'doctor', avatar: 'https://i.pravatar.cc/150?img=13',
    qualification: 'MS, Orthopedics', specialization: 'Orthopedic Surgeon',
    hospital: 'MYCARE Bone & Joint Center', experience: 15, registrationNumber: 'MCI-2009-1145',
    clinicAddress: 'Stadium Road, Block C', phone: '+919876543213',
    consultationFee: 1000, timings: 'Mon-Sat, 8:00 AM - 4:00 PM', rating: 4.9, approved: true,
    whatsapp: '919876543213',
  },
  {
    id: 'doc-5', email: 'dr.meera@mycare.health', name: 'Dr. Meera Iyer',
    role: 'doctor', avatar: 'https://i.pravatar.cc/150?img=44',
    qualification: 'MD, Psychiatry', specialization: 'Psychiatrist',
    hospital: 'MYCARE Mind Wellness', experience: 10, registrationNumber: 'MCI-2014-6701',
    clinicAddress: 'Wellness Avenue, East Wing', phone: '+919876543214',
    consultationFee: 900, timings: 'Mon-Fri, 12:00 PM - 8:00 PM', rating: 4.8, approved: false,
    whatsapp: '919876543214',
  },
];

export const seedPatients: Patient[] = [
  {
    id: 'pat-1', email: 'john@example.com', name: 'John Mathews',
    role: 'patient', avatar: 'https://i.pravatar.cc/150?img=33',
    age: 34, gender: 'Male', bloodGroup: 'O+', height: 178, weight: 76,
    mobile: '+919812345678', emergencyContact: '+919812345679',
    address: '12 Riverside Apartments, MG Road', preferredLanguage: 'English',
    medicalHistory: 'Hypertension diagnosed 2021', allergies: 'Penicillin',
    createdAt: '2024-01-15',
  },
  {
    id: 'pat-2', email: 'priya@example.com', name: 'Priya Sharma',
    role: 'patient', avatar: 'https://i.pravatar.cc/150?img=49',
    age: 28, gender: 'Female', bloodGroup: 'B+', height: 162, weight: 58,
    mobile: '+919812345680', emergencyContact: '+919812345681',
    address: '7 Garden Villas, Indiranagar', preferredLanguage: 'Hindi',
    medicalHistory: 'None', allergies: 'None',
    createdAt: '2024-03-20',
  },
];

export const seedAdmin: Admin = {
  id: 'admin-1', email: 'admin@mycare.health', name: 'System Administrator',
  role: 'admin', avatar: 'https://i.pravatar.cc/150?img=68',
  createdAt: '2024-01-01',
};

export const seedAppointments: Appointment[] = [
  {
    id: 'apt-1', patientId: 'pat-1', patientName: 'John Mathews',
    doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', specialization: 'Cardiologist',
    date: '2026-08-02', time: '10:30 AM', status: 'upcoming',
    reason: 'Routine cardiac checkup', fee: 800,
  },
  {
    id: 'apt-2', patientId: 'pat-1', patientName: 'John Mathews',
    doctorId: 'doc-4', doctorName: 'Dr. Vikram Singh', specialization: 'Orthopedic Surgeon',
    date: '2026-07-15', time: '2:00 PM', status: 'completed',
    reason: 'Knee pain follow-up', fee: 1000,
  },
  {
    id: 'apt-3', patientId: 'pat-2', patientName: 'Priya Sharma',
    doctorId: 'doc-2', doctorName: 'Dr. Rajesh Kumar', specialization: 'Pediatrician',
    date: '2026-08-05', time: '11:00 AM', status: 'upcoming',
    reason: 'Child vaccination', fee: 600,
  },
];

export const seedMedicines: Medicine[] = [
  {
    id: 'med-1', name: 'Paracetamol', brand: 'Crocin', composition: 'Paracetamol 500mg',
    uses: 'Fever, headache, body pain relief', sideEffects: 'Nausea, rash (rare)',
    warnings: 'Do not exceed 4g per day. Avoid alcohol.', dosage: '1-2 tablets every 6 hours',
    price: 35, manufacturer: 'GSK Pharmaceuticals', prescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d8c2c2c1c2?w=400',
    category: 'Pain Relief',
  },
  {
    id: 'med-2', name: 'Azithromycin', brand: 'Azee', composition: 'Azithromycin 500mg',
    uses: 'Bacterial infections, respiratory infections', sideEffects: 'Diarrhea, abdominal pain, nausea',
    warnings: 'Complete full course. Avoid antacids within 2 hours.', dosage: '1 tablet daily for 3-5 days',
    price: 120, manufacturer: 'Cipla Ltd', prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1471863771055-d4377efb1c5a?w=400',
    category: 'Antibiotic',
  },
  {
    id: 'med-3', name: 'Metformin', brand: 'Glycomet', composition: 'Metformin 500mg',
    uses: 'Type 2 diabetes management', sideEffects: 'GI upset, metallic taste, B12 deficiency (long-term)',
    warnings: 'Monitor kidney function. Stop before contrast imaging.', dosage: '1 tablet twice daily with meals',
    price: 85, manufacturer: 'USV Pvt Ltd', prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe611db8898?w=400',
    category: 'Diabetes',
  },
  {
    id: 'med-4', name: 'Amlodipine', brand: 'Amlong', composition: 'Amlodipine 5mg',
    uses: 'Hypertension, angina', sideEffects: 'Ankle swelling, headache, flushing',
    warnings: 'Do not stop abruptly. Monitor blood pressure regularly.', dosage: '1 tablet once daily',
    price: 55, manufacturer: 'Sun Pharma', prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400',
    category: 'Cardiac',
  },
  {
    id: 'med-5', name: 'Omeprazole', brand: 'Omez', composition: 'Omeprazole 20mg',
    uses: 'Acid reflux, GERD, stomach ulcers', sideEffects: 'Headache, constipation, vitamin B12 deficiency (long-term)',
    warnings: 'Long-term use increases fracture risk. Take before meals.', dosage: '1 capsule daily before breakfast',
    price: 68, manufacturer: 'Dr. Reddy\'s', prescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1607619056570-12d8d2c0e9c0?w=400',
    category: 'Gastrointestinal',
  },
  {
    id: 'med-6', name: 'Cetirizine', brand: 'Cetzine', composition: 'Cetirizine 10mg',
    uses: 'Allergies, hay fever, skin rashes', sideEffects: 'Drowsiness, dry mouth, fatigue',
    warnings: 'May cause drowsiness. Avoid driving if affected.', dosage: '1 tablet at bedtime',
    price: 25, manufacturer: 'Hetero Drugs', prescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b291c4?w=400',
    category: 'Allergy',
  },
];

export const seedInstruments: MedicalInstrument[] = [
  {
    id: 'inst-1', name: 'Digital Thermometer', category: 'Thermometer',
    description: 'Non-contact infrared thermometer for accurate body temperature measurement in 1 second.',
    uses: 'Measures body and surface temperature without skin contact. Ideal for all ages.',
    howToUse: [
      'Press the power button to turn on',
      'Hold 3-5cm away from the forehead',
      'Press the measurement button',
      'Wait for the beep and read the display',
    ],
    precautions: 'Keep away from water. Do not use on broken skin. Clean sensor with soft cloth.',
    cleaningGuide: 'Wipe the sensor with 70% isopropyl alcohol after each use.',
    maintenance: 'Replace battery when low indicator appears. Calibrate annually.',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600',
  },
  {
    id: 'inst-2', name: 'Blood Pressure Monitor', category: 'BP Monitor',
    description: 'Automatic upper arm blood pressure monitor with irregular heartbeat detection.',
    uses: 'Measures systolic and diastolic blood pressure and heart rate at home.',
    howToUse: [
      'Sit comfortably with arm at heart level',
      'Wrap cuff snugly around upper arm',
      'Press the start button',
      'Remain still during measurement',
      'Record the reading displayed',
    ],
    precautions: 'Avoid caffeine or exercise 30 min before. Use correct cuff size.',
    cleaningGuide: 'Wipe cuff with damp cloth. Do not immerse in water.',
    maintenance: 'Calibrate every 2 years. Replace batteries when symbol appears.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  },
  {
    id: 'inst-3', name: 'Pulse Oximeter', category: 'Pulse Oximeter',
    description: 'Fingertip pulse oximeter measuring SpO2 and pulse rate with OLED display.',
    uses: 'Measures blood oxygen saturation and heart rate non-invasively.',
    howToUse: [
      'Insert finger fully into the device',
      'Keep hand still and warm',
      'Press the power button',
      'Wait 5-10 seconds for stable reading',
    ],
    precautions: 'Remove nail polish. Cold hands may give inaccurate readings.',
    cleaningGuide: 'Wipe with alcohol swab. Do not submerge.',
    maintenance: 'Replace batteries regularly. Store in dry place.',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a2c0f5f?w=600',
  },
  {
    id: 'inst-4', name: 'Nebulizer Machine', category: 'Nebulizer',
    description: 'Compressor nebulizer for delivering medication directly to the lungs.',
    uses: 'Converts liquid medicine into mist for inhalation in respiratory conditions.',
    howToUse: [
      'Add prescribed medication to the medicine cup',
      'Attach the mask or mouthpiece',
      'Turn on the machine',
      'Breathe in the mist slowly and deeply',
      'Continue until medication is finished',
    ],
    precautions: 'Use only prescribed medications. Clean after every use to prevent infection.',
    cleaningGuide: 'Wash medicine cup with warm water after each use. Boil parts weekly.',
    maintenance: 'Replace filter every 6 months. Replace tubing every 3 months.',
    image: 'https://images.unsplash.com/photo-1631815156015-ba5b0b0e0c5f?w=600',
  },
  {
    id: 'inst-5', name: 'Stethoscope', category: 'Stethoscope',
    description: 'Dual-head acoustic stethoscope for auscultation of heart, lungs, and abdomen.',
    uses: 'Listens to internal body sounds for diagnostic purposes.',
    howToUse: [
      'Place earpieces in ears angled forward',
      'Select the diaphragm or bell side',
      'Place chestpiece firmly on skin',
      'Listen carefully to sounds',
    ],
    precautions: 'Keep earpieces clean. Store away from extreme temperatures.',
    cleaningGuide: 'Wipe eartips and chestpiece with alcohol wipes between patients.',
    maintenance: 'Replace earpieces when worn. Check tubing for cracks annually.',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600',
  },
  {
    id: 'inst-6', name: 'Glucometer', category: 'Glucometer',
    description: 'Blood glucose monitoring system with test strips for diabetes management.',
    uses: 'Measures blood sugar levels using a small blood sample from the fingertip.',
    howToUse: [
      'Insert a test strip into the meter',
      'Use the lancing device to prick finger',
      'Apply blood drop to the strip',
      'Wait for the result on screen',
    ],
    precautions: 'Use fresh test strips. Do not share lancing devices.',
    cleaningGuide: 'Clean meter exterior with damp cloth. Do not get strips wet.',
    maintenance: 'Code meter when using new strip batch. Replace batteries as needed.',
    image: 'https://images.unsplash.com/photo-1631815156015-ba5b0b0e0c5f?w=600',
  },
];

export const seedHealthUpdates: HealthUpdate[] = [
  {
    id: 'hu-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen',
    title: 'Understanding Heart Palpitations: When to Worry',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
    description: 'Heart palpitations are common and often harmless, but certain patterns warrant medical attention. Learn the warning signs and lifestyle changes that can help.',
    whySuggested: 'Essential for patients with hypertension or family history of cardiac issues.',
    category: 'Cardiology', date: '2026-07-25',
  },
  {
    id: 'hu-2', doctorId: 'doc-5', doctorName: 'Dr. Meera Iyer',
    title: '5 Daily Habits to Boost Your Mental Wellness',
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9fccce597dca?w=600',
    description: 'Mental wellness is as important as physical health. Discover five evidence-based daily practices that can significantly improve your mood and reduce anxiety.',
    whySuggested: 'Helpful for everyone, especially those experiencing stress or sleep issues.',
    category: 'Mental Health', date: '2026-07-22',
  },
  {
    id: 'hu-3', doctorId: 'doc-2', doctorName: 'Dr. Rajesh Kumar',
    title: 'Child Vaccination Schedule: What Parents Need to Know',
    coverImage: 'https://images.unsplash.com/photo-1583912267550-d4c0c0c0c0c0?w=600',
    description: 'A complete guide to childhood vaccination schedules from birth to adolescence, including side effects and why timely vaccination matters.',
    whySuggested: 'Must-read for parents of children under 12.',
    category: 'Pediatrics', date: '2026-07-18',
  },
];

export const seedMedicalReports: MedicalReport[] = [
  {
    id: 'rep-1', patientId: 'pat-1', patientName: 'John Mathews',
    type: 'Blood Test', date: '2026-07-10', doctorName: 'Dr. Sarah Chen',
    hospital: 'MYCARE Heart Institute',
    summary: 'Complete blood count and lipid panel. Cholesterol slightly elevated. Blood pressure normal.',
    findings: [
      { test: 'Total Cholesterol', value: '215 mg/dL', range: '< 200 mg/dL', status: 'borderline' },
      { test: 'HDL', value: '45 mg/dL', range: '> 40 mg/dL', status: 'normal' },
      { test: 'LDL', value: '145 mg/dL', range: '< 100 mg/dL', status: 'abnormal' },
      { test: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5 g/dL', status: 'normal' },
      { test: 'Fasting Glucose', value: '92 mg/dL', range: '70-99 mg/dL', status: 'normal' },
    ],
  },
  {
    id: 'rep-2', patientId: 'pat-1', patientName: 'John Mathews',
    type: 'Lab Report', date: '2026-06-15', doctorName: 'Dr. Vikram Singh',
    hospital: 'MYCARE Bone & Joint Center',
    summary: 'X-ray of right knee shows mild osteoarthritis. No fractures detected.',
    findings: [
      { test: 'Joint Space', value: '3.2mm', range: '> 4mm', status: 'borderline' },
      { test: 'Osteophytes', value: 'Present (mild)', range: 'Absent', status: 'abnormal' },
      { test: 'Alignment', value: 'Normal', range: 'Normal', status: 'normal' },
    ],
  },
];

export const seedNotifications: Notification[] = [
  {
    id: 'n1', userId: 'pat-1', type: 'appointment_reminder',
    title: 'Appointment Tomorrow', message: 'You have an appointment with Dr. Sarah Chen at 10:30 AM tomorrow.',
    date: '2026-08-01', read: false,
  },
  {
    id: 'n2', userId: 'pat-1', type: 'medicine_reminder',
    title: 'Medicine Reminder', message: 'Time to take your Amlodipine 5mg tablet.',
    date: '2026-08-01', read: false,
  },
  {
    id: 'n3', userId: 'pat-1', type: 'health_update',
    title: 'New Health Article', message: 'Dr. Sarah Chen published a new article about heart palpitations.',
    date: '2026-07-25', read: true,
  },
];

export const seedFeedback: Feedback[] = [
  {
    id: 'fb-1', patientId: 'pat-1', patientName: 'John Mathews',
    rating: 5, message: 'The AI Doctor helped me understand my symptoms before my appointment. Very helpful!',
    date: '2026-07-20',
  },
  {
    id: 'fb-2', patientId: 'pat-2', patientName: 'Priya Sharma',
    rating: 4, message: 'Great platform. Medicine scanner saved me a lot of confusion at the pharmacy.',
    date: '2026-07-18',
  },
];

export const seedHospitals: Hospital[] = [
  { id: 'hosp-1', name: 'MYCARE Heart Institute', type: 'Hospital', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600', address: '4th Avenue, Medical District', phone: '+918012345678', distance: '1.2 km', rating: 4.9, openHours: '24/7', lat: 17.385, lng: 78.4867 },
  { id: 'hosp-2', name: 'City Care Clinic', type: 'Clinic', image: 'https://images.unsplash.com/photo-1631217868264-e5b00bb2a8da?w=600', address: 'Park Road, Central Plaza', phone: '+918012345679', distance: '0.8 km', rating: 4.5, openHours: '9 AM - 9 PM', lat: 17.386, lng: 78.4870 },
  { id: 'hosp-3', name: 'MedPlus Pharmacy', type: 'Pharmacy', image: 'https://images.unsplash.com/photo-1587854692152-cbe611db8898?w=600', address: 'Main Street, Block A', phone: '+918012345680', distance: '0.5 km', rating: 4.7, openHours: '8 AM - 11 PM', lat: 17.384, lng: 78.4860 },
  { id: 'hosp-4', name: 'Apollo Diagnostics', type: 'Laboratory', image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600', address: 'Lake View, North Block', phone: '+918012345681', distance: '2.1 km', rating: 4.8, openHours: '6 AM - 10 PM', lat: 17.387, lng: 78.4880 },
  { id: 'hosp-5', name: 'MYCARE Children Hospital', type: 'Hospital', image: 'https://images.unsplash.com/photo-1586773881901-819d52b1c8d0?w=600', address: 'Garden Road, East Wing', phone: '+918012345682', distance: '3.5 km', rating: 4.8, openHours: '24/7', lat: 17.390, lng: 78.4900 },
  { id: 'hosp-6', name: 'HealthCare Pharmacy', type: 'Pharmacy', image: 'https://images.unsplash.com/photo-1572868563787-3a5d2c2c2c0c?w=600', address: 'Station Road, Shop 12', phone: '+918012345683', distance: '1.0 km', rating: 4.3, openHours: '24/7', lat: 17.383, lng: 78.4855 },
];

export const seedPrescriptions: Prescription[] = [
  {
    id: 'rx-1', patientId: 'pat-1', patientName: 'John Mathews', patientAge: 34,
    doctorId: 'doc-1', doctorName: 'Dr. Sarah Chen', doctorQualification: 'MD, Internal Medicine',
    hospital: 'MYCARE Heart Institute', date: '2026-07-15',
    symptoms: 'High blood pressure, occasional headaches',
    summary: 'Hypertension stage 1. Lifestyle modifications and medication prescribed.',
    diagnosis: 'Essential Hypertension (Stage 1)',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet OD', instructions: 'Take once daily in the morning' },
      { name: 'Aspirin 75mg', dosage: '1 tablet OD', instructions: 'Take after dinner' },
    ],
    nextVisit: '2026-08-15',
  },
];
