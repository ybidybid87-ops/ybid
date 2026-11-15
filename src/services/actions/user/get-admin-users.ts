import { fetcher } from "@/services/fetcher";
import { AdminUser } from "@/types/users";

export async function getAdminUsers(): Promise<AdminUser[]> {
  return fetcher("/api/admin/users");
}
