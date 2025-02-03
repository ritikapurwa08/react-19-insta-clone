import { useCreateComment } from "@/actions/mutation/post-interaction";
import { useGetPostComment } from "@/actions/query/post-query";
import { useToast } from "@/hooks/use-toast";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { LoaderIcon, SendIcon } from "lucide-react";

export function AddComment({
  postId,
  userId,
  showComments,
  setShowComments,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const { mutate: createComment, isPending: creatingComment } =
    useCreateComment();
  const CommentZodSchema = z.object({
    comment: z.string().min(1, "Comment is required"),
  });
  type CommentType = z.infer<typeof CommentZodSchema>;
  const form = useForm<CommentType>({
    resolver: zodResolver(CommentZodSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleAddComment = async (data: CommentType) => {
    if (postId && userId) {
      try {
        await createComment(
          {
            comment: data.comment,
            postId,
            userId,
          },
          {
            onSuccess() {
              toast({
                title: "Comment Added!",
                description: "Your comment has been successfully added.",
                duration: 800,
              });
              form.reset();
              setShowComments(true);
              // Clear the input field after successful submission
            },
            onError(error) {
              toast({
                title: "Error Adding Comment",
                description:
                  error.message ||
                  "An error occurred while adding your comment.",
              });
            },
          }
        );
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const { comments } = useGetPostComment({ postId });

  return (
    <div
      className={`mt-2 ${showComments ? " flex flex-col w-full" : "hidden"}`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddComment)}
          className="flex flex-row w-full border justify-start items-end space-x-4"
        >
          <CustomInput
            control={form.control}
            name="comment"
            placeholder="Add a comment..."
            label=""
            className="w-full flex flex-grow-0"
          />
          <Button
            variant="outline"
            size="icon"
            type="submit"
            className={` size-9  flex justify-center items-center`}
            disabled={creatingComment}
          >
            {creatingComment ? (
              <span>
                <LoaderIcon className="animate-spin" />
              </span>
            ) : (
              <span>
                <SendIcon />
              </span>
            )}
          </Button>
        </form>
      </Form>
      <div>
        <PostComment comments={comments} />
      </div>
    </div>
  );
}

type CommentNewType = {
  username: string;
  customImage: string;
  _id: Id<"postComment">;
  _creationTime: number;
  updatedAt?: number | undefined;
  userId: Id<"users">;
  postId: Id<"posts">;
  comment: string;
};

export function PostComment({
  comments,
}: {
  comments: CommentNewType[] | undefined;
}) {
  return (
    <div>
      {comments ? (
        <div className="border">
          {comments.map((comment) => (
            <div key={comment._id} className="flex px-3 gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="size-8 overflow-hidden"
                  src={comment.customImage}
                  alt="user image"
                />
                <AvatarFallback>{comment.username.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-pink-500 text-base">
                  {" "}
                  by {comment.username}
                </span>
                <span className="text-xs">{comment.comment}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <span>no comment found</span>
        </div>
      )}
    </div>
  );
}
