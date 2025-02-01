import { useState } from "react";
import UserSignIn from "./user-sing-in";
import UserSignUp from "./user-sign-up";
import { Button } from "../ui/button";

const UserAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <main className="flex flex-col space-y-3 max-w-xl mx-auto h-full justify-around min-h-[calc(90vh-64px)]">
      <section className="flex flex-col text-center items-center justify-end flex-grow h-full ">
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>
        <p>
          {isLogin ? "Sign in to your account" : "Sign up for a new account"}
        </p>
      </section>
      <section>{isLogin ? <UserSignIn /> : <UserSignUp />}</section>
      <section>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create an account" : "Already have an account?"}
        </Button>
      </section>
    </main>
  );
};

export default UserAuthPage;
