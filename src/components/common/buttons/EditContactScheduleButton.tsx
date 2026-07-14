// 일정변경 버튼

"use client";

import EditContactScheduleDialog from "@/components/features/contact-schedule/EditContactScheduleDialog";
import { Button } from "@/components/ui/button";
import { DashboardTodayContact } from "@/types/dashboard";
import { ComponentProps, useState } from "react";

type Props = {
  contact: DashboardTodayContact;
  className?: string;
  size?: ComponentProps<typeof Button>["size"];
};

export default function EditContactScheduleButton({ contact, className, size }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className={className} size={size}>
        일정 변경
      </Button>

      <EditContactScheduleDialog open={open} onOpenChange={setOpen} contact={contact} />
    </>
  );
}
