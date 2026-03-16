import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import { DashboardIcons } from '../components/icons';
import {
  getTrucks, createTruck, getMatchedLoads, getShipments,
  createShipment, assignDriver, getDrivers, getTransportAnalytics,
} from '../services/api';
import AnalyticsPage from './AnalyticsPage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

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

function TransportDashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransportAnalytics(user.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6">Fleet Dashboard</h2>
        <div className="glass-card p-12 text-center text-dark-300">Loading dashboard...</div>
      </div>
    );
  }

  const chartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        {payload.map((p) => (
          <p key={p.dataKey} className="text-white text-sm">{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
        ))}
      </div>
    );
  };

  const tripTiming = data?.tripTiming || data?.mockTripTiming || { early: 0, onTime: 0, late: 0 };
  const timingData = [
    { name: 'Early', value: tripTiming.early, color: '#22c55e' },
    { name: 'On time', value: tripTiming.onTime, color: '#4c6ef5' },
    { name: 'Late', value: tripTiming.late, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const truckGoodsChartData = (data?.truckGoodsList?.length > 0 ? data.truckGoodsList : data?.mockTruckGoods || []).map((t) => ({ name: t.truckNumber, trips: t.goodsCount }));
  const regionTripsChartData = (data?.regionTrips?.length > 0 ? data.regionTrips : data?.mockRegionTrips || []).map((r) => ({ route: r.route?.replace('–', ' → ') || r.route, count: r.count }));
  const regionReturnsChartData = (data?.regionReturns?.length > 0 ? data.regionReturns : data?.mockRegionReturns || []).map((r) => ({ route: r.route?.replace('–', ' → ') || r.route, avgReturn: r.avgReturn }));
  const driverChartData = (data?.driverStats?.length > 0 ? data.driverStats : data?.mockDriverStats || []).map((d) => ({ name: d.driverName, trips: d.tripCount }));
  const tripsByMonthData = data?.tripsByMonth || [];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Fleet Dashboard</h1>
        <p className="text-dark-200 mt-1">Insights on vehicles, drivers, regions, and delivery performance</p>
      </div>

      {/* Trips over time */}
      {tripsByMonthData.length > 0 && (
        <div className="glass-card-static p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.route}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Trips over time</h2>
              <p className="text-dark-200 text-sm">Completed deliveries by month</p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tripsByMonthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#909296" fontSize={12} tickLine={false} />
                <YAxis stroke="#909296" fontSize={12} tickLine={false} />
                <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(76, 110, 245, 0.08)' }} />
                <Line type="monotone" dataKey="trips" stroke="#4c6ef5" strokeWidth={2} dot={{ fill: '#4c6ef5' }} name="Trips" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 1. Running transports */}
      <div className="glass-card-static overflow-hidden mb-6">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
          <div>
            <h2 className="text-lg font-semibold text-white">Transports currently running</h2>
            <p className="text-dark-200 text-sm">Active in-transit shipments</p>
          </div>
        </div>
        {data?.runningTransports?.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Truck</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.runningTransports.map((t) => (
                  <tr key={t.id}>
                    <td><span className="text-white font-medium">{t.truckNumber}</span></td>
                    <td>{t.driverName}</td>
                    <td><span className="text-brand-400">{t.route}</span></td>
                    <td>
                      <div className="w-24 bg-dark-600 rounded-full h-2">
                        <div className="h-2 rounded-full gradient-blue" style={{ width: `${t.progress}%` }} />
                      </div>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-dark-300">No transports currently running</div>
        )}
      </div>

      {/* 2 & 4. Max / Min goods by vehicle + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Most goods delivered</h2>
              <p className="text-dark-200 text-sm">Vehicle with highest trip count</p>
            </div>
          </div>
          {data?.maxGoodsVehicle ? (
            <div className="flex items-baseline gap-2">
              <span className="text-success text-3xl font-bold">{data.maxGoodsVehicle.truckNumber}</span>
              <span className="text-dark-200 text-sm">— {data.maxGoodsVehicle.goodsCount} trips</span>
            </div>
          ) : truckGoodsChartData[0] ? (
            <div className="flex items-baseline gap-2">
              <span className="text-success text-3xl font-bold">{truckGoodsChartData[0].name}</span>
              <span className="text-dark-200 text-sm">— {truckGoodsChartData[0].trips} trips</span>
            </div>
          ) : (
            <p className="text-dark-300">No data yet</p>
          )}
        </div>
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Least goods delivered</h2>
              <p className="text-dark-200 text-sm">Vehicle with lowest trip count</p>
            </div>
          </div>
          {data?.minGoodsVehicle ? (
            <div className="flex items-baseline gap-2">
              <span className="text-warning text-3xl font-bold">{data.minGoodsVehicle.truckNumber}</span>
              <span className="text-dark-200 text-sm">— {data.minGoodsVehicle.goodsCount} trips</span>
            </div>
          ) : truckGoodsChartData.length > 0 ? (
            <div className="flex items-baseline gap-2">
              <span className="text-warning text-3xl font-bold">{truckGoodsChartData[truckGoodsChartData.length - 1].name}</span>
              <span className="text-dark-200 text-sm">— {truckGoodsChartData[truckGoodsChartData.length - 1].trips} trips</span>
            </div>
          ) : (
            <p className="text-dark-300">No data yet</p>
          )}
        </div>
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Goods by vehicle</h2>
              <p className="text-dark-200 text-sm">Trip count per truck</p>
            </div>
          </div>
          {truckGoodsChartData.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={truckGoodsChartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#909296" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#909296" fontSize={11} tickLine={false} width={80} />
                  <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(76, 110, 245, 0.08)' }} />
                  <Bar dataKey="trips" fill="#14b8a6" radius={[0, 4, 4, 0]} name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-dark-300">No data yet</p>
          )}
        </div>
      </div>

      {/* 3. Driver–vehicle mapping */}
      <div className="glass-card-static overflow-hidden mb-6">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.driver}</div>
          <div>
            <h2 className="text-lg font-semibold text-white">Driver–vehicle assignments</h2>
            <p className="text-dark-200 text-sm">Who is driving which vehicle</p>
          </div>
        </div>
        {data?.driverVehicleMap?.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Route</th>
                </tr>
              </thead>
              <tbody>
                {data.driverVehicleMap.map((m, i) => (
                  <tr key={i}>
                    <td><span className="text-white font-medium">{m.driverName}</span></td>
                    <td>{m.truckNumber}</td>
                    <td><span className="text-brand-400">{m.route}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-dark-300">No active driver–vehicle assignments</div>
        )}
      </div>

      {/* 5. Top driver + delivery time comparison + chart */}
      <div className="glass-card-static overflow-hidden mb-6">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.driver}</div>
          <div>
            <h2 className="text-lg font-semibold text-white">Driver performance</h2>
            <p className="text-dark-200 text-sm">Most trips + delivery time comparison</p>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {data?.topDriver ? (
                <div className="mb-4">
                  <p className="text-dark-200 text-sm">Top driver by trips</p>
                  <p className="text-white text-xl font-bold">{data.topDriver.driverName}</p>
                  <p className="text-brand-400 text-sm">{data.topDriver.tripCount} completed trips</p>
                </div>
              ) : driverChartData[0] ? (
                <div className="mb-4">
                  <p className="text-dark-200 text-sm">Top driver by trips</p>
                  <p className="text-white text-xl font-bold">{driverChartData[0].name}</p>
                  <p className="text-brand-400 text-sm">{driverChartData[0].trips} completed trips</p>
                </div>
              ) : null}
              {data?.driverStats?.length > 0 ? (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Driver</th>
                        <th>Trips</th>
                        <th>Early</th>
                        <th>On time</th>
                        <th>Late</th>
                        <th>Avg delivery diff (mins)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.driverStats.map((d) => (
                        <tr key={d.driverId}>
                          <td><span className="text-white font-medium">{d.driverName}</span></td>
                          <td>{d.tripCount}</td>
                          <td><span className="text-success">{d.early}</span></td>
                          <td><span className="text-brand-400">{d.onTime}</span></td>
                          <td><span className="text-warning">{d.late}</span></td>
                          <td>{d.avgDeliveryDiffMinutes > 0 ? `+${d.avgDeliveryDiffMinutes}` : d.avgDeliveryDiffMinutes}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-dark-300">No driver stats yet</div>
              )}
            </div>
            {driverChartData.length > 0 && (
              <div>
                <p className="text-dark-200 text-sm mb-3">Trips by driver</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="name" stroke="#909296" fontSize={11} tickLine={false} />
                      <YAxis stroke="#909296" fontSize={12} tickLine={false} />
                      <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }} />
                      <Bar dataKey="trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Trips" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Early / on time / late */}
      <div className="glass-card-static p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.truck}</div>
          <div>
            <h2 className="text-lg font-semibold text-white">Trip delivery timing</h2>
            <p className="text-dark-200 text-sm">Early, on time, or late</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-dark-600/50 rounded-xl p-4 border border-success/20">
            <p className="text-dark-200 text-xs uppercase">Early</p>
            <p className="text-success text-2xl font-bold">{tripTiming.early}</p>
          </div>
          <div className="bg-dark-600/50 rounded-xl p-4 border border-brand-500/20">
            <p className="text-dark-200 text-xs uppercase">On time</p>
            <p className="text-brand-400 text-2xl font-bold">{tripTiming.onTime}</p>
          </div>
          <div className="bg-dark-600/50 rounded-xl p-4 border border-warning/20">
            <p className="text-dark-200 text-xs uppercase">Late</p>
            <p className="text-warning text-2xl font-bold">{tripTiming.late}</p>
          </div>
        </div>
        {(timingData.length > 0 || tripTiming.early + tripTiming.onTime + tripTiming.late > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={timingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={(e) => `${e.name}: ${e.value}`}>
                  {timingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 7 & 8. Region trips + region returns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.route}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Most active regions</h2>
              <p className="text-dark-200 text-sm">Routes by trip count</p>
            </div>
          </div>
          {regionTripsChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionTripsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="route" stroke="#909296" fontSize={11} tickLine={false} />
                  <YAxis stroke="#909296" fontSize={12} tickLine={false} />
                  <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(76, 110, 245, 0.08)' }} />
                  <Bar dataKey="count" fill="#4c6ef5" radius={[4, 4, 0, 0]} name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-dark-300">No region data yet</p>
          )}
        </div>
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.delivered}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Region returns</h2>
              <p className="text-dark-200 text-sm">Avg return (₹) per trip by route</p>
            </div>
          </div>
          {regionReturnsChartData.length > 0 ? (
            <>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionReturnsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="route" stroke="#909296" fontSize={11} tickLine={false} />
                    <YAxis stroke="#909296" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${(v / 1000)}k`} />
                    <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                      <div className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                        <p className="text-white text-sm">Avg: ₹{payload[0].value?.toLocaleString()}/trip</p>
                      </div>
                    ) : null} cursor={{ fill: 'rgba(34, 197, 94, 0.08)' }} />
                    <Bar dataKey="avgReturn" fill="#22c55e" radius={[4, 4, 0, 0]} name="Avg return (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {data?.highestReturnRegion ? (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-3">
                    <p className="text-dark-200 text-xs uppercase">Highest</p>
                    <p className="text-success font-bold text-sm truncate">{data.highestReturnRegion.route.replace('–', ' → ')}</p>
                    <p className="text-success">₹{data.highestReturnRegion.avgReturn?.toLocaleString()}</p>
                  </div>
                ) : regionReturnsChartData[0] ? (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-3">
                    <p className="text-dark-200 text-xs uppercase">Highest</p>
                    <p className="text-success font-bold text-sm truncate">{regionReturnsChartData[0].route}</p>
                    <p className="text-success">₹{regionReturnsChartData[0].avgReturn?.toLocaleString()}</p>
                  </div>
                ) : null}
                {data?.lowestReturnRegion ? (
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
                    <p className="text-dark-200 text-xs uppercase">Lowest</p>
                    <p className="text-warning font-bold text-sm truncate">{data.lowestReturnRegion.route.replace('–', ' → ')}</p>
                    <p className="text-warning">₹{data.lowestReturnRegion.avgReturn?.toLocaleString()}</p>
                  </div>
                ) : regionReturnsChartData.length > 0 ? (
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
                    <p className="text-dark-200 text-xs uppercase">Lowest</p>
                    <p className="text-warning font-bold text-sm truncate">{regionReturnsChartData[regionReturnsChartData.length - 1].route}</p>
                    <p className="text-warning">₹{regionReturnsChartData[regionReturnsChartData.length - 1].avgReturn?.toLocaleString()}</p>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <p className="text-dark-300">No region return data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransportDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<TransportDashboardHome />} />
        <Route path="trucks" element={<MyTrucks />} />
        <Route path="loads" element={<FindLoads />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
