export async function logoutUser() {
  const response = await fetch("/api/users/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }

  return response.json();
}
