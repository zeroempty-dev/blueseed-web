import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { DashboardIcons } from '../components/icons';
import { getLoads, createLoad, getBusinessAnalytics } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CITIES = ['Chennai', 'Bangalore', 'Salem', 'Erode', 'Coimbatore', 'Madurai', 'Trichy', 'Vellore', 'Hosur', 'Krishnagiri'];

// Fallback analytics when API unavailable
const FALLBACK_ANALYTICS = {
  costByMonth: [
    { month: 'Oct 25', cost: 37000, loads: 4 },
    { month: 'Nov 25', cost: 52000, loads: 6 },
    { month: 'Dec 25', cost: 48000, loads: 5 },
    { month: 'Jan 26', cost: 61000, loads: 7 },
    { month: 'Feb 26', cost: 56000, loads: 6 },
    { month: 'Mar 26', cost: 61500, loads: 8 },
  ],
  truckFindTime: {
    currentHours: 4.2,
    previousHours: 18,
    reductionPercent: 77,
  },
  orders: { posted: 5, inTransit: 1, delivered: 5 },
  totalCostYTD: 178500,
};

function PostLoadForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupCity: '', dropCity: '', cargoType: '', weight: '', price: '', pickupTime: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createLoad({ ...formData, businessId: user.id });
      setSuccess(true);
      setTimeout(() => navigate('/demo/business/loads'), 1500);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in-up">
        <div className="mb-4 text-success [&_svg]:w-16 [&_svg]:h-16">{DashboardIcons.delivered}</div>
        <h3 className="text-white text-xl font-bold">Load Posted Successfully!</h3>
        <p className="text-dark-200 mt-2">Redirecting to your loads...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Post Return Load</h2>
      <form onSubmit={handleSubmit} className="glass-card-static p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Pickup City</label>
            <select className="form-select" required value={formData.pickupCity} onChange={e => setFormData(f => ({ ...f, pickupCity: e.target.value }))}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Drop City</label>
            <select className="form-select" required value={formData.dropCity} onChange={e => setFormData(f => ({ ...f, dropCity: e.target.value }))}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Cargo Type</label>
          <input className="form-input" placeholder="e.g. Electronics, Textiles, Auto Parts" required value={formData.cargoType} onChange={e => setFormData(f => ({ ...f, cargoType: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Weight (tons)</label>
            <input type="number" className="form-input" placeholder="e.g. 5" required value={formData.weight} onChange={e => setFormData(f => ({ ...f, weight: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Price Offered (₹)</label>
            <input type="number" className="form-input" placeholder="e.g. 15000" required value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="form-label">Pickup Time</label>
          <input type="datetime-local" className="form-input" required value={formData.pickupTime} onChange={e => setFormData(f => ({ ...f, pickupTime: e.target.value }))} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3 flex items-center gap-2">
          {submitting ? 'Posting...' : (
            <>
              <span className="[&_svg]:w-4 [&_svg]:h-4">{DashboardIcons.package}</span>
              Post Load
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function MyLoads() {
  const { user } = useAuth();
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    getLoads({ businessId: user.id }).then(setLoads);
  }, [user.id]);

  const statusPipeline = ['posted', 'matched', 'picked-up', 'in-transit', 'delivered'];

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">My Posted Loads</h2>
      <div className="glass-card-static overflow-hidden">
        <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Cargo</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {loads.map(load => (
              <tr key={load.id}>
                <td>
                  <span className="text-white font-medium">{load.pickupCity}</span>
                  <span className="text-dark-300 mx-2">→</span>
                  <span className="text-white font-medium">{load.dropCity}</span>
                </td>
                <td>{load.cargoType}</td>
                <td>{load.weight}T</td>
                <td className="text-brand-400 font-semibold">₹{load.price?.toLocaleString()}</td>
                <td><StatusBadge status={load.status} /></td>
                <td>
                  <div className="flex gap-1">
                    {statusPipeline.map((s, i) => (
                      <div
                        key={s}
                        title={s}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          statusPipeline.indexOf(load.status) >= i
                            ? 'bg-brand-500'
                            : 'bg-dark-500'
                        }`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {loads.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            <div className="mb-2 text-dark-400 [&_svg]:w-12 [&_svg]:h-12">{DashboardIcons.package}</div>
            <p>No loads posted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessHome() {
  const { user } = useAuth();
  const [loads, setLoads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLoads({ businessId: user.id }),
      getBusinessAnalytics(user.id).catch(() => FALLBACK_ANALYTICS),
    ]).then(([loadsData, analyticsData]) => {
      setLoads(loadsData);
      setAnalytics(analyticsData);
    }).finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="glass-card-static p-12 text-center">
        <div className="animate-pulse text-dark-300">Loading analytics...</div>
      </div>
    );
  }

  const data = analytics || FALLBACK_ANALYTICS;
  const { costByMonth, truckFindTime, orders } = data;

  const chartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
      <div className="glass-card-static px-4 py-3 text-sm">
        <p className="text-white font-semibold">{p.month}</p>
        <p className="text-brand-400">₹{p.cost?.toLocaleString()} total cost</p>
        <p className="text-dark-200">{p.loads} loads</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}</h1>
        <p className="text-dark-200 mt-1">Your freight analytics and performance metrics</p>
      </div>

      {/* 1. Orders: Posted, In Transit, Delivered */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Order status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={DashboardIcons.posted}
            label="Orders posted"
            value={orders.posted}
            gradient="gradient-amber"
            delay="delay-100"
          />
          <StatCard
            icon={DashboardIcons.truck}
            label="In transit"
            value={orders.inTransit}
            gradient="gradient-purple"
            delay="delay-200"
          />
          <StatCard
            icon={DashboardIcons.delivered}
            label="Delivered"
            value={orders.delivered}
            gradient="gradient-green"
            delay="delay-300"
          />
        </div>
      </div>

      {/* 2. Cost of goods transported month on month */}
      <div className="glass-card-static p-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Cost of goods transported</h2>
            <p className="text-dark-200 text-sm mt-1">Month-on-month freight spend</p>
          </div>
          <div className="text-right">
            <p className="text-dark-200 text-xs uppercase tracking-wider">YTD total</p>
            <p className="text-brand-400 text-2xl font-bold">₹{data.totalCostYTD?.toLocaleString() || 0}</p>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#909296" fontSize={12} tickLine={false} />
              <YAxis stroke="#909296" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${(v / 1000)}k`} />
              <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(76, 110, 245, 0.08)' }} />
              <Bar dataKey="cost" fill="#4c6ef5" radius={[4, 4, 0, 0]} name="Cost (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Wait time reduction & truck find time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card-static p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">
              {DashboardIcons.delivered}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Return load wait time</h2>
              <p className="text-dark-200 text-sm">Reduction vs. traditional broker</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-success text-3xl font-bold">{truckFindTime.reductionPercent}%</span>
            <span className="text-dark-200 text-sm">faster</span>
          </div>
          <p className="text-dark-300 text-sm mt-2">
            Before ZeroEmpty: {truckFindTime.previousHours}h avg • Now: {truckFindTime.currentHours}h avg
          </p>
        </div>

        <div className="glass-card-static p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">
              {DashboardIcons.truck}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Truck find time</h2>
              <p className="text-dark-200 text-sm">Avg. time to match a return load</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-brand-400 text-3xl font-bold">{truckFindTime.currentHours}h</span>
            <span className="text-dark-200 text-sm">average</span>
          </div>
          <p className="text-dark-300 text-sm mt-2">
            Direct matching with transport owners — no broker delays
          </p>
        </div>
      </div>

      {/* Recent loads */}
      <div className="glass-card-static overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-semibold">Recent loads</h3>
          <Link to="/demo/business/loads" className="text-brand-400 text-sm hover:underline">View all</Link>
        </div>
        <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Cargo</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loads.slice(0, 5).map(load => (
              <tr key={load.id}>
                <td>
                  <span className="text-white">{load.pickupCity}</span>
                  <span className="text-dark-300 mx-2">→</span>
                  <span className="text-white">{load.dropCity}</span>
                </td>
                <td>{load.cargoType}</td>
                <td className="text-brand-400 font-semibold">₹{load.price?.toLocaleString()}</td>
                <td><StatusBadge status={load.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {loads.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            <p>No loads yet. Post your first return load to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<BusinessHome />} />
        <Route path="post" element={<PostLoadForm />} />
        <Route path="loads" element={<MyLoads />} />
      </Routes>
    </DashboardLayout>
  );
}
