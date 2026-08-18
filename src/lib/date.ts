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

export type DateRange = {
  startDate: string;
  endDate: string;
};

export function formatLocalDate(year: number, month: number, day: number) {
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

export function getTodayDateString() {
  const now = new Date();

  return formatLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function getThisMonthDateRange(): DateRange {
  const now = new Date();

  return {
    startDate: formatLocalDate(now.getFullYear(), now.getMonth() + 1, 1),
    endDate: getTodayDateString(),
  };
}

export function getLastMonthDateRange(): DateRange {
  const now = new Date();

  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfLastMonth = new Date(firstDayOfThisMonth);

  lastDayOfLastMonth.setDate(0);

  return {
    startDate: formatLocalDate(
      lastDayOfLastMonth.getFullYear(),
      lastDayOfLastMonth.getMonth() + 1,
      1,
    ),
    endDate: formatLocalDate(
      lastDayOfLastMonth.getFullYear(),
      lastDayOfLastMonth.getMonth() + 1,
      lastDayOfLastMonth.getDate(),
    ),
  };
}

// YYYY-MM-DD 문자열을 한국 시간 기준 하루 시작 시각으로 변환
export function parseKoreaDateTime(date: string) {
  return new Date(`${date}T00:00:00${KOREA_TIME_OFFSET}`);
}

// endDate를 포함한 조회에서 사용할 다음 날 00:00
export function getNextKoreaDateTime(date: string) {
  const parsed = parseKoreaDateTime(date);

  parsed.setDate(parsed.getDate() + 1);

  return parsed;
}

// 어제 문자열 함수
export function getYesterdayDateString() {
  const now = new Date();

  now.setDate(now.getDate() - 1);

  return formatLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function getFullThisMonthDateRange(): DateRange {
  const now = new Date();

  const lastDayOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: formatLocalDate(now.getFullYear(), now.getMonth() + 1, 1),
    endDate: formatLocalDate(
      lastDayOfThisMonth.getFullYear(),
      lastDayOfThisMonth.getMonth() + 1,
      lastDayOfThisMonth.getDate(),
    ),
  };
}

// 한국 시간 기준 오늘 00:00 ~ 내일 00:00 범위
export function getTodayRange() {
  const now = getKoreaNow();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const startDate = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00${KOREA_TIME_OFFSET}`,
  );

  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + 1);

  return {
    startDate,
    endDate,
  };
}
