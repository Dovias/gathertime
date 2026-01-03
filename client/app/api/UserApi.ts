import axios from "axios";
import type { User, UserFullName, UserProfileInfo } from "../models/User";

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const response = await axios.get<User | null>(`/auth/check-email/${email}`);
  return response.data;
};

export const fetchUserById = async (id: number): Promise<User | null> => {
  const response = await axios.get<User | null>(`/user/${id}`);
  return response.data;
};

export const searchUsers = async (query: string): Promise<UserFullName[]> => {
  if (!query) return [];
  const response = await axios.get<UserFullName[]>(`/user/search`, {
    params: { query },
  });
  return response.data;
};

export const getUserProfileInfo = async (id: number): Promise<UserProfileInfo> => {
  const response = await axios.get<UserProfileInfo>(`/user/${id}/profile-info`);
  return response.data;
};
