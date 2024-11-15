CREATE TYPE "public"."entity_action" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('feature_flags', 'feature_flag_values');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_history" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_action" "entity_action" NOT NULL,
	"changed_fields" jsonb NOT NULL,
	"changed_by" uuid NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_history" ADD CONSTRAINT "audit_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
