import React, { useState } from 'react';
import { Settings, Database, Check, X, Search, Save, Server, Layers, Plus, Code, Network, Activity } from 'lucide-react';
import { DbEngine } from '../types';
import { ENGINE_COLORS } from '../constants';

// Simulated Registry Data based on the YAML requirement
const INITIAL_REGISTRY = [
  {
    id: DbEngine.SQLServer,
    name: "Microsoft SQL Server",
    version: "2017+",
    capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    active_strategy: "Hybrid (Hooks + DMVs)",
    config: {
      hooks: ["extended_events:deadlock_graph", "extended_events:lock_escalation", "agent_jobs"],
      views: ["sys.dm_exec_requests", "sys.dm_os_wait_stats"],
    }
  },
  {
    id: DbEngine.Postgres,
    name: "PostgreSQL",
    version: "12+",
    capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    active_strategy: "Logical Replication (WAL)",
    config: {
      hooks: ["logical_decode:wal2json", "event_triggers:ddl"],
      views: ["pg_stat_activity", "pg_stat_statements"],
    }
  },
  {
    id: DbEngine.Oracle,
    name: "Oracle Database",
    version: "19c",
    capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    active_strategy: "Log Miner + AWR",
    config: {
      hooks: ["dbms_alert", "scheduler_events"],
      views: ["v$active_session_history", "v$sql_monitor"],
    }
  },
  {
    id: DbEngine.Snowflake,
    name: "Snowflake",
    version: "Cloud",
    capabilities: { hooks: false, views: true, logs: true, provider_metrics: true },
    active_strategy: "Account Usage Views",
    config: {
      hooks: [],
      views: ["account_usage.query_history", "account_usage.warehouse_load_history"],
      provider_metrics: ["credits_used"]
    }
  },
  {
    id: DbEngine.CosmosDB,
    name: "Azure Cosmos DB",
    version: "NoSQL API",
    capabilities: { hooks: false, views: false, logs: true, provider_metrics: true },
    active_strategy: "Diagnostic Logs + Azure Monitor",
    config: {
      logs: ["diagnostic_logs", "partition_key_statistics"],
      provider_metrics: ["normalized_ru_consumption", "provisioned_throughput"]
    }
  },
  {
    id: DbEngine.DynamoDB,
    name: "AWS DynamoDB",
    version: "Cloud",
    capabilities: { hooks: false, views: false, logs: false, provider_metrics: true },
    active_strategy: "CloudWatch Metrics",
    config: {
      provider_metrics: ["consumed_read_capacity", "consumed_write_capacity", "throttled_requests"]
    }
  },
  {
    id: DbEngine.MongoDB,
    name: "MongoDB Enterprise",
    version: "6.0+",
    capabilities: { hooks: false, views: false, logs: true, provider_metrics: true },
    active_strategy: "Profiler + OpLog",
    config: {
      logs: ["audit_log", "profiler"],
      provider_metrics: ["opcounters", "connections"]
    }
  },
  {
    id: DbEngine.Redis,
    name: "Redis / ElastiCache",
    version: "7.0",
    capabilities: { hooks: false, views: true, logs: false, provider_metrics: true },
    active_strategy: "Info Command Polling",
    config: {
      views: ["INFO command", "SLOWLOG"],
      provider_metrics: ["curr_connections", "evicted_keys"]
    }
  },
  {
    id: DbEngine.MariaDB,
    name: "MariaDB / MySQL",
    version: "10.6+",
    capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    active_strategy: "Performance Schema",
    config: {
      views: ["performance_schema", "information_schema"],
      hooks: ["audit_plugin"]
    }
  },
  {
    id: DbEngine.Cassandra,
    name: "Apache Cassandra",
    version: "4.0",
    capabilities: { hooks: false, views: true, logs: true, provider_metrics: false },
    active_strategy: "JMX Metrics + System Logs",
    config: {
      views: ["system.local", "system.peers"],
      logs: ["debug.log", "gc.log"]
    }
  }
];

const RegistryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registry, setRegistry] = useState(INITIAL_REGISTRY);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = registry.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="text-indigo-400" /> Edge Adapter Registry
          </h2>
          <p className="text-slate-400 mt-1 max-w-2xl">
            Configure how the <strong>Edge Adapters</strong> collect data from each engine. 
            The system automatically selects the best ingestion path (Hooks, Logs, or Metrics) based on availability.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
             <input 
                type="text" 
                placeholder="Search supported engines..." 
                className="bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button 
             onClick={() => setShowAddModal(true)}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
           >
              <Plus size={18} /> Add Adapter
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-y-auto pb-8">
        {filtered.map((engine) => (
          <div key={engine.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
            {/* Strategy Indicator Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-800 via-indigo-500 to-slate-800 opacity-30 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-6 pl-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-slate-800 ${ENGINE_COLORS[engine.id] || 'text-slate-400'}`}>
                   {(engine.id === 'mongodb' || engine.id === 'redis' || engine.id === 'cassandra') ? <Layers size={24} /> : <Database size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{engine.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Ver: {engine.version}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-indigo-300 font-medium">
                       <Network size={12}/> {engine.active_strategy}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                 {/* Capability Badges */}
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${engine.capabilities.hooks ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-600 border-slate-700 opacity-50'}`}>
                    HOOKS
                 </div>
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${engine.capabilities.views ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-600 border-slate-700 opacity-50'}`}>
                    VIEWS
                 </div>
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${engine.capabilities.logs ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-600 border-slate-700 opacity-50'}`}>
                    LOGS
                 </div>
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${engine.capabilities.provider_metrics ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-600 border-slate-700 opacity-50'}`}>
                    METRICS
                 </div>
              </div>
            </div>

            {/* Configuration Section */}
            <div className="space-y-4 pl-4">
               {engine.capabilities.hooks && (
                 <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2 flex items-center gap-2">
                      <Server size={12}/> Active Hooks (Push)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {engine.config.hooks?.map((hook, idx) => (
                         <span key={idx} className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded border border-emerald-500/20">
                           {hook}
                         </span>
                       ))}
                    </div>
                 </div>
               )}

               {engine.capabilities.views && (
                 <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase mb-2 flex items-center gap-2">
                      <Search size={12}/> Polled Views (Pull)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {engine.config.views?.map((view, idx) => (
                         <span key={idx} className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20">
                           {view}
                         </span>
                       ))}
                    </div>
                 </div>
               )}

               {engine.capabilities.provider_metrics && (
                 <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2 flex items-center gap-2">
                       Provider Metrics (API)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {engine.config.provider_metrics?.map((metric, idx) => (
                         <span key={idx} className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/20">
                           {metric}
                         </span>
                       ))}
                    </div>
                 </div>
               )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center pl-4">
               <div className="flex items-center gap-2">
                  <Activity size={12} className="text-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400">Adapter Status: <strong>Online</strong></span>
               </div>
               <button className="text-xs text-indigo-400 hover:text-white underline">Edit Adapter JSON</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal Mock */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-xl">
           <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="text-indigo-400" /> Add New Engine Adapter
                 </h3>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Engine Name</label>
                    <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="e.g., Teradata, ClickHouse, DB2..." />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Capabilities</label>
                        <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded border border-slate-700">
                           <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" /> Hooks Enabled</label>
                           <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" /> View Polling</label>
                           <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" /> Log Ingestion</label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Config YAML/JSON</label>
                        <textarea className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-400" defaultValue={`{\n  "views": [\n    "sys.metrics",\n    "sys.query_log"\n  ]\n}`} />
                    </div>
                 </div>

                 <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded text-sm text-indigo-200 flex items-start gap-3">
                    <Code size={20} className="mt-0.5 shrink-0" />
                    <p>Bedrock Normalization uses the "Common Schema" principle. You do not need to define metric mappings manually; the LLM will infer them from the raw JSON payload of your new adapter.</p>
                 </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800">Cancel</button>
                 <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-500">Register Adapter</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default RegistryView;