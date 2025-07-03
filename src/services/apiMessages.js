import supabase from "./supabase";

export async function getOrCreateConversation(user1Id, user2Id) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`,
    )
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  if (data) return data;

  const { data: newConv, error: insertError } = await supabase
    .from("conversations")
    .insert([{ user1_id: user1Id, user2_id: user2Id }])
    .select()
    .single();

  if (insertError) throw insertError;

  return newConv;
}

export async function sendMessage({ conversationId, senderId, content }) {
  // Fetch the conversation to determine the receiver_id
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (convError) throw convError;

  const receiverId =
    conversation.user1_id === senderId
      ? conversation.user2_id
      : conversation.user1_id;

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// export async function sendMessage({ conversationId, senderId, content }) {
//   const { data, error } = await supabase
//     .from("messages")
//     .insert([
//       {
//         conversation_id: conversationId,
//         sender_id: senderId,
//         content,
//       },
//     ])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }
