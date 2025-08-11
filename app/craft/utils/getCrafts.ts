import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Craft {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content?: string;
}

export function getCrafts(): Craft[] {
  const contentDirectory = path.join(process.cwd(), "app/craft/content");

  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(contentDirectory);

  const crafts = filenames
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

  return crafts;
}

export function getCraft(slug: string): Craft | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/craft/content",
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
    console.error("Error reading craft:", error);
    return null;
  }
}

export function getCraftSlugs(): string[] {
  const crafts = getCrafts();
  return crafts.map((craft) => craft.slug);
}
