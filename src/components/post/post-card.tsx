import { useGetCurrentUser } from "@/actions/query/user-query";
import { Doc, Id } from "@convex/_generated/dataModel";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import UserBlogHeaderImage from "./user-blog-profile";
import { EditPostDialog } from "./edit-post-dialog";
import { RemovePostDialog } from "./remove-post-dialog";
import { LikePostButton } from "./post-like-button";
import { SavePostButton } from "./save-post-button";
import { AddComment } from "./post-comment";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
interface PostCardProps {
  post: Doc<"posts">;
}

export function PostCard({ post }: PostCardProps) {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const [showComments, setShowComments] = useState(false);

  const postCreatedAt = format(new Date(post._creationTime), "dd MMM yyyy");
  const updatedAt = post.updatedAt
    ? format(new Date(post.updatedAt), "dd MMM yyyy")
    : null;

  return (
    <Card className="border rounded-lg shadow-md">
      <CardContent className="m-0 p-0">
        <CardHeader className="m-0 p-0">
          <div className="flex w-full items-center flex-row justify-between">
            <div className="self-start px-4 py-2">
              <UserBlogHeaderImage showName={true} userId={post.userId} />
            </div>
            <div className=" self-end place-self-end  w-fit h-fit">
              <PostAction postId={post._id} userId={userId} />
            </div>
          </div>
          <Separator />
        </CardHeader>

        <div className="relative p-0.5 ">
          <img
            src={post.customImage}
            height={240}
            className="h-60 w-full object-cover "
            width={1200}
            alt=""
          />
        </div>

        <div id="post-title-content" className="flex-grow px-4 py-3">
          <h2 className="font-semibold text-xl text-pink-400">{post.title}</h2>
          <p>{post.content}</p>
        </div>

        <div className="px-6 flex flex-row space-x-3">
          <p className="text-sm text-muted-foreground">
            Created At - {postCreatedAt}
          </p>
          {updatedAt && (
            <p className="text-sm text-muted-foreground">
              UpdatedAt:{updatedAt}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between p-2 border-t ">
          <LikedButton postId={post._id} userId={userId} />
          <SavePostButton postId={post._id} userId={userId} />
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-500 hover:underline"
          >
            Comment
          </button>
        </div>

        {/* Comments Section */}
        <AddComment
          postId={post._id}
          userId={userId}
          setShowComments={setShowComments}
          showComments={showComments}
        />
      </CardContent>
    </Card>
  );
}

export function PostAction({
  postId,
  userId,
}: {
  postId: Id<"posts">;
  userId: Id<"users"> | undefined;
}) {
  const [closeDropdown, setCloseDropdown] = useState(false);
  return (
    <DropdownMenu open={closeDropdown} onOpenChange={setCloseDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col space-y-1 py-1">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditPostDialog userId={userId} postId={postId} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <RemovePostDialog postId={postId} />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LikedButton({
  postId,
  userId,
}: {
  postId: Id<"posts"> | undefined;
  userId: Id<"users"> | undefined;
}) {
  const users = useQuery(api.posts.getLikedUsers, postId ? { postId } : "skip");
  const likedCount = users?.likedCount;

  return (
    <div>
      <LikePostButton likedCount={likedCount} postId={postId} userId={userId} />
    </div>
  );
}
