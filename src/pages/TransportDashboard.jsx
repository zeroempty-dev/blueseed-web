import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { DashboardIcons } from '../components/icons';
import {
  getTrucks, createTruck, getMatchedLoads, getShipments,
  createShipment, assignDriver, getDrivers,
} from '../services/api';

const CITIES = ['Chennai', 'Bangalore', 'Salem', 'Erode', 'Coimbatore', 'Madurai', 'Trichy', 'Vellore', 'Hosur', 'Krishnagiri'];
const TRUCK_TYPES = ['Container', 'Open Body', 'Flatbed', 'Refrigerated', 'Tanker'];

function MyTrucks() {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    truckNumber: '', truckType: '', capacity: '', currentCity: '', destinationCity: '',
  });

  useEffect(() => {
    getTrucks({ ownerId: user.id }).then(setTrucks);
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTruck({ ...formData, ownerId: user.id });
    const updated = await getTrucks({ ownerId: user.id });
    setTrucks(updated);
    setShowForm(false);
    setFormData({ truckNumber: '', truckType: '', capacity: '', currentCity: '', destinationCity: '' });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">My Trucks</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary w-full sm:w-auto">
          {showForm ? '✕ Cancel' : '+ Register Truck'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card-static p-6 space-y-4 mb-6 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Truck Number</label>
              <input className="form-input" placeholder="e.g. TN-01-AB-1234" required value={formData.truckNumber} onChange={e => setFormData(f => ({ ...f, truckNumber: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Truck Type</label>
              <select className="form-select" required value={formData.truckType} onChange={e => setFormData(f => ({ ...f, truckType: e.target.value }))}>
                <option value="">Select type</option>
                {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Capacity (tons)</label>
              <input type="number" className="form-input" placeholder="e.g. 10" required value={formData.capacity} onChange={e => setFormData(f => ({ ...f, capacity: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Current City</label>
              <select className="form-select" required value={formData.currentCity} onChange={e => setFormData(f => ({ ...f, currentCity: e.target.value }))}>
                <option value="">Select</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Return Destination</label>
              <select className="form-select" required value={formData.destinationCity} onChange={e => setFormData(f => ({ ...f, destinationCity: e.target.value }))}>
                <option value="">Select</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-success flex items-center gap-2 justify-center">
            <span className="[&_svg]:w-4 [&_svg]:h-4">{DashboardIcons.truck}</span>
            Register Truck
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map(truck => (
          <div key={truck.id} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
                <div>
                  <p className="text-white font-semibold">{truck.truckNumber}</p>
                  <p className="text-dark-200 text-xs">{truck.truckType} • {truck.capacity}T</p>
                </div>
              </div>
              <StatusBadge status={truck.status} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-brand-400">{truck.currentCity}</span>
              <span className="text-dark-400">→</span>
              <span className="text-brand-400">{truck.destinationCity}</span>
            </div>
            {truck.verified ? (
              <span className="text-success text-xs mt-2 inline-block">✓ Verified</span>
            ) : (
              <span className="text-warning text-xs mt-2 inline-block">⏳ Pending verification</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FindLoads() {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [drivers, setDriversList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrucks({ ownerId: user.id }).then(setTrucks);
    getDrivers().then(setDriversList);
  }, [user.id]);

  const handleFindLoads = async (truck) => {
    setSelectedTruck(truck);
    setLoading(true);
    try {
      const result = await getMatchedLoads(truck.id);
      setMatchResult(result);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAcceptLoad = async (load) => {
    try {
      await createShipment({
        loadId: load.id,
        truckId: selectedTruck.id,
        driverId: drivers.length > 0 ? drivers[0].id : null,
      });
      // Refresh
      handleFindLoads(selectedTruck);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Find Return Loads</h2>

      {/* Truck selector */}
      <div className="mb-6">
        <p className="text-dark-200 text-sm mb-3">Select a truck to find matching return loads:</p>
        <div className="flex flex-wrap gap-3">
          {trucks.filter(t => t.status === 'available').map(truck => (
            <button
              key={truck.id}
              onClick={() => handleFindLoads(truck)}
              className={`glass-card p-4 cursor-pointer transition-all ${
                selectedTruck?.id === truck.id ? 'border-brand-500/40 bg-brand-600/10' : ''
              }`}
            >
              <p className="text-white font-semibold text-sm">{truck.truckNumber}</p>
              <p className="text-dark-200 text-xs mt-1">
                {truck.currentCity} → {truck.destinationCity}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Match results */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-pulse text-brand-400 text-lg">Searching for matching loads...</div>
        </div>
      )}

      {matchResult && !loading && (
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-white font-semibold">
              Matched Loads for {matchResult.truck.truckNumber}
            </h3>
            <span className="text-dark-200 text-sm">
              {matchResult.truck.currentCity} → {matchResult.truck.destinationCity}
            </span>
          </div>

          {matchResult.matches.length === 0 ? (
            <div className="text-center py-12 text-dark-300">
              <div className="mb-2 text-dark-400 [&_svg]:w-12 [&_svg]:h-12">{DashboardIcons.search}</div>
              <p>No matching loads found for this route</p>
            </div>
          ) : (
            <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Cargo</th>
                  <th>Weight</th>
                  <th>Price</th>
                  <th>Match</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {matchResult.matches.map(load => (
                  <tr key={load.id}>
                    <td>
                      <span className="text-white">{load.pickupCity}</span>
                      <span className="text-dark-300 mx-2">→</span>
                      <span className="text-white">{load.dropCity}</span>
                    </td>
                    <td>{load.cargoType}</td>
                    <td>{load.weight}T</td>
                    <td className="text-success font-semibold">₹{load.price.toLocaleString()}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        load.matchType === 'exact'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {load.matchType === 'exact' ? '⭐ Exact' : '◐ Partial'}
                        <span className="ml-1 text-dark-200">{load.matchScore}%</span>
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleAcceptLoad(load)} className="btn-success text-xs py-1.5 px-3">
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Shipments() {
  const [shipments, setShipmentsList] = useState([]);
  const [drivers, setDriversList] = useState([]);

  useEffect(() => {
    getShipments().then(setShipmentsList);
    getDrivers().then(setDriversList);
  }, []);

  const handleAssignDriver = async (shipmentId, driverId) => {
    await assignDriver(shipmentId, driverId);
    getShipments().then(setShipmentsList);
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Shipments</h2>
      <div className="glass-card-static overflow-hidden">
        <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id}>
                <td className="text-white font-mono text-xs">{s.id}</td>
                <td>
                  <span className="text-white">{s.pickupCity}</span>
                  <span className="text-dark-300 mx-2">→</span>
                  <span className="text-white">{s.dropCity}</span>
                </td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  {s.driverId ? (
                    <span className="text-success text-sm">
                      {drivers.find(d => d.id === s.driverId)?.name || s.driverId}
                    </span>
                  ) : (
                    <select
                      className="form-select text-xs py-1"
                      onChange={e => handleAssignDriver(s.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Assign driver</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  <div className="w-24 bg-dark-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full gradient-blue transition-all duration-500"
                      style={{ width: `${(s.progress || 0) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {shipments.length === 0 && (
          <div className="text-center py-12 text-dark-300">No shipments yet</div>
        )}
      </div>
    </div>
  );
}

function TransportHome() {
  const { user } = useAuth();
  const [trucks, setTrucks] = useState([]);
  const [shipments, setShipmentsList] = useState([]);

  useEffect(() => {
    getTrucks({ ownerId: user.id }).then(setTrucks);
    getShipments().then(setShipmentsList);
  }, [user.id]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Fleet Dashboard</h1>
        <p className="text-dark-200 mt-1">Manage trucks, find return loads, and track shipments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DashboardIcons.truck} label="Total Trucks" value={trucks.length} gradient="gradient-blue" delay="delay-100" />
        <StatCard icon={DashboardIcons.delivered} label="Available" value={trucks.filter(t => t.status === 'available').length} gradient="gradient-green" delay="delay-200" />
        <StatCard icon={DashboardIcons.shipment} label="Active Shipments" value={shipments.filter(s => s.status !== 'delivered').length} gradient="gradient-amber" delay="delay-300" />
        <StatCard icon={DashboardIcons.completed} label="Completed" value={shipments.filter(s => s.status === 'delivered').length} gradient="gradient-purple" delay="delay-400" />
      </div>

      {/* Quick truck overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trucks.map((truck, i) => (
          <div key={truck.id} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
              <div>
                <p className="text-white font-semibold">{truck.truckNumber}</p>
                <p className="text-dark-200 text-xs">{truck.truckType} • {truck.capacity}T</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="text-brand-400">{truck.currentCity}</span>
              <span className="text-dark-400">→</span>
              <span className="text-brand-400">{truck.destinationCity}</span>
            </div>
            <StatusBadge status={truck.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TransportDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<TransportHome />} />
        <Route path="trucks" element={<MyTrucks />} />
        <Route path="loads" element={<FindLoads />} />
        <Route path="shipments" element={<Shipments />} />
      </Routes>
    </DashboardLayout>
  );
}
