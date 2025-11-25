import axios from "axios";
import type { MeetingResponse } from "../types/Meeting";

export const getMeeting = async (meetingId: number): Promise<MeetingResponse> => {
  const res = await axios.get<MeetingResponse>(`/meeting/${meetingId}`);
  return res.data;
};
