import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import LiveFeed from './components/LiveFeed';
import AnalysisView from './components/AnalysisView';
import RequirementsView from './components/RequirementsView';
import TopologyView from './components/TopologyView';
import RegistryView from './components/RegistryView';
import { MOCK_EVENTS } from './constants';
import { ObservabilityEvent } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState<ObservabilityEvent[]>(MOCK_EVENTS);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  // Simulate incoming events
  useEffect(() => {
    const interval = setInterval(() => {
       // In a real app, this would fetch from an API or WebSocket
       // For demo, we just cycle the mock events or add a timestamp jitter
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (apiKeyMissing) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-red-900/20 border border-red-500 p-8 rounded-xl max-w-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h2>
            <p className="text-slate-300 mb-4">
              The <code>API_KEY</code> environment variable is missing. This application requires a valid Google Gemini API Key to function as the "Bedrock" AI layer.
            </p>
            <p className="text-sm text-slate-400">
              Please restart the application with the API key configured.
            </p>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'topology':
        return <TopologyView />;
      case 'live-feed':
        return <LiveFeed events={events} />;
      case 'anomalies':
        return <AnalysisView events={events} />;
      case 'requirements':
        return <RequirementsView />;
      case 'settings':
        return <RegistryView />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-500">
            Work in progress: {activeTab}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center px-8 justify-between backdrop-blur-sm z-10">
          <h1 className="text-xl font-semibold text-white capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Environment: <strong className="text-emerald-400">Production</strong></span>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold border-2 border-slate-800 ring-2 ring-indigo-500/20">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;