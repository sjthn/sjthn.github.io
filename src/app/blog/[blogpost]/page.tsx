import { FC } from "react";
import fs from "fs";
import { marked } from "marked";
import matter from "gray-matter";
import { BlogHeading } from "../../../components/blog_heading";

interface BlogPostProps {
  params: { blogpost: string };
}

const BlogPost: FC<BlogPostProps> = ({ params }) => {
  let markdown = fs.readFileSync(`_posts/${params.blogpost}.md`, {
    encoding: "utf-8",
  });
  const { data: frontmatter, content } = matter(markdown);
  return (
    <div>
      <BlogHeading title={frontmatter["title"]} date={frontmatter["date"]} />
      <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
  );
};

export function generateStaticParams() {
  const posts = fs.readdirSync(`_posts/`);
  const postPaths = posts.map((post) => {
    const postName = post.replace(".md", "");
    return {
      blogpost: postName,
    };
  });
  return postPaths;
}

export async function generateMetadata({ params }) {
  let markdown = fs.readFileSync(`_posts/${params.blogpost}.md`, {
    encoding: "utf-8",
  });
  const { data: frontmatter } = matter(markdown);
  return {
    title: frontmatter["title"],
  };
}

export default BlogPost;
