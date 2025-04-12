import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ModernLayout from '@/components/ModernLayout';
import HomeDash from '@/pages/HomeDash';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/register';
import AdminRoute from '@/components/AdminRoute';
import UsersPage from '@/pages/UsersPage';
import Region from '@/pages/region';
import AddRoleToUser from '@/pages/AddRoleToUser';
import Layout from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';

// Import organizer pages
import { OrganizersPage } from '@/pages/organizers/OrganizersPage';
import { CreateOrganizerPage } from '@/pages/organizers/CreateOrganizerPage';
import { EditOrganizerPage } from '@/pages/organizers/EditOrganizerPage';
import { OrganizerDetailsPage } from '@/pages/organizers/OrganizerDetailsPage';
import { CreateResourcePage } from '@/pages/resources/CreateResourcePage';
import { ResourcesPage } from '@/pages/resources/ResourcesPage';
// Import category pages
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { CreateCategoryPage } from '@/pages/categories/CreateCategoryPage';
import { EditCategoryPage } from '@/pages/categories/EditCategoryPage';
// Import event type pages
import { EventTypesPage } from '@/pages/event-types/EventTypesPage';
import { CreateEventTypePage } from '@/pages/event-types/CreateEventTypePage';
import { EditEventTypePage } from '@/pages/event-types/EditEventTypePage';
import { EventTypeDetailsPage } from '@/pages/event-types/EventTypeDetailsPage';
// Import event pages
import { EventsPage } from '@/pages/events/EventsPage';
import { CreateEventPage } from '@/pages/events/CreateEventPage';
import { EditEventPage } from '@/pages/events/EditEventPage';
import { EventDetailsPage } from '@/pages/events/EventDetailsPage';
import { EventResourcesPage } from '@/pages/events/EventResourcesPage';
import { EventConfigurationsPage } from '@/pages/events/EventConfigurationsPage';
// Import booking pages
import { CreateBookingPage } from '@/pages/bookings/CreateBookingPage';
import { MyBookingsPage } from '@/pages/bookings/MyBookingsPage';
import { AllBookingsPage } from '@/pages/bookings/AllBookingsPage';
import CalenderPage from '@/pages/calender';
import BookingCalendar from '@/pages/calender/BookingCalendar';
import Login from '@/pages/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomeDash />,
          },
          {
            path: 'calender',
            element: <CalenderPage />,
          },
          {
            path: 'book-calender',
            element: <BookingCalendar />,
          },
          {
            path: 'region',
            element: <Region />,
          },
          {
            path: 'add-role-to-user',
            element: <AddRoleToUser />,
          },
          // Admin-only routes
          {
            path: 'users',
            element: (
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            ),
          },
          // Organizer routes
          {
            path: 'organizers',
            element: <OrganizersPage />,
          },
          {
            path: 'organizers/create',
            element: <CreateOrganizerPage />,
          },
          {
            path: 'organizers/:id',
            element: <OrganizerDetailsPage />,
          },
          {
            path: 'organizers/:id/edit',
            element: <EditOrganizerPage />,
          },
          // Resource routes
          {
            path: 'resources',
            element: <ResourcesPage />,
          },
          {
            path: 'resources/create',
            element: <CreateResourcePage />,
          },
          // Category routes
          {
            path: 'categories',
            element: <CategoriesPage />,
          },
          {
            path: 'categories/create',
            element: <CreateCategoryPage />,
          },
          {
            path: 'categories/:id/edit',
            element: <EditCategoryPage />,
          },
          // Event Type routes
          {
            path: 'event-types',
            element: <EventTypesPage />,
          },
          {
            path: 'event-types/create',
            element: <CreateEventTypePage />,
          },
          {
            path: 'event-types/:id',
            element: <EventTypeDetailsPage />,
          },
          {
            path: 'event-types/:id/edit',
            element: <EditEventTypePage />,
          },
          // Event routes
          {
            path: 'events',
            element: <EventsPage />,
          },
          {
            path: 'events/create',
            element: <CreateEventPage />,
          },
          {
            path: 'events/:id',
            element: <EventDetailsPage />,
          },
          {
            path: 'events/:id/edit',
            element: <EditEventPage />,
          },
          {
            path: 'events/:id/resources',
            element: <EventResourcesPage />,
          },
          {
            path: 'events/:id/configurations',
            element: <EventConfigurationsPage />,
          },
          // Booking routes
          {
            path: 'my-bookings',
            element: <MyBookingsPage />,
          },
          {
            path: 'bookings/create',
            element: <CreateBookingPage />,
          },
          {
            path: 'bookings/all',
            element: <AllBookingsPage />,
          },
        ]
      }
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Define all possible roles in the system
export type UserRole = 'Admin' | 'manager' | 'User' | 'guest';

// Menu item interface
export interface MenuItem {
  name: string;
  path: string;
  icon:  string;
  roles: UserRole[]; // Which roles can access this menu item
}

// Menu configuration
export const menuItems: MenuItem[] = [
  {
    name: 'Regions',
    path: '/region',
    icon: "logo1",
    roles: ['User' ,'Admin', 'manager'], // Only admin and manager can access
  },
  {
    name: 'Users',
    path: '/users',
    icon: "logo2",
    roles: ['Admin'], // Only admin can access
  },
  {
    name: 'Add Role To User',
    path: '/add-role-to-user',
    icon: "logo2",
    roles: ['Admin'], // Only admin can access
  },
  {
    name: 'Organizers',
    path: '/organizers',
    icon: "logo3",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  },
  {
    name: 'Resources',
    path: '/resources',
    icon: "logo4",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  },
  {
    name: 'Categories',
    path: '/categories',
    icon: "logo5",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  },
  {
    name: 'Event Types',
    path: '/event-types',
    icon: "logo6",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  },
  {
    name: 'Events',
    path: '/events',
    icon: "calendar",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  },
  {
    name: 'My Bookings',
    path: '/my-bookings',
    icon: "ticket",
    roles: ['Admin', 'manager', 'User'], // All authenticated users can access
  }
];

// Helper function to filter menu items based on user roles
export const filterMenuItemsByRoles = (userRoles: string[]): MenuItem[] => {
  return menuItems.filter(item => {
    // Check if any of the user's roles match the roles required for this menu item
    return item.roles.some(role => userRoles.includes(role));
  });
};
