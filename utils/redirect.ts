import type { MiddlewareHandler } from "astro";

export const normalizePath: MiddlewareHandler = async ({ url, redirect }, next) => {
  const { pathname } = url;
  const decodedPath = decodeURIComponent(pathname);

  // 同时转换为小写并替换空格
  const normalizedPath = decodedPath.toLowerCase().replace(/ /g, "-");

  // 仅当路径确实发生变化时才重定向
  if (decodedPath !== normalizedPath) {
    // 对最终生成的路径进行编码，以防包含特殊字符
    const newPath = encodeURI(normalizedPath);
    return redirect(newPath, 301); // 301 永久重定向
  }

  return await next();
};

export const redirectDuplicateCategory: MiddlewareHandler = async (
  { url, redirect },
  next,
) => {
  const { pathname } = url;

  const categories = ["reading", "writing", "lifelog"];

  // 将路径分割成数组，并过滤掉空字符串，例如 "/writing/reading/slug" -> ["writing", "reading", "slug"]
  const pathSegments = pathname.split("/").filter(Boolean);

  // --- 检查路径是否为 /category1/category2/slug 模式---
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
  return await next();
};