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

  const getChatName = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupName || "Group Chat";
    } else {
      // Find the participant that is not the current user
      const otherParticipant = chat.participants.find(
        (p) => p && p._id !== userId
      );
      return otherParticipant?.name || "Unknown User";
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroup) {
      return chat.groupProfilePic; // You might need a fallback image URL
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p && p._id !== userId
      );
      // Assuming you have a way to get user images
      return otherParticipant?.name;
    }
  };

  const navigate = useNavigate();

  const handleChatClick = (chatId: Id<"chats">) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <p className="mb-4">This is a static message always shown</p>

      {/* Loading State */}
      {isLoadingChats && (
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
      )}

      {/* No Chats State */}
      {!isLoadingChats && (!chats || chats.length === 0) && (
        <div className="text-gray-500">No messages found.</div>
      )}

      {/* Chat List */}
      {!isLoadingChats && chats && chats.length > 0 && (
        <div>
          {chats.map((chat) => {
            if (!chat) return null;

            const chatName = getChatName(chat);
            const chatAvatar = getChatAvatar(chat);

            return (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat._id)}
                className="flex items-center p-3 border rounded-lg cursor-pointer transition"
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
                <div className="flex-1">
                  <div className="font-semibold">{chatName}</div>
                  {chat.isGroup && chat.isGroup
                    ? "Group Chat"
                    : "not group chat"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
