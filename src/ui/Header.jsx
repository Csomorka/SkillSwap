import { HiBars3 } from "react-icons/hi2";

function Header({ toggleNav }) {
  return (
    <header className="flex items-center justify-between border-t-4 border-t-amber-400 px-3 lg:border-none lg:border-b-amber-400">
      <button onClick={toggleNav}>
        <HiBars3 className="h-6 w-6 hover:text-amber-400 lg:hidden" />
      </button>
      <p className="border-b px-6 py-2 text-start text-lg font-bold uppercase tracking-widest text-amber-600 lg:px-12 lg:py-4 lg:text-xl">
        SkillSwap
      </p>
    </header>
  );
}

export default Header;
