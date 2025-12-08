import axios from "axios";
import type { User } from "../models/User";

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const response = await axios.get<User | null>(`/auth/check-email/${email}`);
  return response.data;
};

export const fetchUserById = async (id: number): Promise<User | null> => {
  const response = await axios.get<User | null>(`/user/${id}`);
  return response.data;
};
