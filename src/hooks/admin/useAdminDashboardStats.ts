import { adminQueries } from "@/services/query-options/admin";
import { useQuery } from "@tanstack/react-query";

export default function useAdminDashboardStats() {
  return useQuery(adminQueries.dashboardStats());
}
