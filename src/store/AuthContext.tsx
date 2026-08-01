import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppUser, Patient, Doctor, Admin, UserRole } from '@/types';
import {
  seedDoctors, seedPatients, seedAdmin, seedAppointments, seedMedicines,
  seedInstruments, seedHealthUpdates, seedMedicalReports, seedNotifications,
  seedFeedback, seedPrescriptions, seedHospitals,
} from '@/data/seed';
import type {
  Appointment, Medicine, MedicalInstrument, HealthUpdate, MedicalReport,
  Notification, Feedback, Prescription, Hospital, MedicineScan,
} from '@/types';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'mycare_db_v1';
const SESSION_KEY = 'mycare_session_v1';

interface DBShape {
  patients: Patient[];
  doctors: Doctor[];
  admins: Admin[];
  appointments: Appointment[];
  medicines: Medicine[];
  instruments: MedicalInstrument[];
  healthUpdates: HealthUpdate[];
  medicalReports: MedicalReport[];
  notifications: Notification[];
  feedback: Feedback[];
  prescriptions: Prescription[];
  hospitals: Hospital[];
  medicineScans: MedicineScan[];
}

function loadDB(): DBShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const db: DBShape = {
    patients: seedPatients,
    doctors: seedDoctors,
    admins: [seedAdmin],
    appointments: seedAppointments,
    medicines: seedMedicines,
    instruments: seedInstruments,
    healthUpdates: seedHealthUpdates,
    medicalReports: seedMedicalReports,
    notifications: seedNotifications,
    feedback: seedFeedback,
    prescriptions: seedPrescriptions,
    hospitals: seedHospitals,
    medicineScans: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db: DBShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

interface AuthContextValue {
  user: AppUser | null;
  db: DBShape;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ ok: boolean; error?: string }>;
  registerPatient: (data: Partial<Patient> & { email: string; name: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  registerDoctor: (data: Partial<Doctor> & { email: string; name: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<AppUser>) => Promise<void>;
  updateDB: (mutator: (db: DBShape) => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function profileToUser(p: any): AppUser {
  const base = {
    id: p.id, email: p.email, name: p.name, role: p.role as UserRole,
    avatar: p.avatar || `https://i.pravatar.cc/150?u=${p.email}`,
    createdAt: p.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  };
  if (p.role === 'patient') {
    return {
      ...base, role: 'patient',
      age: p.age || 0, gender: p.gender || 'Other', bloodGroup: p.blood_group || 'Unknown',
      height: p.height || 0, weight: p.weight || 0, mobile: p.mobile || '',
      emergencyContact: p.emergency_contact || '', address: p.address || '',
      preferredLanguage: (p.preferred_language || 'English') as 'English' | 'Hindi' | 'Telugu',
      medicalHistory: p.medical_history || 'None', allergies: p.allergies || 'None',
    } as Patient;
  }
  if (p.role === 'doctor') {
    return {
      ...base, role: 'doctor',
      qualification: p.qualification || '', specialization: p.specialization || '',
      hospital: p.hospital || '', experience: p.experience || 0,
      registrationNumber: p.registration_number || '', clinicAddress: p.clinic_address || '',
      phone: p.phone || '', consultationFee: p.consultation_fee || 500,
      timings: p.timings || 'Mon-Fri, 9:00 AM - 5:00 PM', rating: p.rating || 0,
      approved: p.approved ?? false, whatsapp: p.whatsapp,
    } as Doctor;
  }
  return base as Admin;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DBShape>(() => loadDB());
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { saveDB(db); }, [db]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && mounted) {
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
            if (data && mounted) setUser(profileToUser(data));
          }
        } catch { /* ignore */ }
      }
      if (mounted) setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!session) { if (mounted) setUser(null); return; }
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (data && mounted) setUser(profileToUser(data));
      })();
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const login: AuthContextValue['login'] = async (email, password, role) => {
    const lower = email.toLowerCase().trim();
    if (role === 'admin') {
      // Admin must have a real Supabase Auth session so RLS (auth.uid()) can
      // recognize them as an admin when approving/removing doctors & patients.
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email: lower, password });
      if (error) {
        // First-run bootstrap: only for the known seed admin credentials, create
        // the Supabase Auth user + profile row the first time they log in.
        const seedAdminAcct = db.admins[0];
        if (lower !== seedAdminAcct.email.toLowerCase() || password !== 'MYCARE@123') {
          return { ok: false, error: 'Invalid admin credentials.' };
        }
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email: lower, password });
        if (signUpErr || !signUpData.user) {
          return { ok: false, error: signUpErr?.message || 'Could not create admin account.' };
        }
        const insert = { id: signUpData.user.id, email: lower, role: 'admin', name: seedAdminAcct.name, avatar: seedAdminAcct.avatar };
        const { error: insertErr } = await supabase.from('profiles').insert(insert);
        if (insertErr) return { ok: false, error: insertErr.message };
        setUser(profileToUser({ ...insert, created_at: new Date().toISOString() }));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: lower, role: 'admin' }));
        return { ok: true };
      }
      const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', authData.user!.id).maybeSingle();
      if (pErr || !profile || profile.role !== 'admin') return { ok: false, error: 'This account is not an admin.' };
      setUser(profileToUser(profile));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: lower, role: 'admin' }));
      return { ok: true };
    }
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email: lower, password });
    if (error) return { ok: false, error: error.message };
    const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', authData.user!.id).maybeSingle();
    if (pErr || !profile) return { ok: false, error: 'Profile not found.' };
    if (profile.role !== role) return { ok: false, error: `This account is registered as ${profile.role}.` };
    if (role === 'doctor' && !profile.approved) return { ok: false, error: 'Your account is pending admin approval.' };
    setUser(profileToUser(profile));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: lower, role }));
    return { ok: true };
  };

  const registerPatient: AuthContextValue['registerPatient'] = async (data) => {
    const lower = data.email!.toLowerCase().trim();
    const { data: authData, error } = await supabase.auth.signUp({ email: lower, password: data.password });
    if (error) return { ok: false, error: error.message };
    if (!authData.user) return { ok: false, error: 'Sign-up failed.' };
    const insert = {
      id: authData.user.id, email: lower, role: 'patient', name: data.name!,
      avatar: data.avatar || null, age: data.age || null, gender: data.gender || null,
      blood_group: data.bloodGroup || null, height: data.height || null, weight: data.weight || null,
      mobile: data.mobile || null, emergency_contact: data.emergencyContact || null,
      address: data.address || null, preferred_language: data.preferredLanguage || 'English',
      medical_history: data.medicalHistory || 'None', allergies: data.allergies || 'None',
    };
    const { error: pErr } = await supabase.from('profiles').insert(insert);
    if (pErr) return { ok: false, error: pErr.message };
    const fullProfile = { ...insert, created_at: new Date().toISOString() };
    setUser(profileToUser(fullProfile));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: lower, role: 'patient' }));
    return { ok: true };
  };

  const registerDoctor: AuthContextValue['registerDoctor'] = async (data) => {
    const lower = data.email!.toLowerCase().trim();
    const { data: authData, error } = await supabase.auth.signUp({ email: lower, password: data.password });
    if (error) return { ok: false, error: error.message };
    if (!authData.user) return { ok: false, error: 'Sign-up failed.' };
    const insert = {
      id: authData.user.id, email: lower, role: 'doctor', name: data.name!,
      avatar: data.avatar || null, qualification: data.qualification || null,
      specialization: data.specialization || null, hospital: data.hospital || null,
      experience: data.experience || null, registration_number: data.registrationNumber || null,
      clinic_address: data.clinicAddress || null, phone: data.phone || null,
      consultation_fee: data.consultationFee || 500, timings: data.timings || 'Mon-Fri, 9:00 AM - 5:00 PM',
      rating: 0, approved: false, whatsapp: data.phone?.replace(/[^0-9]/g, '') || null,
    };
    const { error: pErr } = await supabase.from('profiles').insert(insert);
    if (pErr) return { ok: false, error: pErr.message };
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const updateUser: AuthContextValue['updateUser'] = async (patch) => {
    if (!user) return;
    const updated = { ...user, ...patch } as AppUser;
    setUser(updated);
    const updates: Record<string, any> = {};
    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.avatar !== undefined) updates.avatar = patch.avatar;
    if (user.role === 'patient') {
      const p = patch as Partial<Patient>;
      if (p.age !== undefined) updates.age = p.age;
      if (p.gender !== undefined) updates.gender = p.gender;
      if (p.bloodGroup !== undefined) updates.blood_group = p.bloodGroup;
      if (p.height !== undefined) updates.height = p.height;
      if (p.weight !== undefined) updates.weight = p.weight;
      if (p.mobile !== undefined) updates.mobile = p.mobile;
      if (p.emergencyContact !== undefined) updates.emergency_contact = p.emergencyContact;
      if (p.address !== undefined) updates.address = p.address;
      if (p.preferredLanguage !== undefined) updates.preferred_language = p.preferredLanguage;
      if (p.medicalHistory !== undefined) updates.medical_history = p.medicalHistory;
      if (p.allergies !== undefined) updates.allergies = p.allergies;
    } else if (user.role === 'doctor') {
      const d = patch as Partial<Doctor>;
      if (d.qualification !== undefined) updates.qualification = d.qualification;
      if (d.specialization !== undefined) updates.specialization = d.specialization;
      if (d.hospital !== undefined) updates.hospital = d.hospital;
      if (d.experience !== undefined) updates.experience = d.experience;
      if (d.clinicAddress !== undefined) updates.clinic_address = d.clinicAddress;
      if (d.phone !== undefined) updates.phone = d.phone;
      if (d.consultationFee !== undefined) updates.consultation_fee = d.consultationFee;
      if (d.timings !== undefined) updates.timings = d.timings;
    }
    if (Object.keys(updates).length > 0) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  const updateDB: AuthContextValue['updateDB'] = (mutator) => {
    setDb(prev => {
      const draft = JSON.parse(JSON.stringify(prev)) as DBShape;
      mutator(draft);
      return draft;
    });
  };

  return (
    <AuthContext.Provider value={{ user, db, loading, login, registerPatient, registerDoctor, logout, updateUser, updateDB }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
