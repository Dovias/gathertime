import { createContext } from "react-router";
import type { User } from "./models/User";

export const userContext = createContext<User | null>(null);
