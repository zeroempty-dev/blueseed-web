import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { DashboardIcons } from '../components/icons';
import AnalyticsPage from './AnalyticsPage';
import {
  getAdminStats, getAdminTrucks, getAdminBusinesses,
  getAdminDrivers, verifyTruck, verifyBusiness, getLoads,
} from '../services/api';

function AdminHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-dark-300 animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-200 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DashboardIcons.truck} label="Total Trucks"  value={stats.totalTrucks}  gradient="gradient-blue"   delay="delay-100" />
        <StatCard icon={DashboardIcons.package} label="Active Loads"   value={stats.activeLoads}   gradient="gradient-amber"  delay="delay-200" />
        <StatCard icon={DashboardIcons.delivered} label="Delivered"       value={stats.completedDeliveries} gradient="gradient-green" delay="delay-300" />
        <StatCard icon={DashboardIcons.route} label="Active Trips"   value={stats.activeTrips}   gradient="gradient-purple" delay="delay-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DashboardIcons.driver} label="Drivers"       value={stats.totalDrivers}     gradient="gradient-teal"  />
        <StatCard icon={DashboardIcons.business} label="Businesses"    value={stats.totalBusinesses}  gradient="gradient-red"   />
        <StatCard icon={DashboardIcons.posted} label="Posted Loads"   value={stats.postedLoads}     gradient="gradient-blue"  />
        <StatCard icon={DashboardIcons.matched} label="Matched Loads"  value={stats.matchedLoads}    gradient="gradient-amber" />
      </div>
    </div>
  );
}

function AdminTrucks() {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    getAdminTrucks().then(setTrucks);
  }, []);

  const handleVerify = async (id) => {
    await verifyTruck(id);
    getAdminTrucks().then(setTrucks);
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">All Trucks</h2>
      <div className="glass-card-static overflow-hidden">
        <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Truck Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Route</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map(truck => (
              <tr key={truck.id}>
                <td className="text-white font-semibold">{truck.truckNumber}</td>
                <td>{truck.truckType}</td>
                <td>{truck.capacity}T</td>
                <td>
                  <span className="text-brand-400">{truck.currentCity}</span>
                  <span className="text-dark-400 mx-1">→</span>
                  <span className="text-brand-400">{truck.destinationCity}</span>
                </td>
                <td><StatusBadge status={truck.status} /></td>
                <td>
                  {truck.verified ? (
                    <span className="text-success text-sm">✓ Verified</span>
                  ) : (
                    <span className="text-warning text-sm">⏳ Pending</span>
                  )}
                </td>
                <td>
                  {!truck.verified && (
                    <button onClick={() => handleVerify(truck.id)} className="btn-success text-xs py-1 px-3">
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    getAdminBusinesses().then(setBusinesses);
  }, []);

  const handleVerify = async (id) => {
    await verifyBusiness(id);
    getAdminBusinesses().then(setBusinesses);
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">All Businesses</h2>
      <div className="glass-card-static overflow-hidden">
        <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>GST Number</th>
              <th>City</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map(biz => (
              <tr key={biz.id}>
                <td className="text-white font-semibold">{biz.name}</td>
                <td className="font-mono text-xs">{biz.gst}</td>
                <td>{biz.city}</td>
                <td>
                  {biz.verified ? (
                    <span className="text-success text-sm">✓ Verified</span>
                  ) : (
                    <span className="text-warning text-sm">⏳ Pending</span>
                  )}
                </td>
                <td>
                  {!biz.verified && (
                    <button onClick={() => handleVerify(biz.id)} className="btn-success text-xs py-1 px-3">
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function AdminLoads() {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    getLoads().then(setLoads);
  }, []);

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">All Loads</h2>
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
              <th>Truck</th>
            </tr>
          </thead>
          <tbody>
            {loads.map(load => (
              <tr key={load.id}>
                <td>
                  <span className="text-white">{load.pickupCity}</span>
                  <span className="text-dark-300 mx-2">→</span>
                  <span className="text-white">{load.dropCity}</span>
                </td>
                <td>{load.cargoType}</td>
                <td>{load.weight}T</td>
                <td className="text-brand-400 font-semibold">₹{load.price.toLocaleString()}</td>
                <td><StatusBadge status={load.status} /></td>
                <td>{load.matchedTruckId || <span className="text-dark-400">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="trucks" element={<AdminTrucks />} />
        <Route path="businesses" element={<AdminBusinesses />} />
        <Route path="loads" element={<AdminLoads />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
