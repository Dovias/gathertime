import axios from "axios";
import type { Friendship, FriendshipRequest } from "../models/Friendship";

export const getFriendships = async (userId: number): Promise<Friendship[]> => {
  const res = await axios.get<Friendship[]>(`/friendship/user/${userId}`);
  return res.data;
};

export const getFriendshipRequests = async (
  userId: number,
): Promise<FriendshipRequest[]> => {
  const res = await axios.get<FriendshipRequest[]>(
    `/friendship/user/${userId}/requests`,
  );
  return res.data;
};

export const confirmFriendship = async (
  friendshipId: number,
): Promise<void> => {
  await axios.post(`/friendship/${friendshipId}`);
};
