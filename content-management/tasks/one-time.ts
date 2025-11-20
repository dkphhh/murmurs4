import { editFrontMatterField } from "../utils/edit-frontmatter.ts";
import { spiltFrontMatterAndContent } from "../utils/edit-frontmatter.ts";
import { writeToMarkdownFile } from "../utils/markdown-file-tools.ts";

/**
 * 生成指定长度的随机字母字符串（不含数字）
 * @param length 长度，默认 4
 * @returns 随机字母字符串
 */
const ALPHA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateRandomAlpha(length = 4): string {
  const chars = ALPHA_CHARS;
  const out: string[] = [];
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const rnd = new Uint32Array(length);
    cryptoApi.getRandomValues(rnd);
    for (let i = 0; i < length; i++) {
      out.push(chars[rnd[i] % chars.length]);
    }
  } else {
    for (let i = 0; i < length; i++) {
      out.push(chars[Math.floor(Math.random() * chars.length)]);
    }
  }

  return out.join("");
}

async function reWriteUUID(data: PostFrontmatter) {
  const { uuid } = data;

  if (!uuid || uuid === "") {
    throw new Error("UUID 为空，无法重新生成");
  }

  if (typeof uuid === "string") {
    return data;
  }

  if (typeof uuid === "number") {
    console.log(`检测到 UUID => ${uuid} 为数字，正在重新生成...`);
    // 重新生成 UUID，保留前 14 位数字，后 4 位改为随机字母
    const newUUID =
      (uuid as number).toString().slice(0, 14) + generateRandomAlpha(4);
    console.log(`旧 UUID: ${uuid}，新 UUID: ${newUUID}`);
    const updatedData = editFrontMatterField<PostFrontmatter, PostFrontmatter>(
      data,
      { uuid: newUUID },
    );
    return updatedData;
  }
  throw new Error("UUID 类型不支持重新生成");
}

export async function oneTimeTasks(fullPath: string) {
  const fileContent = await Bun.file(fullPath).text();
  const { data, content } =
    spiltFrontMatterAndContent<PostFrontmatter>(fileContent);

  const newData = await reWriteUUID(data);

  await writeToMarkdownFile(newData, content, fullPath);
}
