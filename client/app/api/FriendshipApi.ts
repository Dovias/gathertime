import axios from "axios";
import type { Friendship, FriendshipRequest } from "../models/Friendship";

export const getFriendships = async (userId: number): Promise<Friendship[]> => {
  const response = await axios.get<Friendship[]>(`/friendship/user/${userId}`);
  return response.data;
};

export const getFriendshipRequests = async (
  userId: number,
): Promise<FriendshipRequest[]> => {
  const response = await axios.get<FriendshipRequest[]>(
    `/friendship/user/${userId}/requests`,
  );
  return response.data;
};

export const confirmFriendship = async (
  friendshipId: number,
): Promise<void> => {
  await axios.post(`/friendship/${friendshipId}`);
};

export const declineFriendship = async (friendshipId: number): Promise<void> => {
  await axios.put(`/friendship/${friendshipId}/decline`);
};