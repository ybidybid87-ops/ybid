import { fetcher } from "@/services/fetcher";
import { UserOption } from "@/types/users";

export async function getUsers(): Promise<UserOption[]> {
  return fetcher("/api/users");
}
