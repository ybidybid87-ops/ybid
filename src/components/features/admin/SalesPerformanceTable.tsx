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
  isLoading?: boolean;
};

function getRankContent(rank: number) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center gap-2 font-bold">
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
    );
  }

  return rank;
}

export default function SalesPerformanceTable({ items, isLoading = false }: Props) {
  return (
    <Card className="relative overflow-hidden p-0">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
          <Loading />
        </div>
      )}

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="w-24 text-center align-middle">
                순위
              </TableHead>

              <TableHead rowSpan={2} className="align-middle">
                이름
              </TableHead>

              <TableHead colSpan={2} className="border-l text-center font-semibold">
                현재 담당 현황
              </TableHead>

              <TableHead colSpan={2} className="border-l text-center font-semibold">
                선택 기간 실적
              </TableHead>
            </TableRow>

            <TableRow>
              <TableHead className="border-l text-center">담당 업체</TableHead>

              <TableHead className="text-center">담당자 연락처</TableHead>

              <TableHead className="border-l text-center">콜</TableHead>

              <TableHead className="text-center">계약</TableHead>
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

                  <TableCell className="border-l text-center">{item.companyCount}개</TableCell>

                  <TableCell className="text-center">{item.contactCount}개</TableCell>

                  <TableCell className="border-l text-center">{item.callCount}건</TableCell>

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
