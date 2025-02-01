import { useUpdateUserProfile } from "@/actions/mutation/user-mutation";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import SubmitButton from "../ui/submit-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Settings2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetUserProfileData } from "@/actions/query/user-query";

// Define the schema for the user profile
const UserProfileZodSchema = z.object({
  bio: z.string().optional(),
  location: z.string().optional(),
  customImage: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
});

// Infer the type from the schema
type UserProfileFormValues = z.infer<typeof UserProfileZodSchema>;

// Props for the dialog
interface FormActionDialogProps {
  userId: Id<"users"> | undefined;
}

const UpdateUserDetailsButton = ({ userId }: FormActionDialogProps) => {
  const [open, setOpen] = useState(false);

  const { mutate: updateUserProfile, isPending: updatingUserProfile } =
    useUpdateUserProfile();
  const { userProfile } = useGetUserProfileData({ userId });
  const { toast } = useToast();
  // Determine if the user has an existing profile
  const hasUserProfile = !!userProfile;

  // Set up the form
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(UserProfileZodSchema),
  });

  // Use useEffect to update form values when userProfile changes
  useEffect(() => {
    if (userProfile) {
      form.setValue("bio", userProfile.bio ?? "");
      form.setValue("location", userProfile.location ?? "");
      form.setValue("instagram", userProfile.instagram ?? "");
      form.setValue("customImage", userProfile.customImage ?? "");
      form.setValue("website", userProfile.website ?? "");
    }
  }, [userProfile, form]);

  // Handle form submission
  const onSubmit = (data: UserProfileFormValues) => {
    // Close the dialog after submission
    if (userProfile?._id && userId) {
      updateUserProfile(
        {
          userId: userId,
          userProfileId: userProfile._id,
          bio: data.bio,
          location: data.location,
          customImage: data.customImage,
          instagram: data.instagram,
          website: data.website,
        },
        {
          onSuccess() {
            setOpen(false);
            toast({
              title: "Success",
              description: "Profile updated successfully",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
            setOpen(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="default">
          <Settings2Icon />
          <span>Change Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasUserProfile ? "Update" : "Create"} Profile
          </DialogTitle>
          <DialogDescription>
            {hasUserProfile
              ? "Make changes to your profile."
              : "Fill in the details to create your profile."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              control={form.control}
              name="bio"
              placeholder="Bio"
              label="Bio"
            />
            <CustomInput
              control={form.control}
              name="location"
              placeholder="Location"
              label="Location"
            />
            <CustomInput
              control={form.control}
              name="customImage"
              placeholder="Custom Image URL"
              label="Custom Image"
            />
            <CustomInput
              control={form.control}
              name="instagram"
              placeholder="Instagram"
              label="Instagram"
            />
            <CustomInput
              control={form.control}
              name="website"
              placeholder="Website"
              label="Website"
            />
            <SubmitButton
              className="w-full bg-pink-400 hover:bg-pink-500 transition-all duration-300 ease-in-out"
              isLoading={updatingUserProfile}
            >
              {hasUserProfile ? "Update Profile" : "Save Profile"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDetailsButton;
