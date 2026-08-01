/*
# Create profiles table for Supabase Auth integration

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users) — links to the authenticated user
  - `email` (text, not null) — user's email
  - `role` (text, not null) — 'patient', 'doctor', or 'admin'
  - `name` (text, not null) — display name
  - `avatar` (text) — profile image URL
  - `created_at` (timestamptz) — account creation timestamp
  - Patient-specific: `age`, `gender`, `blood_group`, `height`, `weight`, `mobile`, `emergency_contact`, `address`, `preferred_language`, `medical_history`, `allergies`
  - Doctor-specific: `qualification`, `specialization`, `hospital`, `experience`, `registration_number`, `clinic_address`, `phone`, `consultation_fee`, `timings`, `rating`, `approved`, `whatsapp`

2. Security
- Enable RLS on `profiles`.
- SELECT: authenticated users can read all profiles (patients need to see doctors, admin needs to see all users).
- INSERT: a user can insert only their own profile (auth.uid() = id).
- UPDATE: a user can update only their own profile.
- DELETE: a user can delete only their own profile.

3. Notes
- This table stores the full user profile. The rest of the app data (appointments, medicines, etc.) remains in the browser's local storage for now.
- Admin accounts are managed separately (admin login uses a project-level password, not Supabase Auth).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'patient',
  name text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now(),

  -- Patient fields
  age int,
  gender text,
  blood_group text,
  height int,
  weight int,
  mobile text,
  emergency_contact text,
  address text,
  preferred_language text DEFAULT 'English',
  medical_history text,
  allergies text,

  -- Doctor fields
  qualification text,
  specialization text,
  hospital text,
  experience int,
  registration_number text,
  clinic_address text,
  phone text,
  consultation_fee int,
  timings text,
  rating numeric DEFAULT 0,
  approved boolean DEFAULT false,
  whatsapp text
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_profiles" ON profiles;
CREATE POLICY "select_all_profiles"
ON profiles FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated USING (auth.uid() = id);
