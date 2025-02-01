import { Id } from "@convex/_generated/dataModel";
import { useCreateChat } from "./message-mutation";
import { useGetChatBetweenUsers } from "../query/message-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateChatButton = ({
  memberOneId,
  memberTwoId,
}: {
  memberOneId: Id<"users"> | undefined;
  memberTwoId: Id<"users"> | undefined;
}) => {
  const { mutate: createChat, isPending: creatingChat } = useCreateChat();
  const chats = useGetChatBetweenUsers({
    memberOneId,
    memberTwoId,
  });

  const navigate = useNavigate();

  const handleCreateChat = () => {
    // Check if both member IDs are defined
    if (!memberOneId || !memberTwoId) {
      console.error("Member IDs are not defined");
      return;
    }

    // Check if a chat already exists between the two users
    if (chats && chats.length > 0) {
      navigate(`/chat/${chats}`);
      console.log("Chat already exists:", chats[0]);
      // Optionally, you can redirect the user to the existing chat here
      return;
    }

    // If no chat exists, create a new one
    createChat(
      {
        participantIds: [memberOneId, memberTwoId],
        isGroup: false,
      },
      {
        onSuccess(data) {
          navigate(`/chat/${data}`);
          console.log("Chat created successfully:", data);
        },
        onError(error) {
          console.error("Error creating chat:", error);
        },
      }
    );
  };

  if (chats === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        size="default"
        variant="outline"
        onClick={handleCreateChat}
        disabled={creatingChat}
      >
        {creatingChat ? "Creating Chat..." : "Create Chat"}
      </Button>
    </div>
  );
};

export default CreateChatButton;
