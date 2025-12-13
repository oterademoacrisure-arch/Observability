import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, trendUp, icon, color = 'bg-slate-800' }) => {
  return (
    <div className={`${color} p-6 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        </div>
        {icon && <div className="p-3 bg-slate-700/50 rounded-lg text-slate-300">{icon}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend}
          </span>
          <span className="text-slate-500 text-xs">vs last hour</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;