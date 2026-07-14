import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeAlert } from "lucide-react";

type Props = {
  high: number;
  medium: number;
  low: number;
};

export default function DashboardInterestCard({ high, medium, low }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-h3 font-medium text-gray-500">관심도</h3>
          <BadgeAlert className="h-6 w-6 text-orange-400" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-orange-500">상</span>
          <span className="text-lg font-bold">{high}개</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-yellow-500">중</span>
          <span className="text-lg font-bold">{medium}개</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">하</span>
          <span className="text-lg font-bold">{low}개</span>
        </div>
      </CardContent>
    </Card>
  );
}
