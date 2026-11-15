"use client";

import { userQueries } from "@/services/query-options/user";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { role } from "@/types/users";

const ROLE_LABELS: Record<role, string> = {
  admin: "관리자",
  leader: "팀장",
  member: "팀원",
};

export default function UserManagementClient() {
  const { data: users, isPending, isError } = useQuery(userQueries.adminList());

  if (isPending) {
    return <div>사용자 목록을 불러오는 중...</div>;
  }

  if (isError) {
    return <div>사용자 목록을 불러오지 못했다.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">사용자 관리</h1>
        <p className="text-sm text-muted-foreground">직원 계정을 조회하고 관리한다.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>권한</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">담당 업체</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{ROLE_LABELS[user.role]}</TableCell>

                <TableCell>{user.is_active ? "활성" : "비활성"}</TableCell>

                <TableCell className="text-right">{user._count.companies}</TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  등록된 사용자가 없다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
