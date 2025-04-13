export const organization = {
  organizersListUrl :  "/dashboard/organizers",
  organizersCreateUrl : "/dashboard/organizers/create",
  organizersEditUrl: (id: string) => `/dashboard/organizers/edit/${id}`,
  organizersDetailUrl: (id: string) => `/dashboard/organizers/${id}`
}

export const resource = {
  resourcesListUrl : "/dashboard/resources",
  resourcesCreateUrl : "/dashboard/resources/create",
  resourcesEditUrl: (id: string) => `/dashboard/resources/edit/${id}`,
  resourcesDetailUrl: (id: string) => `/dashboard/resources/${id}`
}

export const category = {
  categoriesListUrl: "/dashboard/categories",
  categoriesCreateUrl: "/dashboard/categories/create",
  categoriesEditUrl: (id: string) => `/dashboard/categories/${id}/edit`,
  categoriesDetailUrl: (id: string) => `/dashboard/categories/${id}`
}

export const event = {
  eventsListUrl: "/dashboard/events",
  eventsCreateUrl: "/dashboard/events/create",
  eventsEditUrl: (id: string) => `/dashboard/events/${id}/edit`,
  eventsDetailUrl: (id: string) => `/dashboard/events/${id}`,
  eventsCalendarUrl: "/dashboard/events/calendar"
}

export const eventType = {
  eventTypesListUrl: "/dashboard/event-types",
  eventTypesCreateUrl: "/dashboard/event-types/create",
  eventTypesEditUrl: (id: string) => `/dashboard/event-types/${id}/edit`,
  eventTypesDetailUrl: (id: string) => `/dashboard/event-types/${id}`
}

export const user = {
  usersListUrl: "/dashboard/users",
  usersCreateUrl: "/dashboard/users/create",
  usersEditUrl: (id: string) => `/dashboard/users/edit/${id}`,
  usersDetailUrl: (id: string) => `/dashboard/users/${id}`,
  userProfileUrl: "/dashboard/profile"
}

export const auth = {
  loginUrl: "/auth/login",
  registerUrl: "/auth/register",
  forgotPasswordUrl: "/auth/forgot-password",
  resetPasswordUrl: "/auth/reset-password"
}

export const dashboard = {
  homeUrl: "/dashboard",
  analyticsUrl: "/dashboard/analytics",
  reportsUrl: "/dashboard/reports"
}

export const bookings = {
  myBookingsUrl: "/dashboard/my-bookings",
  bookingsListUrl: "/dashboard/bookings",
  bookingsCreateUrl: "/dashboard/bookings/create",
  bookingsEditUrl: (id: string) => `/dashboard/bookings/edit/${id}`,
  bookingsDetailUrl: (id: string) => `/dashboard/bookings/${id}`
}

export const settings = {
  mainUrl: "/dashboard/settings",
  accountUrl: "/dashboard/settings/account",
  securityUrl: "/dashboard/settings/security",
  notificationsUrl: "/dashboard/settings/notifications"
}

export const publicPages = {
  homeUrl: "/",
  aboutUrl: "/about",
  contactUrl: "/contact",
  loginUrl: "/auth/login",
  registerUrl: "/auth/register"
}
