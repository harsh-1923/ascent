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
    const { increment = 1 } = await request.json();

    // Basic validation
    if (typeof increment !== 'number') {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Atomic increment in the DB (like_count = like_count + increment) so that
    // rapid / concurrent likes can't overwrite each other.
    const { data, error } = await supabase.rpc("increment_craft_like", {
      p_craft_id: id,
      p_increment: increment,
    });

    if (error) {
      console.error("Error updating likes:", error);
      return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
    }

    return NextResponse.json({ success: true, new_count: data });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}