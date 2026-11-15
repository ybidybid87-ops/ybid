//app/types/users.d.ts

import { Tables } from "./database.types";

type role = "admin" | "leader" | "member";

type User = Pick<Tables<"users">, "id" | "name" | "created_at" | "team_id"> & {
  role: role;
};

export type UserOption = Pick<User, "id" | "name">;

export type AdminUser = Pick<
  Tables<"users">,
  "id" | "name" | "email" | "created_at" | "team_id" | "is_active"
> & {
  role: role;
  _count: {
    companies: number;
  };
};

export interface UserDeletionPreview {
  user: {
    id: string;
    name: string;
    email: string;
  };
  ownedCompanies: number;
  companyContacts: number;
  businessLicenses: number;
  companySchedules: number;
  companyHistories: number;
  externalCreatedSchedules: number;
  externalCompletedSchedules: number;
  externalHistories: number;
  externalContractCompanies: number;
  externalArchivedCompanies: number;
  externalNotifications: number;
}
