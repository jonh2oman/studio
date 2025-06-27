"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { X, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { useTrainingYear } from "@/hooks/use-training-year";
import { NewYearDialog } from "@/components/settings/new-year-dialog";
import { Label } from "@/components/ui/label";
import type { WeeklyActivity, Settings, StaffMember } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate } from 'date-fns';
import { cn } from "@/lib/utils";
import { StaffManager } from "@/components/settings/staff-manager";
import { DutyRoster } from "@/components/settings/duty-roster";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSave } from "@/hooks/use-save-context";

const settingsSchema = z.object({
  corpsName: z.string().min(1, "Corps name is required"),
  trainingDay: z.coerce.number().min(0).max(6),
});

export default function SettingsPage() {
  const { settings: globalSettings, saveSettings: globalSaveSettings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();
  const { registerSave } = useSave();
  
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>(globalSettings);
  const [isDirty, setIsDirty] = useState(false);
  
  const [newClassroom, setNewClassroom] = useState("");
  const [newCadetRank, setNewCadetRank] = useState("");
  const [newOfficerRank, setNewOfficerRank] = useState("");
  const [newCafDress, setNewCafDress] = useState("");
  const [newCadetDress, setNewCadetDress] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [newActivity, setNewActivity] = useState<{
    activity: string;
    dayOfWeek?: number;
    startDate?: Date;
    endDate?: Date;
    startTime: string;
    endTime: string;
    location: string;
    dress: string;
    opi: string;
  }>({
    activity: '',
    startTime: '',
    endTime: '',
    location: '',
    dress: '',
    opi: '',
  });

  const { currentYear, trainingYears, setCurrentYear, isLoaded: yearsLoaded } = useTrainingYear();
  const [isNewYearDialogOpen, setIsNewYearDialogOpen] = useState(false);
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      corpsName: globalSettings.corpsName || "",
      trainingDay: globalSettings.trainingDay ?? 2,
    },
  });

  const { reset, watch } = form;

  useEffect(() => {
    if (settingsLoaded) {
      setLocalSettings(globalSettings);
      setIsDirty(false);
      reset({
        corpsName: globalSettings.corpsName,
        trainingDay: globalSettings.trainingDay,
      });
    }
  }, [globalSettings, settingsLoaded, reset]);

  const handleSettingChange = useCallback((key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);
  
  const handleListChange = useCallback((key: keyof Settings, newList: any[]) => {
    setLocalSettings(prev => ({ ...prev, [key]: newList }));
    setIsDirty(true);
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
        if (name && value[name as keyof typeof value] !== undefined) {
             handleSettingChange(name as keyof Settings, value[name as keyof typeof value]);
        }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSettingChange]);
  
  const handleSave = useCallback(() => {
    globalSaveSettings(localSettings);
    setIsDirty(false);
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  }, [localSettings, globalSaveSettings, toast]);

  useEffect(() => {
    if (isDirty) {
      registerSave(handleSave);
    } else {
      registerSave(null);
    }
    return () => registerSave(null);
  }, [isDirty, registerSave, handleSave]);


  const handleAddClassroom = () => {
    const classrooms = localSettings.classrooms || [];
    if (newClassroom.trim() && !classrooms.includes(newClassroom.trim())) {
      handleListChange('classrooms', [...classrooms, newClassroom.trim()]);
      setNewClassroom("");
    }
  };

  const handleRemoveClassroom = (classroom: string) => {
    const classrooms = localSettings.classrooms || [];
    handleListChange('classrooms', classrooms.filter(c => c !== classroom));
  };

  const handleAddCadetRank = () => {
    const cadetRanks = localSettings.cadetRanks || [];
    if (newCadetRank.trim() && !cadetRanks.includes(newCadetRank.trim())) {
      handleListChange('cadetRanks', [...cadetRanks, newCadetRank.trim()]);
      setNewCadetRank("");
    }
  };

  const handleRemoveCadetRank = (rank: string) => {
    const cadetRanks = localSettings.cadetRanks || [];
    handleListChange('cadetRanks', cadetRanks.filter(r => r !== rank));
  };
  
  const handleAddOfficerRank = () => {
    const officerRanks = localSettings.officerRanks || [];
    if (newOfficerRank.trim() && !officerRanks.includes(newOfficerRank.trim())) {
      handleListChange('officerRanks', [...officerRanks, newOfficerRank.trim()]);
      setNewOfficerRank("");
    }
  };

  const handleRemoveOfficerRank = (rank: string) => {
    const officerRanks = localSettings.officerRanks || [];
    handleListChange('officerRanks', officerRanks.filter(r => r !== rank));
  };

  const handleAddCafDress = () => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    if (newCafDress.trim() && !ordersOfDress.caf.includes(newCafDress.trim())) {
      handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: [...ordersOfDress.caf, newCafDress.trim()] });
      setNewCafDress("");
    }
  };

  const handleRemoveCafDress = (dress: string) => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    handleSettingChange('ordersOfDress', { ...ordersOfDress, caf: ordersOfDress.caf.filter(d => d !== dress) });
  };

  const handleAddCadetDress = () => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    if (newCadetDress.trim() && !ordersOfDress.cadets.includes(newCadetDress.trim())) {
      handleSettingChange('ordersOfDress', { ...ordersOfDress, cadets: [...ordersOfDress.cadets, newCadetDress.trim()] });
      setNewCadetDress("");
    }
  };

  const handleRemoveCadetDress = (dress: string) => {
    const ordersOfDress = localSettings.ordersOfDress || { caf: [], cadets: [] };
    handleSettingChange('ordersOfDress', { ...ordersOfDress, cadets: ordersOfDress.cadets.filter(d => d !== dress) });
  };

  const handleAddActivity = () => {
    if (!newActivity.activity || newActivity.dayOfWeek === undefined || !newActivity.startDate || !newActivity.endDate) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please provide an activity name, day of week, start date, and end date." });
        return;
    }
    if (newActivity.endDate < newActivity.startDate) {
        toast({ variant: "destructive", title: "Invalid Dates", description: "The end date cannot be before the start date." });
        return;
    }

    const newActivityToAdd: WeeklyActivity = {
        id: crypto.randomUUID(),
        activity: newActivity.activity,
        dayOfWeek: newActivity.dayOfWeek,
        startDate: formatDate(newActivity.startDate, 'yyyy-MM-dd'),
        endDate: formatDate(newActivity.endDate, 'yyyy-MM-dd'),
        startTime: newActivity.startTime,
        endTime: newActivity.endTime,
        location: newActivity.location,
        dress: newActivity.dress,
        opi: newActivity.opi,
    };
    const weeklyActivities = localSettings.weeklyActivities || [];
    handleListChange('weeklyActivities', [...weeklyActivities, newActivityToAdd]);
    setNewActivity({ activity: '', startTime: '', endTime: '', location: '', dress: '', opi: '' });
  };

  const handleRemoveActivity = (id: string) => {
    const weeklyActivities = localSettings.weeklyActivities || [];
    handleListChange('weeklyActivities', weeklyActivities.filter(a => a.id !== id));
  };
  
  const handleStaffChange = (newStaff: StaffMember[]) => {
      handleListChange('staff', newStaff);
  }

  const isLoading = !settingsLoaded || !yearsLoaded;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      >
      </PageHeader>
      <div className="mt-8 space-y-6">
        <Accordion type="multiple" defaultValue={["general", "personnel", "resources"]} className="w-full space-y-6">
            <Card className="border">
                <AccordionItem value="general" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">High-level settings for the application and training year.</p>
                        <div className="grid gap-8">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Training Year Management</CardTitle>
                                    <CardDescription>Select the active training year or create a new one to begin planning.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <Label htmlFor="training-year-select">Active Training Year</Label>
                                        <Select value={currentYear || ''} onValueChange={setCurrentYear}>
                                            <SelectTrigger id="training-year-select">
                                                <SelectValue placeholder="Select a year..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {trainingYears.map(year => (
                                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={() => setIsNewYearDialogOpen(true)} className="w-full sm:w-auto mt-4 sm:mt-0 self-end">
                                        <PlusCircle className="mr-2" />
                                        Create New Year
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Corps Information</CardTitle>
                                    <CardDescription>
                                    Set the primary training night and corps information. These settings are global across all training years.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                    <p>Loading settings...</p>
                                    ) : (
                                    <Form {...form}>
                                        <form className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="corpsName"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Corps Name</FormLabel>
                                                <FormControl>
                                                <Input placeholder="e.g., RCSCC 288 ARDENT" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="trainingDay"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weekly Training Night</FormLabel>
                                                <Select onValueChange={field.onChange} value={String(field.value)}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                    <SelectValue placeholder="Select a day" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {weekDays.map((day, index) => (
                                                    <SelectItem key={index} value={String(index)}>
                                                        {day}
                                                    </SelectItem>
                                                    ))}
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        </form>
                                    </Form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
            
            <Card className="border">
                <AccordionItem value="personnel" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">Personnel Management</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">Manage staff members and assign their parade night duties.</p>
                        <div className="grid gap-8">
                            <StaffManager staff={localSettings.staff || []} onStaffChange={handleStaffChange} />
                            <DutyRoster />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>

            <Card className="border">
                <AccordionItem value="resources" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <h2 className="text-2xl font-bold tracking-tight">Planning Resources</h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <p className="text-muted-foreground mb-6">Customize lists and recurring events used throughout the planners and reports.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Classrooms</CardTitle>
                                    <CardDescription>Add or remove classrooms and locations.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newClassroom}
                                        onChange={(e) => setNewClassroom(e.target.value)}
                                        placeholder="New classroom name"
                                    />
                                    <Button onClick={handleAddClassroom}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.classrooms || []).map(classroom => (
                                        <div key={classroom} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{classroom}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveClassroom(classroom)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                            
                             <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Officer Ranks</CardTitle>
                                    <CardDescription>Add or remove staff ranks from the list available in the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newOfficerRank}
                                        onChange={(e) => setNewOfficerRank(e.target.value)}
                                        placeholder="New officer rank"
                                    />
                                    <Button onClick={handleAddOfficerRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.officerRanks || []).map(rank => (
                                        <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{rank}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveOfficerRank(rank)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Cadet Ranks</CardTitle>
                                    <CardDescription>Add or remove cadet ranks from the list available in the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newCadetRank}
                                        onChange={(e) => setNewCadetRank(e.target.value)}
                                        placeholder="New cadet rank name"
                                    />
                                    <Button onClick={handleAddCadetRank}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.cadetRanks || []).map(rank => (
                                        <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{rank}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetRank(rank)}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                        </div>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="lg:col-span-2 border">
                                <CardHeader>
                                    <CardTitle>Manage Orders of Dress</CardTitle>
                                    <CardDescription>Add or remove orders of dress for CAF Staff and Cadets.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">CAF Staff Dress</h4>
                                        <div className="flex gap-2">
                                            <Input value={newCafDress} onChange={(e) => setNewCafDress(e.target.value)} placeholder="New staff dress" />
                                            <Button onClick={handleAddCafDress}>Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(localSettings.ordersOfDress?.caf || []).map(dress => (
                                                <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                    <span>{dress}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCafDress(dress)}>
                                                        <X className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Cadet Dress</h4>
                                        <div className="flex gap-2">
                                            <Input value={newCadetDress} onChange={(e) => setNewCadetDress(e.target.value)} placeholder="New cadet dress" />
                                            <Button onClick={handleAddCadetDress}>Add</Button>
                                        </div>
                                        <div className="space-y-2">
                                            {(localSettings.ordersOfDress?.cadets || []).map(dress => (
                                                <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                    <span>{dress}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetDress(dress)}>
                                                        <X className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2 border">
                                <CardHeader>
                                    <CardTitle>Manage Weekly Activities</CardTitle>
                                    <CardDescription>Define recurring weekly activities with start and end dates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-semibold">Add New Recurring Activity</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2"><Label>Activity</Label><Input value={newActivity.activity} onChange={e => setNewActivity(prev => ({...prev, activity: e.target.value}))} /></div>
                                            
                                            <div className="flex flex-col space-y-1.5">
                                                <Label>Day of Week</Label>
                                                <Select value={newActivity.dayOfWeek?.toString()} onValueChange={val => setNewActivity(prev => ({ ...prev, dayOfWeek: parseInt(val)}))}>
                                                    <SelectTrigger><SelectValue placeholder="Select a day..." /></SelectTrigger>
                                                    <SelectContent>
                                                        {weekDays.map((day, index) => <SelectItem key={day} value={index.toString()}>{day}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div/>

                                            <div className="flex flex-col space-y-1.5">
                                                <Label>Start Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newActivity.startDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newActivity.startDate ? formatDate(newActivity.startDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newActivity.startDate} onSelect={(d) => setNewActivity(prev => ({...prev, startDate: d}))} initialFocus /></PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label>End Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newActivity.endDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newActivity.endDate ? formatDate(newActivity.endDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newActivity.endDate} onSelect={(d) => setNewActivity(prev => ({...prev, endDate: d}))} initialFocus /></PopoverContent>
                                                </Popover>
                                            </div>

                                            <div><Label>Start Time</Label><Input type="time" value={newActivity.startTime} onChange={e => setNewActivity(prev => ({...prev, startTime: e.target.value}))} /></div>
                                            <div><Label>End Time</Label><Input type="time" value={newActivity.endTime} onChange={e => setNewActivity(prev => ({...prev, endTime: e.target.value}))} /></div>
                                            
                                            <div><Label>Location</Label><Input value={newActivity.location} onChange={e => setNewActivity(prev => ({...prev, location: e.target.value}))} /></div>
                                            <div><Label>Dress</Label><Input value={newActivity.dress} onChange={e => setNewActivity(prev => ({...prev, dress: e.target.value}))} /></div>
                                            <div className="md:col-span-2"><Label>OPI</Label><Input value={newActivity.opi} onChange={e => setNewActivity(prev => ({...prev, opi: e.target.value}))} /></div>
                                        </div>
                                        <Button onClick={handleAddActivity} className="mt-4">Add Recurring Activity</Button>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-2">Scheduled Recurring Activities</h4>
                                        <div className="border rounded-lg">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Activity</TableHead>
                                                        <TableHead>Recurs On</TableHead>
                                                        <TableHead>OPI</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(localSettings.weeklyActivities || []).length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No weekly activities defined.</TableCell></TableRow>}
                                                    {(localSettings.weeklyActivities || []).map(act => (
                                                        <TableRow key={act.id}>
                                                            <TableCell>
                                                                <p className="font-medium">{act.activity}</p>
                                                                <p className="text-xs text-muted-foreground">{act.startTime} - {act.endTime} @ {act.location}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <p className="font-medium">{weekDays[act.dayOfWeek]}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatDate(new Date(act.startDate.replace(/-/g, '/')), "MMM d, yyyy")} - {formatDate(new Date(act.endDate.replace(/-/g, '/')), "MMM d, yyyy")}
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>{act.opi}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveActivity(act.id)}>
                                                                    <X className="h-4 w-4"/>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                    These actions are irreversible. Please proceed with caution.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>
                    Reset Application
                </Button>
            </CardContent>
        </Card>
      </div>
      
      {isNewYearDialogOpen && (
        <NewYearDialog onOpenChange={setIsNewYearDialogOpen} />
      )}

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action is permanent and cannot be undone. It will delete all your corps data, including schedules, cadets, staff, and settings, and reset the application to its default state.
                    <br /><br />
                    To confirm, please type <strong>reset</strong> into the box below.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
                <Input
                    id="reset-confirm"
                    value={resetConfirmation}
                    onChange={(e) => setResetConfirmation(e.target.value)}
                    placeholder='Type "reset" to confirm'
                />
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setResetConfirmation("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    variant="destructive"
                    disabled={resetConfirmation !== "reset"}
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                >
                    Reset Application
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
