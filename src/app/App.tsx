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

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="flex flex-row w-screen h-screen   overflow-hidden">
        <div className="flex flex-row max-w-7xl container w-full  mx-auto  ">
          <HomePageLeftSidebar />
          <div className="flex-grow overflow-y-auto hide-scrollbar ">
            <Routes>
              <Route index path="/" element={<AllPostpage />} />
              <Route path="/login" element={<UserAuthPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/users" element={<AllUsersPage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/chat/:chatId" element={<ChatWindow />} />
              <Route path="/author/:userId" element={<AuthorProfilePage />} />
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
