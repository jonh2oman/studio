
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, FileText, Settings, Ship, Users, ClipboardCheck, CalendarDays, CalendarPlus, Trophy, BookOpen, Info, UserCircle, LogIn, LogOut, Loader2, ClipboardList, Building2, User, Contact, ShoppingCart, FolderKanban, Target, ClipboardEdit, Handshake, Store, Shirt } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSettings } from "@/hooks/use-settings";
import { useTrainingYear } from "@/hooks/use-training-year";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const navGroups = [
  {
    title: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Planning",
    items: [
      { href: "/planning/annual", label: "Annual Planner", icon: Calendar },
      { href: "/planning/day-planner", label: "Day / Weekend Planner", icon: CalendarDays },
      { href: "/planning/ada", label: "ADA Planner", icon: ClipboardList },
      { href: "/planning/eos-pos", label: "PO/EO Library", icon: BookOpen },
      { href: "/csar", label: "CSAR Planning", icon: ClipboardEdit },
    ]
  },
  {
    title: "Cadet & Attendance Management",
    items: [
      { href: "/cadets", label: "Cadets", icon: Users },
      { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
      { href: "/awards", label: "Awards", icon: Trophy },
      { href: "/marksmanship", label: "Marksmanship/Biathlon", icon: Target },
    ]
  },
  {
    title: "Cadet Economy",
    items: [
      { href: "/store", label: "Store & Banking", icon: Store },
    ]
  },
  {
    title: "Corps Management",
    items: [
        { href: "/corps-management/assets", label: "Asset Management", icon: Building2 },
        { href: "/corps-management/uniforms", label: "Uniform Supply", icon: Shirt },
        { href: "/corps-management/loan-manager", label: "Loan Manager", icon: Handshake },
        { href: "/corps-management/staff", label: "Staff Management", icon: Contact },
        { href: "/corps-management/lsa-wish-list", label: "LSA Wish List", icon: ShoppingCart },
    ]
  },
  {
    title: "Reporting",
    items: [
       { href: "/reports", label: "Reports", icon: FileText },
    ]
  },
  {
    title: "ZTO Tools",
    items: [
        { href: "/zto-portal", label: "Plan Review Portal", icon: FolderKanban, isComingSoon: true },
    ]
  },
  {
    title: "Settings",
    items: [
       { href: "/settings", label: "Settings", icon: Settings },
       { href: "/about", label: "About", icon: Info },
    ]
  }
];

const StaticSidebarMenuItem = ({ href, isActive, isDisabled, icon: Icon, label }: {
    href: string;
    isActive: boolean;
    isDisabled: boolean;
    icon: React.ElementType;
    label: string;
}) => {
    const { state, isMobile } = useSidebar();

    const linkContent = (
        <Link
            href={href}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            className={cn(
                "flex h-8 items-center gap-3 w-full overflow-hidden rounded-md px-2 text-left text-sm outline-none ring-sidebar-ring transition-colors focus-visible:ring-2 active:text-sidebar-accent-foreground",
                "group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                isDisabled && "pointer-events-none opacity-50"
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
        </Link>
    );

    return (
        <li className="group/menu-item relative">
            <Tooltip>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </li>
    );
};


function AuthStatus() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
            </div>
        )
    }

    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center p-2 h-auto text-left">
                    <div className="flex items-center gap-2 truncate">
                        <UserCircle className="h-7 w-7 flex-shrink-0 text-sidebar-foreground/80"/>
                        <div className="flex flex-col items-start truncate">
                            <span className="truncate font-semibold text-sm text-sidebar-foreground">My Account</span>
                            <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] mb-2" side="top" align="start">
                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
                <LogIn className="mr-2" />
                Login / Sign Up
            </Button>
        </Link>
    )
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { currentYear, isLoaded: yearsLoaded } = useTrainingYear();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isReady = isMounted && settingsLoaded && !authLoading;

  if (!isReady) {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <Ship className="w-7 h-7 text-primary" />
                    </div>
                     <div className="flex flex-col min-h-[2.5rem] justify-center">
                        <h1 className="text-lg font-semibold text-primary">&nbsp;</h1>
                        <p className="text-xs text-muted-foreground">&nbsp;</p>
                    </div>
                </div>
            </SidebarHeader>
             <SidebarContent>
                <SidebarMenu>
                    {/* Skeletons or placeholders */}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="items-center">
            </SidebarFooter>
        </Sidebar>
    )
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return null; // Don't render sidebar on auth pages
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          {settings.corpsLogo ? (
            <img src={settings.corpsLogo} alt={settings.corpsName || "Corps Logo"} className="w-10 h-10 object-contain rounded-md" />
          ) : (
            <div className="bg-primary/20 p-2 rounded-lg">
              <Ship className="w-7 h-7 text-primary" />
            </div>
          )}
          <div className="flex flex-col min-h-[2.5rem] justify-center">
            <h1 className="text-base font-semibold text-primary">
              {settingsLoaded ? (settings.corpsName || 'Corps/Sqn Manager') : <>&nbsp;</>}
            </h1>
            <p className="text-xs text-muted-foreground">
              {yearsLoaded ? (currentYear ? `TY: ${currentYear}` : 'No Year Selected') : <>&nbsp;</>}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
            {navGroups.map((group, index) => {
                const groupTitle = group.title === 'Main' ? null : group.title;
                return (
                    <React.Fragment key={group.title}>
                        {groupTitle && <SidebarGroupLabel className="px-2 pt-4">{groupTitle}</SidebarGroupLabel>}
                        {group.items.map(item => {
                            const isActive = item.href === "/"
                                ? pathname === item.href
                                : pathname.startsWith(item.href) && item.href !== "/";
                            
                             if (item.isComingSoon) {
                                return (
                                    <Tooltip key={item.href} delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <StaticSidebarMenuItem
                                                    href="#"
                                                    isActive={false}
                                                    isDisabled={true}
                                                    icon={item.icon}
                                                    label={item.label}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center">
                                            <p>Coming in a future release!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return (
                                <StaticSidebarMenuItem 
                                    key={item.href}
                                    href={item.href}
                                    isActive={isActive}
                                    isDisabled={!user && !authLoading}
                                    icon={item.icon}
                                    label={item.label}
                                />
                            );
                        })}
                        {index < navGroups.length - 1 && <SidebarSeparator className="my-2" />}
                    </React.Fragment>
                );
            })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-center p-2 space-y-2">
         <AuthStatus />
      </SidebarFooter>
    </Sidebar>
  );
}
