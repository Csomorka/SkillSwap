import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../services/supabase";
import Loader from "../ui/Loader";

function MessageInbox() {
  const [conversations, setConversations] = useState([]);
  const [partners, setPartners] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setIsloading(true);

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
      setIsloading(false);
    };

    fetchConversations();
  }, [user]);

  const openChat = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  const isConversation = conversations.length === 0;

  return (
    <div className="h-screen bg-stone-100 px-16 py-20">
      {isLoading ? (
        <Loader />
      ) : isConversation ? (
        <p className="text-lg text-stone-700">
          There is no conversation yet...☹️ Start your first conversation by
          messaging someone!
        </p>
      ) : (
        <>
          <h2 className="mb-3 text-lg font-bold">Your Chats</h2>
          <ul className="space-y-3">
            {conversations.map((c) => {
              const otherUserId =
                c.user1_id === user.id ? c.user2_id : c.user1_id;
              const partner = partners[otherUserId];

              return (
                <li
                  key={c.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 shadow hover:bg-stone-100"
                  onClick={() => openChat(c.id)}
                >
                  {partner?.avatarUrl ? (
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-stone-300" />
                  )}
                  <p className="text-sm">
                    {partner?.fullName || "Unknown User"}
                  </p>
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
