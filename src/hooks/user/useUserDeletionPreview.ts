import { userQueries } from "@/services/query-options/user";
import { useQuery } from "@tanstack/react-query";

export default function useUserDeletionPreview(userId: string) {
  return useQuery(userQueries.deletionPreview(userId));
}
