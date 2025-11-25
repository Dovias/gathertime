<<<<<<< HEAD
import { MeetingStatus } from "./enums/MeetingStatus";
=======
import type { MeetingStatus } from "./MeetingStatus";
>>>>>>> 935d6e8 (Fix various code smells)

export type MeetingParticipant = {
  id: string;
  firstName: string;
  lastName: string;
}

export type MeetingOwner = MeetingParticipant

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
}