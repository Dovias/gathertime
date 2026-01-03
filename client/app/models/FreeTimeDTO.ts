import { PastimeType } from "../enums/PastimeType";

export interface FreeTimeDTO {
  id: number;
  startDateTime: string;
  endDateTime: string;
  pastimeType: PastimeType;
  momentaryInterestIds: number[];
}
