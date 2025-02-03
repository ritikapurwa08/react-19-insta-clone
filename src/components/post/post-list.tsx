import { useEffect, useRef, useMemo, useState } from "react";
import { LoadingPostCard } from "./post-loading-card";
import { PostCard } from "./post-card";
import { Id } from "@convex/_generated/dataModel";

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

export function PostList({ results, status, loadMore }: YourPostPageProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingLock = useRef(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "200px", // Increased margin for better scroll anticipation
      threshold: 0.1, // Lower threshold for earlier trigger
    }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (
        lastEntry.isIntersecting &&
        status === "CanLoadMore" &&
        !loadingLock.current
      ) {
        loadingLock.current = true;
        loadMore(5);

        // Add a small cooldown to prevent rapid successive loads
        setTimeout(() => {
          loadingLock.current = false;
        }, 1000);
      }
    }, observerOptions);

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        return currentLoader && observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [status, loadMore, observerOptions]);

  // Handle initial load
  useEffect(() => {
    if (!initialLoadDone && status === "CanLoadMore" && results.length === 0) {
      loadMore(5);
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, status, loadMore, results.length]);

  return (
    <div className="flex flex-col gap-y-4 p-1 lg:p-10">
      {results.map((post) => {
        if (!post) return null;
        return <PostCard key={post._id} post={post} />;
      })}

      <div ref={loaderRef} className="min-h-[100px]">
        {status === "LoadingFirstPage" && <LoadingPostCard />}
        {status === "LoadingMore" && <LoadingPostCard />}
        {status === "Exhausted" && (
          <div className="text-center text-muted-foreground py-4">
            No more posts to show
          </div>
        )}
      </div>
    </div>
  );
}
