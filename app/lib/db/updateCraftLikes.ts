import { toast } from "sonner";

export const updateCraftLikes = async (id: string, increment: number = 1) => {
  try {
    const response = await fetch(`/api/craft/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment }),
    });

    if (!response.ok) {
      throw new Error('Failed to update likes');
    }

    const data = await response.json();
    return data.new_count;
  } catch (error) {
    console.error("Error updating likes:", error);
    toast.error("Error updating likes");
  }
};
