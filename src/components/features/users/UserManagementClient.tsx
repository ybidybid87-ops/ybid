"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { userQueries } from "@/services/query-options/user";
import type { AdminUser, role } from "@/types/users";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteUserPreviewDialog from "./DeleteUserPreviewDialog";
import EditUserNameDialog from "./EditUserNameDialog";

const ROLE_LABELS: Record<role, string> = {
  admin: "관리자",
  leader: "팀장",
  member: "팀원",
};

export default function UserManagementClient() {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

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
              <TableHead className="text-right">관리</TableHead>
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

                <TableCell className="text-right gap-1 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingUser(user)}
                  >
                    삭제
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    이름 변경
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  등록된 사용자가 없다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <EditUserNameDialog
          key={editingUser.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {deletingUser && (
        <DeleteUserPreviewDialog
          key={deletingUser.id}
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}
