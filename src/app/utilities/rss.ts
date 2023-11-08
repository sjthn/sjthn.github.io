import fs from "fs";
import matter from "gray-matter";
import RSS from "rss";

export default async function generateRssFeed(
  blogPostPaths: { blogpost: string }[],
) {
  const site_url =
    process.env.NODE_ENV === "production"
      ? "https://srijith.dev"
      : "http://localhost:3000";

  const feedOptions = {
    title: "Srijith's blog posts | RSS feed",
    description: "Welcome to my blog posts",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  };

  const feed = new RSS(feedOptions);
  // Add each individual post to the feed.
  blogPostPaths.map((postPathObj) => {
    const postPath = postPathObj.blogpost;
    let markdown = fs.readFileSync(`_posts/${postPath}.md`, {
      encoding: "utf-8",
    });
    const { data: frontmatter } = matter(markdown);
    feed.item({
      title: frontmatter["title"],
      description: "",
      url: `${site_url}/blog/${postPath}`,
      date: frontmatter["date"],
    });
  });

  // Write the RSS feed to a file as XML.
  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
