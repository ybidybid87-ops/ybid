"use client";

import AppPagination from "@/components/common/AppPagination";
import CompanyTable from "@/components/common/CompanyTable";
import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useScrollToTopOnPageChange } from "@/hooks/common/useScrollToTopOnPageChange";
import useCompanies from "@/hooks/companies/useCompanies";
import useUser from "@/hooks/user/useUser";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type Props = {
  ownerId?: string;
  showCreateButton?: boolean;
};

export default function MyCompaniesClient({ ownerId, showCreateButton = true }: Props) {
  const { data: user, isPending: isUserPending } = useUser();

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interestLevel, setInterestLevel] = useState("all");
  const [salesStatus, setSalesStatus] = useState("all");
  const [region, setRegion] = useState("all");

  const targetOwnerId = ownerId ?? user?.id;

  const sectionRef = useRef<HTMLDivElement>(null);

  useScrollToTopOnPageChange(sectionRef, page);

  const params = useMemo(
    () => ({
      ownerId: targetOwnerId,
      keyword: searchKeyword,
      interestLevel: interestLevel === "all" ? undefined : interestLevel,
      salesStatus: salesStatus === "all" ? undefined : salesStatus,
      region: region === "all" ? undefined : region,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [targetOwnerId, searchKeyword, interestLevel, salesStatus, region, page],
  );

  const {
    data,
    isPending: isCompaniesPending,
    isFetching: isCompaniesFetching,
  } = useCompanies(params);

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(keyword);
  };

  const resetFilters = () => {
    setPage(1);

    setKeyword("");
    setSearchKeyword("");
    setInterestLevel("all");
    setSalesStatus("all");
    setRegion("all");
  };

  if ((!ownerId && isUserPending) || isCompaniesPending) {
    return <Loading />;
  }

  return (
    <div ref={sectionRef} className="space-y-6">
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex gap-3">
            <Input
              className="max-w-md"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="업체명, 대표자, 담당자, 연락처, 지역 검색"
            />

            <Button onClick={handleSearch} disabled={isCompaniesFetching}>
              {isCompaniesFetching ? "검색 중..." : "검색"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={interestLevel}
              onValueChange={(value) => {
                setPage(1);
                setInterestLevel(value);
              }}
              disabled={isCompaniesFetching}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="관심도 전체" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">관심도 전체</SelectItem>
                <SelectItem value="high">상</SelectItem>
                <SelectItem value="medium">중</SelectItem>
                <SelectItem value="low">하</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={salesStatus}
              onValueChange={(value) => {
                setPage(1);
                setSalesStatus(value);
              }}
              disabled={isCompaniesFetching}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="영업 상태 전체" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">영업 상태 전체</SelectItem>
                <SelectItem value="new">진행 중</SelectItem>
                <SelectItem value="contracted">계약 완료</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={resetFilters} disabled={isCompaniesFetching}>
              초기화
            </Button>

            {showCreateButton && (
              <Button asChild className="ml-auto">
                <Link href="/companies/new">업체 등록</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CompanyTable companies={data?.companies ?? []} isLoading={isCompaniesFetching} />

      <AppPagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </div>
  );
}
