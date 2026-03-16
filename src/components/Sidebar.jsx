import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardIcons } from './icons';
import ThemeToggle from './ThemeToggle';

const BASE = '/demo';

const navItems = {
  business: [
    { path: `${BASE}/business`,        label: 'Dashboard',    icon: DashboardIcons.dashboard },
    { path: `${BASE}/business/post`,   label: 'Post Load',    icon: DashboardIcons.package },
    { path: `${BASE}/business/loads`,  label: 'My Loads',     icon: DashboardIcons.loads },
    { path: `${BASE}/business/analytics`, label: 'Analytics', icon: DashboardIcons.analytics },
    { path: `${BASE}/tracking`,        label: 'Tracking',     icon: DashboardIcons.map },
  ],
  transport: [
    { path: `${BASE}/transport`,          label: 'Dashboard',      icon: DashboardIcons.dashboard },
    { path: `${BASE}/transport/trucks`,   label: 'My Trucks',      icon: DashboardIcons.truck },
    { path: `${BASE}/transport/loads`,    label: 'Find Loads',     icon: DashboardIcons.search },
    { path: `${BASE}/transport/shipments`,label: 'Shipments',      icon: DashboardIcons.shipment },
    { path: `${BASE}/transport/analytics`,label: 'Analytics',      icon: DashboardIcons.analytics },
    { path: `${BASE}/tracking`,           label: 'Tracking',       icon: DashboardIcons.map },
  ],
  driver: [
    { path: `${BASE}/driver`,    label: 'My Trip',   icon: DashboardIcons.route },
    { path: `${BASE}/driver/analytics`, label: 'Analytics', icon: DashboardIcons.analytics },
    { path: `${BASE}/tracking`,  label: 'Map',       icon: DashboardIcons.map },
  ],
  admin: [
    { path: `${BASE}/admin`,            label: 'Dashboard',    icon: DashboardIcons.dashboard },
    { path: `${BASE}/admin/trucks`,     label: 'Trucks',       icon: DashboardIcons.truck },
    { path: `${BASE}/admin/businesses`, label: 'Businesses',   icon: DashboardIcons.business },
    { path: `${BASE}/admin/loads`,      label: 'All Loads',    icon: DashboardIcons.package },
    { path: `${BASE}/admin/analytics`,  label: 'Analytics',    icon: DashboardIcons.analytics },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/demo/login');
    onClose?.();
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <aside className={`sidebar fixed top-0 left-0 h-screen w-64 bg-dark-800 border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Close button (mobile) */}
      <button
        type="button"
        className="sidebar-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <span />
        <span />
      </button>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" onClick={handleNavClick}>
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white font-bold text-lg">
            Z
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">ZeroEmpty</h1>
            <p className="text-dark-200 text-xs">Return Trip Matching</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `${BASE}/${user?.role}` || item.path === `${BASE}/tracking`}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/20'
                  : 'text-dark-100 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="[&_svg]:shrink-0 [&_svg]:text-current">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <ThemeToggle />
        </div>
        <div className="glass-card-static p-3 mb-3">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-dark-200 text-xs capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full btn-outline text-sm justify-center"
        >
          ← Sign Out
        </button>
      </div>
    </aside>
  );
}
