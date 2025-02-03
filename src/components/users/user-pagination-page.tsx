import { useGetAllUsersPaginated } from "@/actions/query/user-query";
import { useRef } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import UserBlogHeaderImage from "../post/user-blog-profile";
// Custom hook for intersection observer

const AllUsersPage = () => {
  const { results, hasMore, isLoading, NoMore, loadMore } =
    useGetAllUsersPaginated();
  const navigate = useNavigate();

  // Ref for loading more users
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Intersection observer to trigger loading more users

  const handleClick = (userId: string) => {
    navigate(`/author/${userId}`);
  };

  return (
    <main className="pt-4 flex flex-col space-y-4">
      <ScrollArea className="h-full">
        {isLoading && <p>Loading...</p>}
        {results.map((user) => (
          <div
            className="p-4 border cursor-pointer  transition"
            onClick={() => handleClick(user._id)}
            key={user._id}
          >
            <UserBlogHeaderImage
              size="size-12"
              showName={true}
              userId={user._id}
            />
          </div>
        ))}

        {/* Load More Indicator */}
        {hasMore && !isLoading && (
          <div ref={loadMoreRef} className="p-4 text-center">
            <Button variant={"outline"} onClick={() => loadMore(10)}>
              Load More
            </Button>
          </div>
        )}

        {/* No More Users Message */}
        {NoMore && <p>No more users to load.</p>}
      </ScrollArea>
    </main>
  );
};

export default AllUsersPage;
