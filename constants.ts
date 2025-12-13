import { ObservabilityEvent, DbEngine, Severity } from './types';

export const MOCK_EVENTS: ObservabilityEvent[] = [
  // 1. SQL SERVER: The specific "Heavy Join" scenario requested
  // Context: CPU is > 80% because of a bad SELECT query with too many joins
  {
    event_type: "query_performance_degradation",
    timestamp: new Date().toISOString(),
    context: {
      db_system: DbEngine.SQLServer,
      db_instance: "prod-sql-billing-01",
      db_host: "10.0.5.12",
      db_name: "BillingDB",
      env: "prod",
      region: "eu-central-1",
      tenant: "internal",
      query_id: "Q-882910"
    },
    payload: {
      metric: "cpu_utilization",
      current_value: 88.5, // > 80% as requested
      threshold: 80,
      root_cause_indicator: "Heavy Nested Loop Join",
      sql_snippet: "SELECT * FROM Invoices i JOIN LineItems l ON i.id = l.inv_id JOIN Products p ON ...",
      missing_index_impact: 95.4,
      wait_type: "CXPACKET", // Parallelism wait often seen with heavy scans
      execution_count: 1450
    },
    source_capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    raw_event_id: "evt-sql-cpu-992",
    severity: Severity.Critical
  },
  
  // 2. POSTGRES: Transaction Rollback Spike
  {
    event_type: "transaction_rollback_spike",
    timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
    context: {
      db_system: DbEngine.Postgres,
      db_instance: "prod-pg-reporting-04",
      db_name: "fin_reports",
      env: "prod",
      region: "us-west-2",
      tenant: "client_alpha"
    },
    payload: { 
      rollback_rate_per_sec: 45,
      commit_rate_per_sec: 120,
      primary_error: "serialization_failure",
      deadlock_detected: true,
      conflicting_table: "ledger_entries"
    },
    source_capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    raw_event_id: "evt-pg-roll-001",
    severity: Severity.Critical
  },

  // 3. ORACLE: Backup/Restore Scenario
  {
    event_type: "backup_job_failure",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    context: {
      db_system: DbEngine.Oracle,
      db_instance: "prod-ora-legacy-09",
      env: "prod",
      region: "us-east-1",
      tenant: "finance-dept"
    },
    payload: {
      tool: "RMAN",
      status: "FAILED",
      error_code: "ORA-19504",
      message: "failed to create file at +RECO/PROD/BACKUPSET...",
      blocking_session_id: 442,
      impact: "Archive Log Destination Full"
    },
    source_capabilities: { hooks: true, views: true, logs: true, provider_metrics: false },
    raw_event_id: "evt-ora-bck-44",
    severity: Severity.Critical
  },

  // 4. COSMOS DB: RU Spike (NoSQL Scenario)
  {
    event_type: "provisioned_throughput_exceeded",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    context: {
      db_system: DbEngine.CosmosDB,
      db_instance: "prod-cosmos-02",
      env: "prod",
      region: "us-east-1",
      tenant: "acrisure"
    },
    payload: {
      request_charge: 14000,
      provisioned_limit: 10000,
      status_code: 429,
      partition_key_range: "05-FF",
      operation: "StoredProcedure: BulkImport"
    },
    source_capabilities: { hooks: false, views: false, logs: true, provider_metrics: true },
    raw_event_id: "evt-cc12",
    severity: Severity.Warning
  },

  // 5. SNOWFLAKE: Credit Exhaustion
  {
    event_type: "warehouse_suspend_failure",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    context: {
      db_system: DbEngine.Snowflake,
      db_instance: "sf-account-xy992",
      warehouse: "COMPUTE_WH_XL",
      env: "prod",
      region: "us-west-2",
      tenant: "analytics-team"
    },
    payload: {
      credits_used: 155,
      cluster_count: 4,
      reason: "Long running query preventing auto-suspend",
      query_tag: "adhoc_analyst_group"
    },
    source_capabilities: { hooks: false, views: true, logs: true, provider_metrics: true },
    raw_event_id: "evt-sf-cred-21",
    severity: Severity.Warning
  },

  // 6. DYNAMODB: Throttling
  {
    event_type: "write_throttle_events",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    context: {
      db_system: DbEngine.DynamoDB,
      db_instance: "users-table-v2",
      env: "prod",
      region: "ap-northeast-1",
      tenant: "mobile-app"
    },
    payload: {
      gsi_name: "EmailIndex",
      write_capacity_units: 50,
      consumed_units: 85,
      throttle_count: 245
    },
    source_capabilities: { hooks: false, views: false, logs: false, provider_metrics: true },
    raw_event_id: "evt-ddb-throt-09",
    severity: Severity.Warning
  },

  // 7. ETL Job Start (Context for Overlap)
  {
    event_type: "etl_job_start",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    context: {
      db_system: DbEngine.Postgres,
      db_instance: "prod-pg-reporting-04",
      env: "prod",
      region: "us-west-2",
      tenant: "internal",
      job_id: "etl-daily-sync-01"
    },
    payload: {
      status: "running",
      batch_size: 50000,
      target_table: "large_ledger_table"
    },
    source_capabilities: { hooks: false, views: true, logs: true, provider_metrics: false },
    raw_event_id: "evt-job-start-88",
    severity: Severity.Info
  }
];

export const ENGINE_COLORS: Record<string, string> = {
  [DbEngine.SQLServer]: "text-red-500",
  [DbEngine.Postgres]: "text-blue-400",
  [DbEngine.Oracle]: "text-red-700",
  [DbEngine.Snowflake]: "text-sky-300",
  [DbEngine.CosmosDB]: "text-blue-500",
  [DbEngine.DynamoDB]: "text-purple-500",
  [DbEngine.MongoDB]: "text-green-500",
  [DbEngine.Redis]: "text-red-600",
  [DbEngine.MariaDB]: "text-amber-500",
  [DbEngine.Cassandra]: "text-blue-300",
};