import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccount } from "../services/apiAccount";
import { formatDate } from "../helpers";
import { useAuth } from "../contexts/AuthContext";
import { HiOutlineTrash } from "react-icons/hi2";
import DeleteButton from "../ui/DeleteButton";
import { deletePost } from "../services/apiPosts";
import { NavLink } from "react-router-dom";

function PostItem({ post }) {
  const { user } = useAuth();

  const {
    id: postId,
    user_id,
    title,
    description,
    skillsNeeded,
    created_at,
  } = post;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user_id],
    queryFn: () => getAccount(user_id),
  });

  const isAuthor = user.id === user_id;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      alert("Post successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (err) => alert(err.message),
  });

  if (isLoading) return <p>Loading post...</p>;

  return (
    <div className="rounded-3xl border border-amber-400 bg-white p-4">
      <NavLink
        to={`/profile/${user_id}`}
        className="mb-2 flex items-center gap-3"
      >
        <img
          className="h-8 w-8 rounded-full"
          src={profile.avatarUrl}
          alt={`${profile.fullName}'s profile picture`}
        />
        <h5 className="font-semibold">{profile.fullName}</h5>
        {isAuthor ? (
          <DeleteButton onDelete={() => mutate(postId)}>
            <HiOutlineTrash />
          </DeleteButton>
        ) : null}
      </NavLink>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-xl">{description}</p>
      <p>{skillsNeeded}</p>
      <p className="text-sm">{formatDate(created_at)}</p>
    </div>
  );
}

export default PostItem;
