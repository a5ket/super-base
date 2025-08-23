CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "superhero_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"superhero_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"caption" varchar(200),
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "superheroes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(100) NOT NULL,
	"real_name" varchar(100) NOT NULL,
	"origin_description" text NOT NULL,
	"superpowers" text NOT NULL,
	"catch_phrase" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "superhero_images" ADD CONSTRAINT "superhero_images_superhero_id_superheroes_id_fk" FOREIGN KEY ("superhero_id") REFERENCES "public"."superheroes"("id") ON DELETE cascade ON UPDATE no action;