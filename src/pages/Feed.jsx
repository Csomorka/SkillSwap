import { useQuery } from "@tanstack/react-query";
import CreatePost from "../posts/CreatePost";
import { getPosts } from "../services/apiPosts";
import PostItem from "../posts/PostItem";
import Loader from "../ui/Loader";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useGetProfile } from "../profiles/useGetProfile";
import { normalizeSkills } from "../helpers";

function Feed() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { profile, isLoadingProfile, profileError } = useGetProfile(user.id);
  const [showSorted, setShowSorted] = useState(false);

  const {
    data: allPosts,
    postError,
    isLoadingPosts,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoadingPosts || isLoadingProfile) return <Loader />;
  if (isError) return <p>Error: {postError.message || profileError.message}</p>;
  if (!allPosts || allPosts.length === 0) return <p>No posts found.</p>;

  const otherUsersPostsAll = allPosts.filter(
    (post) => post.user_id !== user.id,
  );

  const userSkillsOffered = profile.skillsOffered.map((s) => s.toLowerCase());
  const matchingPosts = otherUsersPostsAll.filter((post) => {
    const skillsNeededArray = normalizeSkills(post.skillsNeeded).map((skill) =>
      skill.toLowerCase().trim(),
    );
    return skillsNeededArray.some((skill) => userSkillsOffered.includes(skill));
  });

  const numPosts = showSorted
    ? matchingPosts.length
    : otherUsersPostsAll.length;

  return (
    <div className="h-screen bg-stone-100 px-4 py-2 lg:px-16 lg:py-12">
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <p className="min-w-[90px] text-sm text-stone-400">
            {numPosts} {numPosts === 1 ? "post" : "posts"} found
          </p>
          <button
            onClick={() => setShowSorted((prev) => !prev)}
            className="min-w-[120px] rounded-md bg-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-300"
          >
            {showSorted ? "Show all" : "Sorted by skills"}
          </button>
        </div>
        {!isOpen && (
          <button
            className="min-w-[110px] rounded-3xl bg-amber-300 px-3 py-1.5 font-semibold text-stone-700 hover:bg-amber-400"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Create post
          </button>
        )}
      </div>

      {isOpen && <CreatePost togglePostForm={setIsOpen} />}

      <div className="grid gap-6 md:grid-cols-2">
        {(showSorted ? matchingPosts : otherUsersPostsAll).map((post) => (
          <PostItem post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
