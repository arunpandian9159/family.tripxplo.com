import { useRef, useEffect, useCallback } from "react";

interface UseInfiniteScrollParams {
  onLoadMore: () => void; // Function to call when more data needs to be loaded
  hasMore: boolean; // Flag indicating if there is more data to load
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
}: UseInfiniteScrollParams) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect(); // Disconnect any previous observers

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, onLoadMore],
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}
