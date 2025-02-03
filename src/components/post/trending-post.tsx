import { api } from "@convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { PostList } from "./post-list";

const TrendingPosts = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.posts.getPaginatedMostLikedPosts,
    {},
    { initialNumItems: 10 }
  );
  return (
    <div>
      <h1>i am TrTrendingPost</h1>
      <PostList
        isLoading={isLoading}
        results={results}
        loadMore={loadMore}
        status={status}
      />
    </div>
  );
};

export default TrendingPosts;
