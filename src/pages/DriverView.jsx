import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import MapView from '../components/MapView';
import { DashboardIcons } from '../components/icons';
import { getShipments, updateShipmentStatus, getTracking } from '../services/api';

const statusFlow = [
  { status: 'matched',    label: 'Matched',    icon: DashboardIcons.matched },
  { status: 'picked-up',  label: 'Picked Up',  icon: DashboardIcons.package },
  { status: 'in-transit',  label: 'In Transit', icon: DashboardIcons.inTransit },
  { status: 'delivered',  label: 'Delivered',  icon: DashboardIcons.delivered },
];

const statusActions = {
  'matched':   { next: 'picked-up',  label: 'Reached Pickup', btnClass: 'btn-primary' },
  'picked-up': { next: 'in-transit', label: 'Start Transit',  btnClass: 'btn-primary' },
  'in-transit':{ next: 'delivered',  label: 'Mark Delivered',  btnClass: 'btn-success' },
};

export default function DriverView() {
  const { user } = useAuth();
  const [shipments, setShipmentsList] = useState([]);
  const [activeShipment, setActiveShipment] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // For demo, get all shipments and find driver's
    getShipments().then(data => {
      setShipmentsList(data);
      // Auto-select first one for demo
      if (data.length > 0) {
        setActiveShipment(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeShipment) return;

    const fetchTracking = () => {
      getTracking(activeShipment.id).then(setTrackingData).catch(() => {});
    };
    fetchTracking();
    const interval = setInterval(fetchTracking, 3000);
    return () => clearInterval(interval);
  }, [activeShipment]);

  const handleStatusUpdate = async (newStatus) => {
    if (!activeShipment) return;
    setUpdating(true);
    try {
      const updated = await updateShipmentStatus(activeShipment.id, newStatus);
      setActiveShipment(updated);
      getShipments().then(setShipmentsList);
    } catch (err) {
      console.error(err);
    }
    setUpdating(false);
  };

  const action = activeShipment ? statusActions[activeShipment.status] : null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Trip</h1>
          <p className="text-dark-200 text-sm mt-1">View your assigned trip and update status</p>
        </div>

        {!activeShipment ? (
          <div className="glass-card-static p-12 text-center">
            <div className="mb-3 text-dark-400 [&_svg]:w-12 [&_svg]:h-12">{DashboardIcons.route}</div>
            <p className="text-white text-lg font-semibold">No Active Trip</p>
            <p className="text-dark-300 mt-1">You'll see your assigned trip here</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            {/* Trip card */}
            <div className="glass-card-static p-5">
              <div className="flex items-center justify-between mb-4">
                <StatusBadge status={activeShipment.status} />
                <span className="text-dark-300 text-xs font-mono">{activeShipment.id}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="mb-1 text-brand-400 [&_svg]:w-8 [&_svg]:h-8">{DashboardIcons.package}</div>
                  <p className="text-white font-semibold">{activeShipment.pickupCity}</p>
                  <p className="text-dark-300 text-xs">Pickup</p>
                </div>
                <div className="flex-1 w-full sm:w-auto border-t-2 border-dashed border-dark-400 relative min-h-[2px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                    <span className="[&_svg]:w-6 [&_svg]:h-6">{DashboardIcons.truck}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-brand-400 [&_svg]:w-8 [&_svg]:h-8">{DashboardIcons.pickup}</div>
                  <p className="text-white font-semibold">{activeShipment.dropCity}</p>
                  <p className="text-dark-300 text-xs">Drop</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-dark-600 rounded-full h-2 mb-1">
                <div
                  className="h-2 rounded-full gradient-blue transition-all duration-1000"
                  style={{ width: `${(activeShipment.progress || 0) * 100}%` }}
                />
              </div>
              <p className="text-dark-300 text-xs text-right">{Math.round((activeShipment.progress || 0) * 100)}%</p>
            </div>

            {/* Status pipeline */}
            <div className="glass-card-static p-5">
              <p className="text-dark-200 text-xs font-medium uppercase tracking-wider mb-3">Status Pipeline</p>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-0">
                {statusFlow.map((step, i) => {
                  const currentIdx = statusFlow.findIndex(s => s.status === activeShipment.status);
                  const isActive = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.status} className="flex-1 min-w-[60px] flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all [&_svg]:w-5 [&_svg]:h-5 ${
                        isCurrent ? 'gradient-blue shadow-lg shadow-brand-600/30 scale-110' :
                        isActive ? 'bg-brand-600/20' : 'bg-dark-600'
                      }`}>
                        {step.icon}
                      </div>
                      <p className={`text-xs ${isActive ? 'text-white font-medium' : 'text-dark-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            {trackingData && (
              <div className="glass-card-static overflow-hidden">
                <MapView
                  pickupCoords={trackingData.pickup}
                  dropCoords={trackingData.drop}
                  truckCoords={trackingData.currentPosition}
                  height="300px"
                />
              </div>
            )}

            {/* Action button */}
            {action && (
              <button
                onClick={() => handleStatusUpdate(action.next)}
                disabled={updating}
                className={`${action.btnClass} w-full justify-center py-4 text-base`}
              >
                {updating ? 'Updating...' : action.label}
              </button>
            )}

            {activeShipment.status === 'delivered' && (
              <div className="glass-card-static p-6 text-center bg-success/5 border-success/20">
                <div className="mb-2 text-success [&_svg]:w-12 [&_svg]:h-12">{DashboardIcons.delivered}</div>
                <p className="text-success text-lg font-bold">Trip Completed!</p>
                <p className="text-dark-200 text-sm mt-1">Great job! The load has been delivered.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
