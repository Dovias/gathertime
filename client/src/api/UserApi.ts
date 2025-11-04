import axios from "axios";
import type { User } from "../models/User";

export const fetchUserByEmail = async (email: string): Promise<User> => {
  const response = await axios.get<User>(`/auth/check-email/${email}`);

  return response.data;
};
