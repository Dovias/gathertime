import axios from "axios";
import type { FreeTimeDTO } from "../models/FreeTimeDTO";
import type { FriendFreeTimeDTO } from "../models/FriendFreeTimeDTO";

export const getFreeTimes = async (
  userId: number,
  startDateTime: string,
  endDateTime: string,
): Promise<FreeTimeDTO[]> => {
  const response = await axios.get<FreeTimeDTO[]>(`/freetime/user/${userId}`, {
    params: { startDateTime, endDateTime },
  });
  return response.data;
};

export const createFreeTime = async (
  payload: CreateFreeTimeRequestDTO,
): Promise<void> => {
  await axios.post("/freetime", payload);
};

export const getOverlappingFreeTimesOfFriends = async (
  userId: number,
): Promise<FriendFreeTimeDTO[]> => {
  const response = await axios.get<FriendFreeTimeDTO[]>(
    `/freetime/user/${userId}/friends/overlapping`,
  );

  return response.data;
};

export const getFreeTimesOfFriends = async (
  userId: number,
): Promise<FriendFreeTimeDTO[]> => {
  const response = await axios.get<FriendFreeTimeDTO[]>(
    `/freetime/user/${userId}/friends`,
  );

  return response.data;
};
