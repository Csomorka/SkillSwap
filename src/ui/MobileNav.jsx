import { HiXMark } from "react-icons/hi2";
import NavElements from "./NavElements";

function MobileNav({ toggleNav }) {
  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-white/60 backdrop-blur-sm">
      <button onClick={toggleNav}>
        <HiXMark className="absolute left-5 top-5 h-6 w-6 cursor-pointer hover:text-amber-400 lg:hidden" />
      </button>
      <NavElements onClick={toggleNav} />
    </div>
  );
}

export default MobileNav;
