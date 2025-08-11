import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ClockFading, Tag } from "lucide-react";
import { getCraft, getCraftSlugs } from "../utils/getCrafts";
import type { Metadata } from "next";
import CraftHeader from "@/app/components/CraftHeader";
import { components } from "@/mdx-components";
import CraftFooter from "@/app/components/CraftFooter";

interface CraftPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getCraftSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: CraftPageProps): Promise<Metadata> {
  const { slug } = await params;
  const craft = getCraft(slug);

  if (!craft) {
    return {
      title: "Craft Not Found",
    };
  }

  return {
    title: `${craft.title}`,
    description: craft.description,
    openGraph: {
      title: craft.title,
      description: craft.description,
      type: "article",
      publishedTime: craft.date,
    },
  };
}

export default async function CraftPage({ params }: CraftPageProps) {
  const { slug } = await params;
  const craft = getCraft(slug);

  if (!craft) {
    notFound();
  }

  return (
    <main className="max-w-[80ch] w-full mx-auto px-4">
      <CraftHeader header={craft.title} date={craft.date} />

      <article className="w-full max-w-[80ch] mx-auto">
        <MDXRemote source={craft.content || ""} components={components} />
      </article>
      <CraftFooter />
    </main>
  );
}
