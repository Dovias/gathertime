import type { PastimeType } from "./enums/PastimeType";

export interface FriendFreeTimeDTO {
  id: number;
  startDateTime: string;
  endDateTime: string;
  pastimeType: PastimeType;
  momentaryInterestIds: number[];

  friendId: number;
  firstName: string;
  lastName: string;
}
