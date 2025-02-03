import { useGetChatMessages } from "@/actions/query/message-query";
import { useGetCurrentUser } from "@/actions/query/user-query";
import { Id } from "@convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SendMessage from "./send-message";
import MessageList from "./message-list";

const ChatWindow = () => {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const { chatId } = useParams<{ chatId: Id<"chats"> }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useGetChatMessages({
    chatId,
  });

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col overflow-hidden h-full max-h-[98dvh]">
      {/* Chat Messages Area */}
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      {/* Message Input Area */}

      <SendMessage
        chatId={chatId}
        userId={userId}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
};

export default ChatWindow;
