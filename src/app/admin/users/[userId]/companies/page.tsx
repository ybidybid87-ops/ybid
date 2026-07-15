import Loading from "@/components/common/Loading";
import AdminUserCompaniesPageContent from "@/components/features/admin/AdminUserCompaniesPageContent";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default function AdminUserCompaniesPage({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <AdminUserCompaniesPageContent params={params} />
    </Suspense>
  );
}
