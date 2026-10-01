import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// WordPress's `date`/`modified` fields are local wall times. The source site
// uses Asia/Seoul; preserve that meaning for both imported and new Markdown.
const publicationDate = z.preprocess(value => {
  if (typeof value !== 'string') return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00+09:00`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) return `${value}+09:00`;
  return value;
}, z.coerce.date());

const schema = z.object({
  title: z.string(),
  path: z.string().optional(),
  date: publicationDate,
  modified: publicationDate.optional(),
  lang: z.string().default('en'),
  excerpt: z.string().default(''),
  description: z.string().optional(),
  categories: z.array(z.union([z.number(), z.string()])).default([]),
  tags: z.array(z.union([z.number(), z.string()])).default([]),
  author: z.union([z.number(), z.string()]).optional(),
  image: z.string().optional(),
  imageAlt: z.string().default(''),
  readingMinutes: z.number().optional(),
  wordpressId: z.number().optional(),
  sourceUrl: z.string().optional(),
  snapshotFile: z.string().optional(),
  draft: z.boolean().default(false),
}).passthrough();

export const collections = {
  posts: defineCollection({ loader: glob({ base: './content/posts', pattern: '**/*.md' }), schema }),
  pages: defineCollection({ loader: glob({ base: './content/pages', pattern: '**/*.md' }), schema }),
};
