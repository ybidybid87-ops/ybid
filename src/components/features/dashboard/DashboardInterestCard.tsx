import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
    },
    {
      label: "중",
      count: medium,
      type: "interest-medium" as const,
    },
    {
      label: "하",
      count: low,
      type: "interest-low" as const,
    },
  ];

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
            onClick={() => onSelectDetail?.(item.type)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
              onSelectDetail && "hover:bg-muted",
              selectedDetail === item.type && "bg-muted font-semibold",
            )}
          >
            <span>{item.label}</span>
            <span>{item.count}개</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
