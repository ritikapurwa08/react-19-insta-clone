import {
  useSavePost,
  useUnsavePost,
} from "@/actions/mutation/post-interaction";
import { useCheckIsPostAlreadySaved } from "@/actions/query/post-query";
import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { BookmarkIcon, LoaderIcon } from "lucide-react";

export function SavePostButton({
  postId,
  userId,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
}) {
  const { mutate: savePost, isPending: savingPost } = useSavePost();
  const { mutate: unsavePost, isPending: unsavingPost } = useUnsavePost();
  const { isSaved } = useCheckIsPostAlreadySaved({ postId, userId });
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    if (postId && userId) {
      try {
        await savePost(
          { postId, userId },
          {
            onSuccess: () => {
              toast({
                title: "Saved!",
                description: "You have saved this post successfully.",
                duration: 800,
              });
            },
            onError: (error) => {
              toast({
                title: "Error Saving Post",
                description:
                  error.message || "An error occurred while saving the post.",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error saving post:", error);
      }
    }
  }, [savePost, postId, userId, toast]);

  const handleUnsave = useCallback(async () => {
    if (postId && userId) {
      try {
        await unsavePost(
          { postId, userId },
          {
            onSuccess: () => {
              toast({
                title: "Unsaved!",
                description: "You have unsaved this post.",
                duration: 800,
              });
            },
            onError: (error) => {
              toast({
                title: "Error Unsaving Post",
                description:
                  error.message || "An error occurred while unsaving the post.",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error unsaving post:", error);
      }
    }
  }, [unsavePost, postId, userId, toast]);

  return (
    <div>
      <Button
        onClick={isSaved ? handleUnsave : handleSave}
        disabled={savingPost || unsavingPost}
        size={"icon"}
        variant={"outline"} // Change style based on save state
        className={`transition-all duration-200 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white`}
      >
        {savingPost || unsavingPost ? (
          <span className="">
            <LoaderIcon className="animate-spin" />
          </span>
        ) : (
          <span>
            <BookmarkIcon
              className={`text-blue-500 ${isSaved ? "fill-blue-400" : ""}`}
            />
          </span>
        )}
      </Button>
    </div>
  );
}
