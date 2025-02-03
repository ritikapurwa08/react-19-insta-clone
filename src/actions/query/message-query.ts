import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";

interface UserId {
  userId: Id<"users"> | undefined;
}
interface ChatId {
  chatId: Id<"chats"> | undefined;
}

export const useGetUserChats = ({ userId }: UserId) => {
  const userChats = useQuery(
    api.chats.getUserChats,
    userId ? { userId } : "skip"
  );
  return userChats;
};

export const useGetChatMessages = ({ chatId }: ChatId) => {
  const messages = useQuery(
    api.messages.getMessages,
    chatId ? { chatId } : "skip"
  );
  return messages;
};

export const useGetChatBetweenUsers = ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: Id<"users"> | undefined;
  memberTwoId: Id<"users"> | undefined;
}) => {
  const chat = useQuery(
    api.chats.getChatBetweenUsers,
    memberOneId && memberTwoId ? { memberOneId, memberTwoId } : "skip"
  );
  return chat;
};

type Chat = Doc<"chats">;

type UsePaginatedUsersResult = {
  results: Chat[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
  NoMore: boolean;
};

export const usePaginatedUsersHook = (
  queryName: "getUserChatsPaginated",
  initialNumItems: number = 5,
  userIds: Id<"users">[] | undefined
): UsePaginatedUsersResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.chats[queryName],
    { userIds },
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";
  const NoMore = status === "Exhausted";

  return {
    results: results as Chat[],
    loadMore,
    isLoading,
    status,
    hasMore,
    NoMore,
  };
};

export function useGetChatPaginate({
  userIds,
  numItems,
}: {
  userIds: Id<"users">[] | undefined;
  numItems: number;
}) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.chats.getUserChatsPaginated,
    { userIds },
    { initialNumItems: numItems }
  );

  return {
    results,
    status,
    loadMore,
  };
}
