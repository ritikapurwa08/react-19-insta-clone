import { Id } from "@convex/_generated/dataModel";
import { Skeleton } from "../ui/skeleton";
import { useGetCurrentUser, useGetUserById } from "@/actions/query/user-query";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { format } from "date-fns";

interface MessageInterface {
  _id: Id<"messages">;
  _creationTime: number;
  updatedAt?: number | undefined;
  chatId: Id<"chats">;
  senderId: Id<"users">;
  content: string;
  edited: boolean;
}

export function MessageCard({
  _creationTime,
  _id,
  content,
  senderId,
}: MessageInterface) {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const receiver = useGetUserById({ userId: senderId });
  const receiverName = receiver?.name;
  const chatTime = format(new Date(_creationTime), "hh:mm a");
  return (
    <div
      key={_id}
      className={`flex ${
        senderId === userId ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {senderId !== userId && (
        <Avatar className="h-10 w-10 mr-3">
          {/* Replace with actual user image if available */}
          <AvatarFallback>
            {receiverName?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg max-w-[80%] leading-5 flex flex-col  lg:max-w-[40%] pl-3 pr-4 py-1 ${
          senderId === userId
            ? "bg-pink-500 text-white  rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        <p className="text-base leading-5">{content}</p>
        <p className="text-xs leading-4">{chatTime}</p>
      </div>
    </div>
  );
}

interface MessageListInterface {
  messages: MessageInterface[] | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  messagesEndRef,
}: MessageListInterface) {
  return (
    <div className="flex-1 hide-scrollbar overflow-y-auto p-4">
      {messages === undefined ? (
        <div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start mb-4">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : messages && messages.length > 0 ? (
        <div>
          {messages.map((message) => {
            return <MessageCard {...message} />;
          })}
        </div>
      ) : (
        <span>
          <div className="text-center text-gray-500">
            No messages in this chat yet.
          </div>
        </span>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
