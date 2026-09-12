import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/changelog" }),
  schema: ({ image }) =>
    z.object({
      apps: z.array(z.string()),
      version: z.string(),
      date: z.coerce.date(),
      title: z.string(),
      description: z.string(),
      image: image().optional(),
      tag: z.string().optional(),
    }),
});

export const collections = { changelog };
