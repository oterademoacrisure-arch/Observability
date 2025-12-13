import React from 'react';
import { Database, Globe, Server, ArrowRight, AlertTriangle, FileText, Share2 } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';

const TopologyView: React.FC = () => {
  const failureEvent = MOCK_EVENTS.find(e => e.event_type === 'report_generation_timeout');

  return (
    <div className="h-full flex flex-col p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Service Topology & Correlation</h2>
        <p className="text-slate-400">Tracing the path of failure: <span className="text-red-400">Report Generation Service (Critical)</span></p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Connection Lines (CSS Absolute for simplicity) */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
        
        <div className="flex justify-between w-full max-w-5xl">
          
          {/* Node 1: Client Application */}
          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center z-10 shadow-xl group-hover:border-indigo-500 transition-all">
              <Globe size={40} className="text-indigo-400" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold text-slate-200">Client Portal</h3>
              <p className="text-xs text-slate-500">Browser / Mobile</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] border border-green-500/20">200 OK</span>
            </div>
          </div>

          <ArrowRight className="text-slate-600 mt-10" size={32} />

          {/* Node 2: API Service (The one failing) */}
          <div className="flex flex-col items-center group relative">
             <div className="absolute -top-12 bg-red-500/10 border border-red-500 text-red-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                High Latency
             </div>
            <div className="w-24 h-24 bg-slate-900 rounded-full border-2 border-red-500 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <Server size={40} className="text-red-500" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold text-red-400">Report Service</h3>
              <p className="text-xs text-slate-500">AWS Fargate</p>
              <div className="mt-2 text-left bg-slate-800 p-2 rounded border border-slate-700 w-48">
                 <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                    <Share2 size={10} /> Datadog APM
                 </div>
                 <p className="text-[10px] text-slate-300 font-mono">Trace: {failureEvent?.context.trace_id}</p>
                 <p className="text-[10px] text-red-400 font-mono mt-1">Error: 504 Gateway Timeout</p>
              </div>
            </div>
          </div>

          <ArrowRight className="text-red-500 mt-10 animate-pulse" size={32} />

          {/* Node 3: Database (The Root Cause) */}
          <div className="flex flex-col items-center group">
            <div className="w-24 h-24 bg-slate-900 rounded-full border-2 border-red-600 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              <Database size={40} className="text-red-500" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold text-red-400">Postgres DB</h3>
              <p className="text-xs text-slate-500">prod-pg-reporting-04</p>
              
              <div className="mt-2 bg-red-950/30 border border-red-500/50 p-3 rounded-lg text-left w-64">
                 <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-xs font-bold text-red-200">Root Cause Detected</span>
                 </div>
                 <ul className="space-y-1">
                    <li className="text-[10px] text-red-300">• Lock Wait: 30.005s</li>
                    <li className="text-[10px] text-red-300">• Blocking PID: 4421 (ETL Job)</li>
                    <li className="text-[10px] text-red-300">• Overlap: Backup Window Active</li>
                 </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400"/> Contextual Logs (Combined)
         </h3>
         <div className="font-mono text-xs space-y-2">
            <div className="flex gap-4 border-b border-slate-700/50 pb-2">
               <span className="text-slate-500">14:32:01.005</span>
               <span className="text-blue-400 font-bold w-24">APP-LOG</span>
               <span className="text-slate-300">Request received for GenerateAnnualReport [TraceID: {failureEvent?.context.trace_id}]</span>
            </div>
            <div className="flex gap-4 border-b border-slate-700/50 pb-2 bg-red-900/10">
               <span className="text-slate-500">14:32:01.120</span>
               <span className="text-orange-400 font-bold w-24">DB-AUDIT</span>
               <span className="text-orange-200">Process 9981 waiting for AccessExclusiveLock on relation 18292 of database 16384. Blocking Process: 4421.</span>
            </div>
            <div className="flex gap-4 border-b border-slate-700/50 pb-2">
               <span className="text-slate-500">14:32:01.150</span>
               <span className="text-indigo-400 font-bold w-24">SCHEDULER</span>
               <span className="text-slate-300">Job [etl-daily-sync-01] is actively writing to [large_ledger_table].</span>
            </div>
            <div className="flex gap-4 pb-2 bg-red-900/10">
               <span className="text-slate-500">14:32:31.005</span>
               <span className="text-blue-400 font-bold w-24">APP-LOG</span>
               <span className="text-red-300">Error: 504 Gateway Timeout. Upstream database request failed.</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TopologyView;