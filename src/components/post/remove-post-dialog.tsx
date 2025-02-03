import { useRemovePost } from "@/actions/mutation/post-interaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import SubmitButton from "../ui/submit-button";
import { Id } from "@convex/_generated/dataModel";
import { useGetPostById } from "@/actions/query/post-query";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

export function RemovePostDialog({
  postId,
}: {
  postId: Id<"posts"> | undefined;
}) {
  const { mutate: removePost, isPending: removingPost } = useRemovePost();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { post } = useGetPostById({ postId });

  const handleRemovePost = async () => {
    if (postId) {
      try {
        await removePost({ postId });
        toast({
          title: "Post Removed Successfully!",
          description: "The post has been deleted successfully.",
          // Assuming your toast library supports status
        });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: "Error Removing Post",
          description:
            "There was an issue while trying to remove the post. Please try again.",
        });
        console.error("Error removing post:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <span className="flex flex-row items-center justify-start w-full">
              <Trash2Icon className="text-red-400 mr-1" />
              <span>Remove</span>
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Post Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this post? This action cannot be
              undone.
            </DialogDescription>
            <div className="form-container">
              <p>
                <strong>Title:</strong> {post?.title}
              </p>
              <p>
                <strong>Content:</strong> {post?.content}
              </p>
              {/* Display other relevant post details if necessary */}
              <SubmitButton isLoading={removingPost} onClick={handleRemovePost}>
                Confirm Removal
              </SubmitButton>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
