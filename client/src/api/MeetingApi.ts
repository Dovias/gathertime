import axios from "axios";
import type { Meeting } from "../models/Meeting";

export const getMeeting = async (meetingId: number): Promise<Meeting> => {
  const res = await axios.get<Meeting>(`/meeting/${meetingId}`);
  return res.data;
};
