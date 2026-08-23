"use client";

import EditContactScheduleDialog from "@/components/features/contact-schedule/EditContactScheduleDialog";
import { Button } from "@/components/ui/button";
import { InterestLevel } from "@/types/common";
import { Tables } from "@/types/database.types";
import { ComponentProps, useState } from "react";

export type EditableContactSchedule = {
  id?: string;
  scheduled_at?: string;
  companies: {
    id: string;
    name: string;
    interest_level: InterestLevel;
    company_contacts: Tables<"company_contacts">[];
    contact_count?: number;
  };
};

type Props = {
  contact: EditableContactSchedule;
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
