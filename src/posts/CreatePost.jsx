import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { getAccount } from "../services/apiAccount";
import { useEffect, useState } from "react";
import { stringToArray } from "../helpers";
import { createPost as createPostApi } from "../services/apiPosts";
import { HiOutlineX } from "react-icons/hi";

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
    createPost(postForm);
  }

  function handleChange(e) {
    e.preventDefault();

    const { name, value } = e.target;

    setPostForm((prev) => ({
      ...prev,
      [name]: name === "skillsNeeded" ? stringToArray(value) : value,
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
    <div className="m-4 bg-white p-4">
      <div className="mb-2 flex items-center gap-3">
        <img
          className="h-6 w-6 rounded-full"
          src={avatarUrl}
          alt={`${fullName}'s profile picture`}
        />
        <h5>{fullName}</h5>
        <button onClick={() => togglePostForm((prev) => !prev)}>
          <HiOutlineX className="h6 w-6" />
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={postForm.title}
          placeholder="Title of the post"
          onChange={handleChange}
          disabled={isCreating}
        />

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={postForm.description}
          placeholder="Write down what you need help with"
          onChange={handleChange}
          disabled={isCreating}
        />

        <label>Skills you need</label>
        <input
          type="text"
          name="skillsNeeded"
          value={postForm.skillsNeeded}
          placeholder="Gardening, React, movin etc..."
          onChange={handleChange}
          disabled={isCreating}
        />

        <button type="submit" disabled={isCreating}>
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
