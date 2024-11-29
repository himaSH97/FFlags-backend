CREATE TABLE IF NOT EXISTS "project_keys" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"server_public_key" varchar(2048) NOT NULL,
	"server_private_key" varchar(2048) NOT NULL,
	"project_public_key" varchar(2048) NOT NULL,
	"project_private_key" varchar(2048) NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_keys_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_keys" ADD CONSTRAINT "project_keys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
