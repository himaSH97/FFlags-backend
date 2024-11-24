ALTER TABLE "public"."users_on_projects" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."role" CASCADE;--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('owner', 'admin', 'viewer');--> statement-breakpoint
ALTER TABLE "public"."users_on_projects" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";