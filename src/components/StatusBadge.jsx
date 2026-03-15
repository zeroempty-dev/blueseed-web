const statusConfig = {
  'posted':     { label: 'Posted',     color: 'status-posted' },
  'matched':    { label: 'Matched',    color: 'status-matched' },
  'picked-up':  { label: 'Picked Up',  color: 'status-picked-up' },
  'in-transit': { label: 'In Transit', color: 'status-in-transit' },
  'delivered':  { label: 'Delivered',  color: 'status-delivered' },
  'available':  { label: 'Available',  color: 'status-posted' },
  'assigned':   { label: 'Assigned',   color: 'status-matched' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, color: '' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {config.label}
    </span>
  );
}
