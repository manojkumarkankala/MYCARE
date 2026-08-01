import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { ThemeProvider } from '@/store/ThemeContext';
import { ToastProvider } from '@/store/ToastContext';
import type { UserRole } from '@/types';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { PatientDashboard } from '@/pages/patient/PatientDashboard';
import { AIDoctorPage } from '@/pages/patient/AIDoctorPage';
import { MedicineScannerPage } from '@/pages/patient/MedicineScannerPage';
import { MedicalReportScannerPage } from '@/pages/patient/MedicalReportScannerPage';
import { InstrumentCatalogPage } from '@/pages/patient/InstrumentCatalogPage';
import { AppointmentsPage } from '@/pages/patient/AppointmentsPage';
import { HealthRecordsPage } from '@/pages/patient/HealthRecordsPage';
import { EmergencySOSPage } from '@/pages/patient/EmergencySOSPage';
import { NearbyHospitalsPage } from '@/pages/patient/NearbyHospitalsPage';
import { PrescriptionViewPage } from '@/pages/patient/PrescriptionViewPage';
import { DoctorDashboard } from '@/pages/doctor/DoctorDashboard';
import { DoctorPatientsPage } from '@/pages/doctor/DoctorPatientsPage';
import { WritePrescriptionPage } from '@/pages/doctor/WritePrescriptionPage';
import { DoctorUpdatesPage } from '@/pages/doctor/DoctorUpdatesPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminPatientsPage } from '@/pages/admin/AdminPatientsPage';
import { AdminDoctorsPage } from '@/pages/admin/AdminDoctorsPage';
import { AdminMedicinesPage } from '@/pages/admin/AdminMedicinesPage';
import { AdminInstrumentsPage } from '@/pages/admin/AdminInstrumentsPage';
import { AdminArticlesPage } from '@/pages/admin/AdminArticlesPage';
import { AdminFeedbackPage } from '@/pages/admin/AdminFeedbackPage';
import { AdminHospitalsPage } from '@/pages/admin/AdminHospitalsPage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileSettingsPage } from '@/pages/shared/ProfileSettingsPage';

function ProtectedRoute({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'patient' ? '/patient' : user.role === 'doctor' ? '/doctor' : '/admin'} replace />;
  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  const base = user.role === 'patient' ? '/patient' : user.role === 'doctor' ? '/doctor' : '/admin';
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {user.role === 'patient' && <>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/ai-doctor" element={<AIDoctorPage />} />
          <Route path="/patient/medicine-scanner" element={<MedicineScannerPage />} />
          <Route path="/patient/report-scanner" element={<MedicalReportScannerPage />} />
          <Route path="/patient/instruments" element={<InstrumentCatalogPage />} />
          <Route path="/patient/appointments" element={<AppointmentsPage />} />
          <Route path="/patient/records" element={<HealthRecordsPage />} />
          <Route path="/patient/sos" element={<EmergencySOSPage />} />
          <Route path="/patient/hospitals" element={<NearbyHospitalsPage />} />
          <Route path="/patient/prescription/:id" element={<PrescriptionViewPage />} />
        </>}
        {user.role === 'doctor' && <>
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
          <Route path="/doctor/prescription" element={<WritePrescriptionPage />} />
          <Route path="/doctor/updates" element={<DoctorUpdatesPage />} />
        </>}
        {user.role === 'admin' && <>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<AdminPatientsPage />} />
          <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
          <Route path="/admin/medicines" element={<AdminMedicinesPage />} />
          <Route path="/admin/instruments" element={<AdminInstrumentsPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/hospitals" element={<AdminHospitalsPage />} />
        </>}
        <Route path="/settings" element={<ProfileSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={base} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={<DashboardRouter />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
