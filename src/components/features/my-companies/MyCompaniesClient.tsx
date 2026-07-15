"use client";

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
import useCompanies from "@/hooks/companies/useCompanies";
import useUser from "@/hooks/user/useUser";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  ownerId?: string;
  showCreateButton?: boolean;
};

export default function MyCompaniesClient({ ownerId, showCreateButton = true }: Props) {
  const { data: user, isPending: isUserPending } = useUser();

  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interestLevel, setInterestLevel] = useState("all");
  const [salesStatus, setSalesStatus] = useState("all");
  const [region, setRegion] = useState("all");

  const targetOwnerId = ownerId ?? user?.id;

  const params = useMemo(
    () => ({
      ownerId: targetOwnerId,
      keyword: searchKeyword,
      interestLevel: interestLevel === "all" ? undefined : interestLevel,
      salesStatus: salesStatus === "all" ? undefined : salesStatus,
      region: region === "all" ? undefined : region,
    }),
    [targetOwnerId, searchKeyword, interestLevel, salesStatus, region],
  );

  const {
    data: companies = [],
    isPending: isCompaniesPending,
    isFetching: isCompaniesFetching,
  } = useCompanies(params);

  const resetFilters = () => {
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
    <div className="space-y-6">
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex gap-3">
            <Input
              className="max-w-md"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchKeyword(keyword);
                }
              }}
              placeholder="업체명, 대표자, 담당자, 연락처, 지역 검색"
            />

            <Button onClick={() => setSearchKeyword(keyword)} disabled={isCompaniesFetching}>
              {isCompaniesFetching ? "검색 중..." : "검색"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={interestLevel}
              onValueChange={setInterestLevel}
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
              onValueChange={setSalesStatus}
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

      <CompanyTable companies={companies} isLoading={isCompaniesFetching} />
    </div>
  );
}
