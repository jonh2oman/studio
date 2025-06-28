
"use client";

import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback, useMemo } from "react";
import { X, PlusCircle, Calendar as CalendarIcon, FileDown, FileUp, Loader2, Cloud } from "lucide-react";
import { useTrainingYear } from "@/hooks/use-training-year";
import { NewYearDialog } from "@/components/settings/new-year-dialog";
import { Label } from "@/components/ui/label";
import type { WeeklyActivity, Settings, CustomEO } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate } from 'date-fns';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useGoogleLogin } from '@react-oauth/google';


export default function SettingsPage() {
  const { settings, saveSettings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  const [newClassroom, setNewClassroom] = useState("");
  const [newCadetRank, setNewCadetRank] = useState("");
  const [newCadetRole, setNewCadetRole] = useState("");
  const [newCadetDress, setNewCadetDress] = useState("");
  const [newCustomEo, setNewCustomEo] = useState({ id: "", title: "", periods: 1 });
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

  const commandingOfficer = useMemo(() => {
    return localSettings.staff.find(s => s.primaryRole === 'Commanding Officer');
  }, [localSettings.staff]);

  const trainingOfficer = useMemo(() => {
    return localSettings.staff.find(s => s.primaryRole === 'Training Officer');
  }, [localSettings.staff]);

  useEffect(() => {
    if (settingsLoaded) {
      setLocalSettings(settings);
    }
  }, [settings, settingsLoaded]);

  const handleSettingChange = useCallback((key: keyof Settings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    saveSettings(newSettings);
    toast({
      title: "Settings Saved",
      description: "Your changes have been automatically saved.",
    });
  }, [localSettings, saveSettings, toast]);
  
  const handleListChange = useCallback((key: keyof Settings, newList: any[]) => {
    handleSettingChange(key, newList);
  }, [handleSettingChange]);

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

  const handleAddCadetRole = () => {
    const cadetRoles = localSettings.cadetRoles || [];
    if (newCadetRole.trim() && !cadetRoles.includes(newCadetRole.trim())) {
      handleListChange('cadetRoles', [...cadetRoles, newCadetRole.trim()]);
      setNewCadetRole("");
    }
  };

  const handleRemoveCadetRole = (role: string) => {
    const cadetRoles = localSettings.cadetRoles || [];
    handleListChange('cadetRoles', cadetRoles.filter(r => r !== role));
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
  
  const handleAddCustomEo = () => {
    const customEOs = localSettings.customEOs || [];
    if (newCustomEo.id.trim() && newCustomEo.title.trim() && !customEOs.some(eo => eo.id === newCustomEo.id.trim())) {
        handleListChange('customEOs', [...customEOs, { ...newCustomEo, id: newCustomEo.id.trim(), title: newCustomEo.title.trim() }]);
        setNewCustomEo({ id: "", title: "", periods: 1 });
    } else {
        toast({ variant: "destructive", title: "Invalid Input", description: "EO ID and Title are required, and the ID must be unique." });
    }
  };

  const handleRemoveCustomEo = (id: string) => {
      const customEOs = localSettings.customEOs || [];
      handleListChange('customEOs', customEOs.filter(eo => eo.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) { // 500KB limit
        toast({
            variant: "destructive",
            title: "Image too large",
            description: "Please upload an image smaller than 500KB.",
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        const newSettings = { ...localSettings, corpsLogo: result };
        setLocalSettings(newSettings);
        saveSettings({ corpsLogo: result });
        toast({
            title: "Logo Saved",
            description: "Your new logo has been saved.",
        });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const newSettings = { ...localSettings, corpsLogo: "" };
    setLocalSettings(newSettings);
    saveSettings({ corpsLogo: "" });
    toast({
        title: "Logo Removed",
    });
  };

  const isLoading = !settingsLoaded || !yearsLoaded;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      >
      </PageHeader>
      <div className="mt-8 space-y-6">
        <Accordion type="multiple" defaultValue={["general", "resources"]} className="w-full space-y-6">
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
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="corpsName">Corps Name</Label>
                                            <Input 
                                                id="corpsName"
                                                placeholder="e.g., RCSCC 288 ARDENT"
                                                defaultValue={localSettings.corpsName}
                                                onBlur={(e) => handleSettingChange('corpsName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Weekly Training Night</Label>
                                            <Select 
                                                value={String(localSettings.trainingDay)}
                                                onValueChange={(value) => handleSettingChange('trainingDay', Number(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {weekDays.map((day, index) => (
                                                        <SelectItem key={index} value={String(index)}>
                                                            {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="coDisplay">Commanding Officer</Label>
                                            <Input 
                                                id="coDisplay"
                                                readOnly
                                                value={commandingOfficer ? `${commandingOfficer.rank} ${commandingOfficer.firstName} ${commandingOfficer.lastName}` : 'Not Assigned'}
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="toDisplay">Training Officer</Label>
                                            <Input 
                                                id="toDisplay"
                                                readOnly
                                                value={trainingOfficer ? `${trainingOfficer.rank} ${trainingOfficer.firstName} ${trainingOfficer.lastName}` : 'Not Assigned'}
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Corps Logo</Label>
                                            <div className="flex items-center gap-4">
                                                {localSettings.corpsLogo ? (
                                                    <img src={localSettings.corpsLogo} alt="Corps Logo" className="h-20 w-20 object-contain rounded-md border p-1 bg-white" />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted/50">
                                                        <span className="text-xs text-muted-foreground">No Logo</span>
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <Input id="logo-upload" type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="max-w-xs" />
                                                    <p className="text-sm text-muted-foreground">Upload a PNG or JPG file. Max 500KB.</p>
                                                    {localSettings.corpsLogo && (
                                                        <Button variant="outline" size="sm" onClick={handleRemoveLogo}>Remove Logo</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </CardContent>
                            </Card>
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
                                    <CardTitle>Manage Cadet Roles</CardTitle>
                                    <CardDescription>Add or remove optional cadet roles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                    <Input 
                                        value={newCadetRole}
                                        onChange={(e) => setNewCadetRole(e.target.value)}
                                        placeholder="New cadet role name"
                                    />
                                    <Button onClick={handleAddCadetRole}>Add</Button>
                                    </div>
                                    <div className="space-y-2">
                                    {(localSettings.cadetRoles || []).map(role => (
                                        <div key={role} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <span>{role}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetRole(role)}>
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

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Cadet Orders of Dress</CardTitle>
                                    <CardDescription>Add or remove orders of dress for Cadets.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input value={newCadetDress} onChange={(e) => setNewCadetDress(e.target.value)} placeholder="New cadet dress" />
                                        <Button onClick={handleAddCadetDress}>Add</Button>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {(localSettings.ordersOfDress?.cadets || []).map(dress => (
                                            <div key={dress} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                                <span>{dress}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCadetDress(dress)}>
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Manage Custom EOs</CardTitle>
                                    <CardDescription>Add or remove corps-specific activities.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border p-3 rounded-md">
                                        <Input value={newCustomEo.id} onChange={(e) => setNewCustomEo(prev => ({ ...prev, id: e.target.value }))} placeholder="EO ID (e.g., CS032)" />
                                        <Input value={newCustomEo.title} onChange={(e) => setNewCustomEo(prev => ({ ...prev, title: e.target.value }))} placeholder="EO Title" />
                                        <Input value={newCustomEo.periods} onChange={(e) => setNewCustomEo(prev => ({ ...prev, periods: Number(e.target.value) }))} type="number" min="1" placeholder="Periods" />
                                    </div>
                                    <Button onClick={handleAddCustomEo} className="w-full">Add Custom EO</Button>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {(localSettings.customEOs || []).map(eo => (
                                        <div key={eo.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                            <div>
                                                <span className="font-semibold">{eo.id}</span> - <span>{eo.title}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCustomEo(eo.id)}>
                                                <X className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))}
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
        
        <Card className="border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5" /> Data Storage</CardTitle>
                <CardDescription>
                    All of your application data is now automatically and securely saved to the cloud, tied to your user account. Your changes are available instantly across any device you log in from. Manual backups are no longer necessary.
                </CardDescription>
            </CardHeader>
        </Card>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                    This action is irreversible. It will permanently delete all of your corps data from the cloud.
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
                    This action is permanent and cannot be undone. It will delete all your corps data from the cloud, including schedules, cadets, staff, and settings, and reset the application to its default state.
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
                        // This would need a backend function to delete the user's Firestore document
                        toast({ variant: "destructive", title: "Action Not Implemented", description: "This requires a secure backend function to prevent misuse."});
                        setResetConfirmation("");
                        setIsResetDialogOpen(false);
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
