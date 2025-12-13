import React from 'react';
import { Download, Terminal, CheckCircle, Package, Database, Key, ExternalLink, Info } from 'lucide-react';

const RequirementsView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Get Started Quickly</h2>
          <p className="text-indigo-200 max-w-xl">
            Deploy the observability agents and configure your environment in minutes using our CLI or manual artifacts.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-lg font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-3 transition-all hover:scale-105">
          <Download size={24} />
          <span>Download CLI v2.4.0</span>
          <span className="bg-indigo-700 text-xs px-2 py-0.5 rounded text-indigo-200">Stable</span>
        </button>
      </div>
      
      {/* Demo Disclaimer */}
      <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div>
           <h4 className="text-amber-400 font-bold text-sm">Demo Environment Notice</h4>
           <p className="text-amber-200/80 text-xs mt-1">
             This is a prototype interface. The CLI commands below are <strong>simulated examples</strong>. 
             Running <code>npm install -g @obsframe/cli</code> will fail as the package is hypothetical for this demo.
             In a production environment, this would point to your internal private registry (e.g., Artifactory/Verdaccio).
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* System Requirements */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} /> Prerequisites
          </h3>
          <ul className="space-y-4">
             <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-slate-800 rounded text-indigo-400"><Terminal size={18}/></div>
                <div>
                   <span className="block text-slate-200 font-medium">Node.js 18+ or Docker Runtime</span>
                   <span className="text-xs text-slate-500">Required for running the Normalization Service and Edge Adapters.</span>
                </div>
             </li>
             <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-slate-800 rounded text-indigo-400"><Database size={18}/></div>
                <div>
                   <span className="block text-slate-200 font-medium">Target Databases</span>
                   <span className="text-xs text-slate-500">Supported: SQL Server 2017+, Postgres 12+, Oracle 19c, Cosmos DB (SQL API).</span>
                </div>
             </li>
             <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="p-2 bg-slate-800 rounded text-indigo-400"><Key size={18}/></div>
                <div>
                   <span className="block text-slate-200 font-medium">GenAI Credentials</span>
                   <span className="text-xs text-slate-500">Google Gemini API Key (recommended for this demo) or AWS Bedrock Access Key.</span>
                </div>
             </li>
          </ul>
        </div>

        {/* Installation Steps */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Terminal className="text-blue-500" size={20} /> Quick Install (Example)
          </h3>
          <div className="space-y-6 flex-1">
             <div>
                <p className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide text-[10px]">1. Install the CLI tool</p>
                <div className="bg-black/40 p-3 rounded-lg border border-slate-700 font-mono text-sm text-emerald-400 flex justify-between items-center group">
                   <span>npm install -g @obsframe/cli</span>
                   <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-white text-xs bg-slate-800 px-2 py-1 rounded">copy</span>
                </div>
             </div>
             <div>
                <p className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide text-[10px]">2. Initialize configuration</p>
                <div className="bg-black/40 p-3 rounded-lg border border-slate-700 font-mono text-sm text-emerald-400">
                   obsframe init --provider=bedrock --region=us-east-1
                </div>
             </div>
             <div>
                <p className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide text-[10px]">3. Install Database Hooks</p>
                <div className="bg-black/40 p-3 rounded-lg border border-slate-700 font-mono text-sm text-emerald-400">
                   obsframe hooks install --target=sqlserver --host=prod-01
                </div>
             </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
             <a href="#" className="text-indigo-400 text-sm flex items-center gap-1 hover:text-indigo-300">
                View full documentation <ExternalLink size={12} />
             </a>
          </div>
        </div>
      </div>

      {/* Artifact Downloads */}
      <div>
         <h3 className="text-xl font-bold text-slate-200 mb-4">Manual Artifact Downloads</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group">
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
                     <Package className="text-slate-300 group-hover:text-indigo-300" size={24} />
                  </div>
                  <Download size={16} className="text-slate-500 group-hover:text-white" />
               </div>
               <h4 className="font-semibold text-slate-200">Docker Compose</h4>
               <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                 Deploy the full stack locally: Prometheus, Grafana, API, and the Normalization Service container.
               </p>
            </div>
            
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group">
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
                     <Database className="text-slate-300 group-hover:text-indigo-300" size={24} />
                  </div>
                  <Download size={16} className="text-slate-500 group-hover:text-white" />
               </div>
               <h4 className="font-semibold text-slate-200">SQL Hook Scripts</h4>
               <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                 Raw .sql files for Extended Events (SQL Server) and Event Triggers (Postgres) if you prefer manual setup.
               </p>
            </div>
            
             <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group">
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
                     <Database className="text-slate-300 group-hover:text-indigo-300" size={24} />
                  </div>
                  <Download size={16} className="text-slate-500 group-hover:text-white" />
               </div>
               <h4 className="font-semibold text-slate-200">Postgres WAL Config</h4>
               <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                 Configuration templates for <code>postgresql.conf</code> to enable logical replication for WAL2JSON.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RequirementsView;