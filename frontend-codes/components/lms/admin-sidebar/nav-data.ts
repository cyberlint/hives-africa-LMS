import {
  IconDashboard,
  IconListDetails,
  IconPlayCard,
  IconPencil,
  IconUsers,
  IconSettings,
  IconHelp,
  IconDatabase,
  IconReport,
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
        title: "Courses",
        url:
          mode === "admin"
            ? "/admin/courses"
            : `/orgs/${orgSlug}/courses`,
        icon: IconListDetails,
      },
      {
        title: "Learning Activities",
        url:
          mode === "admin"
            ? "/admin/activities"
            : `/orgs/${orgSlug}/activities`,
        icon: IconPlayCard,
      },
      {
        title: "Review Submissions",
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

    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
    ],
  }
}