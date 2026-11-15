import type { UserDeletionPreview } from "@/types/users";

export async function getUserDeletionPreview(userId: string): Promise<UserDeletionPreview> {
  const response = await fetch(`/api/users/${encodeURIComponent(userId)}/deletion-preview`);

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(`삭제 영향 범위를 조회하지 못했습니다. (HTTP ${response.status})`);
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "삭제 영향 범위를 조회하지 못했습니다.");
  }

  return result.data;
}
