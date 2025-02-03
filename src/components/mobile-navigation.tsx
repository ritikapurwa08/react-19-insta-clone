"use client";

import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  HeartIcon,
  BookmarkIcon,
  TrendingUp,
  MessageSquareCodeIcon,
  ImageIcon,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import UserBlogHeaderImage from "./post/user-blog-profile";
import { useGetCurrentUser } from "@/actions/query/user-query";
import { Button } from "./ui/button";
import UserLogOutButton from "./users/user-logout-button";

const MobileNavigation = () => {
  const location = useLocation();

  // Use Framer Motion's useScroll hook to track scroll position

  const isCurrentTab = (path: string) => {
    return location.pathname === path;
  };

  const homeNavigationArray = [
    { path: "/", label: "Home", icon: UserIcon },
    { path: "/trending", label: "Trending", icon: TrendingUp },
    { path: "/messages", label: "Messages", icon: MessageSquareCodeIcon },
    { path: "/most-liked", label: "Most Liked", icon: HeartIcon },
    { path: "/most-saved", label: "Most Saved", icon: BookmarkIcon },
  ];

  return (
    <AnimatePresence>
      <div className="fixed bottom-0 lg:hidden w-full px-0.5 z-50">
        {/* Container for centering */}
        <div className="mx-auto w-full max-w-full">
          <div className="backdrop-blur-sm bg-black border-t   rounded-sm shadow-md p-2 z-50">
            <div className="flex items-center justify-between">
              {/* Left Side: Dynamic Links */}

              {/* Right Side: Main Tabs */}
              <div className="flex items-center space-x-2">
                {homeNavigationArray.map((item) => (
                  <Button
                    key={item.path}
                    variant={!isCurrentTab(item.path) ? "ghost" : "outline"}
                    className="w-full"
                    size="default"
                  >
                    <Link to={`${item.path}`}>
                      <span className="flex flex-row justify-center items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                ))}
                <div>
                  <UserNavigationTab />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default MobileNavigation;

export function UserNavigationTab() {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const [isOpen, setIsOpen] = useState(false);
  const userNavigationArray = [
    {
      path: "/profile",
      label: "your profile",
      icon: UserIcon,
    },
    {
      path: "/your-post",
      label: "your profile", // Note: This label seems duplicated, you might want to change it to "your posts"
      icon: ImageIcon,
    },
    {
      path: "/liked-post",
      label: "your saved post", // Might want to change label to "liked posts"
      icon: HeartIcon,
    },
    {
      path: "/saved-post",
      label: "your saved post",
      icon: BookmarkIcon,
    },
  ];

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <UserBlogHeaderImage showName={false} userId={userId} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full py-40 flex flex-col space-y-3">
        {userNavigationArray.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            variant="outline"
            className="w-full"
            size="default"
          >
            <span className="flex flex-row justify-center items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </span>
          </Button>
        ))}

        <UserLogOutButton />
      </SheetContent>
    </Sheet>
  );
}
