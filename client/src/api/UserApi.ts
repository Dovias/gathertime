import axios from "axios";
import type { User } from "../models/User";

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const response = await axios.get<User | null>(
    `${import.meta.env.VITE_API_URL}/auth/check-email/${email}`
  );

  return response.data;
};
