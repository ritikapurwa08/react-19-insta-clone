import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react"; // Assuming you're using Lucide icons for the menu

const HomePageRightSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const rightSidebarNavigation = [
    { id: 1, name: "YourPost", path: "/your-post" },
    { id: 2, name: "LikedPost", path: "/liked-post" },
    { id: 3, name: "SavedPost", path: "/saved-post" },
    { id: 4, name: "Messages", path: "/messages" },
    { id: 5, name: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* Menu Button for smaller screens */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        id="right-sidebar"
        className={`basis-1/4 md:basis-1/5 shrink-0 sticky top-0 h-screen overflow-y-auto transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div id="sidebar" className="border-gray-600 h-full">
          <div className="flex flex-col space-y-4 p-4">
            {rightSidebarNavigation.map((item) => (
              <Link to={item.path} key={item.id}>
                <Button variant="outline" size="default">
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageRightSidebar;
