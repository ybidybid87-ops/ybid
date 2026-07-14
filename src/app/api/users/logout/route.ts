import { logout } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logout();

    return NextResponse.json({
      success: true,
      message: "로그아웃되었습니다.",
    });
  } catch (error) {
    console.error("로그아웃 실패:", error);

    return NextResponse.json(
      {
        success: false,
        message: "로그아웃에 실패했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
