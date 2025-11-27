import { Outlet, redirect } from "react-router";
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
  if (context.get(userContext) !== null) {
    console.warn(
      "User context has been already initialized! Redirecting to dashboard...",
    );
    throw redirect(appRoutes.dashboard.index);
  }
};

export const clientMiddleware = [authorizationMiddleware];

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  return context.get(userContext);
}

export default function Layout() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50">
      <Outlet />
    </div>
  );
}
