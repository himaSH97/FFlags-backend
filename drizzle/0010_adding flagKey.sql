ALTER TABLE "feature_flags" ADD COLUMN "flag_key" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_flag_key_unique" UNIQUE("flag_key");