import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAccount, updateAccount } from "../services/apiAccount";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { stringToArray } from "../helpers";

function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: () => getAccount(user.id),
  });

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    password: "",
    avatarUrl: "",
    skillsOffered: "",
  });

  const updateMutation = useMutation({
    mutationFn: async ({ profileUpdates, password }) => {
      if (password) {
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
      }

      if (Object.keys(profileUpdates).length > 0) {
        return await updateAccount(user.id, profileUpdates);
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", user.id]);
      alert("Settings updated successfully!");
    },
    onError: (error) => {
      alert("Error updating settings:" + error.message);
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const { fullName, bio, skillsOffered } = profile;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileUpdates = {};
    if (formData.fullName && formData.fullName !== fullName) {
      profileUpdates.fullName = formData.fullName;
    }
    if (formData.bio && formData.bio !== bio) {
      profileUpdates.bio = formData.bio;
    }

    if (formData.skillsOffered && formData.skillsOffered !== skillsOffered) {
      profileUpdates.skillsOffered = stringToArray(formData.skillsOffered);
    }

    if (formData.avatarUrl) {
      try {
        const file = formData.avatarUrl;
        const fileName = `avatar-${user.id}-${Math.random().toString(36).substring(2, 9)}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        profileUpdates.avatarUrl = publicUrl;
      } catch (error) {
        alert("failed");
        console.error(error);
        return;
      }
    }

    await updateMutation.mutateAsync({
      profileUpdates,
      password: formData.password,
    });
  };

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : e.target.value,
    }));
  };

  return (
    <div className="h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
      <form
        className="grid grid-cols-2 grid-rows-3 gap-2"
        onSubmit={handleSubmit}
      >
        <label>Change name</label>

        <input
          type="text"
          name="fullName"
          placeholder="your name"
          defaultValue={fullName}
          onChange={handleChange}
        />

        <label>Change password</label>
        <input
          type="password"
          name="password"
          placeholder=" new password"
          onChange={handleChange}
        />

        <label>Change Bio</label>
        <input
          type="text"
          name="bio"
          placeholder="your bio"
          defaultValue={bio}
          onChange={handleChange}
        />

        <label>Your offered skills</label>
        <input
          type="text"
          name="skillsOffered"
          placeholder="Type your skills"
          defaultValue={skillsOffered}
          onChange={handleChange}
        />

        <label>Upload profile picture</label>
        <input
          name="avatarUrl"
          accept="image/*"
          type="file"
          onChange={handleChange}
        />

        <button type="submit" disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? "Updating..." : "Update Settings"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
