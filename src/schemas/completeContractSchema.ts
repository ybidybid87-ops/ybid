import { z } from "zod";

export const completeContractSchema = z.object({
  memo: z.string().max(500, "500자 이하로 입력해주세요.").optional(),
  contractedAt: z.string().optional(),
  contractDurationDays: z
    .number()
    .int("계약 소요일은 정수로 입력해주세요.")
    .min(0, "계약 소요일은 0일 이상이어야 합니다.")
    .optional(),
});

export type CompleteContractForm = z.infer<typeof completeContractSchema>;
