import type { MarkdownInstance } from "astro";
import type { InferEntrySchema } from "astro:content";
import type { CollectionEntry } from "astro:content";

declare global {
  /**
   * 代表一篇原创文章。
   */
  type OriginalPostMeta = InferEntrySchema<"writing">;

  type LifeLogPageMeta = InferEntrySchema<"lifelog">;

  /**
   * 表示一篇剪藏类型的文章。
   */
  type ClippingPostMeta = InferEntrySchema<"reading">;

  /**
   * 文章的 frontmatter 元数据。
   *
   * 它可以是原创文章的元数据 (`OriginalPostMeta`)，
   * 也可以是剪藏文章的元数据 (`ClippingPostMeta`)。
   */
  type PostFrontmatter = OriginalPostMeta | ClippingPostMeta | LifeLogPageMeta;

  /**
   * 代表一个完整的博客文章条目,用于文章列表的展示项。
   *
   */
  type PostEntry =
    | CollectionEntry<"writing">
    | CollectionEntry<"reading">
    | CollectionEntry<"lifelog">;

  /**
   * 表示单个经过处理的 Markdown 文章实例。
   *
   * 这是 `MarkdownInstance` 泛型类型的一个具体化，
   * 使用 `PostFrontmatter` 作为其 frontmatter 的类型。
   * 每个实例通常包含帖子的元数据（frontmatter）、URL 以及渲染后的内容。
   */
  type PostInstance = MarkdownInstance<PostFrontmatter>;
}

export {};
