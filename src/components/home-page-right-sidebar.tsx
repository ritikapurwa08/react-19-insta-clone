import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const HomePageRightSidebar = () => {
  const rightSidebarNavigation = [
    { id: 1, name: "YourPost", path: "/your-post" },
    { id: 2, name: "LikedPost", path: "/liked-post" },
    { id: 3, name: "SavedPost", path: "/saved-post" },
    { id: 4, name: "Messages", path: "/messages" },
    { id: 5, name: "Profile", path: "/profile" },
  ];

  return (
    <div
      id="right-sidebar"
      className="basis-1/4 md:basis-1/5 shrink-0 sticky top-0 h-screen overflow-y-auto"
    >
      <div id="sidebar" className=" border-gray-600 h-full">
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
  );
};

export default HomePageRightSidebar;
