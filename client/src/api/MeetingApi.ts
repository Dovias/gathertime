import axios from "axios";
<<<<<<< HEAD
import type { Meeting } from "../models/Meeting";
=======
import type { MeetingResponse } from "../models/Meeting";
>>>>>>> 3cfff02 (linting)

export const getMeeting = async (
  meetingId: number,
<<<<<<< HEAD
): Promise<Meeting> => {
  const res = await axios.get<Meeting>(`/meeting/${meetingId}`);
=======
): Promise<MeetingResponse> => {
  const res = await axios.get<MeetingResponse>(`/meeting/${meetingId}`);
>>>>>>> 935d6e8 (Fix various code smells)
  return res.data;
};
