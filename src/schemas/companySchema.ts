import { z } from "zod";

//주력분야 스키마
export const businessLicenseSchema = z
  .object({
    businessGroup: z.string().min(1, "공사업 유형을 선택해주세요."),

    businessType: z.string().min(1, "대업종을 선택해주세요."),

    specialtyType: z.string().optional(),

    isPrimary: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.businessGroup === "professional" && !data.specialtyType) {
      ctx.addIssue({
        code: "custom",
        path: ["specialtyType"],
        message: "주력분야를 선택해주세요.",
      });
    }
  });

//담당자 스키마
export const companyContactSchema = z.object({
  name: z.string().optional(),

  phone: z
    .string()
    .min(1, "담당자 연락처를 입력해주세요.")
    .regex(/^\d+$/, "담당자 연락처는 숫자만 입력해주세요."),
});

/* ___________________________________________________________________ */

export const createCompanySchema = z.object({
  // 기본 정보
  name: z.string().min(1, "업체명을 입력해주세요."),

  ceoName: z.string().optional(),

  ceoPhone: z
    .string()
    .transform((value) => value.replace(/[^0-9]/g, ""))
    .optional(),

  region: z.string().min(1, "지역을 선택해주세요."),

  faxNumber: z
    .string()
    .transform((value) => value.replace(/[^0-9]/g, ""))
    .optional(),

  // 담당자 정보
  contacts: z.array(companyContactSchema),

  // 영업 정보
  interestLevel: z.enum(["high", "medium", "low"], {
    message: "관심도를 선택해주세요.",
  }),

  salesStatus: z.enum(["new", "in_progress", "reviewing", "hold", "contracted", "failed"]),

  scheduledAt: z.string(),

  memo: z.string().optional(),

  // 공사업 정보
  businessLicenses: z
    .array(businessLicenseSchema)
    .min(1, "최소 1개 이상의 업종을 등록해야 합니다."),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
