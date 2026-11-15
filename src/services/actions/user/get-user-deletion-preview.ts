import type { UserDeletionPreview } from "@/types/users";

export async function getUserDeletionPreview(userId: string): Promise<UserDeletionPreview> {
  const response = await fetch(`/api/admin/users/${userId}/deletion-preview`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "삭제 영향 범위를 조회하지 못했다.");
  }

  return result.data;
}
