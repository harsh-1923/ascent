import { Metadata } from "next";
import { getCraftBySlug } from "./getAllCrafts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const craft = getCraftBySlug(slug);

  if (!craft) {
    return {
      title: "Craft Not Found",
      description: "The requested craft could not be found.",
    };
  }

  const ogImageUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/api/og?title=${encodeURIComponent(
    craft.title
  )}&name=Harsh Sharma&role=Design Engineer`;

  return {
    title: `${craft.title} | Harsh Sharma`,
    description: craft.tldr,
    alternates: {
      canonical: `/craft/${slug}`,
    },
    openGraph: {
      title: craft.title,
      description: craft.tldr,
      type: "article",
      publishedTime: craft.date,
      tags: craft.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${craft.title} - Harsh Sharma`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: craft.title,
      description: craft.tldr,
      images: [ogImageUrl],
    },
  };
}
