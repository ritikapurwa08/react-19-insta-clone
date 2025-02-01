import HomePageLeftSidebar from "@/components/home-page-left-sidebar";
import HomePageRightSidebar from "@/components/home-page-right-sidebar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="flex flex-row w-screen h-screen   overflow-hidden">
      <div className="flex flex-row max-w-7xl container w-full  mx-auto  ">
        <HomePageLeftSidebar />
        <div className="flex-grow overflow-y-auto hide-scrollbar ">
          <Outlet />
        </div>
        <HomePageRightSidebar />
      </div>
    </main>
  );
};

export default HomePage;
