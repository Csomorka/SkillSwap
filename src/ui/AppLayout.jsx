import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import { useState } from "react";
import MobileNav from "./MobileNav";

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleNav() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <div className="relative h-screen lg:grid lg:grid-cols-[1.5fr_4fr] lg:grid-rows-[auto_1fr]">
        <Header toggleNav={toggleNav} />
        <SideBar />
        <main className="overflow-x-scroll bg-stone-100">
          <Outlet />
        </main>
      </div>

      {isOpen && <MobileNav toggleNav={toggleNav} />}
    </>
  );
}

export default AppLayout;
