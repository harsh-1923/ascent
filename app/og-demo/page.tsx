import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OG Image Demo",
  description: "Demo of dynamic OG image generation",
};

export default function OGDemoPage() {
  const demoTitles = [
    "Glyph Inspector",
    "Focus Accordion",
    "Through Tabs",
    "Chat Input",
    "Getting Started with Next.js",
    "Advanced TypeScript Tips and Tricks for Modern Web Development",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          OG Image Generator Demo
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          This page demonstrates the dynamic Open Graph image generation for
          your craft and writing pages. Each image below shows how the OG image
          would look when shared on social media.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoTitles.map((title, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">Generated OG Image</p>
              </div>
              <div className="p-4">
                <img
                  src={`/api/og?title=${encodeURIComponent(
                    title
                  )}&name=Harsh Sharma&role=Design Engineer`}
                  alt={`OG Image for ${title}`}
                  className="w-full h-auto rounded border"
                />
                <div className="mt-3 text-xs text-gray-500">
                  <p>
                    URL: /api/og?title={encodeURIComponent(title)}&name=Harsh
                    Sharma&role=Design Engineer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            How it works
          </h2>
          <ul className="text-blue-800 space-y-2">
            <li>
              • Each page automatically generates a unique OG image based on its
              title
            </li>
            <li>
              • Images include your name (Harsh Sharma) and role (Design
              Engineer)
            </li>
            <li>• Font size automatically adjusts for longer titles</li>
            <li>
              • Images are generated at 1200x630px for optimal social media
              sharing
            </li>
            <li>
              • The API route is located at{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">/api/og</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
