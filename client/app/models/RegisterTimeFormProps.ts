import type { Meeting } from "./Meeting";

type MeetingData = Omit<Meeting, "id" | "owner" | "participants">;
type FreeTimeData = {
  startDateTime: string;
  endDateTime: string;
};

export type RegisterTimeFormProps = {
  onClose: () => void;
  formType: "meeting" | "free-time";
  onSubmit: (data: MeetingData | FreeTimeData) => void;
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
};
