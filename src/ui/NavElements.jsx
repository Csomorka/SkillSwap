import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiArrowRightStartOnRectangle,
} from "react-icons/hi2";
import { useAuth } from "../contexts/AuthContext";

function NavElements({ onClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    onClick?.();
    navigate("/login");
  }

  return (
    <ul className="flex flex-col gap-2">
      <li>
        <NavLink
          to="/feed"
          className="group flex items-center gap-5 p-4 text-xl text-stone-500 hover:bg-stone-100 [&.active]:bg-stone-100 [&.active]:text-amber-600"
          onClick={onClick}
        >
          <HiOutlineHome className="h-7 w-7 transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600" />
          <span className="font-semibold transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600">
            Home
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/messages"
          className="group flex items-center gap-5 p-4 text-xl text-stone-500 hover:bg-stone-100 [&.active]:bg-stone-100 [&.active]:text-amber-600"
          onClick={onClick}
        >
          <HiOutlineEnvelope className="h-7 w-7 transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600" />
          <span className="font-semibold transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600">
            Messages
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/account"
          className="group flex items-center gap-5 p-4 text-xl text-stone-500 hover:bg-stone-100 [&.active]:bg-stone-100 [&.active]:text-amber-600"
          onClick={onClick}
        >
          <HiOutlineUser className="h-7 w-7 transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600" />
          <span className="font-semibold transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600">
            My Account
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/settings"
          className="group flex items-center gap-5 p-4 text-xl text-stone-500 hover:bg-stone-100 [&.active]:bg-stone-100 [&.active]:text-amber-600"
          onClick={onClick}
        >
          <HiOutlineCog6Tooth className="h-7 w-7 transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600" />
          <span className="font-semibold transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600">
            Settings
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/login"
          className="group flex items-center gap-5 p-4 text-xl text-stone-500 hover:bg-stone-100 [&.active]:bg-stone-100 [&.active]:text-amber-600"
          onClick={handleLogout}
        >
          <HiArrowRightStartOnRectangle className="h-7 w-7 transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600" />
          <span className="font-semibold transition-colors group-hover:text-amber-600 group-[.active]:text-amber-600">
            Log Out
          </span>
        </NavLink>
      </li>
    </ul>
  );
}

export default NavElements;
