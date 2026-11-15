"use client";

import { useState } from "react";

import useDeleteAdminUserData from "@/hooks/user/useDeleteAdminUserData";
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
import { Input } from "@/components/ui/input";

interface Props {
  user: AdminUser;
  onClose: () => void;
}

export default function DeleteUserPreviewDialog({ user, onClose }: Props) {
  const [step, setStep] = useState<"preview" | "confirm">("preview");
  const [confirmationName, setConfirmationName] = useState("");

  const { data, isPending, isError, error } = useUserDeletionPreview(user.id);

  const deleteMutation = useDeleteAdminUserData();

  const isDeleting = deleteMutation.isPending;

  const canDelete = confirmationName === user.name && !isDeleting;

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
      ] as const)
    : [];

  const handleClose = () => {
    if (isDeleting) return;

    onClose();
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      await deleteMutation.mutateAsync(user.id);
      onClose();
    } catch {
      // Mutation 오류는 화면에 표시한다.
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-h-[85vh] overflow-y-auto"
        onEscapeKeyDown={(event) => {
          if (isDeleting) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isDeleting) event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "preview" ? "직원 삭제 영향 범위" : "직원 데이터 삭제 확인"}
          </DialogTitle>

          <DialogDescription>
            {user.name} ({user.email})
            {step === "preview"
              ? " 계정의 삭제 전 데이터 현황입니다."
              : " 직원의 업무 데이터를 삭제합니다."}
          </DialogDescription>
        </DialogHeader>

        {step === "preview" && (
          <>
            {isPending && (
              <p className="text-sm text-muted-foreground">영향 범위를 조회하는 중...</p>
            )}

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
                  삭제된 업무 데이터는 복구할 수 없습니다. 삭제 전 영향 범위를 반드시 확인해 주세요.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                닫기
              </Button>

              <Button
                variant="destructive"
                disabled={!data || isPending || isError}
                onClick={() => setStep("confirm")}
              >
                다음
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && (
          <>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                삭제를 진행하면 해당 직원이 담당하는 업체 및 관련 데이터가 영구적으로 삭제됩니다.
              </p>

              <p className="text-sm text-muted-foreground">
                사용자 계정과 Supabase Auth 계정은 삭제하지 않습니다.
              </p>

              <div className="space-y-2">
                <p className="text-sm">계속하려면 아래 직원 이름을 입력해 주세요.</p>

                <p className="font-semibold">{user.name}</p>

                <Input
                  value={confirmationName}
                  onChange={(event) => setConfirmationName(event.target.value)}
                  placeholder="직원 이름 입력"
                  disabled={isDeleting}
                  autoComplete="off"
                />
              </div>

              {deleteMutation.isError && (
                <p role="alert" className="text-sm text-destructive">
                  {deleteMutation.error.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                disabled={isDeleting}
                onClick={() => {
                  deleteMutation.reset();
                  setStep("preview");
                }}
              >
                이전
              </Button>

              <Button variant="destructive" disabled={!canDelete} onClick={handleDelete}>
                {isDeleting ? "삭제하는 중..." : "업무 데이터 영구 삭제"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
