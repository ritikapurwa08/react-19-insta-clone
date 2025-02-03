import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

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
