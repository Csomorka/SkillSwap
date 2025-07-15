import { useQuery } from "@tanstack/react-query";

import PostItem from "../posts/PostItem";
import { getPosts } from "../services/apiPosts";
import { useAuth } from "../contexts/AuthContext";
import MessageButton from "../ui/MessageButton";
import Loader from "../ui/Loader";
import { getOrCreateConversation } from "../services/apiMessages";
import { useNavigate } from "react-router-dom";
import SkillItem from "../ui/SkillItem";
import { useGetProfile } from "./useGetProfile";
import { getRatings } from "../services/apiRatings";
import ProfileRating from "../ui/ProfileRating";
import { HiMiniStar } from "react-icons/hi2";

function Profile({ userId }) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { profile, error, isLoading, isError } = useGetProfile(userId);

  const {
    data: ratings,
    isLoadingRating,
    isRatingError,
  } = useQuery({
    queryKey: ["ratings"],
    queryFn: () => getRatings(userId),
  });

  const {
    data: posts,
    isLoadingPost,
    isPostError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading || isLoadingPost || isLoadingRating) return <Loader />;
  if (isError || isPostError || isRatingError)
    return <p>Error: {error.message}</p>;
  if (!profile || profile.length === 0) return <p>No profile found.</p>;
  if (!posts || posts.length === 0) return <p>No posts found.</p>;

  const usersPosts = posts.filter((post) => post.user_id === userId);

  const averageRating =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : null;

  const { fullName, bio, skillsOffered, avatarUrl } = profile;

  async function handleSendMessage(userId1, userId2) {
    try {
      const conversation = await getOrCreateConversation(userId1, userId2);
      navigate(`/messages/${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Avatar */}
        <div className="relative">
          <img
            className="h-40 w-40 rounded-full border-4 border-amber-400 object-cover object-top shadow-lg"
            src={avatarUrl}
            alt={fullName}
          />
        </div>

        {/* Name, Bio, Rating */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>

            {/* Average Rating */}
            {averageRating && (
              <div className="mt-2 flex items-center text-lg text-yellow-500">
                <HiMiniStar size={20} className="mr-1" />
                <span className="font-semibold">
                  {averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({ratings.length} review{ratings.length > 1 ? "s" : ""})
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mt-4 max-w-2xl rounded-lg bg-gray-50 p-4">
            <h2 className="mb-2 text-lg font-semibold">About</h2>
            <p className="text-gray-600">
              {bio || "This user hasn't written a bio yet."}
            </p>
          </div>
        </div>

        {/* Message Button */}
        {userId !== currentUser.id && (
          <div className="mt-4 md:mt-0">
            <MessageButton
              handleMessage={() => handleSendMessage(currentUser.id, userId)}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {/* Skills Section */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Skills Offered</h2>
            <div className="flex flex-wrap gap-2">
              {skillsOffered?.length > 0 ? (
                skillsOffered.map((skill) => (
                  <SkillItem key={skill}>{skill}</SkillItem>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-8 md:col-span-2">
          {/* Posts */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              {usersPosts.length > 0
                ? `Posts (${usersPosts.length})`
                : "No Posts Yet"}
            </h2>
            <div className="space-y-4">
              {usersPosts.map((post) => (
                <PostItem post={post} key={post.id} />
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          {ratings && ratings.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <ProfileRating key={rating.id} rating={rating} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Profile;
