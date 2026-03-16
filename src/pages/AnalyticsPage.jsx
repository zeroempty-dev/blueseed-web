import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardIcons } from '../components/icons';
import { getAnalytics } from '../services/api';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics(user.id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
        <div className="glass-card p-12 text-center text-dark-300">Loading analytics...</div>
      </div>
    );
  }

  const usageItems = data?.platformUsage?.items ?? [];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-dark-200 mt-1">Your usage, platform availability, activity log, and service interruptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your usage */}
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.analytics}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Your usage</h2>
              <p className="text-dark-200 text-sm">Platform activity this month</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {usageItems.map((item, i) => (
              <div key={i} className="bg-dark-600/50 rounded-lg p-3">
                <p className="text-dark-200 text-xs">{item.label}</p>
                <p className="text-white font-bold">{item.value ?? 0}</p>
              </div>
            ))}
            {usageItems.length === 0 && (
              <p className="text-dark-300 col-span-2">No usage data yet</p>
            )}
          </div>
        </div>

        {/* Platform availability */}
        <div className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.clock}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Platform availability</h2>
              <p className="text-dark-200 text-sm">Service status and uptime</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-success text-3xl font-bold">{data?.platformAvailability?.uptimePercent ?? 99.9}%</span>
            <span className="text-dark-200 text-sm">uptime</span>
          </div>
          <p className="text-success text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            {data?.platformAvailability?.message ?? 'All systems operational'}
          </p>
        </div>

        {/* Activity log */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.activity}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Activity log</h2>
              <p className="text-dark-200 text-sm">Recent actions on your account</p>
            </div>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto">
            {data?.recentActivity?.length > 0 ? (
              <ul className="space-y-3">
                {data.recentActivity.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-dark-400 shrink-0">{new Date(a.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <div>
                      <p className="text-white font-medium">{a.action}</p>
                      <p className="text-dark-300 text-xs">{a.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-dark-300 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* Service interruptions */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center text-white [&_svg]:w-5 [&_svg]:h-5">{DashboardIcons.alert}</div>
            <div>
              <h2 className="text-lg font-semibold text-white">Service interruptions</h2>
              <p className="text-dark-200 text-sm">Past maintenance and outages</p>
            </div>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto">
            {data?.serviceInterruptions?.length > 0 ? (
              <ul className="space-y-3">
                {data.serviceInterruptions.map((inc, i) => (
                  <li key={i} className="flex flex-col gap-1 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium">{inc.type}</span>
                      <span className="text-dark-400 text-xs">{inc.date} • {inc.duration}</span>
                    </div>
                    <p className="text-dark-300 text-xs">{inc.impact}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-dark-300 text-sm">No recent interruptions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
