export const AppRoutes = {
  LOG_IN: "/login",
  SIGN_UP: "/signup",
  CALENDAR: "/calendar",
  VERIFY_EMAIL: "/verify-email",
  EVENTS: "/events",

  ROOT: "/",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
