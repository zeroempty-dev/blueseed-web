export default function StatCard({ icon, label, value, gradient = 'gradient-blue', delay = '' }) {
  return (
    <div className={`glass-card p-6 animate-fade-in-up ${delay}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-200 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-white text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center text-white [&_svg]:shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
