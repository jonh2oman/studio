
"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, FileText, Settings, Ship, Users, ClipboardCheck, CalendarDays, CalendarPlus, Trophy, BookOpen, Info, UserCircle, LogIn, LogOut, Loader2, ClipboardList, Building2, User, Contact, GripVertical } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useSettings } from "@/hooks/use-settings";
import { useTrainingYear } from "@/hooks/use-training-year";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/instructions", label: "Instructions", icon: BookOpen },
    ]
  },
  {
    title: "Planning",
    items: [
      { href: "/planner", label: "Corps/Squadron Training Plan - Annual", icon: Calendar },
      { href: "/weekends", label: "Weekend Planner", icon: CalendarDays },
      { href: "/lda", label: "LDA Day Planner", icon: CalendarPlus },
      { href: "/ada", label: "ADA Planner", icon: ClipboardList },
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
    title: "Corps Management",
    items: [
        { href: "/corps-management/assets", label: "Asset Management", icon: Building2 },
        { href: "/corps-management/staff", label: "Staff Management", icon: Contact },
    ]
  },
  {
    title: "Reporting",
    items: [
       { href: "/reports", label: "Reports", icon: FileText },
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

const SortableSidebarMenuItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group/menu-item relative cursor-grab bg-sidebar"
        >
            {children}
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
  const { settings, saveSettings, isLoaded: settingsLoaded } = useSettings();
  const { currentYear, isLoaded: yearsLoaded } = useTrainingYear();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
        return;
    }

    let activeGroupKey: string | null = null;
    let overGroupKey: string | null = null;

    for (const group of navGroups) {
        const key = group.title || 'Main';
        if (group.items.some(item => item.href === active.id)) activeGroupKey = key;
        if (group.items.some(item => item.href === over.id)) overGroupKey = key;
    }
    
    if (activeGroupKey !== overGroupKey) {
        return; // Prevent dragging between groups
    }

    const currentOrder = settings.sidebarNavOrder?.[activeGroupKey] || navGroups.find(g => (g.title || 'Main') === activeGroupKey)?.items.map(i => i.href) || [];
    const oldIndex = currentOrder.indexOf(active.id as string);
    const newIndex = currentOrder.indexOf(over.id as string);
    const newOrder = arrayMove(currentOrder, oldIndex, newIndex);

    saveSettings({
        sidebarNavOrder: {
            ...settings.sidebarNavOrder,
            [activeGroupKey]: newOrder,
        }
    });
  };


  if (!isMounted) {
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
          <div className="bg-primary/20 p-2 rounded-lg">
            <Ship className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col min-h-[2.5rem] justify-center">
            <h1 className="text-lg font-semibold text-primary">
              {settingsLoaded ? (settings.corpsName || 'Training Planner') : <>&nbsp;</>}
            </h1>
            <p className="text-xs text-muted-foreground">
              {yearsLoaded ? (currentYear ? `TY: ${currentYear}` : 'No Year Selected') : <>&nbsp;</>}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SidebarMenu>
            {navGroups.map((group, index) => {
                const groupKey = group.title || 'Main';
                const orderedHrefs = settings.sidebarNavOrder?.[groupKey] || group.items.map(item => item.href);
                const itemsMap = new Map(group.items.map(item => [item.href, item]));
                const groupTitle = group.title === 'Main' ? null : group.title;
                
                return (
                <React.Fragment key={groupKey}>
                    {groupTitle && <SidebarGroupLabel className="px-2 pt-4">{groupTitle}</SidebarGroupLabel>}
                    <SortableContext items={orderedHrefs} strategy={verticalListSortingStrategy}>
                    {orderedHrefs.map(href => {
                        const item = itemsMap.get(href);
                        if (!item) return null;
                        
                        const isActive = item.href === "/"
                            ? pathname === item.href
                            : pathname.startsWith(item.href) && item.href !== "/";
                            
                        return (
                            <SortableSidebarMenuItem key={item.href} id={item.href}>
                                <Link href={item.href}>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        className="w-full"
                                        tooltip={item.label}
                                        disabled={!user && !authLoading}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SortableSidebarMenuItem>
                        );
                    })}
                    </SortableContext>
                    {index < navGroups.length - 1 && <SidebarSeparator className="my-2" />}
                </React.Fragment>
                )
            })}
            </SidebarMenu>
        </DndContext>
      </SidebarContent>
      <SidebarFooter className="items-center p-2 space-y-2">
         <AuthStatus />
      </SidebarFooter>
    </Sidebar>
  );
}
