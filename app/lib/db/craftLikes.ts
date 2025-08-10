import { fetchCraftLikes } from "./fetchCraftLikes";
import { updateCraftLikes } from "./updateCraftLikes";

export interface CraftLikesManager {
  getLikes: (id: string) => Promise<number>;
  incrementLikes: (id: string, currentLikes: number) => Promise<void>;
  handleLikeInteraction: (id: string, currentLikes: number) => Promise<number>;
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
  incrementLikes: async (id: string, currentLikes: number): Promise<void> => {
    try {
      await updateCraftLikes(id, 1, currentLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
      throw error;
    }
  },

  /**
   * Handle a complete like interaction - update with new count
   */
  handleLikeInteraction: async (
    id: string,
    newLikeCount: number
  ): Promise<void> => {
    await updateCraftLikes(id, 1, newLikeCount - 1);
  },
};
