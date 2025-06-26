
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CsarDetails } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";

const j4ItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const csarDetailsSchema = z.object({
  activityName: z.string().min(1, "Activity name is required"),
  activityType: z.enum(["discretionary_supported", "elemental_training", "fundamental_supported", ""]).optional(),
  activityLocation: z.string().min(1, "Activity location is required"),
  startTime: z.string(),
  endTime: z.string(),
  isMultiUnit: z.boolean(),
  multiUnitDetails: z.string().optional(),
  numCadetsMale: z.coerce.number().min(0),
  numCadetsFemale: z.coerce.number().min(0),
  numStaffMale: z.coerce.number().min(0),
  numStaffFemale: z.coerce.number().min(0),
  transportRequired: z.boolean(),
  transportation: z.object({
    schoolBus44: z.coerce.number().min(0),
    cruiser55: z.coerce.number().min(0),
  }),
  supportVehiclesRequired: z.boolean(),
  supportVehicles: z.object({
    van8: z.coerce.number().min(0),
    crewCab: z.coerce.number().min(0),
    cubeVan: z.coerce.number().min(0),
    miniVan7: z.coerce.number().min(0),
    panelVan: z.coerce.number().min(0),
    staffCar: z.coerce.number().min(0),
  }),
  fuelCardRequired: z.boolean(),
  accommodationsRequired: z.boolean(),
  accommodation: z.object({
    type: z.enum(["military", "commercial", "private", ""]).optional(),
    cost: z.coerce.number().min(0),
  }),
  mealsRequired: z.boolean(),
  mealPlanDetails: z.string().optional(),
  j4Plan: z.object({
    quartermasterLocation: z.string().optional(),
    items: z.array(j4ItemSchema),
    submitted: z.boolean(),
    approved: z.boolean(),
  }),
});

interface CsarPlannerProps {
  initialData: CsarDetails;
  onSave: (data: CsarDetails) => void;
  onClose: () => void;
  startDate: string;
  endDate: string;
}

export function CsarPlanner({ initialData, onSave, onClose, startDate, endDate }: CsarPlannerProps) {
  const form = useForm<CsarDetails>({
    resolver: zodResolver(csarDetailsSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "j4Plan.items",
  });
  
  const watchFields = form.watch();

  const totalCadets = useMemo(() => Number(watchFields.numCadetsMale || 0) + Number(watchFields.numCadetsFemale || 0), [watchFields.numCadetsMale, watchFields.numCadetsFemale]);
  const totalStaff = useMemo(() => Number(watchFields.numStaffMale || 0) + Number(watchFields.numStaffFemale || 0), [watchFields.numStaffMale, watchFields.numStaffFemale]);

  const onSubmit = (data: CsarDetails) => {
    onSave(data);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-background">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">CSAR Details</TabsTrigger>
                <TabsTrigger value="meals" disabled={!watchFields.mealsRequired}>Meal Plan</TabsTrigger>
                <TabsTrigger value="j4">J4 Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-6">
                <Card>
                  <CardHeader><CardTitle>Activity Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="activityName" render={({ field }) => (<FormItem><FormLabel>Activity Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="activityType" render={({ field }) => (<FormItem><FormLabel>Activity Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="discretionary_supported">LDA Discretionary Supported Day</SelectItem><SelectItem value="elemental_training">LDA Elemental Training Weekend/Day</SelectItem><SelectItem value="fundamental_supported">LDA - Fundamental Supported Day</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="activityLocation" render={({ field }) => (<FormItem><FormLabel>Activity Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <div className="flex gap-4">
                          <div className="w-1/2"><Label>Start Date</Label><Input value={startDate} disabled /></div>
                          <div className="w-1/2"><Label>End Date</Label><Input value={endDate} disabled /></div>
                      </div>
                       <FormField control={form.control} name="startTime" render={({ field }) => (<FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={form.control} name="endTime" render={({ field }) => (<FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="isMultiUnit" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Multi-Unit Activity?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    {watchFields.isMultiUnit && <FormField control={form.control} name="multiUnitDetails" render={({ field }) => (<FormItem><FormLabel>Unit Number & Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Personnel</CardTitle><CardDescription>Enter the number of expected participants.</CardDescription></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="numCadetsMale" render={({ field }) => (<FormItem><FormLabel># Male Cadets</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name="numCadetsFemale" render={({ field }) => (<FormItem><FormLabel># Female Cadets</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name="numStaffMale" render={({ field }) => (<FormItem><FormLabel># Male Staff</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name="numStaffFemale" render={({ field }) => (<FormItem><FormLabel># Female Staff</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                      </div>
                       <div className="grid grid-cols-3 gap-4 font-medium text-sm border-t pt-4">
                          <p>Total Cadets: {totalCadets}</p>
                          <p>Total Staff: {totalStaff}</p>
                          <p>Total All: {totalCadets + totalStaff}</p>
                      </div>
                  </CardContent>
                </Card>

                <Card>
                   <CardHeader><CardTitle>Logistics</CardTitle></CardHeader>
                   <CardContent className="space-y-6">
                      <FormField control={form.control} name="transportRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Transportation Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                      {watchFields.transportRequired && (
                          <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 ml-2">
                             <FormField control={form.control} name="transportation.schoolBus44" render={({ field }) => (<FormItem><FormLabel># of 44 Pass. School Bus</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="transportation.cruiser55" render={({ field }) => (<FormItem><FormLabel># of 55 Pass. Cruiser</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                          </div>
                      )}
                      
                      <FormField control={form.control} name="supportVehiclesRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Support Vehicles Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                       {watchFields.supportVehiclesRequired && (
                          <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 ml-2">
                             <FormField control={form.control} name="supportVehicles.van8" render={({ field }) => (<FormItem><FormLabel># of 8 Pass. Van</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="supportVehicles.crewCab" render={({ field }) => (<FormItem><FormLabel># of Crew Cab Truck</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="supportVehicles.cubeVan" render={({ field }) => (<FormItem><FormLabel># of Cube Van</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="supportVehicles.miniVan7" render={({ field }) => (<FormItem><FormLabel># of 7 Pass. Mini Van</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="supportVehicles.panelVan" render={({ field }) => (<FormItem><FormLabel># of Panel Van</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                             <FormField control={form.control} name="supportVehicles.staffCar" render={({ field }) => (<FormItem><FormLabel># of Staff Car</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                          </div>
                      )}
                      
                      <FormField control={form.control} name="fuelCardRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Fuel Card Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                      
                      <FormField control={form.control} name="accommodationsRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Accommodations Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                       {watchFields.accommodationsRequired && (
                          <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 ml-2">
                             <FormField control={form.control} name="accommodation.type" render={({ field }) => (<FormItem><FormLabel>Facility Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="military">Military Facility</SelectItem><SelectItem value="commercial">Commercial Facility</SelectItem><SelectItem value="private">Private Facility</SelectItem></SelectContent></Select></FormItem>)} />
                             <FormField control={form.control} name="accommodation.cost" render={({ field }) => (<FormItem><FormLabel>Proposed Cost</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>)} />
                          </div>
                      )}
                      
                      <FormField control={form.control} name="mealsRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Meals Required?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                   </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="meals" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Meal Planner</CardTitle>
                    <CardDescription>This feature is coming soon. For now, please describe your meal plan below.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="mealPlanDetails" render={({ field }) => (<FormItem><FormLabel>Meal Plan Details</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="j4" className="mt-4 space-y-6">
                 <Card>
                    <CardHeader><CardTitle>J4 Plan</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={form.control} name="j4Plan.quartermasterLocation" render={({ field }) => (<FormItem><FormLabel>J4 Quartermaster Location</FormLabel><FormControl><Input {...field} placeholder="e.g., Regional Warehouse" /></FormControl></FormItem>)} />
                      <div className="flex gap-8">
                        <FormField control={form.control} name="j4Plan.submitted" render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 pt-2"><FormLabel>List Submitted?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                        <FormField control={form.control} name="j4Plan.approved" render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 pt-2"><FormLabel>List Approved?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                      </div>
                    </CardContent>
                 </Card>
                 <Card>
                      <CardHeader>
                          <div className="flex justify-between items-center">
                              <div>
                                  <CardTitle>Items Required</CardTitle>
                                  <CardDescription>List all equipment and supplies needed.</CardDescription>
                              </div>
                              <Button type="button" onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1 })}>Add Item</Button>
                          </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex items-end gap-4 p-3 border rounded-md">
                             <FormField control={form.control} name={`j4Plan.items.${index}.description`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Item Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name={`j4Plan.items.${index}.quantity`} render={({ field }) => (<FormItem className="w-24"><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                        {fields.length === 0 && <p className="text-muted-foreground text-center py-4">No items added yet.</p>}
                      </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
        <div className="p-4 border-t flex justify-end gap-2 bg-background">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save CSAR Plan</Button>
        </div>
      </form>
    </Form>
  );
}
