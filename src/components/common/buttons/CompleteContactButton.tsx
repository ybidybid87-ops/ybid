"use client";

import { Button } from "@/components/ui/button";
import useUpdateContactSchedule from "@/hooks/contact-schedule/useUpdateContactSchedule";
import { cn } from "@/lib/utils";

type Props = {
  scheduleId: string;
  className?: string;
};

export default function CompleteContactButton({ scheduleId, className }: Props) {
  const { mutate, isPending } = useUpdateContactSchedule();

  const handleComplete = () => {
    mutate({
      scheduleId,
      input: {
        completed: true,
      },
    });
  };

  return (
    <Button onClick={handleComplete} disabled={isPending} className={cn(className)}>
      연락 완료
    </Button>
  );
}
