import { PostList } from "./post-list";
import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const AllPostpage = () => {
  const { isLoading, results, loadMore, status } = usePaginatedQuery(
    api.posts.getAllPaginatedPost,
    {},
    { initialNumItems: 5 }
  );
  return (
    <div className="py-4">
      <div className="p-4 flex w-full">
        <span className="text-2xl font-bold text-center w-full">All Posts</span>
      </div>
      <PostList
        results={results}
        isLoading={isLoading}
        status={status}
        loadMore={loadMore}
      />
    </div>
  );
};

export default AllPostpage;
