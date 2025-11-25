import { InvitationStatus } from "./InvitationStatus";

export interface Invitation {
  id: number;
  createdDateTime: string;
  modifiedDateTime: string;
  status: InvitationStatus;
  meetingId: number;
  inviterId: number;
  inviteeId: number;
}
