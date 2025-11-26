import { Outlet, redirect } from "react-router";
import Navigation from "../../components/main/Navigation";
import type { Route } from "./+types/layout";
import { appRoutes } from "../../routes";
import { User } from "../../models/User";
import { userContext } from "../../context";

/*
  Client-side authentication middleware.

  API resources are protected, so its reasonable to do this just
  for user convenience of not loading things they won't need
*/
const authMiddleware: Route.ClientMiddlewareFunction = async ({ context }) => {
  const token = localStorage.getItem("user");
  if (!token) {
    console.log("Missing session token! Rerouting to authenticate...")
    throw redirect(appRoutes.auth.login)
  }

  try {
    const user: User = JSON.parse(token)
    context.set(userContext, user);
  } catch {
    console.error("Invalid session token! Rerouting to reauthenticate...")

    localStorage.removeItem("user")
    throw redirect(appRoutes.auth.login)
  }
}

export const clientMiddleware = [authMiddleware];


export function clientLoader({ context }: Route.ClientLoaderArgs) {
  return context.get(userContext);
}

export default function Layout({ loaderData: user }: Route.ComponentProps) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation user={user} />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
