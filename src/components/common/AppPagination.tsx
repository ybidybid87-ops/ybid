"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { getPaginationPages } from "@/lib/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AppPagination({ page, totalPages, onPageChange }: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationPages(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button variant="ghost" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeftIcon className="size-4" />
            이전
          </Button>
        </PaginationItem>

        {pages.map((value, index) =>
          value === "..." ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={value}>
              <Button
                variant={page === value ? "outline" : "ghost"}
                onClick={() => onPageChange(value)}
              >
                {value}
              </Button>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            다음
            <ChevronRightIcon className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
