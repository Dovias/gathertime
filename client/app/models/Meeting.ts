import type { MeetingStatus } from "./enums/MeetingStatus";

export type MeetingParticipant = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Meeting = {
  id: number;

  summary: string | null;
  description: string | null;
  location: string | null;

  maxParticipants: number | null;
  status: MeetingStatus;

  participants: MeetingParticipant[];
  activityIds: number[];
};
