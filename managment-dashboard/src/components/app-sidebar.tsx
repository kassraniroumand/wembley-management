import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { organization, resource, event, user, auth, dashboard, settings, publicPages } from '@/types/CONSTANT';

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { roleAtom } from "@/model/atoms"
import { useAtom } from "jotai"

interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
  roles: string[];
}

interface NavGroup {
  title: string;
  url: string;
  items: NavItem[];
}

export const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          roles: ["admin", "manager", "user"],
          title: "Home",
          url: dashboard.homeUrl,
        }
      ],
    },
    {
      title: "Users",
      url: "#",
      items: [
        {
          title: 'Add Role To User',
          url: "/dashboard/add-role-to-user",
          roles: ["admin"],
        }
      ],
    },
    {
      title: "Calender",
      url: "#",
      items: [
        {
          title: 'Calender',
          url: "/dashboard/calender",
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Book Events',
          url: "/dashboard/book-calender",
          roles: ["admin", "manager", "user"],
        }
      ],
    },
    {
      title: "Organizers",
      url: "#",
      items: [
        {
          title: 'All Organizers',
          url: organization.organizersListUrl,
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Add Organizer',
          url: organization.organizersCreateUrl,
          roles: ["admin", "manager"],
        }
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: 'All Resource',
          url: resource.resourcesListUrl,
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Add Resource',
          url: resource.resourcesCreateUrl,
          roles: ["admin", "manager"],
        }
      ],
    },
    {
      title: "Categories",
      url: "#",
      items: [
        {
          title: 'All Categories',
          url: "/dashboard/categories",
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Add Category',
          url: "/dashboard/categories/create",
          roles: ["admin", "manager"],
        }
      ],
    },
    {
      title: "Event Types",
      url: "#",
      items: [
        {
          title: 'All Event Types',
          url: "/dashboard/event-types",
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Add Event Type',
          url: "/dashboard/event-types/create",
          roles: ["admin", "manager"],
        }
      ],
    },
    {
      title: "Events",
      url: "#",
      items: [
        {
          title: 'All Events',
          url: event.eventsListUrl,
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Add Event',
          url: event.eventsCreateUrl,
          roles: ["admin", "manager"],
        }
      ],
    },
    {
      title: "Bookings",
      url: "#",
      items: [
        {
          title: 'My Bookings',
          url: "/dashboard/my-bookings",
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'Create Booking',
          url: "/dashboard/bookings/create",
          roles: ["admin", "manager", "user"],
        },
        {
          title: 'All Bookings',
          url: "/dashboard/bookings/all",
          roles: ["admin", "manager"],
        }
      ],
    }
  ] as NavGroup[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [roles] = useAtom(roleAtom);
  console.log("Sidebar roles:", roles);

  // Convert user roles to lowercase for case-insensitive comparison
  const normalizedUserRoles = roles.map(role => role.toLowerCase());
  console.log("Normalized roles:", normalizedUserRoles);

  // Helper function to check if item should be shown based on user roles
  const hasAccess = (itemRoles: string[]) => {
    // If no roles defined for the item, show it to everyone
    if (!itemRoles || itemRoles.length === 0) return true;

    // Convert item roles to lowercase for comparison
    const normalizedItemRoles = itemRoles.map(role => role.toLowerCase());

    // Check if any user role matches any required item role
    return normalizedUserRoles.some(userRole =>
      normalizedItemRoles.includes(userRole)
    );
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => {
          // Filter items based on user roles
          const accessibleItems = item.items.filter(menuItem => hasAccess(menuItem.roles));

          // Only render groups that have at least one accessible item
          if (accessibleItems.length === 0) return null;

          return (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
                >
                  <CollapsibleTrigger>
                    {item.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {accessibleItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.url}
                          >
                            <Link to={item.url}>{item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
