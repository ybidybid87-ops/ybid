//app/services/actions/user/update-admin-user-name.ts

import { UpdateUserNameInput } from "@/schemas/updateUserNameSchema";

interface UpdateAdminUserNameParams {
  userId: string;
  data: UpdateUserNameInput;
}

export async function updateAdminUserName({ userId, data }: UpdateAdminUserNameParams) {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message ?? "사용자 이름 변경에 실패했다.");
  }

  return response.json();
}
