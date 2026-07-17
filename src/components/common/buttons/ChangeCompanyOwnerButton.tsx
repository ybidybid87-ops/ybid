"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useChangeCompanyOwner from "@/hooks/companies/useChangeCompanyOwner";
import useCompanyOwnerCandidates from "@/hooks/companies/useCompanyOwnerCandidates";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  companyId: string;
  currentOwnerName: string;
}

export default function ChangeCompanyOwnerButton({ companyId, currentOwnerName }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");

  const {
    data: candidates = [],
    isPending: isCandidatesPending,
    isError: isCandidatesError,
    error: candidatesError,
  } = useCompanyOwnerCandidates(companyId, open);

  const { mutate, isPending: isChanging } = useChangeCompanyOwner();

  useEffect(() => {
    if (!open) {
      setSelectedOwnerId("");
    }
  }, [open]);

  const selectedOwner = candidates.find((candidate) => candidate.id === selectedOwnerId);

  const handleChangeOwner = () => {
    if (!selectedOwnerId) {
      toast.error("새 담당자를 선택해주세요.");
      return;
    }

    mutate(
      {
        companyId,
        request: {
          ownerId: selectedOwnerId,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `${selectedOwner?.name ?? "선택한 사용자"} 님으로 담당자가 변경되었습니다.`,
          );

          setOpen(false);
        },

        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "담당자를 변경하지 못했습니다.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="h-12 rounded-2xl px-6">
          <ArrowRightLeft size={16} />
          담당자 변경
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>업체 담당자 변경</DialogTitle>

          <DialogDescription>이 업체를 담당할 새로운 영업사원을 선택합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">현재 담당자</p>

            <p className="mt-1 font-semibold text-slate-900">{currentOwnerName}</p>
          </div>

          {isCandidatesPending ? (
            <div className="flex min-h-28 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-slate-500" />
            </div>
          ) : null}

          {isCandidatesError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {candidatesError instanceof Error
                  ? candidatesError.message
                  : "담당자 목록을 불러오지 못했습니다."}
              </AlertDescription>
            </Alert>
          ) : null}

          {!isCandidatesPending && !isCandidatesError && candidates.length === 0 ? (
            <Alert>
              <AlertDescription>담당자로 변경할 수 있는 다른 사용자가 없습니다.</AlertDescription>
            </Alert>
          ) : null}

          {!isCandidatesPending && !isCandidatesError && candidates.length > 0 ? (
            <div className="space-y-2">
              <label htmlFor="new-owner" className="text-sm font-medium">
                새 담당자
              </label>

              <Select
                value={selectedOwnerId}
                onValueChange={setSelectedOwnerId}
                disabled={isChanging}
              >
                <SelectTrigger id="new-owner" className="w-full">
                  <SelectValue placeholder="새 담당자를 선택해주세요." />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>담당자 목록</SelectLabel>

                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        <div className="flex items-center gap-2">
                          <span>{candidate.name}</span>

                          {candidate.teams ? (
                            <span className="text-xs text-muted-foreground">
                              · {candidate.teams.name}
                            </span>
                          ) : null}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {selectedOwner ? (
            <Alert>
              <AlertDescription>
                담당자를 <strong>{selectedOwner.name}</strong> 님으로 변경합니다.
                {/* {selectedOwner.teams
                  ? ` 업체의 소속 팀도 ${selectedOwner.teams.name}(으)로 변경됩니다.`
                  : " 새 담당자에게 소속 팀이 없어 업체의 팀 정보도 비워집니다."} */}
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isChanging}
          >
            취소
          </Button>

          <Button
            type="button"
            onClick={handleChangeOwner}
            disabled={
              !selectedOwnerId || isChanging || isCandidatesPending || candidates.length === 0
            }
          >
            {isChanging ? (
              <>
                <Loader2 className="animate-spin" />
                변경 중
              </>
            ) : (
              "담당자 변경"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
