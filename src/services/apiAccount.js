import supabase from "./supabase";

// export async function getAccount() {
//   const { data, error } = await supabase.from("profiles").select("*");

//   if (error) {
//     console.error(error);
//     throw new Error("Profiles could not be loaded");
//   }

//   return data;
// }

export async function getAccount(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Profiles could not be loaded");
  }

  return data;
}

export async function updateAccount(id, updates) {
  const updatesToApply = {};

  if (updates.fullName !== undefined)
    updatesToApply.fullName = updates.fullName;
  if (updates.bio !== undefined) updatesToApply.bio = updates.bio;
  if (updates.skillsOffered !== undefined)
    updatesToApply.skillsOffered = updates.skillsOffered;
  if (updates.avatarUrl !== undefined)
    updatesToApply.avatarUrl = updates.avatarUrl;

  if (Object.keys(updatesToApply).length === 0) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updatesToApply)
    .eq("user_id", id)
    .select();

  console.log(updatesToApply);

  if (error) throw new Error(error.message);
  return data ? data[0] : null;
}
