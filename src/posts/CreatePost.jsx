import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { getAccount } from "../services/apiAccount";
import { useEffect, useState } from "react";
import { stringToArray } from "../helpers";
import { createPost as createPostApi } from "../services/apiPosts";
import { HiOutlineX } from "react-icons/hi";
import { HiOutlinePlusCircle } from "react-icons/hi2";

function CreatePost({ togglePostForm }) {
  const { user } = useAuth();
  const {
    data: profile,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: () => getAccount(user.id),
  });

  const queryClient = useQueryClient();

  const initialFormState = {
    user_id: user?.id || "",
    title: "",
    description: "",
    skillsOffered: "",
    skillsNeeded: "",
  };

  const [postForm, setPostForm] = useState(initialFormState);

  const { mutate: createPost, isLoading: isCreating } = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      alert("New post successfully created");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      resetPostForm();
      togglePostForm((prev) => !prev);
    },
    onError: (error) => alert(error.message),
  });

  useEffect(() => {
    if (profile) {
      setPostForm((prev) => ({
        ...prev,
        user_id: profile.user_id,
        skillsOffered: profile.skillsOffered,
      }));
    }
  }, [profile]);

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!profile || profile.length === 0) return <p>No profile found.</p>;

  const { fullName, avatarUrl } = profile;

  function handleSubmit(e) {
    e.preventDefault();
    createPost({
      ...postForm,
      skillsNeeded: stringToArray(postForm.skillsNeeded),
    });
  }

  function handleChange(e) {
    e.preventDefault();

    const { name, value } = e.target;

    setPostForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetPostForm() {
    setPostForm({
      ...initialFormState,
      user_id: user?.id || "",
      skillsOffered: profile?.skillsOffered || "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={avatarUrl}
              alt={`${fullName}'s profile picture`}
            />
            <h5 className="text-lg font-medium text-gray-900">{fullName}</h5>
          </div>
          <button
            onClick={() => togglePostForm((prev) => !prev)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={postForm.title}
              placeholder="What's your project about?"
              onChange={handleChange}
              disabled={isCreating}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={postForm.description}
              placeholder="Describe what you need help with..."
              onChange={handleChange}
              disabled={isCreating}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Skills needed
            </label>
            <input
              type="text"
              name="skillsNeeded"
              value={postForm.skillsNeeded}
              placeholder="React, Gardening, Design..."
              onChange={handleChange}
              disabled={isCreating}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
            <p className="text-xs text-gray-500">Separate skills with commas</p>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <HiOutlinePlusCircle className="h-5 w-5" />
            {isCreating ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className="m-4 bg-white p-4">
  //     <div className="mb-2 flex items-center gap-3">
  //       <img
  //         className="h-6 w-6 rounded-full"
  //         src={avatarUrl}
  //         alt={`${fullName}'s profile picture`}
  //       />
  //       <h5>{fullName}</h5>
  //       <button onClick={() => togglePostForm((prev) => !prev)}>
  //         <HiOutlineX className="h6 w-6" />
  //       </button>
  //     </div>

  //     <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
  //       <label>Title</label>
  //       <input
  //         type="text"
  //         name="title"
  //         value={postForm.title}
  //         placeholder="Title of the post"
  //         onChange={handleChange}
  //         disabled={isCreating}
  //       />

  //       <label>Description</label>
  //       <input
  //         type="text"
  //         name="description"
  //         value={postForm.description}
  //         placeholder="Write down what you need help with"
  //         onChange={handleChange}
  //         disabled={isCreating}
  //       />

  //       <label>Skills you need</label>
  //       <input
  //         type="text"
  //         name="skillsNeeded"
  //         value={postForm.skillsNeeded}
  //         placeholder="Gardening, React, movin etc..."
  //         onChange={handleChange}
  //         disabled={isCreating}
  //       />

  //       <button type="submit" disabled={isCreating}>
  //         Post
  //       </button>
  //     </form>
  //   </div>
  // );
}

export default CreatePost;
