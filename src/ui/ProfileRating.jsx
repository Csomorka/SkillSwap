import { HiMiniStar } from "react-icons/hi2";
import { useGetProfile } from "../profiles/useGetProfile";
import Loader from "./Loader";

export default function ProfileRating({ rating }) {
  const { profile, isLoading } = useGetProfile(rating.rater_id);

  if (isLoading) return <Loader />;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={profile.avatarUrl}
          alt={profile.fullName}
          className="h-12 w-12 rounded-full border object-cover object-top"
        />

        <div>
          {/* Name + Stars */}
          <div className="mb-1 flex items-center gap-2">
            <span className="font-semibold text-gray-800">
              {profile.fullName}
            </span>
            <div className="flex items-center text-yellow-500">
              {Array.from({ length: rating.rating }, (_, i) => (
                <HiMiniStar key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>

          {/* Review Text */}
          <p className="text-sm text-gray-700">{rating.review}</p>
        </div>
      </div>
    </div>
  );
}
