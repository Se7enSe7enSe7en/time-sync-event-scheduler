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

export type GroupMember = {
  id: string;
  role: Role;
  joined_at: Date;

  name?: string;
  email?: string;
  timezone?: string;
};
