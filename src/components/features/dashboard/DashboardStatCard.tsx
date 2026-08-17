import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function DashboardStatCard({
  title,
  count,
  icon: Icon,
  color,
  isActive = false,
  onClick,
}: Props) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        onClick &&
          "cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
        isActive && "border-primary ring-2 ring-primary/20",
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle>
          <h3 className="text-h3 font-medium text-gray-500">{title}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="my-4 flex items-center justify-between">
        <p className="text-3xl font-bold">{count}개</p>

        <Icon size={24} className={color} />
      </CardContent>
    </Card>
  );
}
