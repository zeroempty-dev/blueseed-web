import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const roles = [
  { role: 'business',  icon: '🏢', label: 'Business',       email: 'business@test.com',  desc: 'Post return loads for your shipments' },
  { role: 'transport', icon: '🚛', label: 'Transport Owner', email: 'transport@test.com', desc: 'Find loads for empty return trips' },
  { role: 'driver',    icon: '👤', label: 'Driver',          email: 'driver@test.com',    desc: 'View assigned trips & update status' },
  { role: 'admin',     icon: '⚙️', label: 'Admin',           email: 'admin@test.com',     desc: 'Manage platform operations' },
];

// Fallback demo users when backend is unavailable
const DEMO_USERS = [
  { id: 'u1', email: 'business@test.com',  password: 'password', role: 'business',  name: 'Rajesh Kumar',    company: 'TN Exports Pvt Ltd' },
  { id: 'u2', email: 'transport@test.com', password: 'password', role: 'transport', name: 'Suresh Logistics', company: 'Suresh Fleet Services' },
  { id: 'u3', email: 'driver@test.com',    password: 'password', role: 'driver',    name: 'Anand M',         phone: '+91 98765 43210' },
  { id: 'u4', email: 'admin@test.com',    password: 'password', role: 'admin',     name: 'Platform Admin' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role.role);
    setEmail(role.email);
    setPassword('password');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      loginUser(data.user);
      navigate(`/demo/${data.user.role}`);
      return;
    } catch (err) {
      // Fallback: if backend unreachable, use demo users for offline demo
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...safeUser } = user;
        loginUser(safeUser);
        navigate(`/demo/${user.role}`);
        return;
      }
      setError(err?.response?.status === 401
        ? 'Invalid credentials. Please try again.'
        : 'Unable to connect. Use demo: business@test.com / password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-400/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-blue mb-4 text-2xl font-bold text-white shadow-lg shadow-brand-600/20">
            Z
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">ZeroEmpty</h1>
          <p className="text-dark-100 mt-2 text-sm">Logistics Reimagined</p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {roles.map((role, i) => (
            <button
              key={role.role}
              onClick={() => handleRoleSelect(role)}
              className={`glass-card p-4 text-left transition-all duration-300 cursor-pointer animate-fade-in-up ${
                selectedRole === role.role
                  ? 'border-brand-500/40 bg-brand-600/10 shadow-lg shadow-brand-600/10'
                  : ''
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl mb-2 block">{role.icon}</span>
              <p className="text-white font-semibold text-sm">{role.label}</p>
              <p className="text-dark-200 text-xs mt-1">{role.desc}</p>
            </button>
          ))}
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="glass-card-static p-6 space-y-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-danger text-sm text-center bg-danger/10 rounded-lg py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base py-3"
          >
            {loading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              'Sign In →'
            )}
          </button>

          <p className="text-dark-300 text-xs text-center mt-3">
            Select a role above • Password: <code className="text-brand-400">password</code>
          </p>
          <Link to="/" className="block text-center text-dark-200 text-sm mt-4 hover:text-white transition-colors">
            ← Back to homepage
          </Link>
        </form>
      </div>
    </div>
  );
}
