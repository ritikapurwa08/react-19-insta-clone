import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react"; // Assuming you're using Lucide icons for the menu

const HomePageLeftSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const leftSidebarNavigation = [
    { id: 1, name: "home", path: "/" },
    { id: 2, name: "TrendingBlog", path: "/trending-blog" },
    { id: 3, name: "MostLikedBlog", path: "/most-liked-blog" },
    { id: 4, name: "MostSavedBlog", path: "/most-saved-blog" },
    { id: 5, name: "Users", path: "/users" },
  ];

  return (
    <>
      {/* Menu Button for smaller screens */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        id="left-sidebar"
        className={`basis-1/4 md:basis-1/5 shrink-0 sticky top-0 h-screen overflow-y-auto transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div id="sidebar" className="border-gray-600 h-full">
          <div className="flex flex-col space-y-4 p-4">
            {leftSidebarNavigation.map((item) => (
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

export default HomePageLeftSidebar;
