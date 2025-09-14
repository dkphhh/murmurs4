// filepath: src/middleware.ts
import { defineMiddleware } from "astro:middleware";

/**
 * Astro 中间件，用于处理请求和响应
 * @see https://docs.astro.build/zh-cn/guides/middleware/
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const { params, redirect } = context;

  // --- 检查路径是否为 /category1/category2/slug 模式---
  const categories = ["reading", "writing", "lifelog"];
  // 将路径分割成数组，并过滤掉空字符串，例如 "/writing/reading/slug" -> ["writing", "reading", "slug"]
  const pathSegments = pathname.split("/").filter(Boolean);

  // 检查路径是否至少包含两个部分，且前两个部分都是分类目录
  if (
    pathSegments.length >= 2 &&
    categories.includes(pathSegments[0]) &&
    categories.includes(pathSegments[1])
  ) {
    // 这是一个错误的嵌套分类路径，例如 /writing/reading/slug
    // 我们需要重定向到正确的路径，例如 /reading/slug
    const newPath = `/${pathSegments.slice(1).join("/")}`;
    return redirect(newPath, 301); // 301 永久重定向
  }

  // --- 检查路径是否为 /category/slug1/slug2 格式 ---
  if (
    pathSegments.length === 3 &&
    categories.includes(pathSegments[0]) &&
    !categories.includes(pathSegments[1]) // 确保中间部分不是一个分类
  ) {
    // 这是一个错误的同分类相对路径，例如 /writing/slug-a/slug-b
    // 我们需要重定向到正确的路径，例如 /writing/slug-b
    const newPath = `/${pathSegments[0]}/${pathSegments[2]}`;
    return redirect(newPath, 301); // 301 永久重定向
  }

  // --- 检查是否是标签页路由，并且 tag 参数与它的小写版本不符---
  if (
    pathname.startsWith("/tags/") &&
    params.tag &&
    params.tag !== params.tag.toLowerCase()
  ) {
    // 如果 tag 包含大写字母，则重定向到全小写的 URL
    // 例如：/tags/AI -> /tags/ai
    const lowercasePath = `/tags/${params.tag.toLowerCase()}`;
    return redirect(lowercasePath, 301); // 301 表示永久重定向
  }

  // --- about页面重定向 ---
  if (pathname === "/about") {
    return redirect("/lifelog/about-me", 301);
  }

  // 如果不匹配，继续处理下一个中间件或页面
  return next();
});
