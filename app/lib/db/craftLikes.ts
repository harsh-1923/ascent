import { fetchCraftLikes } from "./fetchCraftLikes";
import { updateCraftLikes } from "./updateCraftLikes";

export interface CraftLikesManager {
  getLikes: (id: string) => Promise<number>;
  incrementLikes: (id: string) => Promise<void>;
  handleLikeInteraction: (id: string) => Promise<number>;
}

export const craftLikesManager: CraftLikesManager = {
  /**
   * Fetch the current like count for a craft
   */
  getLikes: async (id: string): Promise<number> => {
    try {
      const likes = await fetchCraftLikes(id);
      return likes || 0;
    } catch (error) {
      console.error("Error fetching likes:", error);
      return 0;
    }
  },

  /**
   * Increment likes by 1 for a craft
   */
  incrementLikes: async (id: string): Promise<void> => {
    try {
      await updateCraftLikes(id, 1);
    } catch (error) {
      console.error("Error updating likes:", error);
      throw error;
    }
  },

  /**
   * Handle a complete like interaction - returns the authoritative new count
   */
  handleLikeInteraction: async (id: string): Promise<number> => {
    return await updateCraftLikes(id, 1);
  },
};
