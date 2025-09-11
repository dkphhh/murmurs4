// filepath: src/middleware.ts
import { defineMiddleware } from "astro:middleware";

/**
 * Astro 中间件，用于处理请求和响应
 * @see https://docs.astro.build/zh-cn/guides/middleware/
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const { params, redirect } = context;

  // 检查是否是标签页路由，并且 tag 参数与它的小写版本不符
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

  if (pathname === "/about") {
    return redirect("/lifelog/about-me", 301);
  }

  // 如果不匹配，继续处理下一个中间件或页面
  return next();
});
