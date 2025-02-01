import { useSendMessage } from "@/actions/mutation/message-mutation";
import { useGetChatMessages } from "@/actions/query/message-query";
import { useGetCurrentUser } from "@/actions/query/user-query";
import { Id } from "@convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";

const ChatWindow = () => {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const { chatId } = useParams<{ chatId: Id<"chats"> }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useGetChatMessages({
    chatId,
  });

  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();

  const form = useForm<{ newMessage: string }>({
    defaultValues: {
      newMessage: "",
    },
  });

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (data: { newMessage: string }) => {
    if (chatId && userId && data.newMessage.trim() !== "") {
      sendMessage(
        {
          chatId,
          content: data.newMessage,
          senderId: userId,
        },
        {
          onSuccess() {
            form.reset(); // Clear the input after sending
            scrollToBottom();
          },
          onError(error) {
            console.error("Error sending message:", error);
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages Area */}
      <div className="flex-1 hide-scrollbar overflow-y-auto p-4">
        {messages === undefined ? (
          // Skeleton loading state
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
          // Actual messages
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {message.senderId !== userId && (
                <Avatar className="h-10 w-10 mr-3">
                  {/* Replace with actual user image if available */}
                  <AvatarFallback>
                    {message.senderId?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          // No messages yet
          <div className="text-center text-gray-500">
            No messages in this chat yet.
          </div>
        )}
        {/* Ref for scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="flex items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="newMessage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Type your message..."
                      {...field}
                      disabled={isSendingMessage}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? (
                <span className="animate-spin">
                  <SendIcon className="h-5 w-5" />
                </span>
              ) : (
                <SendIcon className="h-5 w-5" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;
