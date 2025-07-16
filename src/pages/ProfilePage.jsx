import { useParams } from "react-router-dom";
import Profile from "../profiles/Profile";
import BackButton from "../ui/BackButton";

function ProfilePage() {
  const { userId } = useParams();

  return (
    <div className="relative h-screen bg-stone-100 px-2 py-4 lg:px-16 lg:py-20">
      <Profile userId={userId} />
      <BackButton />
    </div>
  );
}

export default ProfilePage;
