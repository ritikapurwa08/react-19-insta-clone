import { api } from "@convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { PostList } from "./post-list";

const MostSavedPost = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.posts.getPaginatedMostSavedPosts,
    {},
    { initialNumItems: 10 }
  );
  return (
    <div>
      <h1>MostSavedPost</h1>
      <div>
        <PostList
          isLoading={isLoading}
          results={results}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
};

export default MostSavedPost;
