import {
  useGetCurrentUser,
  useGetUserCustomImageUrl,
  useGetUserUploadedImageUrl,
  useGetUserPrivacy,
} from "@/actions/query/user-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState, useMemo } from "react";

const UserProfileImage = () => {
  // Fetch the current user and other data unconditionally
  const user = useGetCurrentUser();
  const userId = user?._id;

  const { userCustomImageUrl, isLoading: customImageLoading } =
    useGetUserCustomImageUrl({ userId });

  const { userUploadedImageUrl, isLoading: uploadedImageLoading } =
    useGetUserUploadedImageUrl({ userId });

  const { userPrivacy } = useGetUserPrivacy({
    userId,
  });

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Combined loading state for image-related data
  const isImageLoading =
    customImageLoading || uploadedImageLoading || userPrivacy === undefined;

  // Determine which image to show based on privacy settings
  const showCustomImage = useMemo(
    () => userPrivacy?.imagePreference === "custom",
    [userPrivacy]
  );
  const showUploadedImage = useMemo(
    () => userPrivacy?.imagePreference === "convex",
    [userPrivacy]
  );

  // Determine the image URL to display using useMemo
  const imageUrl = useMemo(() => {
    return (
      (showCustomImage && userCustomImageUrl) ||
      (showUploadedImage && userUploadedImageUrl)
    );
  }, [
    showCustomImage,
    showUploadedImage,
    userCustomImageUrl,
    userUploadedImageUrl,
  ]);

  // Generate fallback initials from the user's name using useMemo
  const userInitials = useMemo(() => {
    return user?.name
      ? user.name
          .split(" ")
          .map((namePart) => namePart[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "US";
  }, [user?.name]);

  useEffect(() => {
    if (user === undefined) {
      setIsLoadingUser(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsLoadingUser(false);
    }
  }, [user]);

  // Handle loading state for user data, including name and email
  if (isLoadingUser) {
    return (
      <div>
        <div className="flex justify-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          {/* Loading state for avatar */}
        </div>
        <div className="flex flex-col items-center mt-2">
          <Skeleton className="w-24 h-6 rounded-full" />
          {/* Skeleton for name */}
          <Skeleton className="w-32 h-4 mt-1 rounded-full" />
          {/* Skeleton for email */}
        </div>
      </div>
    );
  }

  // Handle case where user is not found
  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-red-500">User not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <Avatar className="relative size-24">
          {isImageLoading ? (
            <Skeleton className="w-full h-full rounded-full" /> // Loading state for avatar
          ) : (
            <>
              {imageUrl ? (
                <AvatarImage
                  src={imageUrl}
                  alt={user.name || "User"}
                  className=""
                />
              ) : (
                <AvatarFallback delayMs={600} className="text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              )}
            </>
          )}
        </Avatar>
      </div>
      <div className="flex flex-col items-center mt-2">
        <span className="text-base font-semibold">{user.name}</span>
        <span className="text-sm font-semibold">{user.email}</span>
      </div>
    </div>
  );
};

export default UserProfileImage;
