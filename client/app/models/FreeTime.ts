import type { Meeting } from "./Meeting";

export type FreeTime = {
  id: number;
  ownerId: number;
  meeting: Meeting | null;
  startDateTime: string;
  endDateTime: string;
};
