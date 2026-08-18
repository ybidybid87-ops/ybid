import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getInterestBadgeStyle, getInterestTextStyle } from "@/lib/utils";
import { DashboardDetailType } from "@/types/dashboard";

type Props = {
  high: number;
  medium: number;
  low: number;
  selectedDetail?: DashboardDetailType | null;
  onSelectDetail?: (type: DashboardDetailType) => void;
};

export default function DashboardInterestCard({
  high,
  medium,
  low,
  selectedDetail,
  onSelectDetail,
}: Props) {
  const interests = [
    {
      label: "상",
      count: high,
      type: "interest-high" as const,
      level: "high" as const,
    },
    {
      label: "중",
      count: medium,
      type: "interest-medium" as const,
      level: "medium" as const,
    },
    {
      label: "하",
      count: low,
      type: "interest-low" as const,
      level: "low" as const,
    },
  ];

  const isClickable = !!onSelectDetail;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <h3 className="text-h3 font-medium text-gray-500">관심도</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="my-4 space-y-1">
        {interests.map((item) => (
          <button
            key={item.type}
            type="button"
            disabled={!isClickable}
            onClick={() => onSelectDetail?.(item.type)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
              isClickable && "cursor-pointer hover:bg-muted",
              !isClickable && "cursor-default",
              selectedDetail === item.type && "bg-muted font-semibold",
            )}
          >
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 font-medium",
                getInterestBadgeStyle(item.level),
              )}
            >
              {item.label}
            </span>

            <span className={cn("font-medium", getInterestTextStyle(item.level))}>
              {item.count}개
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
