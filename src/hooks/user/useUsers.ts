import { userQueries } from "@/services/query-options/user";
import { useQuery } from "@tanstack/react-query";

export default function useUsers(enabled = true) {
  return useQuery({
    ...userQueries.list(),
    enabled,
  });
}
