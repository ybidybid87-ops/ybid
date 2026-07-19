import { RefObject, useEffect } from "react";

// 페이지네이션에서 페이지가 변경될 때 목록의 맨 위로 부드럽게 스크롤

export function useScrollToTopOnPageChange(ref: RefObject<HTMLElement | null>, page: number) {
  useEffect(() => {
    if (page === 1) return;

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page, ref]);
}
