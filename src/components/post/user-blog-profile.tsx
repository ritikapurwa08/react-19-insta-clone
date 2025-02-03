import {
  useGetUserCustomImageUrl,
  useGetUserUploadedImageUrl,
  useGetUserPrivacy,
  useGetUserById,
} from "@/actions/query/user-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState, useMemo } from "react";
import { Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const UserBlogHeaderImage = ({
  userId,
  showName,
  size,
}: {
  userId: Id<"users"> | undefined;
  showName?: boolean;
  size?: string;
}) => {
  const user = useGetUserById({ userId });
  const { userCustomImageUrl, isLoading: customImageLoading } =
    useGetUserCustomImageUrl({ userId });
  const { userUploadedImageUrl, isLoading: uploadedImageLoading } =
    useGetUserUploadedImageUrl({ userId });
  const { userPrivacy } = useGetUserPrivacy({ userId });

  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const isImageLoading =
    customImageLoading || uploadedImageLoading || userPrivacy === undefined;

  const showCustomImage = useMemo(
    () => userPrivacy?.imagePreference === "custom",
    [userPrivacy]
  );
  const showUploadedImage = useMemo(
    () => userPrivacy?.imagePreference === "convex",
    [userPrivacy]
  );

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
    setIsLoadingUser(user === undefined);
  }, [user]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center space-x-3">
        <Skeleton className="size-6 rounded-full" />
        {showName ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
          </div>
        ) : null}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-red-500">User not found</h1>
      </div>
    );
  }

  return (
    <div className="flex w-fit items-center   ">
      <Avatar className={cn("size-6", size)}>
        {isImageLoading ? (
          <Skeleton className="h-full w-full rounded-full" />
        ) : (
          <>
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={user.name || "User"} />
            ) : (
              <AvatarFallback className="font-medium">
                {userInitials}
              </AvatarFallback>
            )}
          </>
        )}
      </Avatar>
      {showName ? (
        <div className="space-y-2 ml-2 ">
          <h1 className="lg:text-lg text-sm  font-semibold">{user.name}</h1>
        </div>
      ) : null}
    </div>
  );
};

export default UserBlogHeaderImage;
