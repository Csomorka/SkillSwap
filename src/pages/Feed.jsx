import { useQuery } from "@tanstack/react-query";
import CreatePost from "../posts/CreatePost";
import { getPosts } from "../services/apiPosts";
import PostItem from "../posts/PostItem";
import Loader from "../ui/Loader";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Feed() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: posts,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;
  if (!posts || posts.length === 0) return <p>No posts found.</p>;

  const otherUsersPosts = posts.filter((post) => post.user_id !== user.id);
  const numPosts = otherUsersPosts.length;

  return (
    <div className="h-screen bg-stone-100 p-[1rem_4.8rem_6.4rem]">
      <div className="flex justify-between pb-8">
        <p className="text-stone-400">{numPosts} posts found</p>
        {!isOpen && (
          <button
            className="rounded-3xl bg-amber-300 px-4 py-2 text-stone-700 hover:bg-amber-400"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Create post
          </button>
        )}
      </div>
      {isOpen && <CreatePost togglePostForm={setIsOpen} />}
      <div className="grid gap-8 md:grid-cols-2">
        {otherUsersPosts.map((post) => (
          <PostItem post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
