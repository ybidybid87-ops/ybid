// src/lib/date.ts

//한국 시간 기준으로 조회하기 위한 함수들

const KOREA_TIME_OFFSET = "+09:00";

//현재 한국 시간을 구할 때
export function getKoreaNow() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
    }),
  );
}

//오늘 날짜(@db.Date) 비교용
// 오늘 날짜(@db.Date) 비교용
export function getToday() {
  const now = getKoreaNow();

  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

//이번 달 범위 조회
export function getMonthRange(year?: number, month?: number) {
  const now = getKoreaNow();

  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth() + 1;

  const startDate = new Date(
    `${targetYear}-${String(targetMonth).padStart(2, "0")}-01T00:00:00${KOREA_TIME_OFFSET}`,
  );

  const nextYear = targetMonth === 12 ? targetYear + 1 : targetYear;
  const nextMonth = targetMonth === 12 ? 1 : targetMonth + 1;

  const endDate = new Date(
    `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00${KOREA_TIME_OFFSET}`,
  );

  return {
    startDate,
    endDate,
  };
}

//사용자가 입력한 날짜를 DB에 저장
export function parseKoreaDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

//Date를 한국 시간 기준 YYYY-MM-DD 문자열로 변환
export function getKoreaDateKey(value: string | Date) {
  const date = new Date(value);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}
