import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import CustomEmailInput from "../ui/custom-email-input";
import CustomPasswordInput from "../ui/custom-password-input";
import SubmitButton from "../ui/submit-button";
import ShowPasswordCheckBox from "../ui/show-password-checkbox";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const UserSignUp = ({
  isLogin,
  setIsLogin,
}: {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const userSignUpZodSchema = z
    .object({
      name: z.string().min(2, "Name must be at least 2 char long").max(100),
      email: z.string().email().min(2, { message: "Enter a valid email" }),
      password: z.string().min(8).max(12),
      confirmPassword: z.string().min(8).max(12),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type UserSignUpType = z.infer<typeof userSignUpZodSchema>;

  const form = useForm<UserSignUpType>({
    resolver: zodResolver(userSignUpZodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const navigate = useNavigate();

  const { signIn } = useAuthActions();
  const handleSignUp = async (data: UserSignUpType) => {
    setLoading(true);
    setError(null);
    await signIn("password", {
      name: data.name,
      email: data.email,
      password: data.password,
      flow: "signUp",
    })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setError(null);
        setLoading(false);
      });
  };

  return (
    <main className="flex flex-col items-center justify-center h-full w-full ">
      {" "}
      <section className=" h-fit  w-full text-center py-4">
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        <p>Sign Up in to your account</p>
      </section>
      <Form {...form}>
        <form
          className="flex flex-col  space-y-3 max-w-xl w-full mx-auto justify-start  h-fit"
          onSubmit={form.handleSubmit(handleSignUp)}
        >
          <CustomInput control={form.control} name="name" label="Name" />
          <CustomEmailInput
            setIsEmailAvailable={setEmail}
            control={form.control}
            name="email"
            label="Email"
          />
          <CustomPasswordInput
            control={form.control}
            name="password"
            label="Password "
            placeholder="Enter your password"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <CustomPasswordInput
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {error && <div className="text-red-500">{error}</div>}

          <ShowPasswordCheckBox
            setShowPassword={setShowPassword}
            showPassword={showPassword}
          />
          <SubmitButton
            type="submit"
            isLoading={loading}
            loadingText="Signing Up"
          >
            Sign Up
          </SubmitButton>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create an account" : "Already have an account?"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default UserSignUp;
