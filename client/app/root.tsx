<<<<<<< HEAD
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
=======
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
<<<<<<< HEAD
<<<<<<< HEAD:client/app/root.tsx
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
=======
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
>>>>>>> a044ffa (Add initial migration files):client/src/root.tsx
=======
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
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
<<<<<<< HEAD
<<<<<<< HEAD:client/app/root.tsx
}
=======
}
>>>>>>> a044ffa (Add initial migration files):client/src/root.tsx
=======
}
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
