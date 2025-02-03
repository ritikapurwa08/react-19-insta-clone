import { useSendMessage } from "@/actions/mutation/message-mutation";
import { Id } from "@convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderIcon, SendIcon } from "lucide-react";
import { useRef } from "react"; // Import useRef
import { cn } from "@/lib/utils";

interface SendMessageProps {
  chatId: Id<"chats"> | undefined;
  userId: Id<"users"> | undefined;
  scrollToBottom: () => void;
}

const SendMessage = ({ chatId, userId, scrollToBottom }: SendMessageProps) => {
  const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();
  const form = useForm<{ newMessage: string }>({
    defaultValues: {
      newMessage: "",
    },
  });

  // Create a ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

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

            // Focus the input field after sending the message
            if (inputRef.current) {
              inputRef.current.focus();
            }
          },
          onError(error) {
            console.error("Error sending message:", error);
          },
        }
      );
    }
  };

  return (
    <div
      className={cn(
        "border-t mb-12 transition-all duration-200 ease-in-out md:mb-0 p-3",
        inputRef.current && "mb-0"
      )}
    >
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
                    autoFocus // Automatically focus the input when the component mounts
                    ref={inputRef} // Attach the ref to the input field
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
                <LoaderIcon className="h-5 w-5" />
              </span>
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SendMessage;
