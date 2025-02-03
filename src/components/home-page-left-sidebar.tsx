import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// Assuming you're using Lucide icons for the menu

const HomePageLeftSidebar = () => {
  const leftSidebarNavigation = [
    { id: 1, name: "home", path: "/" },
    { id: 2, name: "TrendingBlog", path: "/trending" },
    { id: 3, name: "MostLikedBlog", path: "/most-liked" },
    { id: 4, name: "MostSavedBlog", path: `/most-saved` },
    { id: 5, name: "Users", path: "/users" },
  ];

  return (
    <div
      id="left-sidebar"
      className={`basis-1/4 min-w-full md:basis-1/5 shrink-0 sticky top-0 h-screen overflow-y-auto transform transition-transform duration-200 ease-in-out `}
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
  );
};

export default HomePageLeftSidebar;
