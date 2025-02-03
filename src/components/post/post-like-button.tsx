import {
  useLikePost,
  useUnlikePost,
} from "@/actions/mutation/post-interaction";
import { useCheckIsPostAlreadyLiked } from "@/actions/query/post-query";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { HeartIcon, LoaderIcon } from "lucide-react";

export function LikePostButton({
  postId,
  userId,
  likedCount,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
  likedCount: number | undefined;
}) {
  const { mutate: likePost, isPending: likingPost } = useLikePost();
  const { mutate: unlikePost, isPending: unlikingPost } = useUnlikePost();
  const { isLiked } = useCheckIsPostAlreadyLiked({ postId, userId });
  const { toast } = useToast();

  const handleLike = useCallback(async () => {
    if (postId && userId) {
      try {
        await likePost(
          { postId, userId },
          {
            onSuccess: () => {
              toast({
                title: "Liked!",
                description: "You liked this post.",
                duration: 800,
              });
            },
            onError: (error) => {
              toast({
                title: "Error Liking Post",
                description:
                  error.message || "An error occurred while liking the post.",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error liking post:", error);
      }
    }
  }, [likePost, postId, userId, toast]);

  const handleUnlike = useCallback(async () => {
    if (postId && userId) {
      try {
        await unlikePost(
          { postId, userId },
          {
            onSuccess: () => {
              toast({
                title: "Unliked!",
                description: "You unliked this post.",
                duration: 800,
              });
            },
            onError: (error) => {
              toast({
                title: "Error Unliking Post",
                description:
                  error.message || "An error occurred while unliking the post.",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error unliking post:", error);
      }
    }
  }, [unlikePost, postId, userId, toast]);

  return (
    <div>
      <Button
        onClick={isLiked ? handleUnlike : handleLike}
        disabled={likingPost || unlikingPost}
        size={"default"}
        variant={"outline"} // Change style based on like state
        className={`transition-all duration-200 `}
      >
        {likingPost || unlikingPost ? (
          <span className="">
            <LoaderIcon className="animate-spin" />
          </span>
        ) : (
          <span className="flex flex-row text-xs items-center">
            <HeartIcon
              className={`text-red-500 mr-1 ${isLiked ? "fill-red-400" : ""}`}
            />
            <span>
              {isLiked ? (
                likedCount !== undefined && likedCount > 1 ? (
                  <>
                    liked by you and {likedCount - 1}{" "}
                    {likedCount - 1 === 1 ? "person" : "people"}
                  </>
                ) : (
                  "liked by you"
                )
              ) : likedCount !== undefined && likedCount > 0 ? (
                <>
                  liked by {likedCount} {likedCount === 1 ? "person" : "people"}
                </>
              ) : (
                "Not liked yet" // Or any other message for no likes or undefined likedCount
              )}
            </span>
          </span>
        )}
      </Button>
    </div>
  );
}
