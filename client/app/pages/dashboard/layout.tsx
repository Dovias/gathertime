import { Outlet, redirect } from "react-router";
import Navigation from "../../components/main/Navigation";
import { userContext } from "../../context";
import { appRoutes } from "../../routes";
import type { Route } from "./+types/layout";

/*
  Client-side authorization middleware.

  API resources are protected, so its reasonable to do this just
  for user convenience of not loading things they won't need
*/
const authorizationMiddleware: Route.ClientMiddlewareFunction = async ({
  context,
}) => {
  if (context.get(userContext) === null) {
    console.warn("Missing session token! Redirecting to authentication...");
    throw redirect(appRoutes.auth.index);
  }
};

export const clientMiddleware = [authorizationMiddleware];

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  if (user == null) {
    throw Error(
      "User context is missing whilst loading the dashboard. This is a bug. Please contact one of the developers to raise this issue!",
    );
  }

  return user;
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
