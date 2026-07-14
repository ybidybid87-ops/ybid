"use client";

import { signInWithGoogle } from "@/app/login/actions";
import { ButtonHTMLAttributes } from "react";

type SocialLoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function SocialLoginButton({ className, ...rest }: SocialLoginButtonProps) {
  return (
    <form action={signInWithGoogle} className="w-full">
      <button
        {...rest}
        type="submit"
        className={`flex h-13 w-full cursor-pointer min-w-82 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 ${className ?? ""}`}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-white text-xl font-bold">
          <span className="text-blue-600">G</span>
        </span>

        <span>Google 계정으로 로그인</span>
      </button>
    </form>
  );
}
