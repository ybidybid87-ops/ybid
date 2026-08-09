import { Tables } from "./database.types";

type role = "admin" | "leader" | "member";

export type User = Pick<
  Tables<"users">,
  "id" | "name" | "created_at" | "team_id" | "is_active" | "retired_at"
> & {
  role: role;
};
