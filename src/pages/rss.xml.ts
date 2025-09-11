import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const writing = await getCollection("writing", (post) => post.data.public);

const reading = await getCollection("reading", (post) => post.data.public);

const allPosts = [...writing, ...reading];

export const GET: APIRoute = async (context) => {
  return rss({
    title: "Dkphhh's Murmurs",
    description: "闲言碎语就要讲",
    site: context.site as URL,
    items: allPosts.map((post) => {
      return {
        title: post.data.title,
        pubDate:
          post.data.category === "origin"
            ? post.data.updated
            : post.data.published || post.data.saved,
        description: post.data.description,
        link:
          post.data.category === "origin"
            ? `/writing/${post.id}`
            : `/reading/${post.id}`,
      };
    }),
    customData: `<language>zh-cn</language>`,
  });
};
