import SocialLoginButton from "@/components/login/SocialLoginButton";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";

type Props = {
  error?: string;
};

export default function LoginCard({ error }: Props) {
  const isInactiveAccount = error === "inactive-account";

  return (
    <section>
      <Card className="flex justify-center gap-4 border-none px-24 py-15 shadow-xl">
        <CardHeader className="flex flex-col items-center justify-center gap-8">
          <h2 className="text-[50px] font-bold">YBID</h2>

          <h2 className="text-h1 font-semibold">로그인</h2>
        </CardHeader>

        <CardDescription className="my-4 text-center">
          구글 계정으로 간편하게 로그인하세요.
        </CardDescription>

        {isInactiveAccount && (
          <p className="text-center text-sm font-medium text-red-500">
            퇴사 처리된 계정으로는 서비스를 이용할 수 없습니다.
          </p>
        )}

        <CardAction>
          <SocialLoginButton />
        </CardAction>
      </Card>
    </section>
  );
}
