import { useParams } from "react-router-dom";
import Profile from "../profiles/Profile";
import BackButton from "../ui/BackButton";

function ProfilePage() {
  const { userId } = useParams();

  return (
    <div className="relative h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
      <Profile userId={userId} />
      <BackButton />
    </div>
  );
}

export default ProfilePage;
