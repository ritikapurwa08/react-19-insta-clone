import { PostList } from "./post-list";
import { useGetCurrentUser } from "@/actions/query/user-query";
import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { BookmarkIcon } from "lucide-react";

export type YourPostPageProps = {
  results: Array<{
    _id: Id<"posts">;
    _creationTime: number;
    uploadedImageStorageId?: Id<"_storage"> | undefined;
    uploadedImageUrl?: string | undefined;
    updatedAt?: number | undefined;
    userId: Id<"users">;
    customImage: string;
    content: string;
    title: string;
  } | null>;
  isLoading: boolean;
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
};

const YourSavedPost = () => {
  const user = useGetCurrentUser();
  const userId = user?._id;
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.posts.getPaginatedSavedPosts,
    userId ? { userId } : "skip",
    { initialNumItems: 5 }
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center">
        <BookmarkIcon className="mr-2 h-6 w-6" />
        Your Saved Posts
      </h1>
      <PostList
        results={results}
        isLoading={isLoading}
        status={status}
        loadMore={loadMore}
      />
    </div>
  );
};

export default YourSavedPost;
