import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getLoads, createLoad } from '../services/api';

const CITIES = ['Chennai', 'Bangalore', 'Salem', 'Erode', 'Coimbatore', 'Madurai', 'Trichy', 'Vellore', 'Hosur', 'Krishnagiri'];

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
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-white text-xl font-bold">Load Posted Successfully!</h3>
        <p className="text-dark-200 mt-2">Redirecting to your loads...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Post Return Load</h2>
      <form onSubmit={handleSubmit} className="glass-card-static p-6 space-y-5 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
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
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
          {submitting ? 'Posting...' : '📦 Post Load'}
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
                <td className="text-brand-400 font-semibold">₹{load.price.toLocaleString()}</td>
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
        {loads.length === 0 && (
          <div className="text-center py-12 text-dark-300">
            <p className="text-3xl mb-2">📭</p>
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

  useEffect(() => {
    getLoads({ businessId: user.id }).then(setLoads);
  }, [user.id]);

  const stats = {
    total: loads.length,
    posted: loads.filter(l => l.status === 'posted').length,
    inTransit: loads.filter(l => l.status === 'in-transit').length,
    delivered: loads.filter(l => l.status === 'delivered').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}</h1>
        <p className="text-dark-200 mt-1">Manage your return loads and track shipments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Loads" value={stats.total} gradient="gradient-blue" delay="delay-100" />
        <StatCard icon="📝" label="Posted" value={stats.posted} gradient="gradient-amber" delay="delay-200" />
        <StatCard icon="🚛" label="In Transit" value={stats.inTransit} gradient="gradient-purple" delay="delay-300" />
        <StatCard icon="✅" label="Delivered" value={stats.delivered} gradient="gradient-green" delay="delay-400" />
      </div>

      {/* Recent loads */}
      <div className="glass-card-static overflow-hidden animate-fade-in-up delay-300">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Recent Loads</h3>
        </div>
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
                <td className="text-brand-400 font-semibold">₹{load.price.toLocaleString()}</td>
                <td><StatusBadge status={load.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
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
