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
import { useEffect } from "react";

const settingsSchema = z.object({
  trainingDay: z.coerce.number().min(0).max(6),
  corpsName: z.string().min(1, "Corps name is required"),
});

export default function SettingsPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: {
      trainingDay: settings.trainingDay,
      corpsName: settings.corpsName,
    },
  });

  useEffect(() => {
    if (isLoaded) {
      form.reset(settings);
    }
  }, [isLoaded, settings, form]);

  const onSubmit = (data: z.infer<typeof settingsSchema>) => {
    saveSettings(data);
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the application to your corps' needs."
      />
      <div className="mt-6">
        <Card className="max-w-2xl">
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
                  <FormField
                    control={form.control}
                    name="trainingDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Night</FormLabel>
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
            ) : (
                <p>Loading settings...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
