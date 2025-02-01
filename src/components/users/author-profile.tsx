import {
  useFolllowUser,
  useUnfollowUser,
} from "@/actions/mutation/user-mutation";
import {
  useGetFollowers,
  useGetFollowing,
  useGetUserById,
  useGetUserStates,
  useIsAlreadyFollowing,
} from "@/actions/query/user-query";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";

import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { CreateChatButton } from "../message/message";

const AuthorProfilePage = ({
  currentUserId,
}: {
  currentUserId: Id<"users">;
}) => {
  const { userId } = useParams<{ userId: Id<"users"> }>();
  if (!userId) {
    return <div>user not found</div>;
  }
  return (
    <div>
      <AuthorProfile currentUserId={currentUserId} userId={userId} />
    </div>
  );
};

export default AuthorProfilePage;

const AuthorProfile = ({
  userId,
  currentUserId,
}: {
  userId: Id<"users">;
  currentUserId: Id<"users">;
}) => {
  const { user, isLoading } = useGetUserById({ userId });

  if (!user) {
    return <div>user not found</div>;
  }
  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <FollowButton currentUserId={currentUserId} userId={userId} />
      <h1>{user.name}</h1>
      <div>
        <AuthorFollowers userId={userId} />
      </div>
      <AuthorFollowing userId={userId} />

      <div>
        <CreateChatButton receiverId={userId} />
      </div>

      <div>
        <AuthorState userId={userId} />
      </div>
    </div>
  );
};

const FollowButton = ({
  userId,
  currentUserId,
}: {
  userId: Id<"users">;
  currentUserId: Id<"users">;
}) => {
  const { mutate: followUser, isPending: followingUser } = useFolllowUser();
  const { mutate: unFollowUser, isPending: unFollowingUser } =
    useUnfollowUser();
  const { isFollowing, isLoading: checkingFollowing } = useIsAlreadyFollowing({
    userId,
    currentUserId,
  });
  const { toast } = useToast();
  const handleFollowUser = () => {
    if (isFollowing && !checkingFollowing) {
      unFollowUser(
        {
          followerId: userId,
          followingId: currentUserId,
        },
        {
          onSuccess() {
            toast({
              title: "UnFollowed",
              description: "You have unFollowed this user",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: `${error}Something went wrong`,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      followUser(
        {
          followerId: userId,
          followingId: currentUserId,
        },
        {
          onSuccess() {
            toast({
              title: "Followed",
              description: "You have followed this user",
              variant: "default",
            });
          },
          onError(error) {
            toast({
              title: "Error",
              description: `${error}Something went wrong`,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const isLoading = followingUser || unFollowingUser || checkingFollowing;

  return (
    <Button disabled={isLoading} variant="outline" onClick={handleFollowUser}>
      {isFollowing ? "UnFollow" : "Follow"}
    </Button>
  );
};

// Dummy implementation for useGetFollowing

type Follower = {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
} | null;

interface UserFollowers {
  userId: Id<"users">;
  followers: Follower[] | undefined; // Followers can be an array of Follower objects or null
}

export const AuthorFollowersCard = ({ followers, userId }: UserFollowers) => {
  // Handle undefined followers (loading or error state)
  if (!followers) {
    return <div>Loading followers...</div>; // Or a more elaborate loading/error message
  }

  // Handle empty followers array
  if (followers.length === 0) {
    return (
      <div>
        <p>This user has no followers yet.</p>
      </div>
    );
  }

  return (
    <div>
      {followers.map((follower) => {
        // Handle cases where follower might be null
        if (!follower) {
          return <div key={userId}>Follower data unavailable</div>; // Or handle it differently
        }
        return (
          <div key={follower._id} className="follower-card p-2 bg-gray-600 ">
            {/* Example card content - customize as needed */}
            <p>
              Name: <b>{follower.name}</b>
            </p>
            <p>
              Email: <b>{follower.email}</b>
            </p>
            {/* Add more details or actions as required */}
          </div>
        );
      })}
    </div>
  );
};

export const AuthorFollowers = ({ userId }: { userId: Id<"users"> }) => {
  const { followers, isLoading } = useGetFollowers({ userId });

  return (
    <div className="author-followers">
      <h2>Followers</h2>
      {/* Handle loading state */}
      {isLoading && <div>Loading...</div>}
      {/* Pass followers and userId to AuthorFollowersCard */}
      <AuthorFollowersCard followers={followers} userId={userId} />
    </div>
  );
};
export const AuthorFollowing = ({ userId }: { userId: Id<"users"> }) => {
  const { following, isLoading } = useGetFollowing({ userId });

  return (
    <div className="author-followers">
      <h2>Followers</h2>
      {/* Handle loading state */}
      {isLoading && <div>Loading...</div>}
      {/* Pass followers and userId to AuthorFollowersCard */}
      <AuthorFollowersCard followers={following} userId={userId} />
    </div>
  );
};

export const AuthorState = ({ userId }: { userId: Id<"users"> }) => {
  const { userStates } = useGetUserStates({ userId });

  return (
    <div>
      <h1>{userStates ? userStates.followersCount : 0}</h1>
      <h1>{userStates ? userStates.followingCount : 0}</h1>
      <h1>{userStates ? userStates.likedPostCount : 0}</h1>
      <h1>{userStates ? userStates.savedPostCount : 0}</h1>
    </div>
  );
};
