import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("craft_likes")
      .select("like_count")
      .eq("craft_id", id)
      .single();

    if (error) {
      // If record doesn't exist, create it
      if (error.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("craft_likes")
          .insert({ craft_id: id, like_count: 0 });

        if (!insertError) {
          return NextResponse.json({ like_count: 0 });
        }
      }
      console.error("Error fetching likes:", error);
      return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
    }

    return NextResponse.json({ like_count: data.like_count });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { increment = 1, currentLikes } = await request.json();

    // Basic validation
    if (typeof increment !== 'number' || typeof currentLikes !== 'number') {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Simple rate limiting: check if this IP has liked this craft recently
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // For now, we'll implement a basic update
    const { error } = await supabase
      .from("craft_likes")
      .update({ like_count: currentLikes + increment })
      .eq("craft_id", id);

    if (error) {
      console.error("Error updating likes:", error);
      return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
    }

    return NextResponse.json({ success: true, new_count: currentLikes + increment });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}