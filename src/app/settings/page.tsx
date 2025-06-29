
"use client";

import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { X, PlusCircle, Calendar as CalendarIcon, FileDown, FileUp, Loader2, Cloud, GripVertical, Download, Trash2 } from "lucide-react";
import { useTrainingYear } from "@/hooks/use-training-year";
import { NewYearDialog } from "@/components/settings/new-year-dialog";
import { Label } from "@/components/ui/label";
import type { WeeklyActivity, Settings, CustomEO, UserDocument, TrainingYearData, CadetElement } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


// Component for top-level draggable cards (General, Resources, etc.)
function SortableCard({ id, children }: { id: string, children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // Pass listeners to the child to attach to the drag handle
  const childWithDragHandle = React.cloneElement(children as React.ReactElement, {
    dragHandleListeners: listeners
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        {childWithDragHandle}
    </div>
  );
}

// Component for nested draggable cards (e.g., Classrooms, Ranks)
function SortableSubCard({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const childWithDragHandle = React.cloneElement(children as React.ReactElement, {
      dragHandleListeners: listeners
    });

    return (
        <div ref={setNodeRef} style={style} {...attributes} className={className}>
            {childWithDragHandle}
        </div>
    );
}

// Sub-components for individual settings cards
const TrainingYearManagementCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { currentYear, trainingYears, setCurrentYear, deleteTrainingYear } = useTrainingYear();
    const [isNewYearDialogOpen, setIsNewYearDialogOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const handleDelete = () => {
        if (currentYear) {
            deleteTrainingYear(currentYear);
        }
        setIsDeleteAlertOpen(false);
    };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                    <CardTitle>Training Year Management</CardTitle>
                    <CardDescription>Select the active training year or create a new one.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                    <Label htmlFor="training-year-select">Active Training Year</Label>
                    <Select value={currentYear || ''} onValueChange={setCurrentYear} disabled={!currentYear}>
                        <SelectTrigger id="training-year-select"><SelectValue placeholder="No years created..." /></SelectTrigger>
                        <SelectContent>
                            {trainingYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsNewYearDialogOpen(true)} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2" />
                        Create New Year
                    </Button>
                     <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)} disabled={!currentYear}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Active Year
                    </Button>
                </div>
            </CardContent>
            {isNewYearDialogOpen && <NewYearDialog onOpenChange={setIsNewYearDialogOpen} />}
             <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the training year "{currentYear}". All associated cadets, schedules, and reports for this year will be lost. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete Year
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

const CorpsInformationCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const { currentYearData, isLoaded: yearIsLoaded } = useTrainingYear();
    const { toast } = useToast();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const handleSettingChange = (key: keyof Settings, value: any) => {
        saveSettings({ [key]: value });
        toast({ title: "Settings Saved" });
    };

    const isSchedulePopulated = useMemo(() => {
        if (!yearIsLoaded || !currentYearData) return false;
        const mainScheduleHasItems = Object.keys(currentYearData.schedule || {}).length > 0;
        const adaHasItems = (currentYearData.adaPlanners || []).some(p => p.eos && p.eos.length > 0);
        return mainScheduleHasItems || adaHasItems;
    }, [currentYearData, yearIsLoaded]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 500 * 1024) { 
            toast({ variant: "destructive", title: "Image too large", description: "Please select an image under 500KB." }); 
            return; 
        }
        const reader = new FileReader();
        reader.onload = (event) => { handleSettingChange('corpsLogo', event.target?.result as string); };
        reader.readAsDataURL(file);
    };

    const commandingOfficer = useMemo(() => settings.staff.find(s => s.primaryRole === 'Commanding Officer'), [settings.staff]);
    const trainingOfficer = useMemo(() => settings.staff.find(s => s.primaryRole === 'Training Officer'), [settings.staff]);
  
    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                 <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                 <div>
                    <CardTitle>Corps Information</CardTitle>
                    <CardDescription>Global settings for your corps.</CardDescription>
                 </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="corpsName">Corps/Sqn Name</Label>
                        <Input id="corpsName" placeholder="e.g., RCSCC 288 ARDENT" defaultValue={settings.corpsName} onBlur={(e) => handleSettingChange('corpsName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Element</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="w-full">
                                        <Select 
                                            value={settings.element} 
                                            onValueChange={(value) => handleSettingChange('element', value as CadetElement)}
                                            disabled={isSchedulePopulated}
                                        >
                                            <SelectTrigger className={cn(isSchedulePopulated && "cursor-not-allowed")}>
                                                <SelectValue placeholder="Select an element" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Sea">Sea Cadets</SelectItem>
                                                <SelectItem value="Army">Army Cadets</SelectItem>
                                                <SelectItem value="Air">Air Cadets</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TooltipTrigger>
                                {isSchedulePopulated && (
                                    <TooltipContent>
                                        <p>Cannot change element once planning has begun.</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                        <Label>Weekly Training Night</Label>
                        <Select value={String(settings.trainingDay)} onValueChange={(value) => handleSettingChange('trainingDay', Number(value))}>
                            <SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger>
                            <SelectContent>{weekDays.map((day, index) => <SelectItem key={index} value={String(index)}>{day}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="coDisplay">Commanding Officer</Label><Input id="coDisplay" readOnly value={commandingOfficer ? `${commandingOfficer.rank} ${commandingOfficer.firstName} ${commandingOfficer.lastName}` : 'Not Assigned'} className="font-medium"/></div>
                    <div className="space-y-2"><Label htmlFor="toDisplay">Training Officer</Label><Input id="toDisplay" readOnly value={trainingOfficer ? `${trainingOfficer.rank} ${trainingOfficer.firstName} ${trainingOfficer.lastName}` : 'Not Assigned'} className="font-medium"/></div>
                </div>
                <div className="space-y-2">
                    <Label>Corps Logo</Label>
                    <div className="flex items-center gap-4">
                        {settings.corpsLogo ? <img src={settings.corpsLogo} alt="Corps Logo" className="h-20 w-20 object-contain rounded-md border p-1 bg-white" /> : <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted/50"><span className="text-xs text-muted-foreground">No Logo</span></div>}
                        <div className="space-y-2">
                            <Input id="logo-upload" type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="max-w-xs" />
                            <p className="text-sm text-muted-foreground">Max 500KB.</p>
                            {settings.corpsLogo && <Button variant="outline" size="sm" onClick={() => handleSettingChange('corpsLogo', '')}>Remove Logo</Button>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const ClassroomsCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const [newClassroom, setNewClassroom] = useState("");
    const handleAdd = () => { if (newClassroom.trim() && !settings.classrooms.includes(newClassroom.trim())) { saveSettings({ classrooms: [...settings.classrooms, newClassroom.trim()] }); setNewClassroom(""); } };
    const handleRemove = (item: string) => { saveSettings({ classrooms: settings.classrooms.filter(c => c !== item) }); };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div><CardTitle>Manage Classrooms</CardTitle><CardDescription>Add or remove locations.</CardDescription></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2"><Input value={newClassroom} onChange={(e) => setNewClassroom(e.target.value)} placeholder="New classroom name" /><Button onClick={handleAdd}>Add</Button></div>
                <div className="space-y-2 max-h-48 overflow-y-auto">{(settings.classrooms || []).map(item => <div key={item} className="flex items-center justify-between p-2 rounded-md bg-muted/50"><span>{item}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(item)}><X className="h-4 w-4"/></Button></div>)}</div>
            </CardContent>
        </Card>
    );
};

const CustomEOsCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const { toast } = useToast();
    const [newCustomEo, setNewCustomEo] = useState({ id: "", title: "", periods: 1 });
    const handleAdd = () => {
        const customEOs = settings.customEOs || [];
        if (newCustomEo.id.trim() && newCustomEo.title.trim() && !customEOs.some(eo => eo.id === newCustomEo.id.trim())) {
            saveSettings({ customEOs: [...customEOs, { ...newCustomEo, id: newCustomEo.id.trim(), title: newCustomEo.title.trim() }] });
            setNewCustomEo({ id: "", title: "", periods: 1 });
        } else {
            toast({ variant: "destructive", title: "Invalid Input", description: "EO ID and Title are required, and the ID must be unique." });
        }
    };
    const handleRemove = (id: string) => { saveSettings({ customEOs: (settings.customEOs || []).filter(eo => eo.id !== id) }); };
    
    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div><CardTitle>Manage Custom EOs</CardTitle><CardDescription>Add corps-specific activities.</CardDescription></div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border p-3 rounded-md"><Input value={newCustomEo.id} onChange={(e) => setNewCustomEo(prev => ({ ...prev, id: e.target.value }))} placeholder="EO ID (e.g., CS032)" /><Input value={newCustomEo.title} onChange={(e) => setNewCustomEo(prev => ({ ...prev, title: e.target.value }))} placeholder="EO Title" /><Input value={newCustomEo.periods} onChange={(e) => setNewCustomEo(prev => ({ ...prev, periods: Number(e.target.value) }))} type="number" min="1" placeholder="Periods" /></div><Button onClick={handleAdd} className="w-full">Add Custom EO</Button><div className="space-y-2 max-h-48 overflow-y-auto">{(settings.customEOs || []).map(eo => <div key={eo.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50"><div><span className="font-semibold">{eo.id}</span> - <span>{eo.title}</span></div><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemove(eo.id)}><X className="h-4 w-4"/></Button></div>)}</div>
            </CardContent>
        </Card>
    );
};

const WeeklyActivitiesCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const { toast } = useToast();
    const [newItem, setNewItem] = useState<{ activity: string; dayOfWeek?: number; startDate?: Date; endDate?: Date; startTime: string; endTime: string; location: string; dress: string; opi: string; }>({ activity: '', startTime: '', endTime: '', location: '', dress: '', opi: '' });
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const handleAdd = () => {
        if (!newItem.activity || newItem.dayOfWeek === undefined || !newItem.startDate || !newItem.endDate) { toast({ variant: "destructive", title: "Missing Information" }); return; }
        if (newItem.endDate < newItem.startDate) { toast({ variant: "destructive", title: "Invalid Dates" }); return; }
        const newActivityToAdd: WeeklyActivity = { id: crypto.randomUUID(), activity: newItem.activity, dayOfWeek: newItem.dayOfWeek, startDate: formatDate(newItem.startDate, 'yyyy-MM-dd'), endDate: formatDate(newItem.endDate, 'yyyy-MM-dd'), startTime: newItem.startTime, endTime: newItem.endTime, location: newItem.location, dress: newItem.dress, opi: newItem.opi };
        saveSettings({ weeklyActivities: [...(settings.weeklyActivities || []), newActivityToAdd] });
        setNewItem({ activity: '', startTime: '', endTime: '', location: '', dress: '', opi: '' });
    };
    const handleRemove = (id: string) => { saveSettings({ weeklyActivities: (settings.weeklyActivities || []).filter(a => a.id !== id) }); };
    
    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div><CardTitle>Manage Weekly Activities</CardTitle><CardDescription>Define recurring events.</CardDescription></div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 p-4 border rounded-md"><h4 className="font-semibold">Add New Recurring Activity</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="md:col-span-2"><Label>Activity</Label><Input value={newItem.activity} onChange={e => setNewItem(prev => ({...prev, activity: e.target.value}))} /></div><div className="flex flex-col space-y-1.5"><Label>Day of Week</Label><Select value={newItem.dayOfWeek?.toString()} onValueChange={val => setNewItem(prev => ({ ...prev, dayOfWeek: parseInt(val)}))}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{weekDays.map((day, index) => <SelectItem key={day} value={index.toString()}>{day}</SelectItem>)}</SelectContent></Select></div><div/><div className="flex flex-col space-y-1.5"><Label>Start Date</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start text-left font-normal", !newItem.startDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newItem.startDate ? formatDate(newItem.startDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newItem.startDate} onSelect={(d) => setNewItem(prev => ({...prev, startDate: d}))} initialFocus /></PopoverContent></Popover></div><div className="flex flex-col space-y-1.5"><Label>End Date</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start text-left font-normal", !newItem.endDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newItem.endDate ? formatDate(newItem.endDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newItem.endDate} onSelect={(d) => setNewItem(prev => ({...prev, endDate: d}))} initialFocus /></PopoverContent></Popover></div><div><Label>Start Time</Label><Input type="time" value={newItem.startTime} onChange={e => setNewItem(prev => ({...prev, startTime: e.target.value}))} /></div><div><Label>End Time</Label><Input type="time" value={newItem.endTime} onChange={e => setNewItem(prev => ({...prev, endTime: e.target.value}))} /></div><div><Label>Location</Label><Input value={newItem.location} onChange={e => setNewItem(prev => ({...prev, location: e.target.value}))} /></div><div><Label>Dress</Label><Input value={newItem.dress} onChange={e => setNewItem(prev => ({...prev, dress: e.target.value}))} /></div><div className="md:col-span-2"><Label>OPI</Label><Input value={newItem.opi} onChange={e => setNewItem(prev => ({...prev, opi: e.target.value}))} /></div></div><Button onClick={handleAdd} className="mt-4">Add Recurring Activity</Button></div><div className="mt-6"><h4 className="font-semibold mb-2">Scheduled Recurring Activities</h4><div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Recurs On</TableHead><TableHead>OPI</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{(settings.weeklyActivities || []).length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No weekly activities defined.</TableCell></TableRow>}{(settings.weeklyActivities || []).map(act => (<TableRow key={act.id}><TableCell><p className="font-medium">{act.activity}</p><p className="text-xs text-muted-foreground">{act.startTime} - {act.endTime} @ {act.location}</p></TableCell><TableCell><p className="font-medium">{weekDays[act.dayOfWeek]}</p>{isValid(new Date(act.startDate.replace(/-/g, '/'))) && isValid(new Date(act.endDate.replace(/-/g, '/'))) ? (<p className="text-xs text-muted-foreground">{formatDate(new Date(act.startDate.replace(/-/g, '/')), "MMM d, yyyy")} - {formatDate(new Date(act.endDate.replace(/-/g, '/')), "MMM d, yyyy")}</p>) : null}</TableCell><TableCell>{act.opi}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemove(act.id)}><X className="h-4 w-4"/></Button></TableCell></TableRow>))}</TableBody></Table></div></div>
            </CardContent>
        </Card>
    );
};


// Category components that act as containers for draggable sub-cards
const GeneralSettingsCard = ({ dragHandleListeners }: { dragHandleListeners?: any }) => {
    const { settings, saveSettings } = useSettings();
    const [cardOrder, setCardOrder] = useState<string[]>([]);
    
    useEffect(() => { setCardOrder(settings.generalSettingsCardOrder || ['trainingYear', 'corpsInfo']); }, [settings.generalSettingsCardOrder]);
    
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCardOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                saveSettings({ generalSettingsCardOrder: newOrder });
                return newOrder;
            });
        }
    };
    
    const cardComponents: { [key: string]: React.FC<{ dragHandleListeners: any }> } = {
        trainingYear: TrainingYearManagementCard,
        corpsInfo: CorpsInformationCard
    };

    return (
        <Card className="border">
            <AccordionItem value="general" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex items-center gap-2">
                        <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                        <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <p className="text-muted-foreground mb-6">High-level settings for the application and training year.</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
                            <div className="space-y-6">
                                {cardOrder.map(id => {
                                    const Component = cardComponents[id];
                                    return <SortableSubCard key={id} id={id}><Component dragHandleListeners={{}} /></SortableSubCard>;
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
};

const PlanningResourcesCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { settings, saveSettings } = useSettings();
    const [cardOrder, setCardOrder] = useState<string[]>([]);

    useEffect(() => { setCardOrder(settings.planningResourcesCardOrder || ['classrooms', 'customEos', 'weeklyActivities']); }, [settings.planningResourcesCardOrder]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCardOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                saveSettings({ planningResourcesCardOrder: newOrder });
                return newOrder;
            });
        }
    };
    
    const cardComponents: { [key: string]: { component: React.FC<{ dragHandleListeners: any }>, className?: string } } = {
        classrooms: { component: ClassroomsCard },
        customEos: { component: CustomEOsCard },
        weeklyActivities: { component: WeeklyActivitiesCard, className: "lg:col-span-2" },
    };

    return (
        <Card className="border">
            <AccordionItem value="resources" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex items-center gap-2">
                        <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                        <h2 className="text-2xl font-bold tracking-tight">Planning Resources</h2>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                    <p className="text-muted-foreground mb-6">Customize lists and recurring events used throughout the planners and reports.</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {cardOrder.map(id => {
                                    const CardData = cardComponents[id];
                                    if (!CardData) return null;
                                    return <SortableSubCard key={id} id={id} className={CardData.className}><CardData.component dragHandleListeners={{}} /></SortableSubCard>;
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
};

const DataManagementCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { trainingYears, allYearsData } = useTrainingYear();
    const [isDownloading, setIsDownloading] = useState(false);
    const [yearToExport, setYearToExport] = useState<string>('');

    const handleDownloadFullBackup = async () => {
        if (!user || !db) {
            toast({ variant: "destructive", title: "Error", description: "Not logged in or database not available." });
            return;
        }
        setIsDownloading(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `corps-sqn-manager-full-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast({ title: "Success", description: "Your data has been downloaded." });
            } else {
                toast({ variant: "destructive", title: "Error", description: "No data found to download." });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Download Failed", description: "Could not download your data." });
        } finally {
            setIsDownloading(false);
        }
    };
    
    const handleExportYear = () => {
        if (!yearToExport || !allYearsData[yearToExport]) {
            toast({ variant: "destructive", title: "Error", description: "Please select a valid year to export."});
            return;
        }

        const data = allYearsData[yearToExport];
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-year-export-${yearToExport}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Success", description: `Training year ${yearToExport} has been exported.` });
    };

    return (
        <Card className="border">
            <CardHeader className="flex-row items-center gap-2">
                    <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                <div>
                    <CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5" /> Data Management</CardTitle>
                    <CardDescription>
                        Backup your entire application or export individual training years to share.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-base font-semibold">Full Application Backup</h4>
                    <p className="text-sm text-muted-foreground mb-3">Download a single JSON file containing all your data across all training years. This is useful for personal backups and disaster recovery.</p>
                    <Button onClick={handleDownloadFullBackup} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Download Full Backup
                    </Button>
                </div>
                <Separator />
                <div>
                     <h4 className="text-base font-semibold">Export Single Training Year</h4>
                    <p className="text-sm text-muted-foreground mb-3">Export the data for a single year to share with another user. They can import this file when creating a new training year on their own account.</p>
                    <div className="flex items-center gap-2">
                        <Select value={yearToExport} onValueChange={setYearToExport}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select year..." />
                            </SelectTrigger>
                            <SelectContent>
                                {trainingYears.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleExportYear} disabled={!yearToExport}>Export Year</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const DangerZoneCard = ({ dragHandleListeners }: { dragHandleListeners: any }) => {
    const { toast } = useToast();
    const { resetUserDocument } = useSettings();
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [resetConfirmation, setResetConfirmation] = useState("");
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        await resetUserDocument();
        // The page will reload via the hook, so we don't need to set states back to false.
    };
  
    return (
        <Card className="border-destructive">
            <CardHeader className="flex-row items-center gap-2">
                 <div {...dragHandleListeners} className="cursor-grab p-1"><GripVertical className="h-5 w-5 text-destructive" /></div>
                <div>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>This action is irreversible. It will permanently delete all of your corps data from the cloud.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>
                    Reset Application
                </Button>
            </CardContent>
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action is permanent and cannot be undone. It will delete all your corps data from the cloud, including schedules, cadets, staff, and settings, and reset the application to its default state.<br /><br />To confirm, please type <strong>reset</strong> into the box below.</AlertDialogDescription></AlertDialogHeader>
                    <div className="py-2"><Input id="reset-confirm" value={resetConfirmation} onChange={(e) => setResetConfirmation(e.target.value)} placeholder='Type "reset" to confirm' /></div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setResetConfirmation("")}>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" disabled={resetConfirmation !== "reset" || isResetting} onClick={handleReset}>
                            {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Application
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};


// Main Page Component
export default function SettingsPage() {
    const { settings, saveSettings, isLoaded } = useSettings();
    const defaultOrder = ['general', 'resources', 'data', 'danger'];
    const [cardOrder, setCardOrder] = useState<string[]>([]);
    
    useEffect(() => {
        if (isLoaded) {
            setCardOrder(settings.settingsCardOrder || defaultOrder);
        }
    }, [isLoaded, settings.settingsCardOrder]);
    
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setCardOrder((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          const newOrder = arrayMove(items, oldIndex, newIndex);
          saveSettings({ settingsCardOrder: newOrder });
          return newOrder;
        });
      }
    };

    const cardComponents: { [key: string]: React.FC<{ dragHandleListeners: any }> } = {
        general: GeneralSettingsCard,
        resources: PlanningResourcesCard,
        data: DataManagementCard,
        danger: DangerZoneCard
    };
  
    if (!isLoaded) {
      return (
        <>
            <PageHeader title="Settings" description="Configure the application to your corps' needs." />
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </>
      )
    }

    return (
        <>
            <PageHeader title="Settings" description="Configure the application to your corps' needs." />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
                    <Accordion type="multiple" defaultValue={["general", "resources"]} className="w-full space-y-6 mt-8">
                       {cardOrder.map(id => {
                           const Component = cardComponents[id];
                           if (!Component) return null;
                           return (
                               <SortableCard key={id} id={id}>
                                   <Component dragHandleListeners={{}} />
                               </SortableCard>
                           );
                       })}
                    </Accordion>
                </SortableContext>
            </DndContext>
        </>
    );
}
