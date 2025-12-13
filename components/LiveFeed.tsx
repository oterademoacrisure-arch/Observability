import React, { useState } from 'react';
import { ObservabilityEvent, DbEngine } from '../types';
import { ENGINE_COLORS } from '../constants';
import { Terminal, Cpu, ArrowRight } from 'lucide-react';
import { normalizeEventWithAi } from '../services/geminiService';

interface LiveFeedProps {
  events: ObservabilityEvent[];
}

const LiveFeed: React.FC<LiveFeedProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<ObservabilityEvent | null>(null);
  const [normalizedView, setNormalizedView] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleNormalize = async (evt: ObservabilityEvent) => {
    setLoading(true);
    const result = await normalizeEventWithAi(evt);
    setNormalizedView(result);
    setLoading(false);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Feed List */}
      <div className="w-1/2 flex flex-col gap-4 overflow-y-auto pr-2">
        <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
          <Terminal size={18} /> Raw Event Stream (Hook-First)
        </h2>
        {events.map((evt) => (
          <div
            key={evt.raw_event_id}
            onClick={() => { setSelectedEvent(evt); setNormalizedView(null); }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedEvent?.raw_event_id === evt.raw_event_id
                ? 'bg-slate-800 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${ENGINE_COLORS[evt.context.db_system] || 'text-slate-400'}`}>
                {evt.context.db_system}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h3 className="text-slate-200 font-medium">{evt.event_type}</h3>
            <div className="flex gap-2 mt-2 text-xs text-slate-500">
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{evt.context.db_instance}</span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">{evt.context.region}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Inspector */}
      <div className="w-1/2 bg-slate-900 rounded-xl border border-slate-700 p-6 flex flex-col h-full overflow-hidden">
        {!selectedEvent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Terminal size={48} className="mb-4 opacity-50" />
            <p>Select an event to inspect payload</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-100">Event Inspector</h3>
              <button
                onClick={() => handleNormalize(selectedEvent)}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <Cpu size={16} />
                )}
                Run Bedrock Normalizer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Raw JSON */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw Payload</h4>
                <pre className="bg-black/50 p-4 rounded-lg text-xs text-green-400 font-mono overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>

              {/* Normalized Output */}
              {normalizedView && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight size={14} className="text-indigo-400" />
                    <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Normalized Metric (Bedrock)</h4>
                  </div>
                  
                  <div className="bg-indigo-950/30 p-4 rounded-lg border border-indigo-500/30">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-slate-500 block">Metric Name</span>
                        <span className="text-sm font-mono text-white">{normalizedView.metric_name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Value</span>
                        <span className="text-sm font-mono text-white">{normalizedView.value} {normalizedView.unit}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-xs text-slate-500 block mb-1">Enrichment</span>
                      <p className="text-sm text-slate-300 italic">"{normalizedView.ai_enrichment}"</p>
                    </div>

                    <pre className="bg-black/30 p-3 rounded text-[10px] text-slate-400 font-mono">
                      {JSON.stringify(normalizedView.tags, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveFeed;