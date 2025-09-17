export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 只对可能是页面的请求进行重定向检查
    // 排除明显的静态资源
    const staticExtensions = [
      ".css",
      ".js",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".ico",
      ".woff",
      ".woff2",
      ".ttf",
      ".eot",
      ".pdf",
      ".zip",
      ".xml",
      ".txt",
    ];

    const isStaticAsset = staticExtensions.some((ext) =>
      pathname.toLowerCase().endsWith(ext),
    );
    const isAstroAsset = pathname.startsWith("/_astro/");
    const isApiRoute = pathname.startsWith("/api/");

    // 对于静态资源、Astro 资源和 API 路由，直接转发
    if (isStaticAsset || isAstroAsset || isApiRoute) {
      // 优先使用 ASSETS
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      // 如果没有 ASSETS，尝试 Astro Worker
      try {
        const { default: astroWorker } = await import(
          "./dist/_worker.js/index.js"
        );
        return await astroWorker.fetch(request, env, ctx);
      } catch (error) {
        return new Response("Not Found", { status: 404 });
      }
    }

    // 只对页面请求进行重定向检查
    const decodedPath = decodeURIComponent(pathname);
    let needsRedirect = false;
    let newPath = decodedPath;

    // 重定向逻辑
    const categories = ["reading", "writing", "lifelog"];
    const pathSegments = newPath.split("/").filter(Boolean);

    if (
      pathSegments.length >= 2 &&
      categories.includes(pathSegments[0]) &&
      categories.includes(pathSegments[1])
    ) {
      newPath = `/${pathSegments.slice(1).join("/")}`;
      needsRedirect = true;
    } else if (
      pathSegments.length === 3 &&
      categories.includes(pathSegments[0]) &&
      !categories.includes(pathSegments[1])
    ) {
      newPath = `/${pathSegments[0]}/${pathSegments[2]}`;
      needsRedirect = true;
    }

    const lowercasePath = newPath.toLowerCase();
    if (newPath !== lowercasePath) {
      newPath = lowercasePath;
      needsRedirect = true;
    }

    if (newPath.includes(" ")) {
      newPath = newPath.replace(/ /g, "-");
      needsRedirect = true;
    }

    if (needsRedirect) {
      const newUrl = new URL(url);
      newUrl.pathname = encodeURI(newPath);
      return new Response(null, {
        status: 301,
        headers: { Location: newUrl.href },
      });
    }

    // 对于页面请求，转发给 Astro
    try {
      // 首先尝试 ASSETS（预渲染页面）
      if (env.ASSETS) {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status !== 404) {
          return assetResponse;
        }
      }

      // 然后尝试 Astro Worker（SSR 页面）
      const { default: astroWorker } = await import(
        "./dist/_worker.js/index.js"
      );
      return await astroWorker.fetch(request, env, ctx);
    } catch (error) {
      console.error("Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
