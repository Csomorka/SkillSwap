import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAccount, updateAccount } from "../services/apiAccount";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
import { stringToArray } from "../helpers";
import toast from "react-hot-toast";

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
      toast.success("Settings updated successfully!");
    },
    onError: (error) => {
      toast.error("Error updating settings:" + error.message);
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
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-stone-800">
          Account Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">
                  Bio
                </label>
                <textarea
                  name="bio"
                  defaultValue={bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-stone-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-stone-600">
                  Skills Offered
                </label>
                <input
                  type="text"
                  name="skillsOffered"
                  defaultValue={skillsOffered}
                  onChange={handleChange}
                  placeholder="Separate skills with commas"
                  className="w-full rounded-lg border border-stone-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Security</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                New Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Profile Picture</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Upload new avatar
              </label>
              <input
                type="file"
                name="avatarUrl"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-stone-500 file:mr-4 file:rounded file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isLoading}
            className="w-full rounded-lg bg-amber-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:opacity-50 sm:w-auto"
          >
            {updateMutation.isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

//   return (
//     <div className="h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
//       <form
//         className="grid grid-cols-2 grid-rows-3 gap-2"
//         onSubmit={handleSubmit}
//       >
//         <label>Change name</label>

//         <input
//           type="text"
//           name="fullName"
//           placeholder="your name"
//           defaultValue={fullName}
//           onChange={handleChange}
//         />

//         <label>Change password</label>
//         <input
//           type="password"
//           name="password"
//           placeholder=" new password"
//           onChange={handleChange}
//         />

//         <label>Change Bio</label>
//         <input
//           type="text"
//           name="bio"
//           placeholder="your bio"
//           defaultValue={bio}
//           onChange={handleChange}
//         />

//         <label>Your offered skills</label>
//         <input
//           type="text"
//           name="skillsOffered"
//           placeholder="Type your skills"
//           defaultValue={skillsOffered}
//           onChange={handleChange}
//         />

//         <label>Upload profile picture</label>
//         <input
//           name="avatarUrl"
//           accept="image/*"
//           type="file"
//           onChange={handleChange}
//         />

//         <button type="submit" disabled={updateMutation.isLoading}>
//           {updateMutation.isLoading ? "Updating..." : "Update Settings"}
//         </button>
//       </form>
//     </div>
//   );
// }

export default Settings;
