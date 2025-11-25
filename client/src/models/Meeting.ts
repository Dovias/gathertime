import { MeetingStatus } from "./MeetingStatus";

export interface MeetingResponse {
  id: number;

  startDateTime: string;
  endDateTime: string;

  summary: string | null;
  description: string | null;
  location: string | null;

  maxParticipants: number | null;
  status: MeetingStatus;

  freeTimeId: number | null;
  ownerId: number | null;

  participantIds: number[] | null;
  activityIds: number[] | null;
}
