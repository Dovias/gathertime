<<<<<<< HEAD
<<<<<<< HEAD:client/app/routes.ts
=======
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
import {
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export const appRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verify: "/auth/verification",
  },
  dashboard: {
    calendar: "/dashboard/calendar",
    feed: "/dashboard/feed",
    friends: "/dashboard/friends",
    meetings: "/dashboard/meetings",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
  },
} as const;

export type AppRoutes = (typeof appRoutes)[keyof typeof appRoutes];

export default [
  ...prefix("auth", [
    route("login", "./pages/auth/login.tsx"),
    route("register", "./pages/auth/register.tsx"),
    route("verification", "./pages/auth/verification.tsx"),
  ]),
  ...prefix("dashboard", [
    layout("./pages/dashboard/layout.tsx", [
      route("calendar", "./pages/dashboard/calendar.tsx"),
      route("feed", "./pages/dashboard/feed.tsx"),
      route("meetings", "./pages/dashboard/meetings.tsx"),
      route("friends", "./pages/dashboard/friends.tsx"),
      route("profile", "./pages/dashboard/profile.tsx"),
      route("settings", "./pages/dashboard/settings.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
<<<<<<< HEAD
=======
import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
>>>>>>> a044ffa (Add initial migration files):client/src/routes.ts
=======
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
