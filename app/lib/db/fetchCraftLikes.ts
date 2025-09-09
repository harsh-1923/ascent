export const fetchCraftLikes = async (id: string) => {
  try {
    const response = await fetch(`/api/craft/${id}/like`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }
    
    const data = await response.json();
    return data.like_count;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
};
