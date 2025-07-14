import supabase from "./supabase";

export async function getRatings(userId) {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("ratee_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching ratings:", error.message);
    return [];
  }

  return data;
}
