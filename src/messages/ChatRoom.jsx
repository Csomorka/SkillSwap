import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../services/supabase";
import { sendMessage as apiSendMessage } from "../services/apiMessages";
import BackButton from "../ui/BackButton";
import { formatDate } from "../helpers";

export default function ChatRoom() {
  const { conversationId } = useParams();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  // Fetch messages from DB
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchMessages();
  }, [conversationId]);

  // Setup broadcast realtime
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const channel = supabase.channel(`chat-${conversationId}`, {
      config: {
        broadcast: { ack: true },
      },
    });

    channel
      .on("broadcast", { event: "new-message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe((status) => {
        console.log("📡 Broadcast channel status:", status);
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!currentUser || !channelRef.current) return;

    const content = newMessage.trim();
    if (!content) return;

    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");

    try {
      const savedMsg = await apiSendMessage({
        conversationId,
        senderId: currentUser.id,
        content,
      });

      // Send realtime message through WebSocket
      await channelRef.current.send({
        type: "broadcast",
        event: "new-message",
        payload: savedMsg,
      });

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? savedMsg : msg)),
      );
    } catch (err) {
      console.error("Sending message failed:", err.message);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  }

  return (
    <div className="relative h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
      <BackButton />
      <div className="flex h-screen w-full flex-col p-4">
        <h2 className="mb-4 text-2xl font-semibold">Chat Room</h2>

        <div className="flex-grow overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, index) => {
              const isOwn = msg.sender_id === currentUser?.id;
              return (
                <div
                  key={index}
                  className={`mb-3 flex ${
                    isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] break-words rounded-lg px-4 py-2 ${
                      isOwn
                        ? "rounded-br-none bg-green-200 text-green-900"
                        : "rounded-bl-none bg-white text-gray-900"
                    } shadow`}
                  >
                    <p>{msg.content}</p>
                    <span className="mt-1 block text-right text-xs text-gray-500">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="mt-4 flex gap-2"
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
