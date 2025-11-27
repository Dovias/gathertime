import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { userContext } from "./context";
import type { User } from "./models/User";

/*
  Client-side authentication middleware.

  API resources are protected, so its reasonable to do this just
  for user convenience of not loading things they won't need
*/
const authenticationMiddleware: Route.ClientMiddlewareFunction = async ({
  context,
}) => {
  const token = localStorage.getItem("user");
  if (token === null) return;

  try {
    const user: User = JSON.parse(token);
    context.set(userContext, user);
  } catch {
    console.error("Invalid session token! Discarding token...");
    localStorage.removeItem("user");
  }
};

export const clientMiddleware = [authenticationMiddleware];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
