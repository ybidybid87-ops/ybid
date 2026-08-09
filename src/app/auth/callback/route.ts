// src/app/auth/callback/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";
import { upsertGoogleUser } from "./auth";

/* OAuth 로그인 후 리디렉션된 사용자를 처리하는 서버 핸들러 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      const existingUser = await prisma.users.findUnique({
        where: {
          id: authUser.id,
        },
        select: {
          is_active: true,
        },
      });

      // 기존에 등록된 퇴사 계정이면 로그인 차단
      if (existingUser && !existingUser.is_active) {
        await supabase.auth.signOut();

        return NextResponse.redirect(`${origin}/login?error=inactive-account`);
      }

      // 신규 사용자 또는 기존 활성 사용자 정보 동기화
      await upsertGoogleUser(supabase);

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
