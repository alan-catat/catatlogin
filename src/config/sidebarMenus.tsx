import {
    GridIcon, UserCircleIcon, ListIcon, PageIcon, PlugInIcon, CalenderIcon,
  } from "@/icons";
  
  export type NavItem = {
    name: string;
    path?: string;
    icon?: React.ReactNode;
    subItems?: NavItem[];
  };
  
  export const sidebarMenus: Record<"admin" | "user", NavItem[]> = {
    admin: [
      { name: "Overview", path: "/dashboard-admin", icon: <GridIcon /> },
      { name: "User Management", path: "/dashboard-admin/user-management", icon: <UserCircleIcon /> },
      {
        name: "Master Data",
        icon: <ListIcon />,
        subItems: [
          { name: "Kategori", path: "/dashboard-admin/global-category" },
          { name: "Group", path: "/dashboard-admin/groups" },
          { name: "Channel", path: "/dashboard-admin/channels" },
          { name: "Product", path: "/dashboard-admin/packages" },
        ],
      },
      { name: "Reports & Logs", path: "/dashboard-admin/report-logs", icon: <CalenderIcon /> },
      { name: "Support", path: "/dashboard-admin/supports", icon: <PlugInIcon /> },
      { name: "Settings", path: "/dashboard-admin/settings", icon: <PlugInIcon /> },
    ],
    user: [
      { name: "Overview", path: "/dashboard-user", icon: <GridIcon /> },
      { name: "Profile Management", path: "/dashboard-user/profile", icon: <UserCircleIcon /> },
      { name: "Subscription & Billing", path: "/dashboard-user/subscriptions", icon: <PlugInIcon /> },
      { name: "Reports", path: "/dashboard-user/reports", icon: <CalenderIcon /> },
      { name: "Support", path: "/dashboard-user/supports", icon: <PageIcon /> },
      { name: "Settings", path: "/dashboard-user/settings", icon: <PlugInIcon /> },
    ],
  };
  