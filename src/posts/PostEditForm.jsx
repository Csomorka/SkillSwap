import toast from "react-hot-toast";
import { stringToArray } from "../helpers";
import { useUpdatePost } from "./useUpdatePost";

function PostEditForm({ post }) {
  const { id: postId, title, description, skillsNeeded } = post;
  const { isUpdating, updatePost } = useUpdatePost();

  function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    const updatedValue =
      field === "skillsNeeded" ? stringToArray(value) : value;

    const originalValue =
      field === "skillsNeeded" ? JSON.parse(skillsNeeded) : post[field];

    if (JSON.stringify(originalValue) === JSON.stringify(updatedValue)) return;

    updatePost({ field, value: updatedValue, postId });
  }

  return (
    <form className="space-y-3">
      {/* Title input styled like h2 */}
      <input
        autoFocus
        name="title"
        defaultValue={title}
        disabled={isUpdating}
        onBlur={(e) => handleUpdate(e, "title")}
        className="px-2 py-1 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      {/* Description input styled like p */}
      <textarea
        name="description"
        defaultValue={description}
        rows={3}
        disabled={isUpdating}
        onBlur={(e) => handleUpdate(e, "description")}
        className="w-full rounded-md border border-amber-200 px-2 py-1 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      {/* Skills input (raw for now) */}
      <input
        name="skillsNeeded"
        defaultValue={JSON.parse(skillsNeeded).join(", ")}
        disabled={isUpdating}
        onBlur={(e) => handleUpdate(e, "skillsNeeded")}
        className="w-full rounded-md border border-amber-200 px-2 py-1 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </form>
  );
}

export default PostEditForm;
