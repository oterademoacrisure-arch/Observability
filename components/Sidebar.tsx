import React from 'react';
import { LayoutDashboard, Activity, AlertTriangle, Settings, Database, Server, Download, Network } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Unified Metrics', icon: LayoutDashboard },
    { id: 'topology', label: 'APM Topology', icon: Network },
    { id: 'live-feed', label: 'Live Hooks', icon: Activity },
    { id: 'anomalies', label: 'RCA & Insights', icon: AlertTriangle },
    { id: 'requirements', label: 'Install & Req', icon: Download },
    { id: 'settings', label: 'Registry', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Server className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">ObsFrame</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Bedrock-Powered</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-300">System Healthy</span>
          </div>
          <p className="text-[10px] text-slate-500">Adapters Connected: 142</p>
          <p className="text-[10px] text-slate-500">Events/sec: 2.4k</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;