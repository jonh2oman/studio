
"use client";

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, Users, ClipboardCheck, Settings, Tent, Loader2, ClipboardPlus, Trophy, BookOpen, GripVertical } from 'lucide-react';
import { useSchedule } from '@/hooks/use-schedule';
import { trainingData } from '@/lib/data';

const initialDashboardItems = [
  { id: "/planner", href: "/planner", title: "Corps/Squadron Training Plan - Annual", icon: Calendar, description: "Plan your training year schedule by dragging and dropping lessons." },
  { id: "/weekends", href: "/weekends", title: "Weekend Planner", icon: Tent, description: "Plan training weekends with a detailed 9-period schedule." },
  { id: "/lda", href: "/lda", title: "LDA Day Planner", icon: ClipboardPlus, description: "Plan single ad-hoc training days with a 9-period schedule." },
  { id: "/reports", href: "/reports", title: "WRO Reports", icon: FileText, description: "Generate PDF routine orders for a specific training night." },
  { id: "/cadets", href: "/cadets", title: "Cadet Management", icon: Users, description: "Add, view, and manage your corps' cadet roster." },
  { id: "/attendance", href: "/attendance", title: "Attendance Management", icon: ClipboardCheck, description: "Mark and track attendance for training nights." },
  { id: "/awards", href: "/awards", title: "Awards Management", icon: Trophy, description: "Manage corps awards and track eligible cadets." },
  { id: "/instructions", href: "/instructions", title: "Instructions", icon: BookOpen, description: "Read the user guide for this application." },
  { id: "/settings", href: "/settings", title: "Settings", icon: Settings, description: "Configure corps information, instructors, and classrooms." },
];

type DashboardItemType = typeof initialDashboardItems[0];

function SortableDashboardItem({ item }: { item: DashboardItemType }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="relative group touch-none">
             <Link href={item.href} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background h-full">
              <Card className="h-full transition-colors border-2 border-transparent group-hover:border-primary/50 group-hover:bg-muted/30">
                  <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-xl font-bold">
                              {item.title}
                          </CardTitle>
                          <item.icon className="h-8 w-8 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
              </Card>
            </Link>
            <div {...listeners} className="absolute top-3 right-3 cursor-grab p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                <GripVertical className="h-5 w-5" />
            </div>
        </div>
    );
}


export default function DashboardPage() {
  const { schedule, isLoaded } = useSchedule();
  const [dashboardItems, setDashboardItems] = useState<DashboardItemType[]>([]);

  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem('dashboardOrder');
      if (storedOrder) {
        const orderedIds: string[] = JSON.parse(storedOrder);
        const orderedItems = orderedIds
          .map(id => initialDashboardItems.find(item => item.id === id))
          .filter((item): item is DashboardItemType => !!item);
        
        const newItems = initialDashboardItems.filter(initialItem => !orderedIds.includes(initialItem.id));
        
        setDashboardItems([...orderedItems, ...newItems]);
      } else {
        setDashboardItems(initialDashboardItems);
      }
    } catch (error) {
        console.error("Failed to load dashboard order from localStorage", error);
        setDashboardItems(initialDashboardItems);
    }
  }, []);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      setDashboardItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        try {
          const orderIds = newOrder.map(item => item.id);
          localStorage.setItem('dashboardOrder', JSON.stringify(orderIds));
        } catch (error) {
            console.error("Failed to save dashboard order to localStorage", error);
        }

        return newOrder;
      });
    }
  }

  const phaseProgress = useMemo(() => {
    if (!isLoaded) return [];

    const scheduledEOs = Object.values(schedule).filter(Boolean).map(item => item!.eo);
    const scheduledMandatoryIds = new Set(
        scheduledEOs
            .filter(eo => eo.type === 'mandatory')
            .map(eo => eo.id)
    );

    return trainingData.map(phase => {
        const mandatoryEOs = phase.performanceObjectives.flatMap(po => 
            po.enablingObjectives.filter(eo => eo.type === 'mandatory')
        );
        
        const totalMandatoryPeriods = mandatoryEOs.reduce((sum, eo) => sum + eo.periods, 0);

        if (totalMandatoryPeriods === 0) {
            return {
                phaseName: phase.name,
                progress: 100,
            };
        }
        
        const completedPeriods = mandatoryEOs
            .filter(eo => scheduledMandatoryIds.has(eo.id))
            .reduce((sum, eo) => sum + eo.periods, 0);

        const progress = (completedPeriods / totalMandatoryPeriods) * 100;

        return {
            phaseName: phase.name,
            progress: Math.min(100, progress),
        };
    });
  }, [schedule, isLoaded]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your Training Officer Planning Tool. You can drag and drop cards to reorder your dashboard."
      />
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mandatory Training Progress</CardTitle>
            <CardDescription>
              A quick glance at the percentage of mandatory training periods scheduled for each phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {phaseProgress.map((p) => (
                  <div key={p.phaseName}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{p.phaseName}</span>
                      <span className="text-sm font-semibold">{p.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={p.progress} aria-label={`${p.phaseName} completion progress`} />
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
            )}
          </CardContent>
        </Card>
        
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={dashboardItems.map(item => item.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardItems.map((item) => (
                    <SortableDashboardItem key={item.id} item={item} />
                ))}
                </div>
            </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

    