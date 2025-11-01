export const AppRoutes = {

    LOG_IN: '/login',
    SIGN_UP: '/signup',
    CALENDAR: '/calendar',

    ROOT: '/'
} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes];