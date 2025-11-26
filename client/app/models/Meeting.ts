import type { MeetingStatus } from "./enums/MeetingStatus";

export type MeetingParticipant = {
  id: string;
  firstName: string;
  lastName: string;
};

export type MeetingOwner = MeetingParticipant;

export type Meeting = {
  id: number;

  startDateTime: string;
  endDateTime: string;

  summary: string | null;
  description: string | null;
  location: string | null;

  maxParticipants: number | null;
  status: MeetingStatus;

  freeTimeId: number | null;
  owner: MeetingOwner;

  participants: MeetingParticipant[];
  activityIds: number[] | null;
};
