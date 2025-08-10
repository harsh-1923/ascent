import { toast } from "sonner";
import { supabase } from "./supabase";

export const updateCraftLikes = async (
  id: string,
  increment: number = 1,
  currentLikes: number
) => {
  try {
    const { error } = await supabase
      .from("craft_likes")
      .update({ like_count: currentLikes + increment })
      .eq("craft_id", id);

    if (error) {
      toast.error("Error updating likes");
    }
  } catch (error) {
    toast.error("Error updating likes");
  }
};
