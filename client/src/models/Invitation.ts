<<<<<<< HEAD
import { InvitationStatus } from "./enums/InvitationStatus";
=======
import type { InvitationStatus } from "./InvitationStatus";
>>>>>>> 935d6e8 (Fix various code smells)

export interface Invitation {
  id: number;
  createdDateTime: string;
  modifiedDateTime: string;
  status: InvitationStatus;
  meetingId: number;
  inviterId: number;
  inviteeId: number;
}
