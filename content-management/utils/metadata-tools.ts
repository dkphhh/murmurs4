// import { OPEN_ROUTER_API_KEY } from "astro:env/server";
const OPEN_ROUTER_API_KEY =
  "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";

/**
 * 预设的 tag
 *
 * @type {string[]}
 */
const TAGS: string[] = [
  "图像",
  "方法论",
  "科技",
  "幽默",
  "情绪",
  "自我",
  "评论",
  "文艺",
  "编程",
  "生活",
  "随笔",
  "设计",
  "读书",
  "电影",
  "音乐",
  "旅行",
  "历史",
  "心理",
  "哲学",
  "经济",
  "文化",
  "知识管理",
  "企业管理",
  "创业",
  "创意",
  "生产力",
  "写作",
  "学习",
  "笔记",
  "复古科技",
  "AI",
  "未来学",
  "软件",
  "硬件",
  "互联网",
  "创业",
  "效率",
];

/**
 * 根据文本内容，由AI自动生成 tags（在一个范围里让AI挑选tags）
 * 字数少于10的，不生成 tags
 * @param {string} content:string 文本内容
 * @param {string} tagScope:string[]=TAGS 选择 tags 范围
 * @returns {Promise<string[]>} :Promise<string[]>
 */
export async function createTags(
  content: string,
  tagScope: string[] = TAGS,
): Promise<string[]> {
  if (content.length <= 10) {
    return [];
  }

  const MAX_RETRIES = 3; // 设置最大重试次数

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
          messages: [
            {
              role: "system",
              content: `你是一个标签生成器，你的任务是根据用户输入的内容生成相关的标签，用户输入的内容都是markdown格式的文本。
        
        下面是生成标签的要求：

        1. 你只能从以下范围选择标签:
        ${tagScope.join(",")}
        
        2. 输出的标签的数量不超过5个，标签之间用","分隔。

        3. 我会用一段程序脚本自动处理你的输出，所以你只需要输出标签，不需要加任何提示语句或者引导词。这个自动处理的脚本如下，请不要输出这个脚本无法处理的内容：
        const tags = yourOutput.split(",").map((tag) => tag.trim());
        `,
            },
            {
              role: "user",
              content: content,
            },
          ],
        }),
      });

      if (!res.ok) {
        // 如果网络请求本身就失败了，直接抛出错误触发重试
        throw new Error(`API 请求错误： ${res.status}`);
      }

      const resJson = (await res.json()) as {
        choices?: [{ message?: { content?: string } }];
      };

      // 校验返回的数据结构是否符合预期
      const aiContent = resJson.choices?.[0]?.message?.content;
      if (!aiContent || typeof aiContent !== "string") {
        throw new Error("AI 返回的内容格式不正确");
      }

      const generatedTags = aiContent
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => Boolean(tag)); // 过滤掉空字符串

      // 校验生成的标签是否都在预设范围内
      const areTagsValid =
        generatedTags.length > 0 &&
        generatedTags.every((tag) => tagScope.includes(tag));

      if (areTagsValid) {
        return generatedTags.slice(0, 5); // 成功，返回结果
      } else {
        // AI返回了无效内容，抛出错误触发重试
        throw new Error("生成的标签不合法或超出限制范围.");
      }
    } catch (error) {
      console.error(`第 ${attempt} 次尝试失败:`, error);
      if (attempt === MAX_RETRIES) {
        // 如果达到最大重试次数，则返回空数组或抛出最终错误
        console.error("达到最大重试次数，返回空数组");
        return [];
      }
    }
  }

  return []; // 循环结束后（理论上不会到这里），返回空数组
}
