import { useCreatePost } from "@/actions/mutation/post-interaction";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import CustomInput from "../ui/custom-input";
import SubmitButton from "../ui/submit-button";
import { Id } from "@convex/_generated/dataModel";

export function CreatePostDialog({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) {
  const { mutate: createPost, isPending: creatingPost } = useCreatePost();
  const [open, setOpen] = useState(false);
  const { toast } = useToast(); // or 'error'

  const PostZodSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    customImage: z.string().url("Must be a valid URL"),
  });

  type PostType = z.infer<typeof PostZodSchema>;

  const form = useForm<PostType>({
    resolver: zodResolver(PostZodSchema),
    defaultValues: {
      title: "",
      content: "",
      customImage: "",
    },
  });

  const handleCreatePost = async (data: PostType) => {
    if (userId) {
      await createPost(
        {
          title: data.title,
          content: data.content,
          customImage: data.customImage,
          userId,
          uploadedImageUrl: "",
        },
        {
          onSuccess() {
            toast({
              title: "Post created successfully!",
              description: "Your post has been successfully created.",
              duration: 800,
            });
            setOpen(false);
          },
          onError(error) {
            toast({
              title: "Error creating post",
              description: "Something went wrong while creating the post.",
            });
            console.error("Error creating post:", error);
          },
        }
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-pink-500 hover:bg-pink-600"
            variant="outline"
            size="default"
          >
            Create Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community!
            </DialogDescription>
            <div className="form-container">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreatePost)}>
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
                  <SubmitButton isLoading={creatingPost}>
                    Create Post
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
