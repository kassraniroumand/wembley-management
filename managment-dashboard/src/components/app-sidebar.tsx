import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

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

interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
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
          title: "Home",
          url: "/dashboard",
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
        },
        {
          title: 'Book Events',
          url: "/dashboard/book-calender",
        }
      ],
    },
    {
      title: "Organizers",
      url: "#",
      items: [
        {
          title: 'All Organizers',
          url: "/dashboard/organizers",
        },
        {
          title: 'Add Organizer',
          url: "/dashboard/organizers/create",
        }
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: 'All Resource',
          url: "/dashboard/resources",
        },
        {
          title: 'Add Resource',
          url: "/dashboard/resources/create",
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
        },
        {
          title: 'Add Category',
          url: "/dashboard/categories/create",
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
        },
        {
          title: 'Add Event Type',
          url: "/dashboard/event-types/create",
        }
      ],
    },
    {
      title: "Events",
      url: "#",
      items: [
        {
          title: 'All Events',
          url: "/dashboard/events",
        },
        {
          title: 'Add Event',
          url: "/dashboard/events/create",
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
        },
        {
          title: 'Create Booking',
          url: "/dashboard/bookings/create",
        },
        {
          title: 'All Bookings',
          url: "/dashboard/bookings/all",
        }
      ],
    }
  ] as NavGroup[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

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
        {data.navMain.map((item) => (
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
                    {item.items.map((item) => (
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
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
