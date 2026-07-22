import {
  IconDashboard,
  IconListDetails,
  IconPlayCard,
  IconPencil,
  IconUsers,
  IconSettings,
  IconHelp,
  IconCalendarEvent,
  IconTopologyStar3,
} from "@tabler/icons-react"

export type SidebarMode = "admin" | "org"

export function getNavData(
  orgSlug?: string,
  mode: SidebarMode = "admin"
) {
  const base =
    mode === "admin"
      ? "/admin"
      : `/orgs/${orgSlug}`

  return {
    navMain: [
      {
        title: "Dashboard",
        url: base,
        icon: IconDashboard,
      },
      {
        title: "Hives",
        url:
          mode === "admin"
            ? "/admin/hives"
            : `/orgs/${orgSlug}/hives`,
        icon: IconUsers,
      },
      {
        title: "Programs",
        url:
          mode === "admin"
            ? "/admin/courses"
            : `/orgs/${orgSlug}/courses`,
        icon: IconListDetails,
      },
      {
        title: "Activity Center",
        url:
          mode === "admin"
            ? "/admin/activities"
            : `/orgs/${orgSlug}/activities`,
        icon: IconPlayCard,
      },
      {
        title: "Submissions",
        url:
          mode === "admin"
            ? "/admin/activities/submissions"
            : `/orgs/${orgSlug}/activities/submissions`,
        icon: IconPencil,
      },
    ],

    navSecondary: [
      {
        title: "Settings",
        url:
          mode === "admin"
            ? "/admin/settings"
            : `/orgs/${orgSlug}/settings`,
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "https://docs.hives.africa",
        icon: IconHelp,
      },
    ],

    platform: [
  {
    name: "Events",
    url: "/events",
    icon: IconCalendarEvent,
  },
  {
    name: "Signal Graph",
    url: "/community",
    icon: IconTopologyStar3,
  },
    ],
  }
}