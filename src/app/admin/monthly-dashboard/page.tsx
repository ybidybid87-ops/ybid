import Loading from "@/components/common/Loading";
import MonthlyDashboardPageContent from "@/components/features/admin-dashboard/MonthlyDashboardPageContent";
import { Suspense } from "react";

export default function MonthlyDashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MonthlyDashboardPageContent />
    </Suspense>
  );
}
