import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";

type Posts = Doc<"posts">;

type UsePaginatedPostsResult = {
  results: Posts[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  NoMore: boolean;
};

export const usePaginatedUsersHook = (
  queryName:
    | "getAllPaginatedPost"
    | "getPaginatedUserPost"
    | "getPaginatedLikedPosts"
    | "getPaginatedSavedPosts",
  initialNumItems: number = 5,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: any = {}
): UsePaginatedPostsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts[queryName],
    { userId: queryArgs.userId as Id<"users"> }, // Ensure userId is included in queryArgs
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";
  const NoMore = status === "Exhausted";

  return {
    results: results as Posts[],
    loadMore,
    isLoading,
    status,
    hasMore,
    NoMore,
  };
};

export const useGetAllPaginatePost = ({ numItem }: { numItem: number }) => {
  return usePaginatedUsersHook("getAllPaginatedPost", numItem);
};
export const useGetAllUserPaginatedPost = ({
  numItem,
  userId,
}: {
  numItem: number;
  userId: Id<"users"> | undefined;
}) => {
  return usePaginatedUsersHook(
    "getAllPaginatedPost",
    numItem,
    userId ? { userId } : ""
  );
};

export const useCheckIsPostAlreadyLiked = ({
  postId,
  userId,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
}) => {
  const isLiked = useQuery(
    api.posts.isPostAlreadyLiked,
    postId && userId ? { postId, userId } : "skip"
  );

  return {
    isLiked,
  };
};
export const useCheckIsPostAlreadySaved = ({
  postId,
  userId,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
}) => {
  const isSaved = useQuery(
    api.posts.isPostAlreadySaved,
    postId && userId ? { postId, userId } : "skip"
  );

  return {
    isSaved,
  };
};

export const useGetPostById = ({
  postId,
}: {
  postId: Id<"posts"> | undefined;
}) => {
  const post = useQuery(api.posts.getPostById, postId ? { postId } : "skip");
  return {
    post,
  };
};

export const useGetPostComment = ({
  postId,
}: {
  postId: Id<"posts"> | undefined;
}) => {
  const comments = useQuery(
    api.posts.getCommentByPostId2,
    postId ? { postId } : "skip"
  );
  return {
    comments,
  };
};

export const useGetPostLikeCount = ({
  postId,
}: {
  postId: Id<"posts"> | undefined;
}) => {
  const likeCount = useQuery(
    api.posts.getLikedUsers,
    postId ? { postId } : "skip"
  );
  return {
    likeCount,
  };
};
