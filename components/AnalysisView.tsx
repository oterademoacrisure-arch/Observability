import React, { useState } from 'react';
import { ObservabilityEvent, RcaResult, PreIntimationResult, Severity } from '../types';
import { generateRcaWithAi, generatePreIntimationWithAi } from '../services/geminiService';
import { AlertTriangle, BrainCircuit, CheckCircle, Mail, Clock, Activity } from 'lucide-react';

interface AnalysisViewProps {
  events: ObservabilityEvent[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ events }) => {
  const [activeTab, setActiveTab] = useState<'rca' | 'pre-intimation'>('rca');
  const [selectedForRca, setSelectedForRca] = useState<ObservabilityEvent | null>(events[0] || null);
  const [rcaResult, setRcaResult] = useState<RcaResult | null>(null);
  const [preIntimation, setPreIntimation] = useState<PreIntimationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunRca = async () => {
    if (!selectedForRca) return;
    setLoading(true);
    const result = await generateRcaWithAi(selectedForRca);
    setRcaResult(result);
    setLoading(false);
  };

  const handleRunPreIntimation = async () => {
    setLoading(true);
    const result = await generatePreIntimationWithAi(events);
    setPreIntimation(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('rca')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'rca' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Automated RCA
        </button>
        <button
          onClick={() => setActiveTab('pre-intimation')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pre-intimation' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Pre-Intimation (Predictive)
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'rca' ? (
          <div className="flex h-full gap-6">
            <div className="w-1/3 overflow-y-auto pr-2">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">Select Anomaly</h3>
              {events.map((evt) => (
                <div
                  key={evt.raw_event_id}
                  onClick={() => { setSelectedForRca(evt); setRcaResult(null); }}
                  className={`p-4 mb-3 rounded-lg border cursor-pointer transition-all ${
                    selectedForRca?.raw_event_id === evt.raw_event_id
                      ? 'bg-slate-800 border-indigo-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {evt.severity === Severity.Critical ? (
                      <AlertTriangle size={14} className="text-red-500" />
                    ) : (
                      <Activity size={14} className="text-yellow-500" />
                    )}
                    <span className="font-medium text-slate-200">{evt.event_type}</span>
                  </div>
                  <p className="text-xs text-slate-500">{evt.context.db_instance} • {new Date(evt.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>

            <div className="w-2/3 bg-slate-900 border border-slate-700 rounded-xl p-6 overflow-y-auto">
              {!rcaResult ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <BrainCircuit size={64} className="text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-300 mb-2">AI-Driven Root Cause Analysis</h3>
                  <p className="text-slate-500 max-w-md mb-6">
                    Bedrock will analyze the anomaly context, locks, logs, and metrics to generate a hypothesis and remediation plan.
                  </p>
                  <button
                    onClick={handleRunRca}
                    disabled={loading || !selectedForRca}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? 'Analyzing...' : 'Generate RCA'}
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Analysis Result</h2>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-mono border border-green-500/30">
                      Confidence: {(rcaResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-indigo-500">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase mb-1">Summary</h4>
                      <p className="text-slate-200">{rcaResult.summary}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">Hypothesis</h4>
                      <p className="text-slate-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-slate-800">
                        {rcaResult.hypothesis}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                         <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">Remediation Steps</h4>
                         <ul className="space-y-2">
                           {rcaResult.remediation_steps.map((step, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                               <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                               {step}
                             </li>
                           ))}
                         </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">Affected Objects</h4>
                        <div className="flex flex-wrap gap-2">
                          {rcaResult.affected_objects.map((obj, i) => (
                            <span key={i} className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20 text-xs font-mono">
                              {obj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-900 border border-slate-700 rounded-xl p-6 overflow-y-auto">
            {/* PRE INTIMATION VIEW */}
            {!preIntimation ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Clock size={64} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">Predictive Risk Assessment</h3>
                <p className="text-slate-500 max-w-md mb-6 text-center">
                  Analyze current trends against scheduled ETL/Backup windows to predict incidents before they happen.
                </p>
                <button
                  onClick={handleRunPreIntimation}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  {loading ? 'Forecasting...' : 'Run Prediction Model'}
                </button>
              </div>
            ) : (
               <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                 <div className="bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 mb-8">
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h2 className="text-2xl font-bold text-white mb-2">Risk Detected: High</h2>
                       <p className="text-purple-300">Potential overlap detected in upcoming window.</p>
                     </div>
                     <div className="text-right">
                       <span className="text-5xl font-black text-white">{preIntimation.risk_score.toFixed(2)}</span>
                       <span className="block text-xs text-purple-400 uppercase tracking-widest mt-1">Risk Score</span>
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mb-6">
                     <div className="bg-black/20 p-4 rounded-lg">
                       <span className="text-xs text-slate-500 uppercase block">Start Window</span>
                       <span className="text-white font-mono">{new Date(preIntimation.risk_window_start).toLocaleTimeString()}</span>
                     </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                       <span className="text-xs text-slate-500 uppercase block">End Window</span>
                       <span className="text-white font-mono">{new Date(preIntimation.risk_window_end).toLocaleTimeString()}</span>
                     </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                       <span className="text-xs text-slate-500 uppercase block">Driver</span>
                       <span className="text-white text-sm">{preIntimation.drivers[0]}</span>
                     </div>
                   </div>

                    {/* Email Simulation */}
                   <div className="bg-slate-100 rounded-lg p-1 shadow-lg max-w-2xl mx-auto">
                     <div className="bg-white rounded text-slate-900 p-6">
                        <div className="border-b pb-4 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Mail className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Via SES</p>
                            <h4 className="font-bold text-lg leading-tight">{preIntimation.email_subject}</h4>
                          </div>
                        </div>
                        <div className="prose prose-sm text-slate-700 whitespace-pre-line">
                          {preIntimation.email_body}
                        </div>
                        <div className="mt-6 pt-4 border-t flex gap-2">
                           <button className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700">Approve Auto-Scaling</button>
                           <button className="bg-white border border-slate-300 text-slate-700 text-xs px-3 py-1.5 rounded hover:bg-slate-50">Pause ETL Job</button>
                        </div>
                     </div>
                   </div>
                 </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;