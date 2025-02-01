import {
  useCreateChat,
  useSendMessage,
} from "@/actions/mutation/message-mutation";
import {
  useGetAllChatMessages,
  useGetChatWindows,
  useGetUserChats,
} from "@/actions/query/message-query";
import { useToast } from "@/hooks/use-toast";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import SubmitButton from "../ui/submit-button";
import { SendIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Messages = ({ userId }: { userId: Id<"users"> }) => {
  const { userChats } = useGetUserChats();
  return (
    <div>
      <ChatWindowList userId={userId} chatWindows={userChats} />

      <Outlet />
    </div>
  );
};

export default Messages;

export const MessageCard = ({
  message,
  userId,
}: {
  message: Doc<"messages">;
  userId: Id<"users">;
}) => {
  // Replace 'yourCurrentUserId'

  const isCurrentUser = message.senderId === userId;

  return (
    <div className={`flex w-full my-2`}>
      <div className={`p-3 rounded-lg bg-green-400  flex w-full text-sm `}>
        <p
          className={cn(
            "",
            isCurrentUser,
            "border w-full max-w-[50%] flex justify-end"
          )}
        >
          {message.message}
        </p>
      </div>
    </div>
  );
};

export const MessageList = ({ userId }: { userId: Id<"users"> }) => {
  const { chatId } = useParams<{ chatId: Id<"chats"> }>();
  const { results, loadMore, isLoading, hasMore } = useGetAllChatMessages(
    5,
    chatId!
  );

  return (
    <div className="px-4 relative py-2">
      {isLoading && (
        <div className="py-2 text-center text-gray-500">Loading...</div>
      )}

      {/* Render messages only if results are available */}
      <div className="">
        {results &&
          results.map((message) => (
            <MessageCard key={message._id} userId={userId} message={message} />
          ))}
      </div>

      {hasMore && (
        <div className="py-2 text-center">
          <button
            onClick={() => loadMore(5)}
            disabled={isLoading}
            className="text-blue-500 hover:underline"
          >
            Load More
          </button>
        </div>
      )}

      <div className="sticky bottom-0 left-0 w-full">
        {/* Only render SendMessageInput if chatId is valid */}
        <SendMessageInput chatId={chatId as Id<"chats">} senderId={userId} />
      </div>
    </div>
  );
};

export const SendMessageInput = ({
  chatId,
  senderId,
}: {
  chatId: Id<"chats">;
  senderId: Id<"users">;
}) => {
  const { mutate: sendMessage, isPending: sendingMessage } = useSendMessage();
  const { toast } = useToast();

  const form = useForm<{ message: string }>({
    defaultValues: {
      message: "",
    },
  });

  const handleSendMessage = ({ message }: { message: string }) => {
    sendMessage(
      {
        senderId,
        chatId,
        message,
      },
      {
        onSuccess() {
          form.reset();
        },
        onError(error) {
          toast({
            title: "message not sent",
            description: `${error.message}`,
            variant: "destructive",
          });
          form.reset();
        },
      }
    );
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSendMessage)}>
          <div className="relative">
            <CustomInput
              className="h-12 placeholder:text-pink-400"
              control={form.control}
              placeholder="type a message here"
              name="message"
              label=""
            />
            <div className="absolute border  right-0 top-0  bottom-0 flex items-center justify-center">
              <SubmitButton
                size="icon"
                variant="outline"
                isLoading={sendingMessage}
              >
                <SendIcon />
              </SubmitButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ChatWindowLoading = () => {
  return (
    <div>
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
    </div>
  );
};

const EmptyChatWindowList = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <h1>oops you dont have any chats yet</h1>
      </div>
    </div>
  );
};

export const ChatWindowList = ({
  chatWindows,
}: {
  chatWindows: Doc<"chats">[] | undefined;
  userId: Id<"users">;
}) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>

      {/* Handle loading and empty states */}
      {chatWindows === undefined && <ChatWindowLoading />}
      {chatWindows && chatWindows.length === 0 && <EmptyChatWindowList />}

      {/* Render chat list */}
      {chatWindows && chatWindows.length > 0 && (
        <div className="space-y-4">
          {chatWindows.map((chat) => (
            <Link key={chat._id} to={`/messages/${chat._id}`}>
              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{chat.chatName}</h2>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const CreateChatButton = ({
  receiverId,
}: {
  receiverId: Id<"users">;
}) => {
  const { mutate: createChat, isPending: creatingChat } = useCreateChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleCreateChat = () => {
    createChat(
      {
        receiverId,
      },
      {
        onSuccess(data) {
          navigate(`/messages/${data}`);
        },
        onError(error) {
          toast({
            title: "chat not created",
            description: `${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };
  return (
    <div>
      <Button onClick={handleCreateChat} disabled={creatingChat}>
        create Chat
      </Button>
    </div>
  );
};
