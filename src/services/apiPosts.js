import supabase from "./supabase";

export async function createPost(post) {
  const { data, error } = await supabase.from("posts").insert([post]).select();

  if (error) {
    console.error(error);
    throw new Error("Post could not be created");
  }
  return data;
}

export async function updatePost({ field, value, postId }) {
  const { data, error } = await supabase
    .from("posts")
    .update({ [field]: value })
    .eq("id", postId)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Post could not be created");
  }
  return data;
}

export async function getPosts() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("There was an error loading posts");
  }
  return posts;
}

export async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error(error);
    throw new Error("There was an error deleting the post");
  }
}
