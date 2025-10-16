"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, HorizontaLDots } from "@/icons";
import { sidebarMenus, NavItem } from "@/config/sidebarMenus";
import { useSidebar } from "@/context/SidebarContext";

type AppLogoType = {
  light: string;
  dark: string;
};

type Props = {
  role: "admin" | "user";
  appLogo: AppLogoType;
};


const AppSidebar: React.FC<Props> = ({ role, appLogo }) => {
  const pathname = usePathname() || "";
  const {
    isExpanded,
    isMobileOpen,
    setIsHovered,
    isHovered,
    toggleSidebar,
    toggleMobileSidebar,
    openSubmenu,
    toggleSubmenu
  } = useSidebar();

  const menus = sidebarMenus[role];

  const isActive = (path?: string, name?: string) => {
    if (!path) return false;

    // Untuk Overview → harus exact match
    if (name === "Overview") return pathname === path;

    // Untuk menu lain → boleh startsWith
    return pathname.startsWith(path);
  };

  const renderNavItem = (item: NavItem) => {
    const hasSub = item.subItems && item.subItems.length > 0;
    const isOpen = openSubmenu === item.name;

    const baseClass = `flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition`;
    const activeClass = item.path && isActive(item.path, item.name)
      ? "bg-indigo-100 text-indigo-700"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-400";


    return (
      <li key={item.name} className="mb-1">
        {hasSub ? (
          // Kalau ada subItems → pakai button
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`${baseClass} ${activeClass}`}
          >
            {item.icon}
            {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
            {hasSub && (isExpanded || isHovered) && (
              <ChevronDownIcon
                className={`ml-auto h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>
        ) : (
          // Kalau tidak ada subItems → pakai Link
          <Link href={item.path!} className={`${baseClass} ${activeClass}`}>
            {item.icon}
            {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
          </Link>
        )}

        {/* submenu */}
        {hasSub && isOpen && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.subItems!.map((sub) => (
              <li key={sub.name}>
                <Link
                  href={sub.path!}
                  className={`block px-3 py-1.5 rounded-lg text-sm ${isActive(sub.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };


  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link href="#">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {appLogo.light && (
                <img
                  src={appLogo.light}
                  alt="Logo"
                  className="h-8 dark:hidden"
                />
              )}
              {appLogo.dark && (
                <img
                  src={appLogo.dark}
                  alt="Logo Dark"
                  className="h-8 hidden dark:block"
                />
              )}
            </>
          ) : (
            <img
              src="/next.svg"
              alt="Logo Icon"
              className="h-8"
            />
          )}
        </Link>
      </div>



      {/* nav */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Group Menu */}
            <div>
              <ul>{menus.map(renderNavItem)}</ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
