import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/types/database.types";
import { User } from "lucide-react";

interface Props {
  contacts: Tables<"company_contacts">[];
  faxNumber: string | null;
}

export default function CompanyManagerInfo({ contacts, faxNumber }: Props) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <User className="h-6 w-6 text-blue-600" />
          담당자 정보
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-[1fr_1fr] bg-slate-50 font-semibold text-slate-700">
            <div className="border-r px-8 py-4">담당자명</div>
            <div className="px-8 py-4">담당자 연락처</div>
          </div>

          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div key={contact.id} className="grid grid-cols-[1fr_1fr] border-t">
                <div className="flex items-center gap-3 border-r px-8 py-5">
                  <span>{contact.name ?? "-"}</span>

                  {index === 0 && (
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      대표 담당자
                    </span>
                  )}
                </div>

                <div className="px-8 py-5">{contact.phone}</div>
              </div>
            ))
          ) : (
            <div className="border-t px-8 py-6 text-center text-sm text-slate-500">
              등록된 담당자가 없습니다.
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-[10rem_1fr]">
            <div className="bg-slate-50 px-8 py-6 font-semibold text-slate-700">팩스번호</div>

            <div className="border-l px-8 py-6">{faxNumber ?? "-"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
