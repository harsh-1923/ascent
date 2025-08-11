import Link from "next/link";
import { getWritings } from "./utils/getWritings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings | Ascent",
  description: "Explore our collection of thoughts, ideas, and insights",
  openGraph: {
    title: "Writings | Ascent",
    description: "Explore our collection of thoughts, ideas, and insights",
    type: "website",
  },
};

export default function WritingsPage() {
  const writings = getWritings();

  return (
    <main className="w-screen min-h-screen">
      <div className="w-full min-h-screen flex flex-col items-start max-w-3xl mx-auto">
        {writings.map((writing) => (
          <Link key={writing.slug} href={`/writings/${writing.slug}`}>
            {writing.title}
          </Link>
        ))}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen  py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Writings</h1>
          <p className="text-xl text-gray-600">
            Thoughts, ideas, and insights from our journey
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {writings.map((writing) => (
            <article
              key={writing.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {writing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link
                    href={`/writings/${writing.slug}`}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {writing.title}
                  </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {writing.description}
                </p>

                <div className="flex items-center justify-between">
                  <time className="text-sm text-gray-500">
                    {new Date(writing.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>

                  <Link
                    href={`/writings/${writing.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {writings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No writings available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
