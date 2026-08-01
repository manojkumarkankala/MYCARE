/*
# Allow admins to manage any profile

The existing "update_own_profile" / "delete_own_profile" policies only let a
user modify their own row (auth.uid() = id). That means an admin account had
no way to approve a doctor's profile or remove a profile in the database —
admin actions were silently no-ops against Supabase.

This adds two policies that let any authenticated user whose OWN profile has
role = 'admin' update or delete ANY profile row (used for doctor approval,
doctor/patient removal, etc). Read access was already open to all
authenticated users via "select_all_profiles".
*/

DROP POLICY IF EXISTS "admin_update_any_profile" ON profiles;
CREATE POLICY "admin_update_any_profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles admin_row WHERE admin_row.id = auth.uid() AND admin_row.role = 'admin')
)
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_any_profile" ON profiles;
CREATE POLICY "admin_delete_any_profile"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles admin_row WHERE admin_row.id = auth.uid() AND admin_row.role = 'admin')
);
