import { useAuth } from "../contexts/AuthContext";
import Profile from "../profiles/Profile";

function Account() {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-stone-100 p-[4rem_4.8rem_6.4rem]">
      <Profile userId={user.id} />
    </div>
  );
}

export default Account;
