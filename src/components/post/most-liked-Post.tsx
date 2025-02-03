import { api } from "@convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { PostList } from "./post-list";

const MostLikedPost = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.posts.getPaginatedMostLikedPosts,
    {},
    { initialNumItems: 10 }
  );
  return (
    <div>
      <h1>MostLikedPost</h1>
      <div>
        <PostList
          results={results}
          isLoading={isLoading}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
};

export default MostLikedPost;
