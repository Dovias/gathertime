import { redirect } from "react-router";
import { appRoutes } from "../routes";

export function clientLoader() {
  throw redirect(appRoutes.auth.index);
}

export default function Index() {}
