import Logo from "./Logo";
import MainNav from "./MainNav";

function SideBar() {
  return (
    <aside
      className="hidden border-r border-amber-400 px-6 py-10 lg:block"
      style={{ gridRow: "1 / -1" }}
    >
      <Logo />
      <MainNav />
    </aside>
  );
}

export default SideBar;
