import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Default Title";
    const name = searchParams.get("name") || "Harsh Sharma";
    const role = searchParams.get("role") || "Design Engineer";

    // Dynamic font sizing based on title length
    const titleLength = title.length;
    let titleFontSize = 64;
    if (titleLength > 50) titleFontSize = 48;
    if (titleLength > 80) titleFontSize = 36;
    if (titleLength > 120) titleFontSize = 28;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
            color: "#ffffff",
            padding: "40px",
            fontFamily: "Inter, system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)",
              opacity: 0.6,
            }}
          />
          {/* Accent line */}
          <div
            style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              borderRadius: "2px",
              marginBottom: "40px",
            }}
          />

          {/* Main title */}
          <h1
            style={{
              fontSize: `${titleFontSize}px`,
              fontWeight: "bold",
              textAlign: "center",
              margin: "0 0 40px 0",
              lineHeight: "1.1",
              maxWidth: "800px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {title}
          </h1>

          {/* Author info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: "32px",
                fontWeight: "600",
                color: "#e5e5e5",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#a3a3a3",
                fontWeight: "500",
                opacity: 0.9,
              }}
            >
              {role}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(
      `Error generating OG image: ${
        e instanceof Error ? e.message : "Unknown error"
      }`
    );
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
