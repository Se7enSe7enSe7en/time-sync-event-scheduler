import type { ColumnType } from "kysely";
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Availability = {
  id: string;
  profile_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};
export type Event = {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  start_time: Timestamp;
  end_time: Timestamp;
  location: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Group = {
  id: string;
  name: string;
  description: string | null;
  code: string;
  owner_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type GroupMember = {
  id: string;
  group_id: string;
  profile_id: string;
  role: Generated<string>;
  joined_at: Generated<Timestamp>;
};
export type Profile = {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  timezone: Generated<string>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type DB = {
  availability: Availability;
  events: Event;
  group_members: GroupMember;
  groups: Group;
  profiles: Profile;
};
