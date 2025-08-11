import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ClockFading, Tag } from "lucide-react";
import { getWriting, getWritingSlugs } from "../utils/getWritings";
import type { Metadata } from "next";
import WritingsPage from "@/app/components/WritingsPage";

interface WritingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getWritingSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    return {
      title: "Writing Not Found",
    };
  }

  const ogImageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/api/og?title=${encodeURIComponent(
    writing.title
  )}&name=Harsh Sharma&role=Design Engineer`;

  return {
    title: `${writing.title} | Writings | Ascent`,
    description: writing.description,
    openGraph: {
      title: writing.title,
      description: writing.description,
      type: "article",
      publishedTime: writing.date,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${writing.title} - Harsh Sharma`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: writing.title,
      description: writing.description,
      images: [ogImageUrl],
    },
  };
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const writing = getWriting(slug);

  if (!writing) {
    notFound();
  }

  return <WritingsPage writing={writing} />;
}
