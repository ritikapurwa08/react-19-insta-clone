import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";

type Messages = Doc<"messages">;

type UsePaginatedMessageResult = {
  results: Messages[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};

export const usePaginatedBlogs = (
  queryName: "getChatMessages",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedMessageResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages[queryName],
    { chatId: queryArgs.chatId }, // Ensure userId is included in queryArgs
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Messages[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};
type Chats = Doc<"chats">;

type UsePaginatedChatResult = {
  results: Chats[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
};

export const usePaginatChat = (
  queryName: "getUserPaginatedChats",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedChatResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.chat[queryName],
    { userId: queryArgs.userId }, // Ensure userId is included in queryArgs
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Chats[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const useGetAllPaginatedChats = (
  initialNumItems: number = 5,
  userId: Id<"users">
): UsePaginatedChatResult => {
  return usePaginatChat("getUserPaginatedChats", { userId }, initialNumItems);
};

export const useGetAllChatMessages = (
  initialNumItems: number = 5,
  chatId: Id<"chats">
): UsePaginatedMessageResult => {
  return usePaginatedBlogs("getChatMessages", { chatId }, initialNumItems);
};

export const useGetChatWindows = ({ userId }: { userId?: Id<"users"> }) => {
  const chatWindows = useQuery(api.chat.getChatWindows, { userId });
  return { chatWindows };
};

export const useGetUserChats = () => {
  const userChats = useQuery(api.users.getUserChats);
  return { userChats };
};
