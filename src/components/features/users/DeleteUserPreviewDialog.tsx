"use client";

import useUserDeletionPreview from "@/hooks/user/useUserDeletionPreview";
import type { AdminUser } from "@/types/users";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  user: AdminUser;
  onClose: () => void;
}

export default function DeleteUserPreviewDialog({ user, onClose }: Props) {
  const { data, isPending, isError, error } = useUserDeletionPreview(user.id);

  const items = data
    ? ([
        ["담당 업체", data.ownedCompanies],
        ["업체 담당자", data.companyContacts],
        ["업체 면허", data.businessLicenses],
        ["업체 연락 일정", data.companySchedules],
        ["업체 연락 이력", data.companyHistories],
        ["다른 업체에 생성한 일정", data.externalCreatedSchedules],
        ["다른 업체에서 완료한 일정", data.externalCompletedSchedules],
        ["다른 업체의 연락 이력", data.externalHistories],
        ["다른 업체의 계약 담당", data.externalContractCompanies],
        ["다른 업체의 아카이브 기록", data.externalArchivedCompanies],
        ["별도 알림 기록", data.externalNotifications],
      ] as const)
    : [];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>직원 삭제 영향 범위</DialogTitle>
          <DialogDescription>
            {user.name} ({user.email}) 계정의 삭제 전 데이터 현황이입니다.
          </DialogDescription>
        </DialogHeader>

        {isPending && <p className="text-sm text-muted-foreground">영향 범위를 조회하는 중...</p>}

        {isError && <p className="text-sm text-destructive">{error.message}</p>}

        {data && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              아래 수치는 현재 데이터 기준이며, 아직 삭제된 데이터는 없습니다.
            </p>

            <div className="rounded-md border">
              {items.map(([label, count]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
                >
                  <span className="text-sm">{label}</span>
                  <span className="font-medium tabular-nums">{count.toLocaleString()}건</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-destructive">
              직원 삭제 시 관련 데이터가 영구적으로 삭제될 수 있다. 실제 삭제 기능은 다음 단계에서
              구현합니다.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
