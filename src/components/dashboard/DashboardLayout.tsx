import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Stethoscope, Pill, FileText, Calendar, HeartPulse,
  Siren, MapPin, Users, PenSquare, Megaphone, Package, Bell, Settings,
  Moon, Sun, LogOut, Menu, X, FlaskConical, MessageSquare, ShoppingCart,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const patientNav: NavItem[] = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/ai-doctor', label: 'AI Doctor', icon: MessageSquare },
  { to: '/patient/medicine-scanner', label: 'Medicine Scanner', icon: Pill },
  { to: '/patient/report-scanner', label: 'Report Scanner', icon: FileText },
  { to: '/patient/instruments', label: 'Instruments', icon: FlaskConical },
  { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { to: '/patient/records', label: 'Health Records', icon: HeartPulse },
  { to: '/patient/hospitals', label: 'Nearby Hospitals', icon: MapPin },
  { to: '/patient/sos', label: 'Emergency SOS', icon: Siren },
];

const doctorNav: NavItem[] = [
  { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/prescription', label: 'Write Prescription', icon: PenSquare },
  { to: '/doctor/updates', label: 'Health Updates', icon: Megaphone },
];

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/admin/medicines', label: 'Medicines', icon: Pill },
  { to: '/admin/instruments', label: 'Instruments', icon: Package },
  { to: '/admin/hospitals', label: 'Hospitals', icon: MapPin },
  { to: '/admin/articles', label: 'Articles', icon: FileText },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
];

export function DashboardLayout() {
  const { user, logout, db } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;
  const nav = user.role === 'patient' ? patientNav : user.role === 'doctor' ? doctorNav : adminNav;
  const base = user.role === 'patient' ? '/patient' : user.role === 'doctor' ? '/doctor' : '/admin';

  const userNotifications = db.notifications.filter(n => n.userId === user.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-medicalbg dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 flex flex-col',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          {nav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === base}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-primary-800 to-secondary-500 text-white shadow-md shadow-primary-800/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {user.role === 'admin' ? 'Administrator' : user.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
              </p>
              <h2 className="font-display font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Welcome, {user.name.split(' ')[0]}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 card p-4 z-40 max-h-96 overflow-y-auto animate-scale-in">
                    <h3 className="font-display font-bold text-slate-900 dark:text-white mb-3">Notifications</h3>
                    {userNotifications.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">No notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {userNotifications.slice(0, 8).map(n => (
                          <div key={n.id} className={cn('p-3 rounded-xl border', n.read ? 'border-slate-100 dark:border-slate-800' : 'border-secondary-200 bg-secondary-50/50 dark:border-secondary-900 dark:bg-secondary-900/20')}>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-secondary-400 shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
