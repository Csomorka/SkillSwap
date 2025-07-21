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
      <div className="relative min-h-[100vh] lg:grid lg:h-screen lg:grid-cols-[1.5fr_4fr] lg:grid-rows-[auto_1fr]">
        <Header toggleNav={toggleNav} />
        <SideBar />
        <main className="overflow-x-auto bg-stone-100 md:px-4 md:py-4 lg:overflow-x-scroll">
          <Outlet />
        </main>
      </div>

      {isOpen && <MobileNav toggleNav={toggleNav} />}
    </>
  );
}

export default AppLayout;
