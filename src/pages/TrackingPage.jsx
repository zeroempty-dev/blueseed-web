import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import { getShipments, getTracking } from '../services/api';

export default function TrackingPage() {
  const [shipments, setShipmentsList] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingData, setTrackingData] = useState(null);

  useEffect(() => {
    getShipments().then(data => {
      setShipmentsList(data);
      if (data.length > 0) setSelectedShipment(data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedShipment) return;

    const fetchTracking = () => {
      getTracking(selectedShipment.id).then(setTrackingData).catch(() => {});
    };
    fetchTracking();
    const interval = setInterval(fetchTracking, 3000);
    return () => clearInterval(interval);
  }, [selectedShipment]);

  return (
    <DashboardLayout>
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Live Tracking</h1>
          <p className="text-dark-200 text-sm mt-1">Track shipments in real-time</p>
        </div>

        {/* Shipment selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {shipments.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedShipment(s)}
              className={`glass-card p-3 cursor-pointer transition-all ${
                selectedShipment?.id === s.id ? 'border-brand-500/40 bg-brand-600/10' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🚛</span>
                <div>
                  <p className="text-white text-sm font-medium">{s.pickupCity} → {s.dropCity}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            </button>
          ))}
          {shipments.length === 0 && (
            <div className="glass-card-static p-8 w-full text-center">
              <p className="text-dark-300">No active shipments to track</p>
            </div>
          )}
        </div>

        {/* Map */}
        {trackingData && (
          <div className="glass-card-static overflow-hidden mb-6">
            <MapView
              pickupCoords={trackingData.pickup}
              dropCoords={trackingData.drop}
              truckCoords={trackingData.currentPosition}
              height="500px"
            />
          </div>
        )}

        {/* Tracking details */}
        {trackingData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <p className="text-dark-200 text-xs uppercase tracking-wider mb-2">Pickup</p>
              <p className="text-white font-semibold text-lg">{trackingData.pickup.city}</p>
              <p className="text-dark-300 text-xs mt-1">
                {trackingData.pickup.lat.toFixed(4)}°N, {trackingData.pickup.lng.toFixed(4)}°E
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="text-dark-200 text-xs uppercase tracking-wider mb-2">Current Progress</p>
              <p className="text-brand-400 font-bold text-3xl">{Math.round(trackingData.progress * 100)}%</p>
              <div className="w-full bg-dark-600 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full gradient-blue transition-all duration-1000"
                  style={{ width: `${trackingData.progress * 100}%` }}
                />
              </div>
            </div>
            <div className="glass-card p-5">
              <p className="text-dark-200 text-xs uppercase tracking-wider mb-2">Drop</p>
              <p className="text-white font-semibold text-lg">{trackingData.drop.city}</p>
              <p className="text-dark-300 text-xs mt-1">
                {trackingData.drop.lat.toFixed(4)}°N, {trackingData.drop.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
