import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Writing {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content?: string;
}

export function getWritings(): Writing[] {
  const contentDirectory = path.join(process.cwd(), "app/writings/content");

  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(contentDirectory);

  const writings = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(contentDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return writings;
}

export function getWriting(slug: string): Writing | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/writings/content",
      `${slug}.mdx`
    );

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    console.error("Error reading writing:", error);
    return null;
  }
}

export function getWritingSlugs(): string[] {
  const writings = getWritings();
  return writings.map((writing) => writing.slug);
}
