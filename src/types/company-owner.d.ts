export type CompanyOwnerCandidate = {
  id: string;
  name: string;
  email: string;
  role: string;
  team_id: string | null;
  teams: {
    id: string;
    name: string;
  } | null;
};

export type ChangeCompanyOwnerRequest = {
  ownerId: string;
};

export type ChangeCompanyOwnerResponse = {
  id: string;
  owner_id: string;
  team_id: string | null;
  owner: {
    id: string;
    name: string;
  };
};