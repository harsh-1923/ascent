import { supabase } from "./supabase";

export const fetchCraftLikes = async (id: string) => {
  try {
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
          return 0;
        }
      }
      console.error("Error fetching likes:", error);
    } else {
      return data.like_count;
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
  }
};
