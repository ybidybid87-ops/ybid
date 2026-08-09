import LoginBrand from "@/components/login/LoginBrand";
import LoginCard from "@/components/login/LoginCard";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default function LoginPage({ searchParams }: Props) {
  return (
    <div className="flex h-screen items-center justify-center gap-40">
      <LoginBrand />

      <Suspense fallback={<LoginCard />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginContent({ searchParams }: Props) {
  const { error } = await searchParams;

  return <LoginCard error={error} />;
}
