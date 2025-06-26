
"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, FileText, Settings, Ship, Users, ClipboardCheck, Tent, ClipboardPlus, Trophy, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useSettings } from "@/hooks/use-settings";

const navGroups = [
  {
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/instructions", label: "Instructions", icon: BookOpen },
    ]
  },
  {
    title: "Planning",
    items: [
      { href: "/planner", label: "Corps/Squadron Training Plan - Annual", icon: Calendar },
      { href: "/weekends", label: "Weekend Planner", icon: Tent },
      { href: "/lda", label: "LDA Day Planner", icon: ClipboardPlus },
    ]
  },
  {
    title: "Cadet & Attendance Management",
    items: [
      { href: "/cadets", label: "Cadets", icon: Users },
      { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/awards", label: "Awards", icon: Trophy },
    ]
  },
  {
    title: "Reporting",
    items: [
       { href: "/reports", label: "WRO Reports", icon: FileText },
    ]
  },
  {
    title: "Settings",
    items: [
       { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
];


export function AppSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Ship className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-primary">{settings.corpsName}</h1>
            <p className="text-xs text-muted-foreground">Training Officer Planning Tool</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navGroups.map((group, index) => (
            <React.Fragment key={group.title || index}>
              {group.title && <SidebarGroupLabel className="px-2 pt-4">{group.title}</SidebarGroupLabel>}
              {group.items.map(item => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      className="w-full"
                      tooltip={item.label}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
              {index < navGroups.length - 1 && <SidebarSeparator className="my-2" />}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-center">
         <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
