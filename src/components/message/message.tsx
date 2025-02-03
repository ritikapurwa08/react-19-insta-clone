import { useGetUserChats } from "@/actions/query/message-query";
import { useGetCurrentUser } from "@/actions/query/user-query";
import { Id } from "@convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface Participants {
  _id: Id<"users">;
  _creationTime: number;
  userChats?: Id<"chats">[] | undefined;
  name: string;
  email: string;
}

interface Chat {
  participants: (Participants | null)[];
  _id: Id<"chats">;
  _creationTime: number;
  groupName?: string | undefined;
  groupProfilePic?: string | undefined;
  isGroup: boolean;
}

interface ChatCardProps {
  chat: Chat;
  onChatClick: (chatId: Id<"chats">) => void;
  userId: Id<"users"> | undefined;
}

export function ChatCard({ chat, onChatClick, userId }: ChatCardProps) {
  const getChatName = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupName || "Group Chat";
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p && p._id !== userId
      );
      return otherParticipant?.name || "Unknown User";
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupProfilePic;
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p && p._id !== userId
      );
      return otherParticipant?.name; // You might want to return a user profile picture URL here
    }
  };

  const chatName = getChatName(chat);
  const chatAvatar = getChatAvatar(chat);

  return (
    <div
      onClick={() => onChatClick(chat._id)}
      className="flex items-center p-3 border rounded-lg cursor-pointer transition group-hover:bg-red-400 group-[home]:" // Added hover effect
    >
      <Avatar className="h-12 w-12 mr-3">
        {chatAvatar ? (
          <AvatarImage src={chatAvatar} alt={chatName} />
        ) : (
          <AvatarFallback>
            {chatName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 group-[home]:hover:text-red-400">
        <div className="font-semibold">{chatName}</div>
        {chat.isGroup ? "Group Chat" : "Direct Message"}{" "}
        {/* More descriptive */}
      </div>
    </div>
  );
}

interface ChatCardListProps {
  chats: (Chat | null)[] | undefined;
  onChatClick: (chatId: Id<"chats">) => void;
  userId: Id<"users"> | undefined;
  isLoadingChats: boolean;
}

export function ChatCardList({
  chats,
  onChatClick,
  userId,
  isLoadingChats,
}: ChatCardListProps) {
  // Loading State
  if (isLoadingChats) {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center mb-4">
            <Skeleton className="h-12 w-12 rounded-full mr-3" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No Chats State
  if (!isLoadingChats && (!chats || chats.length === 0)) {
    return <div className="text-gray-500">No messages found.</div>;
  }

  // Chat List
  return (
    <div>
      {chats &&
        chats.map((chat) =>
          chat ? (
            <ChatCard
              key={chat._id}
              chat={chat}
              onChatClick={onChatClick}
              userId={userId}
            />
          ) : null
        )}
    </div>
  );
}

const Messages = () => {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [chats, setChats] = useState<(Chat | null)[] | undefined>(undefined);

  const userChats = useGetUserChats({ userId });

  useEffect(() => {
    if (userChats) {
      setChats(userChats);
      setIsLoadingChats(false);
    }
  }, [userChats]);

  useEffect(() => {
    if (userChats === undefined) {
      setIsLoadingChats(true);
    }
  }, [userChats]);

  const navigate = useNavigate();

  const handleChatClick = (chatId: Id<"chats">) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <p className="mb-4">This is a static message always shown</p>

      <ChatCardList
        chats={chats}
        onChatClick={handleChatClick}
        userId={userId}
        isLoadingChats={isLoadingChats}
      />
    </div>
  );
};

export default Messages;
