# MYCARE — AI-Powered Healthcare Platform

**Your Smart Healthcare Companion**

A premium, production-ready AI-powered healthcare platform connecting Patients, Doctors, and Administrators with AI-driven symptom assessment, medicine scanning, medical report analysis, and seamless appointment management.

## Features

### Patient Portal
- **AI Doctor** — Conversational AI that collects symptoms, lifestyle, and medical history, then generates a health assessment with possible conditions, risk level, recommended specialist, and care advice. Includes voice input/output.
- **Medicine Scanner** — Upload a medicine image; AI identifies it and provides composition, uses, dosage, side effects, warnings, interactions, and alternatives.
- **Medical Report Scanner** — Upload blood tests/lab reports; AI extracts data, explains in plain language, and highlights abnormal values.
- **Instrument Catalog** — Beautiful grid of medical devices with step-by-step usage guides, precautions, and maintenance tips.
- **Appointments** — Search doctors, book/cancel/reschedule, view history.
- **Emergency SOS** — One-tap emergency alert with countdown, ambulance call, and emergency instructions.
- **Nearby Hospitals** — Find hospitals, clinics, pharmacies, and labs with directions and contact info.
- **Health Records** — Prescriptions, lab reports, medical history, and appointment history.
- **Digital Prescription** — Hospital-style PDF with QR code, printable and emailable.

### Doctor Portal
- Dashboard with today's patients and appointments
- Patient list with full medical history
- Write digital prescriptions
- Publish health articles visible to all patients (create, edit, delete)

### Admin Portal
- Analytics dashboard (patients, doctors, appointments, revenue, medicines, instruments)
- Manage patients (view, suspend, delete)
- Approve/reject/edit/remove doctors
- Manage medicines and instruments (full CRUD)
- View health articles and patient feedback

### Platform
- Dark/Light mode with system preference detection
- Fully responsive (mobile-first)
- Glassmorphism cards, smooth Framer Motion animations
- Toast notifications, loading states, error states
- Role-based access control
- localStorage persistence (data survives page reloads)

## Tech Stack
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** with custom medical design system
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons
- Web Speech API for voice input/synthesis

## Demo Accounts

| Role    | Email                    | Password      |
|---------|--------------------------|---------------|
| Patient | john@example.com         | patient123    |
| Patient | priya@example.com        | patient123    |
| Doctor  | dr.sarah@mycare.health   | doctor123     |
| Doctor  | dr.rajesh@mycare.health | doctor123     |
| Admin   | admin@mycare.health      | MYCARE@123    |

> Note: Doctor accounts must be approved by an admin before login. Dr. Meera Iyer is pending approval.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Color Theme

| Token      | Hex       |
|------------|-----------|
| Primary    | #0F4C81   |
| Secondary  | #0AA6A6   |
| Accent     | #4FC3F7   |
| Success    | #22C55E   |
| Warning    | #F59E0B   |
| Danger     | #EF4444   |
| Background | #F5FAFF   |

## Medical Disclaimer

MYCARE provides AI-generated suggestions for informational purposes only. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions about a medical condition. In an emergency, call your local emergency number immediately.
