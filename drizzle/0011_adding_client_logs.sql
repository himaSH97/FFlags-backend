CREATE TABLE IF NOT EXISTS "client_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"project_id" uuid NOT NULL,
	"flag_id" uuid NOT NULL,
	"flag_value_id" uuid NOT NULL,
	"metadata" jsonb NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL
);
