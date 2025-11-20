import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import strip from "strip-markdown";
import { unified } from "unified";

/**
 * 将 Markdown 文件内容转换为纯文本，去除 frontmatter、Markdown 语法和 HTML 标签。
 * @param {string} markdownContent - 包含 frontmatter 的 Markdown 字符串
 * @returns {Promise<string>} 纯文本内容
 */
export async function convertMarkdownToText(
  markdownContent: string,
): Promise<string> {
  // 1. 使用 gray-matter 分离 frontmatter 和主要内容
  const { content } = matter(markdownContent);

  // 2. 移除自定义的 [//begin]...[//end] 注释块
  const contentWithoutComments = content.replace(
    /\[\/\/begin\][\s\S]*?\[\/\/end\]/g,
    "",
  );

  // 3. 使用 unified 和 strip-markdown 移除所有 Markdown 和 HTML 格式
  const file = await unified()
    .use(remarkParse)
    .use(strip)
    .use(remarkStringify)
    .process(contentWithoutComments);

  // 4. 返回处理后的纯文本字符串
  return String(file).trim();
}

/**
 * 将 frontmatter 和内容合并，并写入指定的 Markdown 文件。
 * 此函数会覆盖目标路径下的任何现有文件。
 *
 * @param frontMatter - 要写入的 frontmatter 对象。
 * @param content - Markdown 的正文内容。
 * @param filePath - 目标文件的完整路径。
 */
export async function writeToMarkdownFile(
  frontMatter: Record<string, unknown>,
  content: string,
  filePath: string,
): Promise<void> {
  try {
    const newMarkdown = matter.stringify(content, frontMatter);
    await Bun.write(filePath, newMarkdown);
  } catch {
    throw new Error(`写入文件失败：${filePath}`);
  }
}
