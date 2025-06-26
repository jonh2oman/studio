"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "@/hooks/use-settings";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


const settingsSchema = z.object({
  trainingDay: z.coerce.number().min(0).max(6),
  corpsName: z.string().min(1, "Corps name is required"),
  firstTrainingNight: z.date({ required_error: "First training night is required" }),
});

export default function SettingsPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const { toast } = useToast();
  const [newInstructor, setNewInstructor] = useState("");
  const [newClassroom, setNewClassroom] = useState("");

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: {
      trainingDay: settings.trainingDay,
      corpsName: settings.corpsName,
      // Correctly handle YYYY-MM-DD format to avoid timezone issues by replacing hyphens.
      firstTrainingNight: new Date(settings.firstTrainingNight.replace(/-/g, '/')),
    },
  });

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    const settingsToSave = {
      ...data,
      firstTrainingNight: format(data.firstTrainingNight, 'yyyy-MM-dd'),
    };
    saveSettings(settingsToSave);
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


  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      />
      <div className="mt-6 space-y-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Training Schedule</CardTitle>
            <CardDescription>
              Set the primary training night and corps information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                     <FormField
                      control={form.control}
                      name="firstTrainingNight"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>First Training Night</FormLabel>
                           <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            This will be the first date shown in the planner.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            ) : (
                <p>Loading settings...</p>
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

      </div>
    </>
  );
}
