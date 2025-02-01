import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/actions/query/user-query";
import { cn } from "@/lib/utils";

const UserProfileButton = () => {
  const { isLoading, user } = getCurrentUser();

  if (!user) {
    return (
      <div>
        <Button variant="outline">Profile</Button>
      </div>
    );
  }
  return (
    <div>
      <Button variant="outline">
        {isLoading ? <span>loading</span> : <span>{user.name}</span>}
      </Button>
    </div>
  );
};

const Navbar = () => {
  const pathName = useLocation();
  const router = useNavigate();
  const LoginPage = pathName.pathname === "/login";

  const currentPage = (path: string) => {
    return pathName.pathname === path;
  };

  const NavigationLink = () => {
    return (
      <div className="flex flex-row space-x-2">
        <Button
          variant="outline"
          className={cn("", currentPage("/") ? "bg-red-400" : "bg-green-400")}
          onClick={() => router("/")}
        >
          Home
        </Button>
        <UserProfileButton />
        <Button variant="outline" className="" onClick={() => router("/blogs")}>
          Profile
        </Button>
      </div>
    );
  };

  if (LoginPage) {
    return null;
  }
  return (
    <div className={cn("flex justify-between items-center")}>
      <NavigationLink />
    </div>
  );
};

export default Navbar;
