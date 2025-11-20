import { getCategoryPosts } from "../../utils/process-posts.ts";
import type { APIRoute } from "astro";

/**
 * 生成 writing 部分的 sitemap.xml
 * 包含所有已发布的文章链接
 */
export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not configured");
  }

  try {
    // 获取所有 writing 集合中的文章
    const posts = await getCategoryPosts("writing");

    // 生成 sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts
    .map((post) => {
      const url = `${site.toString().replace(/\/$/, "")}/writing/${post.id}`;
      const lastmod = new Date(
        post.data.category == "origin"
          ? post.data.created
          : post.data.category === "clipping"
            ? post.data.saved
            : post.data.created,
      ).toISOString();

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

    return new Response(sitemap.trim(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("生成 sitemap 时出错：", error);
    throw error;
  }
};
