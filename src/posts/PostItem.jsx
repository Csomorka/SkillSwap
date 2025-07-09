import { formatDate } from "../helpers";
import { useAuth } from "../contexts/AuthContext";
import { HiOutlineTrash } from "react-icons/hi2";
import DeleteButton from "../ui/DeleteButton";

import { NavLink } from "react-router-dom";
import { useDeletePost } from "./useDeletePost";

import { useGetProfile } from "../profiles/useGetProfile";
import SkillItem from "../ui/SkillItem";

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

  const { deletePost, isDeletingPost } = useDeletePost();
  const { profile, isLoading } = useGetProfile(user_id);
  const isAuthor = user.id === user_id;

  if (isLoading) return null;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-amber-100 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <NavLink
          to={`/profile/${user_id}`}
          className="group flex items-center gap-3"
        >
          <img
            className="h-10 w-10 rounded-full object-cover object-top"
            src={profile.avatarUrl}
            alt={`${profile.fullName}'s profile`}
          />
          <div>
            <h5 className="font-medium text-stone-800 group-hover:text-amber-600">
              {profile.fullName}
            </h5>
            <p className="text-xs text-stone-500">{formatDate(created_at)}</p>
          </div>
        </NavLink>

        {isAuthor && (
          <DeleteButton
            isDeletingPost={isDeletingPost}
            onDelete={() => deletePost(postId)}
          >
            <HiOutlineTrash className="h-5 w-5" />
          </DeleteButton>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">{title}</h2>
        <p className="text-stone-700">{description}</p>

        {skillsNeeded?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {JSON.parse(skillsNeeded)?.map((skill) => (
              <SkillItem key={skill}>{skill}</SkillItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//   return (
//     <div className="rounded-3xl border border-amber-400 bg-white p-4">
//       <NavLink
//         to={`/profile/${user_id}`}
//         className="mb-2 flex items-center gap-3"
//       >
//         <img
//           className="h-8 w-8 rounded-full"
//           src={profile.avatarUrl}
//           alt={`${profile.fullName}'s profile picture`}
//         />
//         <h5 className="font-semibold hover:text-amber-700">
//           {profile.fullName}
//         </h5>
//         {isAuthor ? (
//           <DeleteButton
//             isDeletingPost={isDeletingPost}
//             onDelete={() => deletePost(postId)}
//           >
//             <HiOutlineTrash />
//           </DeleteButton>
//         ) : null}
//       </NavLink>
//       <div className="flex flex-col gap-2">
//         <h2 className="text-2xl font-bold">{title}</h2>
//         <p className="text-xl text-stone-600">{description}</p>
//         <div className="flex flex-wrap gap-2">
//           {JSON.parse(skillsNeeded)?.map((skill) => (
//             <SkillItem key={skill}>{skill}</SkillItem>
//           ))}
//         </div>
//         <p className="text-sm text-stone-400">{formatDate(created_at)}</p>
//       </div>
//     </div>
//   );
// }

export default PostItem;
