export function getPaginationPages(currentPage: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 앞부분
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // 뒷부분
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // 가운데
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}
