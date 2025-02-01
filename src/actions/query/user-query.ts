import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";

export const useGetCurrentUser = () => {
  const user = useQuery(api.users.currentUser);

  return user;
};

export const useCheckEmail = ({ email }: { email: string }) => {
  const checkEmail = useQuery(api.users.checkEmail, { email });
  const isCheckingEmail = checkEmail === undefined;

  return {
    checkEmail,
    isCheckingEmail,
  };
};

export const useGetUserProfileData = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  // Use `undefined` to skip the query if `userId` is not provided
  const userProfile = useQuery(
    api.users.getUserProfile,
    userId ? { userId } : "skip"
  );

  // Determine loading state
  const isLoading = userProfile === undefined && userId !== undefined;

  return {
    userProfile,
    isLoading,
  };
};

export const useGetUserPrivacy = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  const userPrivacy = useQuery(
    api.users.getUserPrivacy,
    userId ? { userId } : "skip"
  );

  return {
    userPrivacy,
  };
};

export const useGetUserById = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  const author = useQuery(api.users.getUserById, userId ? { userId } : "skip");

  return author;
};

export const useGetAllUsers = () => {
  const users = useQuery(api.users.getAllUsers); // Pass the function to useQuery
  const isLoading = users === undefined;
  return {
    users,
    isLoading,
  };
};
export const useGetUserStates = ({ userId }: { userId: Id<"users"> }) => {
  const userStates = useQuery(api.users.getUserStats, { userId });
  const isLoading = userStates === undefined;
  return {
    userStates,
    isLoading,
  };
};
export const useGetUserCustomImageUrl = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  const userCustomImageUrl = useQuery(
    api.users.getUserCustomProfile,
    userId ? { userId } : "skip"
  );
  const isLoading = userCustomImageUrl === undefined;
  return {
    userCustomImageUrl,
    isLoading,
  };
};
export const useGetUserUploadedImageUrl = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  const userUploadedImageUrl = useQuery(
    api.users.getUserCustomProfile,
    userId ? { userId } : "skip"
  );
  const isLoading = userUploadedImageUrl === undefined;
  return {
    userUploadedImageUrl,
    isLoading,
  };
};

type Users = Doc<"users">;

type UsePaginatedUsersResult = {
  results: Users[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  NoMore: boolean;
};

export const usePaginatedUsersHook = (
  queryName: "getAllPaginatedUsers",
  initialNumItems: number = 5
): UsePaginatedUsersResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users[queryName],
    {}, // Ensure userId is included in queryArgs
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";
  const NoMore = status === "Exhausted";

  return {
    results: results as Users[],
    loadMore,
    isLoading,
    status,
    hasMore,
    NoMore,
  };
};

export const useGetAllUsersPaginated = (initialNumItems: number = 5) => {
  return usePaginatedUsersHook("getAllPaginatedUsers", initialNumItems);
};
