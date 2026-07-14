import Loading from "@/components/common/Loading";
import AdminPageContent from "@/components/features/admin/AdminPageContent";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminPageContent />
    </Suspense>
  );
}
