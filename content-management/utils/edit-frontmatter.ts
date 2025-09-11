import matter from "gray-matter";
import yaml from "js-yaml";

/**
 * 从 Markdown 字符串中分割 front matter 和正文内容。
 *
 * @template T - 用于定义 front matter 解析后 `data` 对象的类型。
 * @param markdownContent - 包含 front matter 的完整 Markdown 字符串。
 * @returns 一个包含 `data` 和 `content` 的对象。`data` 是解析后的 front matter 数据，`content` 是剩余的 Markdown 内容。
 */
export function spiltFrontMatterAndContent<T>(markdownContent: string): {
  data: T;
  content: string;
} {
  return matter(markdownContent.trim(), 
  {
    engines: {
      yaml: {
        parse: (s: string) =>
          // 使用 JSON_SCHEMA 会把时间当作普通字符串而不是 Date
          yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
      },
    },
  }) as unknown as {
    data: T;
    content: string;
  };
}

/**
 * 编辑 frontmatter 对象，添加或更新指定的字段。
 *
 * 此函数会创建一个新的对象，其中包含原始 `data` 对象的所有属性，
 * 以及 `newData` 对象的所有属性。如果 `newData` 中的某个键也存在于 `data` 中，
 * 那么该键的值将被 `newData` 中的值覆盖。
 *
 * @template T 原始 `data` 对象的类型。
 * @template NT 期望返回的新对象的类型。
 * @param data - 原始 frontmatter 对象。
 * @param newData - 包含要添加或更新的字段的对象。其类型应为 `NT` 的子集。
 * @returns 一个包含合并后字段的新对象，类型为 `NT`。
 * @throws 如果 `data` 或 `newData` 不是有效的对象，则会抛出错误。
 */
export function editFrontMatterField<
  T extends Record<string, unknown>,
  NT extends Record<string, unknown>,
>(data: T, newData: Partial<NT>): NT {
  if (typeof data !== "object" || data === null) {
    throw new Error("无效的 frontmatter 数据");
  }
  if (typeof newData !== "object" || newData === null) {
    throw new Error("无效的新增 frontmatter 数据");
  }
  return { ...data, ...newData } as unknown as NT;
}

/**
 * 从一个对象（通常是 frontmatter）中移除指定的字段。
 *
 * 此函数会创建一个输入对象的浅拷贝，然后从中删除 `keys` 数组中指定的所有属性。
 * 它不会修改原始对象。
 *
 * @template T - 要从中移除字段的对象类型。
 * @param data - 要从中移除字段的对象。
 * @param keys - 一个包含要移除的字段键名的字符串数组。数组中的每个键都必须是 `data` 对象的键。
 * @returns 一个移除了指定字段的新对象。
 * @throws 如果 `data` 不是一个有效的对象，则会抛出错误。
 *
 * @example
 * ```typescript
 * const frontmatter = {
 *   title: "Hello World",
 *   author: "John Doe",
 *   date: "2023-01-01"
 * };
 * const keysToRemove = ["author", "date"]; // "author" 和 "date" 都是 frontmatter 的键
 * const newFrontmatter = removeFrontMatterFiled(frontmatter, keysToRemove);
 * // newFrontmatter 的值为 { title: "Hello World" }
 * // frontmatter 对象保持不变
 * console.log(newFrontmatter);
 * ```
 */
export function removeFrontMatterFiled<T extends Record<string, unknown>>(
  data: T,
  keys: (keyof T)[],
): Omit<T, (typeof keys)[number]> {
  if (!data || typeof data !== "object") {
    throw new Error("无效的 frontmatter 数据");
  }

  // 1. 创建一个 data 的浅拷贝，以避免修改原始对象
  const result = { ...data };

  // 2. 遍历需要移除的键
  for (const key of keys) {
    // 3. 从副本中删除键
    delete result[key];
  }

  // 4. 返回移除了键之后的新对象
  return result;
}
