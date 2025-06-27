
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
import { useState, useEffect } from "react";
import { X, PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { useTrainingYear } from "@/hooks/use-training-year";
import { NewYearDialog } from "@/components/settings/new-year-dialog";
import { Label } from "@/components/ui/label";
import type { WeeklyActivity } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format as formatDate, getDay } from 'date-fns';
import { cn } from "@/lib/utils";


const settingsSchema = z.object({
  corpsName: z.string().min(1, "Corps name is required"),
  trainingDay: z.coerce.number().min(0).max(6),
});

export default function SettingsPage() {
  const { settings, saveSettings, isLoaded: settingsLoaded } = useSettings();
  const { toast } = useToast();
  const [newInstructor, setNewInstructor] = useState("");
  const [newClassroom, setNewClassroom] = useState("");
  const [newRank, setNewRank] = useState("");
  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivity[]>(settings.weeklyActivities);
  const [newActivity, setNewActivity] = useState<{ date?: Date; startTime: string; endTime: string; activity: string; location: string; dress: string; opi: string; }>({
    startTime: '',
    endTime: '',
    activity: '',
    location: '',
    dress: '',
    opi: '',
  });

  const { currentYear, trainingYears, setCurrentYear, isLoaded: yearsLoaded } = useTrainingYear();
  const [isNewYearDialogOpen, setIsNewYearDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      corpsName: settings.corpsName,
      trainingDay: settings.trainingDay,
    },
  });

  useEffect(() => {
    if (settingsLoaded) {
      form.reset({
        corpsName: settings.corpsName,
        trainingDay: settings.trainingDay,
      });
      setWeeklyActivities(settings.weeklyActivities);
    }
  }, [settingsLoaded, settings.corpsName, settings.trainingDay, settings.weeklyActivities, form]);


  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    saveSettings(data);
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleAddInstructor = () => {
    if (newInstructor.trim() && !settings.instructors.includes(newInstructor.trim())) {
      saveSettings({ instructors: [...settings.instructors, newInstructor.trim()] });
      setNewInstructor("");
    }
  };

  const handleRemoveInstructor = (instructor: string) => {
    saveSettings({ instructors: settings.instructors.filter(i => i !== instructor) });
  };

  const handleAddClassroom = () => {
    if (newClassroom.trim() && !settings.classrooms.includes(newClassroom.trim())) {
      saveSettings({ classrooms: [...settings.classrooms, newClassroom.trim()] });
      setNewClassroom("");
    }
  };

  const handleRemoveClassroom = (classroom: string) => {
    saveSettings({ classrooms: settings.classrooms.filter(c => c !== classroom) });
  };

  const handleAddRank = () => {
    if (newRank.trim() && !settings.ranks.includes(newRank.trim())) {
      saveSettings({ ranks: [...settings.ranks, newRank.trim()] });
      setNewRank("");
    }
  };

  const handleRemoveRank = (rank: string) => {
    saveSettings({ ranks: settings.ranks.filter(r => r !== rank) });
  };

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const handleAddActivity = () => {
    if (!newActivity.date || !newActivity.activity) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide at least a date and activity name.",
        });
        return;
    }
    const newActivityToAdd: WeeklyActivity = {
        id: crypto.randomUUID(),
        date: formatDate(newActivity.date, 'yyyy-MM-dd'),
        dayOfWeek: weekDays[getDay(newActivity.date)],
        startTime: newActivity.startTime,
        endTime: newActivity.endTime,
        activity: newActivity.activity,
        location: newActivity.location,
        dress: newActivity.dress,
        opi: newActivity.opi,
    };
    const updatedActivities = [...weeklyActivities, newActivityToAdd];
    saveSettings({ weeklyActivities: updatedActivities });
    setNewActivity({ date: undefined, startTime: '', endTime: '', activity: '', location: '', dress: '', opi: '' }); // Reset form
  };

  const handleRemoveActivity = (id: string) => {
    const updatedActivities = weeklyActivities.filter(a => a.id !== id);
    saveSettings({ weeklyActivities: updatedActivities });
  };

  const isLoading = !settingsLoaded || !yearsLoaded;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      />
      <div className="mt-6 space-y-8 max-w-4xl">

        <Card>
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

        <Card>
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Instructors</CardTitle>
            <CardDescription>Add or remove instructors from the list available in the planner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={newInstructor}
                onChange={(e) => setNewInstructor(e.target.value)}
                placeholder="New instructor name"
              />
              <Button onClick={handleAddInstructor}>Add</Button>
            </div>
            <div className="space-y-2">
              {settings.instructors.map(instructor => (
                <div key={instructor} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span>{instructor}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveInstructor(instructor)}>
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
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
              {settings.classrooms.map(classroom => (
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

        <Card>
          <CardHeader>
            <CardTitle>Manage Ranks</CardTitle>
            <CardDescription>Add or remove cadet ranks from the list available in the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={newRank}
                onChange={(e) => setNewRank(e.target.value)}
                placeholder="New rank name"
              />
              <Button onClick={handleAddRank}>Add</Button>
            </div>
            <div className="space-y-2">
              {settings.ranks.map(rank => (
                <div key={rank} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span>{rank}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveRank(rank)}>
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Manage Weekly Activities</CardTitle>
                <CardDescription>Define recurring weekly activities like team practices.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 p-4 border rounded-md">
                    <h4 className="font-semibold">Add New Activity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("justify-start text-left font-normal", !newActivity.date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newActivity.date ? formatDate(newActivity.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newActivity.date} onSelect={(d) => setNewActivity(prev => ({...prev, date: d}))} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div />
                        <div><Label>Start Time</Label><Input type="time" value={newActivity.startTime} onChange={e => setNewActivity(prev => ({...prev, startTime: e.target.value}))} /></div>
                        <div><Label>End Time</Label><Input type="time" value={newActivity.endTime} onChange={e => setNewActivity(prev => ({...prev, endTime: e.target.value}))} /></div>
                        <div className="md:col-span-2"><Label>Activity</Label><Input value={newActivity.activity} onChange={e => setNewActivity(prev => ({...prev, activity: e.target.value}))} /></div>
                        <div><Label>Location</Label><Input value={newActivity.location} onChange={e => setNewActivity(prev => ({...prev, location: e.target.value}))} /></div>
                        <div><Label>Dress</Label><Input value={newActivity.dress} onChange={e => setNewActivity(prev => ({...prev, dress: e.target.value}))} /></div>
                        <div className="md:col-span-2"><Label>OPI</Label><Input value={newActivity.opi} onChange={e => setNewActivity(prev => ({...prev, opi: e.target.value}))} /></div>
                    </div>
                    <Button onClick={handleAddActivity}>Add Activity</Button>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Scheduled Activities</h4>
                     <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead>OPI</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {weeklyActivities.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No weekly activities defined.</TableCell></TableRow>}
                                {weeklyActivities.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(act => (
                                    <TableRow key={act.id}>
                                        <TableCell>{formatDate(new Date(act.date.replace(/-/g, '/')), "PPP")} ({act.dayOfWeek})</TableCell>
                                        <TableCell>
                                            <p className="font-medium">{act.activity}</p>
                                            <p className="text-xs text-muted-foreground">{act.startTime} - {act.endTime} @ {act.location}</p>
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
      
      {isNewYearDialogOpen && (
        <NewYearDialog onOpenChange={setIsNewYearDialogOpen} />
      )}
    </>
  );
}
