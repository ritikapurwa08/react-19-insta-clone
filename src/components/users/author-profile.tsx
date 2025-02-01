import CreateChatButton from "@/actions/mutation/createChatButton";
import { useGetCurrentUser, useGetUserById } from "@/actions/query/user-query";
import { Id } from "@convex/_generated/dataModel";
import { useParams } from "react-router-dom";

const AuthorProfilePage = () => {
  const { userId } = useParams<{ userId: Id<"users"> }>();
  const author = useGetUserById({ userId });

  const currentUserId = useGetCurrentUser();

  if (author === undefined) {
    <div>
      <h1>author loading</h1>
    </div>;
  }

  if (!author) {
    return (
      <div>
        <h1>author not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>
        <div>{author.name}</div>

        <CreateChatButton
          memberOneId={currentUserId?._id}
          memberTwoId={author._id}
        />
      </h1>
    </div>
  );
};

export default AuthorProfilePage;

// Dummy implementation for useGetFollowing
