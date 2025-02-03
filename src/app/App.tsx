import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import UserProfilePage from "@/components/users/user-profile";
import HomePageLeftSidebar from "@/components/home-page-left-sidebar";
import HomePageRightSidebar from "@/components/home-page-right-sidebar";
import AllPostpage from "@/components/post/all-post-page";
import UserAuthPage from "@/components/users/user-auth-page";
import Messages from "@/components/message/message";
import ChatWindow from "@/components/message/chat-window";
import AuthorProfilePage from "@/components/users/author-profile";
import AllUsersPage from "@/components/users/user-pagination-page";
import MostSavedPost from "@/components/post/most-saved-post";
import YourPostPage from "@/components/post/your-post";
import YourSavedPost from "@/components/post/your-save-post";
import YourLikedPost from "@/components/post/your-liked-post";
import MostLikedPost from "@/components/post/most-liked-Post";
import TrendingPosts from "@/components/post/trending-post";
import MobileNavigation from "@/components/mobile-navigation";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex flex-row w-screen h-screen   overflow-hidden">
        <div className="flex flex-row max-w-7xl container w-full  mx-auto  ">
          <div className="hidden lg:flex w-fit">
            <HomePageLeftSidebar />
          </div>
          <div className="flex-grow overflow-y-auto hide-scrollbar ">
            <Routes>
              <Route index path="/" element={<AllPostpage />} />
              <Route path="/login" element={<UserAuthPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/users" element={<AllUsersPage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/trending" element={<TrendingPosts />} />
              <Route path="/most-liked" element={<MostLikedPost />} />
              <Route path="/most-saved" element={<MostSavedPost />} />
              <Route path="/your-post" element={<YourPostPage />} />
              <Route path="/saved-post" element={<YourSavedPost />} />
              <Route path="/liked-post" element={<YourLikedPost />} />
              <Route
                path="/MostSavedBlog/:userId" // Corrected path
                element={<MostSavedPost />}
              />
              <Route path="/chat/:chatId" element={<ChatWindow />} />
              <Route path="/author/:userId" element={<AuthorProfilePage />} />
            </Routes>
          </div>
          <div className="hidden lg:flex w-fit">
            <HomePageRightSidebar />
          </div>
          <MobileNavigation />
        </div>
      </main>

      <Toaster />
    </ThemeProvider>
  );
};

export default App;
