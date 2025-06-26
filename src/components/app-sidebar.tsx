"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, FileText, Settings, Ship, Users, ClipboardCheck } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSettings } from "@/hooks/use-settings";

const menuItems = [
  { href: "/", label: "Training Planner", icon: Calendar },
  { href: "/reports", label: "WRO Reports", icon: FileText },
  { href: "/cadets", label: "Cadets", icon: Users },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/settings", label: "Settings", icon: Settings },
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
            <p className="text-xs text-muted-foreground">Training Planner</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-center">
         <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
