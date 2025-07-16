import { useAuth } from "../contexts/AuthContext";
import Profile from "../profiles/Profile";

function Account() {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-stone-100 px-2 py-4 lg:px-16 lg:py-20">
      <Profile userId={user.id} />
    </div>
  );
}

export default Account;
