export type Profile = {
  id: string;
  userId: string;
  email: string;
  name?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  code: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Role = "ADMIN" | "MEMBER";

// vibe-check: I've added properties from Profile type such as the "timezone" here, is this the correct approach?
export type GroupMember = {
  id: string; // vibe-check: id from profile?
  role: Role;
  joined_at: Date;

  // from Profile
  name?: string;
  email?: string;
  timezone?: string;
};
