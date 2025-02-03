import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import SubmitButton from "../ui/submit-button";
import { Id } from "@convex/_generated/dataModel";
import { useUpdatePost } from "@/actions/mutation/post-interaction";
import { useGetPostById } from "@/actions/query/post-query";
import { Button } from "../ui/button";
import { Edit3Icon } from "lucide-react";

export function EditPostDialog({
  userId,
  postId,
}: {
  userId: Id<"users"> | undefined;
  postId: Id<"posts"> | undefined;
}) {
  const { mutate: updatePost, isPending: updatingPost } = useUpdatePost();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { post } = useGetPostById({ postId });

  const PostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    customImage: z.string().url("Must be a valid URL").optional(),
  });

  type PostType = z.infer<typeof PostSchema>;

  const form = useForm<PostType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      customImage: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        customImage: post.customImage || "", // Ensure it's an empty string if undefined
      });
    }
  }, [post, form]);

  const handleUpdatePost = async (data: PostType) => {
    if (userId && postId) {
      try {
        await updatePost({
          title: data.title,
          content: data.content,
          customImage: data.customImage || undefined, // Send as undefined if not provided
          postId,
        });
        toast({
          title: "Post Updated Successfully!",
          description: "Your post has been updated successfully.",
          duration: 800,
          // Assuming your toast library supports status
        });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: "Error Updating Post",
          description:
            "There was an issue while updating your post. Please try again.",
        });
        setIsOpen(false);
        console.error("Error updating post:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <span className="flex flex-row items-center">
              <Edit3Icon className="mr-1" />
              Edit Post
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Post</DialogTitle>
            <DialogDescription>
              Update your thoughts and share with the community!
            </DialogDescription>
            <div className="form-container">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdatePost)}>
                  <CustomInput
                    control={form.control}
                    name="title"
                    label="Title"
                    error={form.formState.errors.title?.message}
                  />
                  <CustomInput
                    control={form.control}
                    name="content"
                    label="Content"
                    error={form.formState.errors.content?.message}
                  />
                  <CustomInput
                    control={form.control}
                    name="customImage"
                    label="Custom Image URL (optional)"
                    error={form.formState.errors.customImage?.message}
                  />
                  <SubmitButton isLoading={updatingPost}>
                    Update Post
                  </SubmitButton>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
