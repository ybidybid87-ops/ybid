import Loading from "@/components/common/Loading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AdminSalesPerformanceItem } from "@/types/admin-sales-performance";
import { Trophy } from "lucide-react";
import Link from "next/link";

type Props = {
  items: AdminSalesPerformanceItem[];
  isPending: boolean;
};

function getRankContent(rank: number) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center gap-2 font-bold">
        <Trophy className="h-5 w-5 text-yellow-500" />1
      </div>
    );
  }

  return rank;
}

export default function SalesPerformanceTable({ items, isPending }: Props) {
  if (isPending) {
    return <Loading />;
  }

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 text-center">순위</TableHead>

              <TableHead>이름</TableHead>

              <TableHead className="text-center">내 업체 수</TableHead>

              <TableHead className="text-center">담당자 연락처 수</TableHead>

              <TableHead className="text-center">콜 수</TableHead>

              <TableHead className="text-center">계약 건수</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                  영업 현황 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.userId}>
                  <TableCell className="text-center font-medium">
                    {getRankContent(item.rank)}
                  </TableCell>

                  <TableCell className="font-semibold">
                    <Link
                      href={`/admin/users/${item.userId}/companies`}
                      className="transition-colors hover:text-primary hover:underline"
                    >
                      {item.name}
                    </Link>
                  </TableCell>

                  <TableCell className="text-center">{item.companyCount}개</TableCell>

                  <TableCell className="text-center">{item.contactCount}개</TableCell>

                  <TableCell className="text-center">{item.callCount}건</TableCell>

                  <TableCell className="text-center font-semibold">
                    {item.contractCount}건
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
