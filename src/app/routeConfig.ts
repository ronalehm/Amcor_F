export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  PORTFOLIO: {
    LIST: '/portfolio',
    CREATE: '/portfolio/new',
    DETAIL: (code: string) => `/portfolio/${code}`,
    EDIT: (code: string) => `/portfolio/${code}/edit`,
  },

  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects/new',
    DETAIL: (code: string) => `/projects/${code}`,
    EDIT: (code: string) => `/projects/${code}/edit`,
  },

  CLIENTS: {
    LIST: '/clients',
    CREATE: '/clients/new',
    DETAIL: (code: string) => `/clients/${code}`,
    EDIT: (code: string) => `/clients/${code}/edit`,
  },

  DATASHEETS: {
    LIST: '/datasheets',
    CREATE: '/datasheets/new',
    DETAIL: (id: string) => `/datasheets/${id}`,
    EDIT: (id: string) => `/datasheets/${id}/edit`,
  },

  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    EDIT: (id: string) => `/users/${id}/edit`,
  }
};
