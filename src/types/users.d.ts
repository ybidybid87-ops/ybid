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
