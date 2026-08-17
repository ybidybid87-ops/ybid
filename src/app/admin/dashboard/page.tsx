import Loading from "@/components/common/Loading";
import AdminDashboardPageContent from "@/components/features/admin-dashboard/AdminDashboardPageContent";
import { Suspense } from "react";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminDashboardPageContent />
    </Suspense>
  );
}
