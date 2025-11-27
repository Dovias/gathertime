import axios from "axios";
import type { Meeting } from "../models/Meeting";

export const getMeeting = async (meetingId: number): Promise<Meeting> => {
  const res = await axios.get<Meeting>(`/meeting/${meetingId}`);
  return res.data;
};

export const confirmInvitation = async (invitationId: number) => {
  await axios.put(`/meeting/invitation/${invitationId}/confirm`);
};

export const declineInvitation = async (invitationId: number) => {
  await axios.put(`/meeting/invitation/${invitationId}/decline`);
};
