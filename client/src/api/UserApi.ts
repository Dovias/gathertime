import axios from "axios"
import { User } from "../models/User";

export const fetchUserByEmail = async (email: string): Promise<User> => {

    const response = await axios.get<User>(`http://localhost:8080/auth/check-email/${email}`);

    return response.data;
}
