import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../services/supabase";

function MessageInbox() {
  const [conversations, setConversations] = useState([]);
  const [partners, setPartners] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      setConversations(data);

      const otherUserIds = data.map((c) =>
        c.user1_id === user.id ? c.user2_id : c.user1_id,
      );

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, fullName, avatarUrl")
        .in("user_id", otherUserIds);

      if (profileError) {
        console.error("Error fetching profiles:", profileError);
        return;
      }

      const profileMap = {};
      profiles.forEach((p) => {
        profileMap[p.user_id] = p;
      });

      setPartners(profileMap);
    };

    fetchConversations();
  }, [user]);

  const openChat = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  const isConversation = conversations.length > 0;

  return (
    <div className="h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
      {!isConversation ? (
        <p className="text-xl text-stone-700">
          There is no conversation yet...☹️ Start your first conversation by
          messaging someone!
        </p>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-bold">Your Chats</h2>
          <ul className="space-y-4">
            {conversations.map((c) => {
              const otherUserId =
                c.user1_id === user.id ? c.user2_id : c.user1_id;
              const partner = partners[otherUserId];

              return (
                <li
                  key={c.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg bg-white p-4 shadow hover:bg-stone-100"
                  onClick={() => openChat(c.id)}
                >
                  {partner?.avatarUrl ? (
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-stone-300" />
                  )}
                  <p>{partner?.fullName || "Unknown User"}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default MessageInbox;
