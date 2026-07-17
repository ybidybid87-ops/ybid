import { Tables } from "./database.types";

type role = "admin" | "leader" | "member";

type User = Pick<Tables<"users">, "id" | "name" | "created_at" | "team_id"> & {
  role: role;
};
