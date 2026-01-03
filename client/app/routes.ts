import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export const appRoutes = {
  index: "/",
  auth: {
    index: "/auth",
    login: "/auth/login",
    register: "/auth/register",
    verify: "/auth/verification",
  },
  dashboard: {
    index: "/dashboard",
    calendar: "/dashboard/calendar",
    feed: "/dashboard/feed",
    friends: "/dashboard/friends",
    meetings: "/dashboard/meetings",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
  },
} as const;

type NestedRoute<T> = T extends string
  ? T
  : T extends object
    ? NestedRoute<T[keyof T]>
    : never;

export type AppRoute = NestedRoute<typeof appRoutes>;

export default [
  index("./pages/index.tsx"),
  ...prefix("auth", [
    layout("./pages/auth/layout.tsx", [
      index("./pages/auth/index.tsx"),
      route("login", "./pages/auth/login.tsx"),
      route("register", "./pages/auth/register.tsx"),
      route("verification", "./pages/auth/verification.tsx"),
      route("*", "./pages/auth/error/notFound.tsx"),
    ]),
  ]),
  ...prefix("dashboard", [
    layout("./pages/dashboard/layout.tsx", [
      index("./pages/dashboard/index.tsx"),
      route("calendar", "./pages/dashboard/calendar.tsx"),
      route("feed", "./pages/dashboard/feed.tsx"),
      route("meetings", "./pages/dashboard/meetings.tsx"),
      route("friends", "./pages/dashboard/friends.tsx"),
      route("profile", "./pages/dashboard/profile.tsx"),
      route("settings", "./pages/dashboard/settings.tsx"),
      route("user-profile/:id", "./pages/dashboard/user-profile.tsx"),
      route("*", "./pages/dashboard/error/notFound.tsx"),
    ]),
  ]),
  route("*", "./pages/error/notFound.tsx"),
] satisfies RouteConfig;
