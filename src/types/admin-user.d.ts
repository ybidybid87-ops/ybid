export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "leader" | "member";

  createdAt: string;
  isActive: boolean;
  retiredAt: string | null;

  team: {
    id: string;
    name: string;
  } | null;

  companyCount: number;
};
