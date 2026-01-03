import axios from "axios";
import type { FreeTimeDTO } from "../models/FreeTimeDTO";

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