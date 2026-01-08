import axios from "axios";
import type {
  CreateFriendshipRequestDTO,
  Friendship,
  FriendshipRequest,
  FriendshipStatusDTO,
} from "../models/Friendship";

export const createFriendship = async (
  payload: CreateFriendshipRequestDTO,
): Promise<void> => {
  await axios.post("/friendship", payload);
};

export const confirmFriendship = async (friendshipId: number): Promise<void> => {
  await axios.post(`/friendship/${friendshipId}`);
};

export const declineFriendship = async (friendshipId: number): Promise<void> => {
  await axios.put(`/friendship/${friendshipId}/decline`);
};

export const getFriendships = async (userId: number): Promise<Friendship[]> => {
  const response = await axios.get<Friendship[]>(`/friendship/user/${userId}`);
  return response.data;
};

export const getRelationshipStatus = async (
  userId: number,
  userId2: number,
): Promise<FriendshipStatusDTO> => {
  const response = await axios.get<FriendshipStatusDTO>(
    `/friendship/user/${userId}/second-user/${userId2}`,
  );
  console.log("getRelationshipStatus raw response:", response);
  console.log("getRelationshipStatus response.data:", response.data);
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

export const deleteFriendship = async (friendshipId: number): Promise<void> => {
  await axios.delete(`/friendship/${friendshipId}`);
}
