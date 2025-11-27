import { redirect } from "react-router";
import { appRoutes } from "../../routes";

export function clientLoader() {
  throw redirect(appRoutes.dashboard.calendar);
}

export default function Index() {}
