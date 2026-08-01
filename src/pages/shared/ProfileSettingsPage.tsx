import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { useTheme } from '@/store/ThemeContext';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  User, Moon, Sun, Bell, Shield, LogOut, Save, Globe, Heart,
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useNavigate } from 'react-router-dom';

export function ProfileSettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user ? { ...user } : null);

  if (!user || !form) return null;

  const handleSave = async () => {
    await updateUser(form);
    setEditing(false);
    toast('Profile updated successfully!', 'success');
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your profile, preferences, and account.</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-secondary-500" /> Profile
          </h2>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setForm({ ...user }); setEditing(false); }}>Cancel</Button>
              <Button size="sm" onClick={handleSave}><Save className="w-4 h-4" /> Save</Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          {editing ? (
            <ImageUpload value={form.avatar} onChange={(img) => setForm({ ...form, avatar: img })} label="Profile Photo" shape="circle" />
          ) : (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover" />
          )}
          <div>
            <p className="font-display font-bold text-xl text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <Badge color="primary" >{user.role}</Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {editing ? (
            <>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              {user.role === 'patient' && (
                <>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Mobile</label>
                    <input value={form.mobile || ''} onChange={e => setForm({ ...form, mobile: e.target.value } as any)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Address</label>
                    <input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value } as any)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Emergency Contact</label>
                    <input value={form.emergencyContact || ''} onChange={e => setForm({ ...form, emergencyContact: e.target.value } as any)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Allergies</label>
                    <input value={form.allergies || ''} onChange={e => setForm({ ...form, allergies: e.target.value } as any)} className="input-field" />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {user.role === 'patient' && (
                <>
                  <Info label="Age" value={`${user.age} years`} />
                  <Info label="Gender" value={user.gender} />
                  <Info label="Blood Group" value={user.bloodGroup} />
                  <Info label="Mobile" value={user.mobile} />
                  <Info label="Address" value={user.address} />
                  <Info label="Emergency Contact" value={user.emergencyContact} />
                  <Info label="Preferred Language" value={user.preferredLanguage} />
                  <Info label="Allergies" value={user.allergies} />
                </>
              )}
              {user.role === 'doctor' && (
                <>
                  <Info label="Specialization" value={user.specialization} />
                  <Info label="Hospital" value={user.hospital} />
                  <Info label="Experience" value={`${user.experience} years`} />
                  <Info label="Consultation Fee" value={`₹${user.consultationFee}`} />
                  <Info label="Phone" value={user.phone} />
                  <Info label="Timings" value={user.timings} />
                </>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-primary-400" />}
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">Theme</p>
              <p className="text-xs text-slate-400">{theme === 'light' ? 'Light mode' : 'Dark mode'}</p>
            </div>
          </div>
          <button onClick={toggle} className="relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Preferences</h2>
        <div className="space-y-3">
          <PrefRow icon={Bell} title="Notifications" desc="Medicine reminders, appointment alerts" defaultOn />
          <PrefRow icon={Globe} title="Language" desc="English, Hindi, Telugu" />
          <PrefRow icon={Shield} title="Privacy" desc="Control who sees your health data" />
        </div>
      </Card>

      {/* Account */}
      <Card>
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Account</h2>
        <Button variant="danger" onClick={handleLogout}><LogOut className="w-4 h-4" /> Sign Out</Button>
      </Card>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Heart className="w-3 h-3 text-danger" /> MYCARE — Your Smart Healthcare Companion
      </p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium text-slate-400">{label}</p><p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p></div>;
}

function PrefRow({ icon: Icon, title, desc, defaultOn }: { icon: typeof Bell; title: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-500" />
        <div><p className="font-semibold text-sm text-slate-900 dark:text-white">{title}</p><p className="text-xs text-slate-400">{desc}</p></div>
      </div>
      <button onClick={() => setOn(o => !o)} className="relative w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
        <span className={`absolute top-0.5 w-5 h-5 rounded-full ${on ? 'translate-x-6 bg-secondary-500' : 'translate-x-0.5 bg-white'} shadow transition-transform`} />
      </button>
    </div>
  );
}
