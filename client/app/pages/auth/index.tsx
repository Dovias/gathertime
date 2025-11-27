import { redirect } from "react-router";
import { appRoutes } from "../../routes";

export function clientLoader() {
  throw redirect(appRoutes.auth.login);
}

export default function Index() {}
