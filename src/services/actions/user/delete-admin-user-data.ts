export interface DeleteAdminUserDataResult {
  userId: string;
  userName: string;
  deletedCompanies: number;
  deletedExternalSchedules: number;
  updatedCompletedSchedules: number;
  updatedHistories: number;
  updatedContracts: number;
  updatedArchives: number;
  updatedNotifications: number;
}

export async function deleteAdminUserData(userId: string): Promise<DeleteAdminUserDataResult> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "직원 데이터 삭제에 실패했습니다.");
  }

  return result.data;
}
