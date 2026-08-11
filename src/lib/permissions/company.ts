export type UserRole = "member" | "leader" | "admin";

/**
 * 관리자 권한 체크
 *
 * leader:
 * - 팀장
 *
 * owner:
 * - 대표
 */
export const isAdmin = (role: string) => {
  return role === "leader" || role === "owner";
};
