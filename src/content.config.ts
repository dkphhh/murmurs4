// 导入 glob 加载器（loader）
import { glob } from "astro/loaders";
// 从 `astro:content` 导入工具函数
import { z, defineCollection } from "astro:content";
// 导入环境变量
import { MURMURS_PATH } from "astro:env/server";

// 为每个集合定义一个 `loader` 和 `schema`
const writing = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${MURMURS_PATH}/writing`,
  }),
  schema: z.object({
    category: z.literal("origin"),
    title: z.string(),
    created: z
      .string()
      .datetime({ offset: true })
      .transform((s) => new Date(s)),
    updated: z
      .string()
      .datetime({ offset: true })
      .transform((s) => new Date(s)),
    public: z.boolean(),
    author: z.string(),
    description: z.string(),
    tags: z.union([z.array(z.string()), z.null()]).optional(),
    uuid: z.string(),
    alias: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  }),
});

const reading = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${MURMURS_PATH}/reading`,
  }),
  schema: z.object({
    category: z.literal("clipping"),
    title: z.string(),
    published: z
      .union([
        z
          .string()
          .datetime({ offset: true })
          .transform((s) => new Date(s)),
        z.null(),
      ])
      .optional(),
    saved: z
      .string()
      .datetime({ offset: true })
      .transform((s) => new Date(s)),
    public: z.boolean(),
    author: z.string().optional(),
    source: z.object({
      url: z.string().url(),
      title: z.string(),
      text: z.string().optional(),
    }),
    description: z.string(),
    tags: z.union([z.array(z.string()), z.null()]).optional(),
    uuid: z.string(),
    alias: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  }),
});

const lifelog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `${MURMURS_PATH}/lifelog`,
  }),
  schema: z.object({
    category: z.literal("pages"),
    title: z.string(),
    created: z
      .string()
      .datetime({ offset: true })
      .transform((s) => new Date(s)),
    updated: z
      .string()
      .datetime({ offset: true })
      .transform((s) => new Date(s)),
    public: z.boolean(),
    author: z.string(),
    description: z.string(),
    tags: z.union([z.array(z.string()), z.null()]).optional(),
    uuid: z.string(),
    alias: z.union([z.string(), z.array(z.string()), z.null()]).optional(),
  }),
});

// 导出一个单独的 `collections` 对象用以注册集合
export const collections = { writing, reading, lifelog };
