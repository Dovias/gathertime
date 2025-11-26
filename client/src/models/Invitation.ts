<<<<<<< HEAD
<<<<<<< HEAD
import { InvitationStatus } from "./enums/InvitationStatus";
=======
import type { InvitationStatus } from "./InvitationStatus";
>>>>>>> 935d6e8 (Fix various code smells)
=======
import type { InvitationStatus } from "./enums/InvitationStatus";
>>>>>>> 3cfff02 (linting)

export interface Invitation {
  id: number;
  createdDateTime: string;
  modifiedDateTime: string;
  status: InvitationStatus;
  meetingId: number;
  inviterId: number;
  inviteeId: number;
}
