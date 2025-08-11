import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings | Ascent",
  description: "Explore our collection of thoughts, ideas, and insights",
};

export default function WritingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
