import type { PastimeType } from "./enums/PastimeType";

export interface CreateFreeTimeRequestDTO {
  userId: number;
  startDateTime: string;
  endDateTime: string;
  publicForAllFriends?: boolean;
  pastimeType?: PastimeType;
  activityIds?: number[];
}
