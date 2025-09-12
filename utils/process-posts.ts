import { getCollection } from "astro:content";
import type { CollectionKey } from "astro:content";





/**
 * 根据集合键获取该分类下的公开帖子，并按时间降序返回。
 *
 * 处理流程：
 * 1. 调用 getCollection(category) 获取该集合的全部条目。
 * 2. 仅保留 data.public 为 true 的条目。
 * 3. 对条目按时间戳进行降序排序：若条目属于 "clipping" 分类，则优先使用 data.published，其次使用 data.saved；其他分类使用 data.created。
 *
 * 注意：
 * - 假定 data.published、data.saved、data.created 等时间字段为 Date 对象或可比较的时间值。
 * - 如果 getCollection 抛出错误或时间字段缺失/不可比较，调用者将收到相应的异常。
 *
 * @param category - 用于获取集合的键（CollectionKey），指明要处理的分类。
 * @returns 返回一个 Promise，解析为按时间降序排列的公开帖子数组。
 *
 * @throws 当 getCollection 失败或排序过程中遇到不可比较的时间字段时，会抛出错误并向上传播。
 *
 * @example
 * // 示例：获取 blog 分类的公开帖子（降序）
 * const posts = await getCategoryPosts('blog');
 */
export async function getCategoryPosts(category: CollectionKey) {
  const allPosts = await getCollection(category);

  const posts = allPosts
    .filter((post) => post.data.public)
    .sort((a, b) => {
      const aDT =
        a.data.category === "clipping"
          ? a.data.published || a.data.saved
          : a.data.created;
      const bDT =
        b.data.category === "clipping"
          ? b.data.published || b.data.saved
          : b.data.created;

      return bDT.valueOf() - aDT.valueOf();
    });

  return posts;
}
