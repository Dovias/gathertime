<<<<<<< HEAD:client/app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
=======
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
>>>>>>> a044ffa (Add initial migration files):client/src/root.tsx
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
<<<<<<< HEAD:client/app/root.tsx
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
=======
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
>>>>>>> a044ffa (Add initial migration files):client/src/root.tsx
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
<<<<<<< HEAD:client/app/root.tsx
}
=======
}
>>>>>>> a044ffa (Add initial migration files):client/src/root.tsx
