import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../services/apiAccount";
import PostItem from "../posts/PostItem";
import { getPosts } from "../services/apiPosts";
import { useAuth } from "../contexts/AuthContext";
import MessageButton from "../ui/MessageButton";
import { getOrCreateConversation } from "../services/apiMessages";
import { useNavigate } from "react-router-dom";

function Profile({ userId }) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: profile,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getAccount(userId),
  });

  const {
    data: posts,
    isLoadingPost,
    isPostError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading || isLoadingPost) return <p>Loading profile...</p>;
  if (isError || isPostError) return <p>Error: {error.message}</p>;
  if (!profile || profile.length === 0) return <p>No profile found.</p>;
  if (!posts || posts.length === 0) return <p>No posts found.</p>;

  const usersPosts = posts.filter((post) => post.user_id === userId);

  const { fullName, bio, skillsOffered, avatarUrl } = profile;

  async function handleSendMessage(userId1, userId2) {
    try {
      const conversation = await getOrCreateConversation(userId1, userId2);
      navigate(`/messages/${conversation.id}`); // Navigate to the chat
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 lg:relative lg:flex lg:items-start lg:justify-between">
        <img
          className="[solid_1px] h-48 w-48 rounded-full border-[5px] border-amber-400 object-cover object-top md:h-52 md:w-52 lg:h-56 lg:w-56"
          src={avatarUrl}
        />
        <h2 className="border-b-2 border-stone-400 p-2 text-2xl font-bold text-stone-700 md:text-3xl lg:absolute lg:bottom-8 lg:right-20">
          {fullName}
        </h2>
      </div>
      <div className="flex flex-col gap-4 p-4 md:grid md:h-96 md:grid-cols-2">
        <div className="rounded-xl bg-stone-200 p-4">
          <h3>Bio</h3>
          <p>{bio}</p>
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-rows-3">
          <div className="rounded-xl bg-stone-200 p-4 md:row-span-1">
            {usersPosts.map((post) => (
              <PostItem post={post} key={post.id} />
            ))}
          </div>
          <div className="rounded-xl bg-stone-200 p-4 md:row-span-2">
            <h3>Offered skills</h3>
            <p className="text-green-500">{skillsOffered?.join(", ")}</p>
          </div>
        </div>
        {userId !== currentUser.id ? (
          <MessageButton
            handleMessage={() => handleSendMessage(currentUser.id, userId)}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default Profile;
