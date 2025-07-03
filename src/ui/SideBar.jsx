import Logo from "./Logo";
import MainNav from "./MainNav";

function SideBar() {
  return (
    <aside
      className="hidden border-r border-amber-400 p-[3.2rem_2.4rem] lg:block"
      style={{ gridRow: "1 / -1" }}
    >
      <Logo />
      <MainNav />
    </aside>
  );
}

export default SideBar;
