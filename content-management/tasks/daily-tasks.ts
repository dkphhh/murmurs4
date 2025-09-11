import {
  spiltFrontMatterAndContent,
  editFrontMatterField,
} from "../utils/edit-frontmatter.ts";
import {
  writeToMarkdownFile,
  convertMarkdownToText,
} from "../utils/markdown-file-tools.ts";
import { createTags } from "../utils/metadata-tools.ts";

// -------- 任务定义 ----------

/**
 * 为文章添加描述字段，如果已存在则跳过。
 * 该函数将 Markdown 内容转换为纯文本，并截取前60个字符作为描述，
 * 优先在标点符号处截断，并添加省略号。
 *
 * @param data - 文章的前置元数据对象，类型为 PostFrontmatter。
 * @param content - 文章的 Markdown 内容字符串。
 * @returns 返回更新后的前置元数据对象，如果已存在描述则返回原对象。
 */
async function addDescription(data: PostFrontmatter, content: string) {
  // 如果已经有 description 字段，则跳过
  if (data.description) {
    return data;
  }
  //   截取description内容
  const description = await convertMarkdownToText(content).then((text) => {
    // 1. 先截取最多80个字符
    const initialSlice = text.slice(0, 80);

    // 2. 找到最后一个标点符号的位置
    // 这里我们定义了中英文常用标点
    const lastPunctuationIndex = Math.max(
      initialSlice.lastIndexOf("。"),
      initialSlice.lastIndexOf("."),
      initialSlice.lastIndexOf("，"),
      initialSlice.lastIndexOf(","),
      initialSlice.lastIndexOf("！"),
      initialSlice.lastIndexOf("!"),
      initialSlice.lastIndexOf("？"),
      initialSlice.lastIndexOf("?"),
      initialSlice.lastIndexOf("）"),
      initialSlice.lastIndexOf(")"),
      initialSlice.lastIndexOf("；"),
      initialSlice.lastIndexOf(";"),
      initialSlice.lastIndexOf("："),
      initialSlice.lastIndexOf(":"),
    );

    // 3. 如果找到了标点，就截取到标点前；否则直接使用80个字符的截取
    const finalSlice =
      lastPunctuationIndex > 0
        ? initialSlice.slice(0, lastPunctuationIndex)
        : initialSlice;

    // 4. 加上省略号并返回
    return `${finalSlice}……`;
  });

  const updatedData = editFrontMatterField<PostFrontmatter, PostFrontmatter>(
    data,
    { description },
  );

  return updatedData;
}

export async function addTags(data: PostFrontmatter, content: string) {
  // 如果已经有 tags 字段，且不为空数组，则跳过
  if (data.tags && data.tags.length > 0) {
    return data;
  }

  const tags = await createTags(content);

  const updatedData = editFrontMatterField<PostFrontmatter, PostFrontmatter>(
    data,
    { tags },
  );

  return updatedData;
}

// -------- 任务执行区域,开放给外部函数调用 -------

export async function dailyTasksRunner(fullPath: string) {
  console.log(`🔄 处理文件: ${fullPath}`);
  const fileContent = await Bun.file(fullPath).text();
  const { data, content } =
    spiltFrontMatterAndContent<PostFrontmatter>(fileContent);

  // 任务1: 添加 description 字段
  let updatedData = await addDescription(data, content);

  // 任务2: 添加 tags 字段
  updatedData = await addTags(updatedData, content);

  await writeToMarkdownFile(updatedData, content, fullPath);
  console.log(`✅ 处理完成: ${fullPath}`);
}
