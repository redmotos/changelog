import { defineCollection, z } from "astro:content";

const changelog = defineCollection({
  type: "content",
  schema: z.object({
    app: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    tag: z.string().optional(),
  }),
});

export const collections = { changelog };
