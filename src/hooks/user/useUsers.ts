import { userQueries } from "@/services/query-options/user";
import { useQuery } from "@tanstack/react-query";

export default function useUsers() {
  return useQuery(userQueries.list());
}
