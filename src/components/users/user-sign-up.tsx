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

const UserSignUp = () => {
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
    <Form {...form}>
      <form
        className="flex flex-col space-y-3 max-w-xl mx-auto justify-center  h-full"
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
          label="Password"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <CustomPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
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
      </form>
    </Form>
  );
};

export default UserSignUp;
