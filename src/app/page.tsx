
"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, Users, ClipboardCheck, Settings, Loader2, Trophy, BookOpen, Info, CheckCircle, CalendarDays, CalendarPlus, LogIn, ClipboardList, Building2, GripVertical, Contact, ShoppingCart, FolderKanban, Target, ClipboardEdit, Handshake, Store, Shirt, Ship } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { elementalTrainingData } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { useTrainingYear } from '@/hooks/use-training-year';
import { useSettings } from '@/hooks/use-settings';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { getPhaseDisplayName } from '@/lib/utils';
import { useKonamiCode } from '@/hooks/use-konami-code';
import { KonamiConfetti } from '@/components/konami-confetti';

const dashboardCategories = [
    {
        title: "Planning",
        items: [
            { href: "/planning/eos-pos", title: "PO/EO Library", icon: BookOpen, description: "Browse the complete training program for your element." },
            { href: "/planning/ada", title: "ADA Planner", icon: ClipboardList, description: "Track EOs completed at Area Directed Activities." },
            { href: "/csar", title: "CSAR Planning", icon: ClipboardEdit, description: "Create and manage Cadet Support and Activity Requests." },
        ]
    },
    {
        title: "Cadet & Attendance Management",
        items: [
            { href: "/cadets", title: "Cadet Management", icon: Users, description: "Add, view, and manage your corps' cadet roster." },
            { href: "/attendance", title: "Attendance Management", icon: ClipboardCheck, description: "Mark and track attendance for training nights." },
            { href: "/awards", title: "Awards Management", icon: Trophy, description: "Manage corps awards and track eligible cadets." },
            { href: "/marksmanship", title: "Marksmanship / Biathlon", icon: Target, description: "Enter cadet scores and track their achievements." },
        ]
    },
    {
        title: "Cadet Economy",
        items: [
            { href: "/store", title: "Store & Banking", icon: Store, description: "Manage Ardent Dollars, canteen sales, and inventory." },
        ]
    },
    {
        title: "Corps Management",
        items: [
            { href: "/corps-management/assets", title: "Asset Management", icon: Building2, description: "Track and manage all corps-owned assets." },
            { href: "/corps-management/uniforms", title: "Uniform Supply", icon: Shirt, description: "Manage uniform inventory and issue parts to cadets." },
            { href: "/corps-management/loan-manager", title: "Loan Manager", icon: Handshake, description: "Create and track equipment loans for cadets." },
            { href: "/corps-management/staff", title: "Staff Management", icon: Contact, description: "Manage staff roster, duties, and user access." },
            { href: "/corps-management/lsa-wish-list", title: "LSA Wish List", icon: ShoppingCart, description: "Create and manage your annual LSA request list." },
        ]
    },
    {
        title: "Reporting",
        items: [
            { href: "/reports", title: "Reports", icon: FileText, description: "Generate WROs and view various other reports for your corps." },
        ]
    },
    {
        title: "Settings & Help",
        items: [
            { href: "/settings", title: "Settings", icon: Settings, description: "Configure corps information, instructors, and classrooms." },
            { href: "/about", title: "About", icon: Info, description: "View application details and license information." },
        ]
    }
];

const allItemsMap = new Map(dashboardCategories.flatMap(cat => cat.items.map(item => [item.href, item])));

function SortableLinkCard({ id }: { id: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const item = allItemsMap.get(id);

    if (!item) return null;

    return (
        <div ref={setNodeRef} style={style} className="h-full">
            <Link href={item.href} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background h-full">
                <Card className="h-full transition-colors border hover:border-primary/50 hover:bg-muted/30">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <item.icon className="h-8 w-8 flex-shrink-0 transition-colors group-hover:text-primary" />
                                <div {...attributes} {...listeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5" /></div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{item.description}</p></CardContent>
                </Card>
            </Link>
        </div>
    );
}

function SortableDashboardCategory({ category, itemOrder, onItemsOrderChange }: {
    category: typeof dashboardCategories[0],
    itemOrder: string[],
    onItemsOrderChange: (newOrder: string[]) => void
}) {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = itemOrder.indexOf(active.id as string);
            const newIndex = itemOrder.indexOf(over.id as string);
            onItemsOrderChange(arrayMove(itemOrder, oldIndex, newIndex));
        }
    };

    return (
        <AccordionContent className="px-6 pb-6 pt-0">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={itemOrder} strategy={verticalListSortingStrategy}>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {itemOrder.map(href => <SortableLinkCard key={href} id={href} />)}
                    </div>
                </SortableContext>
            </DndContext>
        </AccordionContent>
    );
}

function SortableCategoryAccordionItem({ id, children }: { id: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <Card ref={setNodeRef} style={style} className="border">
            <AccordionItem value={id} className="border-b-0">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child) && child.type === AccordionTrigger) {
                        return React.cloneElement(child, {
                            // @ts-ignore
                            children: (
                                <div className="flex items-center gap-2">
                                    <div {...attributes} {...listeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5" /></div>
                                    <span className="text-xl font-bold tracking-tight">{id}</span>
                                </div>
                            )
                        });
                    }
                    return child;
                })}
            </AccordionItem>
        </Card>
    );
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const { schedule, isLoaded } = useSchedule();
    const { currentYear, isLoaded: yearsLoaded, adaPlanners, dayPlanners } = useTrainingYear();
    const { settings, saveSettings } = useSettings();

    const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
    const [itemOrders, setItemOrders] = useState<Record<string, string[]>>({});
    const [showConfetti, setShowConfetti] = useState(false);

    const onKonamiSuccess = useCallback(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts for 5 seconds
    }, []);

    useKonamiCode(onKonamiSuccess);


    useEffect(() => {
        const savedOrder = settings.dashboardCardOrder;
        
        // Default orders from the master list
        const defaultCategoryOrder = dashboardCategories.map(c => c.title);
        const defaultItemOrders = Object.fromEntries(
            dashboardCategories.map(c => [c.title, c.items.map(i => i.href)])
        );

        // Merge category order
        const savedCategorySet = new Set(savedOrder?.categoryOrder || []);
        const mergedCategoryOrder = [...(savedOrder?.categoryOrder || [])];
        defaultCategoryOrder.forEach(title => {
            if (!savedCategorySet.has(title)) {
                mergedCategoryOrder.push(title);
            }
        });

        // Merge item orders for each category
        const mergedItemOrders: Record<string, string[]> = { ...defaultItemOrders };
        if (savedOrder?.itemOrder) {
            Object.keys(defaultItemOrders).forEach(title => {
                const savedItems = savedOrder.itemOrder[title] || [];
                const defaultItems = defaultItemOrders[title] || [];
                const savedItemSet = new Set(savedItems);
                const finalItems = [...savedItems];
                defaultItems.forEach(href => {
                    if (!savedItemSet.has(href)) {
                        finalItems.push(href);
                    }
                });
                mergedItemOrders[title] = finalItems;
            });
        }
        
        setCategoryOrder(mergedCategoryOrder);
        setItemOrders(mergedItemOrders);

    }, [settings.dashboardCardOrder]);

    const handleCategoryDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCategoryOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                saveSettings({ dashboardCardOrder: { categoryOrder: newOrder, itemOrder: itemOrders } });
                return newOrder;
            });
        }
    };
    
    const handleItemsOrderChange = (categoryTitle: string, newOrder: string[]) => {
        setItemOrders(prev => {
            const newOrders = { ...prev, [categoryTitle]: newOrder };
            saveSettings({ dashboardCardOrder: { categoryOrder: categoryOrder, itemOrder: newOrders } });
            return newOrders;
        });
    };

    const phaseProgress = useMemo(() => {
        if (!isLoaded || !yearsLoaded || !settings.element) return [];
        const trainingData = elementalTrainingData[settings.element];
        if (!trainingData) return [];

        const scheduleEOs = Object.values(schedule).filter(Boolean).map(item => item!.eo);
        const adaEOs = (adaPlanners || []).flatMap(p => p.eos).filter(Boolean);
        const dayPlannerEOs = (dayPlanners || [])
            .flatMap(p => Object.values(p.schedule || {}))
            .map(item => item?.eo)
            .filter(Boolean);
            
        const allScheduledEOs = [...scheduleEOs, ...adaEOs, ...dayPlannerEOs];
        
        const scheduledCounts: { [key: string]: number } = {};
        allScheduledEOs.forEach(eo => {
            if (eo.type === 'mandatory') {
                scheduledCounts[eo.id] = (scheduledCounts[eo.id] || 0) + 1;
            }
        });

        return trainingData.map(phase => {
            const mandatoryEOs = phase.performanceObjectives.flatMap(po => po.enablingObjectives.filter(eo => eo.type === 'mandatory'));
            const totalMandatoryPeriods = mandatoryEOs.reduce((sum, eo) => sum + eo.periods, 0);
            if (totalMandatoryPeriods === 0) return { phaseName: getPhaseDisplayName(settings.element, phase.id), progress: 100, completed: 0, total: 0 };
            
            let completedPeriods = 0;
            mandatoryEOs.forEach(eo => { completedPeriods += Math.min(scheduledCounts[eo.id] || 0, eo.periods); });
            const progress = (completedPeriods / totalMandatoryPeriods) * 100;
            return { phaseName: getPhaseDisplayName(settings.element, phase.id), progress: Math.min(100, progress), completed: completedPeriods, total: totalMandatoryPeriods };
        });
    }, [schedule, isLoaded, adaPlanners, dayPlanners, yearsLoaded, settings.element]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    if (!user) {
        return (
            <>
                <PageHeader title="Welcome to Corps/Sqn Manager" description="Please log in or sign up to continue." />
                <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
                    <div className="mb-4 rounded-full border bg-background p-4 shadow-sm"><Users className="h-10 w-10 text-primary" /></div>
                    <h2 className="text-xl font-semibold">Create an Account to Get Started</h2>
                    <p className="mt-2 max-w-sm text-muted-foreground">An account allows you to save your training plans and access them securely from any device.</p>
                    <div className="mt-6 flex gap-4">
                        <Button asChild size="lg"><Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link></Button>
                        <Button asChild variant="outline" size="lg"><Link href="/signup">Sign Up</Link></Button>
                    </div>
                </div>
            </>
        )
    }

    if (user && yearsLoaded && !currentYear) {
        return (
            <>
                <PageHeader title="Welcome to Corps/Sqn Manager!" description="The first step is to create a new training year." />
                <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
                    <div className="mb-4 rounded-full border bg-background p-4 shadow-sm"><CalendarPlus className="h-10 w-10 text-primary" /></div>
                    <h2 className="text-xl font-semibold">Create Your First Training Year</h2>
                    <p className="mt-2 max-w-sm text-muted-foreground">All your schedules, cadets, and reports are organized by training year. Go to settings to set one up now.</p>
                    <div className="mt-6"><Button asChild size="lg"><Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Go to Settings</Link></Button></div>
                </div>
            </>
        );
    }

    if (!currentYear) return <div className="flex h-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

    const categoriesMap = new Map(dashboardCategories.map(cat => [cat.title, cat]));

    return (
        <>
            {showConfetti && <KonamiConfetti />}
            <PageHeader title="Dashboard" description={`Welcome back, ${user.email}!`} />
            <div className="mt-8 space-y-8">
                <Card className="border">
                    <CardHeader><CardTitle>Mandatory Training Planning Progress</CardTitle><CardDescription>A quick glance at the percentage of mandatory training periods scheduled for each phase.</CardDescription></CardHeader>
                    <CardContent>{isLoaded ? (<div className="space-y-6">{phaseProgress.map((p) => (<div key={p.phaseName}><div className="flex justify-between mb-2"><span className="font-medium text-foreground">{p.phaseName}</span><span className="text-sm font-semibold text-muted-foreground">{p.completed} / {p.total} Periods ({p.progress.toFixed(0)}%)</span></div><Progress value={p.progress} aria-label={`${p.phaseName} completion progress`} /></div>))}</div>) : (<div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)}</CardContent>
                </Card>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
                    <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
                        <Accordion type="multiple" defaultValue={["Planning"]} className="space-y-4">
                            {categoryOrder.map(title => {
                                const category = categoriesMap.get(title);
                                if (!category) return null;
                                const currentItemOrder = itemOrders[title] || category.items.map(i => i.href);
                                return (
                                    <SortableCategoryAccordionItem key={title} id={title}>
                                        <AccordionTrigger className="p-6 hover:no-underline" />
                                        <SortableDashboardCategory
                                            category={category}
                                            itemOrder={currentItemOrder}
                                            onItemsOrderChange={(newOrder) => handleItemsOrderChange(title, newOrder)}
                                        />
                                    </SortableCategoryAccordionItem>
                                );
                            })}
                        </Accordion>
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
