import { GoogleGenAI } from "@google/genai";
import { ObservabilityEvent, NormalizedMetric, RcaResult, PreIntimationResult } from '../types';

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const normalizeEventWithAi = async (event: ObservabilityEvent): Promise<NormalizedMetric> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are the Bedrock Normalization Service for a Database Observability Framework.
      
      PRINCIPLE: "Common Schema, Not Common SQL". 
      Map heterogeneous raw events (SQL, NoSQL, Cache) to these specific Metric Families:
      - db_query_perf_latency_seconds
      - db_concurrency_deadlocks_count
      - db_transaction_rollbacks_count (For rollback spikes)
      - db_throughput_ops_per_second
      - db_storage_bytes_used
      - db_replication_lag_seconds
      - db_cost_credits_used_total (Snowflake)
      - db_ru_usage_total (Cosmos/Dynamo)
      - db_backup_overlap_detected (0 or 1 - For Backup/ETL conflicts)
      - db_connection_count (Mongo/Postgres)
      - db_cache_evictions_total (Redis)
      - db_cpu_utilization_percent (Generic - e.g. for Heavy Join spikes)
      
      Input Event JSON:
      ${JSON.stringify(event)}

      Task:
      1. Normalize 'event_type' to one of the Metric Families above.
      2. Extract numeric 'value'.
      3. Flatten context into 'tags' (include trace_id for APM correlation).
      
      Output JSON Schema:
      {
        "metric_name": "string",
        "value": number,
        "unit": "string",
        "tags": { "key": "string" },
        "original_event_id": "string",
        "ai_enrichment": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    return JSON.parse(text || '{}') as NormalizedMetric;
  } catch (error) {
    console.error("AI Normalization failed:", error);
    return {
      metric_name: `db.unknown.${event.event_type}`,
      value: 1,
      unit: "count",
      tags: { ...event.context } as any,
      original_event_id: event.raw_event_id,
      ai_enrichment: "Normalization fallback active."
    };
  }
};

export const generateRcaWithAi = async (event: ObservabilityEvent): Promise<RcaResult> => {
  try {
    const ai = getAiClient();
    // Updated prompt to specifically look for "Inefficient Joins" and "Backup Overlaps"
    const prompt = `
      You are the RCA Engine. Analyze this specific database failure.
      
      Input: ${JSON.stringify(event)}
      
      Specific Investigation Targets:
      1. Query Efficiency: Check for heavy joins, table scans, or missing indexes causing CPU > 80%.
      2. Resource Overlap: Check if Backup jobs (RMAN, Snapshot) overlap with ETL or peak load.
      3. Concurrency: Check for deadlock chains or high rollback rates.
      4. Cloud Limits: Check for RU exhaustion (Cosmos) or Warehouse Credit limits (Snowflake).
      
      Provide JSON response:
      {
        "summary": "Brief explanation",
        "hypothesis": "Root cause (e.g. Inefficient Nested Loop Join on Table X, RMAN backup saturating IO)",
        "confidence": number (0-1),
        "remediation_steps": ["step 1", "step 2"],
        "affected_objects": ["table_name", "job_id", "warehouse", "query_hash"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}') as RcaResult;
  } catch (error) {
    return {
      summary: "Analysis failed",
      hypothesis: "Unknown error",
      confidence: 0,
      remediation_steps: [],
      affected_objects: []
    };
  }
};

export const generatePreIntimationWithAi = async (events: ObservabilityEvent[]): Promise<PreIntimationResult> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Pre-Intimation Service: Detect trend-based spikes and seasonal overlaps.
      
      Data: ${JSON.stringify(events.slice(0, 5))}
      
      Look for:
      1. Rising slopes in RU/Credits/CPU usage (e.g., CPU trending towards 80%).
      2. ETL jobs starting near Backup windows.
      3. Frequent timeouts or deadlocks.
      
      Output JSON:
      {
        "risk_window_start": "ISO string",
        "risk_window_end": "ISO string",
        "risk_score": number,
        "drivers": ["driver 1", "driver 2"],
        "preventive_steps": ["step 1"],
        "email_subject": "string",
        "email_body": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}') as PreIntimationResult;
  } catch (error) {
    return {
      risk_window_start: new Date().toISOString(),
      risk_window_end: new Date().toISOString(),
      risk_score: 0,
      drivers: [],
      preventive_steps: [],
      email_subject: "N/A",
      email_body: "N/A"
    };
  }
};