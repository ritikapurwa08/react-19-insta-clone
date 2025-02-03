import { PostList } from "./post-list";
import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const YourPostPage = () => {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.posts.getPaginatedUserPost,
    {},
    { initialNumItems: 5 }
  );

  return (
    <div>
      <PostList
        results={results}
        isLoading={isLoading}
        status={status}
        loadMore={loadMore}
      />
    </div>
  );
};

export default YourPostPage;
