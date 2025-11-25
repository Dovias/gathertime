import axios from "axios";
import type { Invitation } from "../types/Invitation";

export const getInvitationsForUser = async (
  userId: number,
): Promise<Invitation[]> => {
  const res = await axios.get<Invitation[]>(`/invitation/user/${userId}`);
  return res.data;
};
