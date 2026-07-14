import AuthRedirect from "@/components/features/home/AuthRedirect";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <AuthRedirect />
    </Suspense>
  );
}
