import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import UserProfilePage from "@/components/users/user-profile";
import HomePageLeftSidebar from "@/components/home-page-left-sidebar";
import HomePageRightSidebar from "@/components/home-page-right-sidebar";
import AllPostpage from "@/components/post/all-post-page";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex flex-row w-screen h-screen   overflow-hidden">
        <div className="flex flex-row max-w-7xl container w-full  mx-auto  ">
          <HomePageLeftSidebar />
          <div className="flex-grow overflow-y-auto hide-scrollbar ">
            <Routes>
              <Route index path="/" element={<AllPostpage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="login" element={<UserProfilePage />} />
            </Routes>
          </div>
          <HomePageRightSidebar />
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
