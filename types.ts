export enum DbEngine {
  SQLServer = 'sqlserver',
  Postgres = 'postgres',
  Oracle = 'oracle',
  Snowflake = 'snowflake',
  CosmosDB = 'cosmosdb',
  DynamoDB = 'dynamodb',
  MongoDB = 'mongodb',
  Redis = 'redis',
  MariaDB = 'mariadb',
  Cassandra = 'cassandra',
}

export enum Severity {
  Critical = 'critical',
  Warning = 'warning',
  Info = 'info',
}

export interface EventContext {
  db_system: string;
  db_instance: string;
  db_host?: string;
  db_name?: string;
  env: string;
  region: string;
  tenant: string;
  session_id?: string;
  query_id?: string;
  job_id?: string | null;
  warehouse?: string | null;
  // APM Correlation
  trace_id?: string;
  span_id?: string;
  service_name?: string;
}

export interface SourceCapabilities {
  hooks: boolean;
  views: boolean;
  logs: boolean;
  provider_metrics: boolean;
}

export interface ObservabilityEvent {
  event_type: string;
  timestamp: string;
  context: EventContext;
  payload: any;
  source_capabilities: SourceCapabilities;
  raw_event_id: string;
  severity: Severity;
}

export interface NormalizedMetric {
  metric_name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  original_event_id: string;
  ai_enrichment?: string;
}

export interface RcaResult {
  summary: string;
  hypothesis: string;
  confidence: number;
  remediation_steps: string[];
  affected_objects: string[];
}

export interface PreIntimationResult {
  risk_window_start: string;
  risk_window_end: string;
  risk_score: number;
  drivers: string[];
  preventive_steps: string[];
  email_subject: string;
  email_body: string;
}