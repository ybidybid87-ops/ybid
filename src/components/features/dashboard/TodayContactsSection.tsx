"use client";

import AppPagination from "@/components/common/AppPagination";
import FallbackMessage from "@/components/common/FallbackMessage";
import Loading from "@/components/common/Loading";
import { getDescendingListNumber } from "@/lib/utils";
import { DashboardTodayContact } from "@/types/dashboard";
import TodayContactCard from "./TodayContactCard";

type Props = {
  contacts: DashboardTodayContact[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
};

export default function TodayContactsSection({
  contacts,
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  isLoading,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-h2 font-bold">오늘 연락해야 할 업체</h2>

      {isLoading ? (
        <Loading />
      ) : contacts.length === 0 ? (
        <FallbackMessage message="오늘 연락해야 할 업체가 없습니다." />
      ) : (
        <>
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <TodayContactCard
                key={contact.id}
                contact={contact}
                number={getDescendingListNumber({
                  totalCount,
                  page,
                  pageSize,
                  index,
                })}
              />
            ))}
          </div>

          <AppPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </section>
  );
}
