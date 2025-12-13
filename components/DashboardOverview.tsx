import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart } from 'recharts';
import MetricCard from './MetricCard';
import { ServerCrash, Zap, Clock, AlertOctagon, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { MOCK_EVENTS, ENGINE_COLORS } from '../constants';
import { DbEngine } from '../types';

// Data simulating "Report Failed due to Heavy Load" scenario
const DATA_PERFORMANCE = [
  { time: '14:00', latency_ms: 200, rollbacks: 0, throughput: 1200 },
  { time: '14:10', latency_ms: 250, rollbacks: 1, throughput: 1250 },
  { time: '14:20', latency_ms: 300, rollbacks: 0, throughput: 1300 },
  { time: '14:30', latency_ms: 1800, rollbacks: 12, throughput: 900 }, // Spike starts (ETL start)
  { time: '14:40', latency_ms: 4500, rollbacks: 45, throughput: 400 }, // Heavy contention
  { time: '14:50', latency_ms: 1200, rollbacks: 5, throughput: 800 },  // Recovery
];

// Data simulating Overlap: Backup Window vs ETL Job vs RU Usage
const DATA_OVERLAP = [
  { time: '14:00', ru_usage: 40, etl_active: 0, backup_active: 0 },
  { time: '14:15', ru_usage: 45, etl_active: 0, backup_active: 0 },
  { time: '14:30', ru_usage: 85, etl_active: 100, backup_active: 0 }, // ETL Starts
  { time: '14:45', ru_usage: 95, etl_active: 100, backup_active: 100 }, // Backup Starts (OVERLAP)
  { time: '15:00', ru_usage: 60, etl_active: 0, backup_active: 100 },
];

// Simulated Status for the 10+ Databases in the fleet
const FLEET_STATUS = [
  { id: 'sql-01', name: 'Billing SQL', engine: DbEngine.SQLServer, status: 'critical', load: 92 },
  { id: 'pg-04', name: 'Reports PG', engine: DbEngine.Postgres, status: 'critical', load: 88 },
  { id: 'ora-09', name: 'Legacy Oracle', engine: DbEngine.Oracle, status: 'warning', load: 75 },
  { id: 'sf-01', name: 'Data Warehouse', engine: DbEngine.Snowflake, status: 'warning', load: 60 },
  { id: 'cos-02', name: 'Global Cosmos', engine: DbEngine.CosmosDB, status: 'healthy', load: 45 },
  { id: 'ddb-01', name: 'User Sessions', engine: DbEngine.DynamoDB, status: 'healthy', load: 30 },
  { id: 'mongo-01', name: 'Catalog API', engine: DbEngine.MongoDB, status: 'critical', load: 98 },
  { id: 'redis-01', name: 'Cart Cache', engine: DbEngine.Redis, status: 'warning', load: 85 },
  { id: 'maria-01', name: 'Web CMS', engine: DbEngine.MariaDB, status: 'healthy', load: 20 },
  { id: 'cass-01', name: 'IoT Events', engine: DbEngine.Cassandra, status: 'healthy', load: 35 },
];

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-2">
         <h2 className="text-xl font-bold text-slate-200">Unified Observability Center</h2>
         <span className="text-xs text-slate-500">Monitored Instances: 142 • Active Alarms: 7</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Avg Query Latency" 
          value="450ms" 
          trend="+210ms" 
          trendUp={false} 
          icon={<Clock size={20}/>} 
          color="bg-slate-900"
        />
        <MetricCard 
          title="Rollbacks / min" 
          value={45} 
          trend="+40" 
          trendUp={false} 
          icon={<ServerCrash size={20}/>}
          color="bg-rose-900/20"
        />
        <MetricCard 
          title="Deadlocks / Blk" 
          value={14} 
          trend="High" 
          trendUp={false} 
          icon={<AlertOctagon size={20}/>} 
          color="bg-red-900/10"
        />
         <MetricCard 
          title="Snowflake Credits" 
          value="1450" 
          trend="97% Used"
          trendUp={false}
          icon={<Zap size={20}/>} 
          color="bg-sky-900/20"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Row 2: Fleet Health Matrix (New) */}
        <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Database size={18} className="text-indigo-400" /> Fleet Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {FLEET_STATUS.map((db) => (
              <div key={db.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 flex flex-col gap-2">
                 <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-300 truncate">{db.name}</span>
                    {db.status === 'healthy' && <CheckCircle size={14} className="text-emerald-500" />}
                    {db.status === 'warning' && <AlertTriangle size={14} className="text-amber-500" />}
                    {db.status === 'critical' && <AlertOctagon size={14} className="text-red-500" />}
                 </div>
                 <div className="flex justify-between items-end">
                    <span className={`text-[10px] uppercase font-bold ${ENGINE_COLORS[db.engine]}`}>{db.engine}</span>
                    <span className="text-xs font-mono text-slate-400">{db.load}% Load</span>
                 </div>
                 {/* Mini Load Bar */}
                 <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full ${db.status === 'critical' ? 'bg-red-500' : db.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${db.load}%` }}
                    ></div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Performance Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200">Incident Analysis: Postgres Timeout</h3>
                <p className="text-xs text-slate-400">Correlates query slowness with transaction failures</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> Throughput</span>
                <span className="flex items-center gap-1 text-rose-500"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Rollbacks</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DATA_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                  <Area yAxisId="left" type="monotone" dataKey="latency_ms" stroke="#8b5cf6" fillOpacity={0.1} fill="#8b5cf6" />
                  <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Bar yAxisId="right" dataKey="rollbacks" fill="#f43f5e" barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
           {/* Overlap Detection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1">
            <h3 className="text-lg font-bold text-slate-200 mb-2">Resource Overlap: Backup vs ETL</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_OVERLAP}>
                  <defs>
                    <linearGradient id="colorEtl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                  <Area type="step" dataKey="etl_active" stackId="1" stroke="#f59e0b" fill="url(#colorEtl)" name="ETL Job" />
                  <Area type="step" dataKey="backup_active" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Backup Window" />
                  <Line type="monotone" dataKey="ru_usage" stroke="#ef4444" strokeWidth={2} dot={false} name="RU %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;