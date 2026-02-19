import type { Group, GroupMember } from "./types";

export type GroupDetailResponse = {
  group: Group;
  members: GroupMember[];
};
