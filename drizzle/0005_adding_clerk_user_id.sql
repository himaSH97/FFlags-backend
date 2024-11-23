ALTER TABLE "users" RENAME COLUMN "user_id" TO "clerk_user_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_user_id_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id");