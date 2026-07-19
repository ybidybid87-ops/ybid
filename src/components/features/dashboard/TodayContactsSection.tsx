"use client";

import AppPagination from "@/components/common/AppPagination";
import FallbackMessage from "@/components/common/FallbackMessage";
import Loading from "@/components/common/Loading";
import { useScrollToTopOnPageChange } from "@/hooks/common/useScrollToTopOnPageChange";
import { DashboardTodayContact } from "@/types/dashboard";
import { useRef } from "react";
import TodayContactCard from "./TodayContactCard";

type Props = {
  contacts: DashboardTodayContact[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
};

export default function TodayContactsSection({
  contacts,
  page,
  totalPages,
  onPageChange,
  isLoading,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollToTopOnPageChange(sectionRef, page);

  return (
    <section ref={sectionRef} className="space-y-6">
      <h2 className="text-h2 font-bold">오늘 연락해야 할 업체</h2>

      {isLoading ? (
        <Loading />
      ) : contacts.length === 0 ? (
        <FallbackMessage message="오늘 연락해야 할 업체가 없습니다." />
      ) : (
        <>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <TodayContactCard key={contact.id} contact={contact} />
            ))}
          </div>

          <AppPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </section>
  );
}
