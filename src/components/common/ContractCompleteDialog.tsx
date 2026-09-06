"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useUpdateCompanyContract from "@/hooks/contract/useUpdateCompanyContract";
import { getKoreaDateKey, parseKoreaDate } from "@/lib/date";
import { CompleteContractForm, completeContractSchema } from "@/schemas/completeContractSchema";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const calculateDurationDays = (companyCreatedAt: string | Date, contractedAt: string) => {
  if (!contractedAt) {
    return undefined;
  }

  const createdDate = parseKoreaDate(getKoreaDateKey(companyCreatedAt));
  const contractDate = parseKoreaDate(contractedAt);

  const diffDays = Math.floor(
    (contractDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return diffDays >= 0 ? diffDays : undefined;
};

const getDefaultValues = (companyCreatedAt: string | Date): CompleteContractForm => {
  const contractedAt = getKoreaDateKey(new Date());

  return {
    memo: "",
    contractedAt,
    contractDurationDays: calculateDurationDays(companyCreatedAt, contractedAt),
  };
};

type Props = {
  companyId: string;
  companyCreatedAt: string | Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canSelectContractDate: boolean;
};

export default function ContractCompleteDialog({
  companyId,
  companyCreatedAt,
  open,
  onOpenChange,
  canSelectContractDate,
}: Props) {
  const mutation = useUpdateCompanyContract();

  const form = useForm<CompleteContractForm>({
    resolver: zodResolver(completeContractSchema),
    defaultValues: getDefaultValues(companyCreatedAt),
  });

  const onSubmit = ({ memo, contractedAt, contractDurationDays }: CompleteContractForm) => {
    mutation.mutate(
      {
        companyId,
        action: "complete",
        memo,
        contractedAt: canSelectContractDate ? contractedAt : undefined,
        contractDurationDays: canSelectContractDate ? contractDurationDays : undefined,
      },
      {
        onSuccess: () => {
          form.reset(getDefaultValues(companyCreatedAt));
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset(getDefaultValues(companyCreatedAt));
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>계약 완료</DialogTitle>

          <DialogDescription>
            {canSelectContractDate
              ? "실제 계약 완료일과 계약 소요일을 입력하여 계약 완료 처리할 수 있습니다."
              : "계약 완료 처리하면 업체 상태가 오늘 날짜로 계약 완료 처리됩니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {canSelectContractDate && (
            <>
              <Controller
                name="contractedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>계약 완료일</FieldLabel>

                    <FieldContent>
                      <Input
                        {...field}
                        id={field.name}
                        type="date"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const contractedAt = event.target.value;

                          field.onChange(contractedAt);

                          form.setValue(
                            "contractDurationDays",
                            calculateDurationDays(companyCreatedAt, contractedAt),
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                        aria-invalid={fieldState.invalid}
                      />

                      <FieldDescription>
                        실제 계약이 완료된 날짜를 선택할 수 있습니다.
                      </FieldDescription>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="contractDurationDays"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>계약 소요일</FieldLabel>

                    <FieldContent>
                      <Input
                        id={field.name}
                        type="number"
                        min={0}
                        step={1}
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;

                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                        aria-invalid={fieldState.invalid}
                        placeholder="계약 소요일을 입력하세요."
                      />

                      <FieldDescription>
                        자동 계산된 소요일을 직접 수정할 수 있습니다. 계약 완료일을 업체 등록일보다
                        이전으로 선택 시 0일로 표시되며, 미입력 시 상세 정보에는 "-"로 표시됩니다.
                      </FieldDescription>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />
            </>
          )}

          <Controller
            name="memo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>계약 메모</FieldLabel>

                <FieldContent>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={5}
                    aria-invalid={fieldState.invalid}
                    placeholder="계약 관련 메모를 입력하세요.(선택)"
                  />

                  <FieldDescription>계약 조건이나 특이사항을 기록할 수 있습니다.</FieldDescription>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "처리 중..." : "계약 완료"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
