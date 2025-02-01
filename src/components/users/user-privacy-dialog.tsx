import { useUpdateUserPrivacy } from "@/actions/mutation/user-mutation";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import SubmitButton from "../ui/submit-button";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  Image,
  MailIcon,
  MessageSquare,
  Settings2Icon,
  UserIcon,
} from "lucide-react";
import CustomRadioGroup from "../ui/custom-radio-group";
import CustomSwitch from "../ui/custom-switch";
import { useGetUserPrivacy } from "@/actions/query/user-query";
const UserPrivacySchema = z.object({
  showEmail: z.boolean().optional(),
  showInstagram: z.boolean().optional(),
  showWebsite: z.boolean().optional(),
  showFollowers: z.boolean().optional(),
  showFollowing: z.boolean().optional(),
  showPosts: z.boolean().optional(),
  showSavedPosts: z.boolean().optional(),
  showLikedPosts: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  showBio: z.boolean().optional(),
  showLastActive: z.boolean().optional(),
  imagePreference: z
    .union([z.literal("custom"), z.literal("convex")])
    .optional(),
  messagePrivacy: z
    .union([z.literal("everyone"), z.literal("followers"), z.literal("none")])
    .optional(),
});

type UserPrivacyFormValues = z.infer<typeof UserPrivacySchema>;

const UserPrivacyDialog = ({ userId }: { userId: Id<"users"> | undefined }) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateUserPrivacy, isPending: updatingUserPrivacy } =
    useUpdateUserPrivacy();

  const { userPrivacy } = useGetUserPrivacy({ userId });
  const hasUserPrivacy = !!userPrivacy;
  const form = useForm<UserPrivacyFormValues>({
    resolver: zodResolver(UserPrivacySchema),
  });

  const isLoadingUserPrivacy = userPrivacy === undefined || updatingUserPrivacy;
  const { toast } = useToast();

  useEffect(() => {
    if (userPrivacy) {
      form.setValue("showEmail", userPrivacy.showEmail);
      form.setValue("showInstagram", userPrivacy.showInstagram);
      form.setValue("showWebsite", userPrivacy.showWebsite);
      form.setValue("showFollowers", userPrivacy.showFollowers);
      form.setValue("showFollowing", userPrivacy.showFollowing);
      form.setValue("showPosts", userPrivacy.showPosts);
      form.setValue("showSavedPosts", userPrivacy.showSavedPosts);
      form.setValue("showLikedPosts", userPrivacy.showLikedPosts);
      form.setValue("showLocation", userPrivacy.showLocation);
      form.setValue("showBio", userPrivacy.showBio);
      form.setValue("showLastActive", userPrivacy.showLastActive);
      form.setValue("imagePreference", userPrivacy.imagePreference);
      form.setValue("messagePrivacy", userPrivacy.messagePrivacy);
    }
  }, [form, userPrivacy]);

  const onSubmit = (data: UserPrivacyFormValues) => {
    if (userPrivacy?._id && userId) {
      updateUserPrivacy(
        {
          userPrivacyId: userPrivacy._id,
          userId: userId,
          ...data,
        },
        {
          onSuccess() {
            toast({
              title: "User Privacy Updated",
              description: "Your user privacy has been updated",
              variant: "default",
            });
            setOpen(false);
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
          <span>Change Privacy</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasUserPrivacy ? "Update" : "Create"} Profile Privacy
          </DialogTitle>
          <DialogDescription>
            {hasUserPrivacy
              ? "Manage your profile's privacy settings."
              : "Set up your profile privacy preferences."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {/* Contact Information */}
            <div className="space-y-4 max-h-[50vh] pb-10 h-full overflow-y-auto hide-scrollbar">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-x-2">
                  <MailIcon className="w-4 h-4" />
                  Contact Information
                </h3>
                <CustomSwitch
                  control={form.control}
                  name="showEmail"
                  label="Show Email"
                />
                <CustomSwitch
                  control={form.control}
                  name="showInstagram"
                  label="Show Instagram"
                />
                <CustomSwitch
                  control={form.control}
                  name="showWebsite"
                  label="Show Website"
                />
              </div>

              {/* Profile Visibility */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-x-2">
                  <UserIcon className="w-4 h-4" />
                  Profile Visibility
                </h3>
                <CustomSwitch
                  control={form.control}
                  name="showFollowers"
                  label="Show Followers"
                />
                <CustomSwitch
                  control={form.control}
                  name="showFollowing"
                  label="Show Following"
                />
                <CustomSwitch
                  control={form.control}
                  name="showPosts"
                  label="Show Posts"
                />
                <CustomSwitch
                  control={form.control}
                  name="showSavedPosts"
                  label="Show Saved Posts"
                />
                <CustomSwitch
                  control={form.control}
                  name="showLikedPosts"
                  label="Show Liked Posts"
                />
                <CustomSwitch
                  control={form.control}
                  name="showLocation"
                  label="Show Location"
                />
                <CustomSwitch
                  control={form.control}
                  name="showBio"
                  label="Show Bio"
                />
                <CustomSwitch
                  control={form.control}
                  name="showLastActive"
                  label="Show Last Active"
                />
              </div>

              {/* Image Preferences */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-x-2">
                  <Image className="w-4 h-4" />
                  Image Preferences
                </h3>
                <CustomRadioGroup
                  control={form.control}
                  name="imagePreference"
                  label="Profile Image"
                  defaultValue="custom"
                  options={[
                    {
                      label: "Convex",
                      value: "convex",
                    },
                    {
                      label: "Custom",
                      value: "custom",
                    },
                  ]}
                />
              </div>

              {/* Message Privacy */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-x-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Privacy
                </h3>
                <CustomRadioGroup
                  control={form.control}
                  name="messagePrivacy"
                  label="Who can message you?"
                  options={[
                    { label: "Everyone", value: "everyone" },
                    { label: "Followers", value: "followers" },
                    { label: "None", value: "none" },
                  ]}
                />
              </div>
            </div>

            {/* Submit Button */}
            <SubmitButton
              className="w-full bg-pink-400 hover:bg-pink-500 transition-all duration-300 ease-in-out"
              isLoading={isLoadingUserPrivacy}
            >
              {hasUserPrivacy ? "Update Privacy" : "Save Privacy"}
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserPrivacyDialog;
