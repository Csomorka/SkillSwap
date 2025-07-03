import { HiBars3 } from "react-icons/hi2";

function Header({ toggleNav }) {
  return (
    <header className="flex items-center justify-between border-t-4 border-t-amber-400 px-4 lg:border-none lg:border-b-amber-400">
      <button onClick={toggleNav}>
        <HiBars3 className="h-8 w-8 hover:text-amber-400 lg:hidden" />
      </button>
      <p className="border-b border-teal-100 p-[0.6rem_2.4rem] text-start text-xl font-bold uppercase tracking-widest text-amber-600 lg:p-[1.2rem_4.8rem] lg:text-2xl">
        SkillSwap
      </p>
    </header>
  );
}

export default Header;
