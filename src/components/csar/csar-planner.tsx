

"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CsarDetails } from "@/lib/types";
import { format } from 'date-fns';
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
import { Trash2, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Badge } from "@/components/ui/badge";
import { defaultYearData } from "@/hooks/use-training-year";
import { useToast } from "@/hooks/use-toast";

const j4ItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const mealPlanItemSchema = z.object({
  id: z.string(),
  dateRequired: z.date({ required_error: "Date is required." }),
  timeRequired: z.string().min(1, "Time is required."),
  mealType: z.enum(["boxed lunches", "Fresh Rations (corps/sqn)", "fresh Rations (RCSU)", "Hay Boxes", "IMP (Corps/sqn)", "IMP (RCSU)", "meal allowance", "Messing", "other", ""], {errorMap: () => ({ message: "Please select a meal type." })}),
  mealTime: z.enum(["Between Meal Supplement", "Breakfast", "Lunch", "supper", ""], {errorMap: () => ({ message: "Please select a meal time." })}),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  reservationHandledBy: z.enum(["Corps/Squadron", "RCSU", "Not Applicable", ""], {errorMap: () => ({ message: "Please select an option." })}),
  quoteReceived: z.boolean(),
  amount: z.coerce.number().optional(),
  vendor: z.string().optional(),
  comments: z.string().optional(),
});

const csarDetailsSchema = z.object({
  activityStartDate: z.date({ required_error: "Start date is required" }),
  activityEndDate: z.date({ required_error: "End date is required" }),
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
  mealPlan: z.array(mealPlanItemSchema),
  j4Plan: z.object({
    quartermasterLocation: z.string().optional(),
    items: z.array(j4ItemSchema),
    submitted: z.boolean(),
    approved: z.boolean(),
  }),
}).refine(data => data.activityEndDate >= data.activityStartDate, {
    message: "End date must be on or after start date.",
    path: ["activityEndDate"],
});

type CsarFormData = z.infer<typeof csarDetailsSchema>;

interface CsarPlannerProps {
  initialData: CsarFormData;
  onSave: (data: CsarFormData) => void;
}

export interface CsarPlannerRef {
  submit: () => void;
}

export const CsarPlanner = forwardRef<CsarPlannerRef, CsarPlannerProps>(({ initialData, onSave }, ref) => {
  const form = useForm<CsarFormData>({
    resolver: zodResolver(csarDetailsSchema),
    defaultValues: initialData,
  });

  const { fields: j4Fields, append: appendJ4, remove: removeJ4 } = useFieldArray({
    control: form.control,
    name: "j4Plan.items",
  });
  
  const { fields: mealFields, append: appendMeal, remove: removeMeal } = useFieldArray({
    control: form.control,
    name: "mealPlan",
  });

  const watchFields = form.watch();

  const totalCadets = useMemo(() => Number(watchFields.numCadetsMale || 0) + Number(watchFields.numCadetsFemale || 0), [watchFields.numCadetsMale, watchFields.numCadetsFemale]);
  const totalStaff = useMemo(() => Number(watchFields.numStaffMale || 0) + Number(watchFields.numStaffFemale || 0), [watchFields.numStaffMale, watchFields.numStaffFemale]);

  const onSubmit = (data: CsarFormData) => {
    onSave(data);
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      form.handleSubmit(onSubmit)();
    }
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-transparent">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6 -mr-6">
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
                      <div></div>
                       <FormField
                        control={form.control}
                        name="activityStartDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="activityEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Meal Planner</CardTitle>
                                <CardDescription>Add meal requirements for the activity.</CardDescription>
                            </div>
                            <Button type="button" onClick={() => appendMeal({ 
                                id: crypto.randomUUID(),
                                dateRequired: new Date(),
                                timeRequired: '12:00',
                                mealType: '',
                                mealTime: 'Lunch',
                                quantity: totalCadets + totalStaff || 1,
                                reservationHandledBy: '',
                                quoteReceived: false,
                                amount: 0,
                                vendor: '',
                                comments: ''
                            })}>Add Meal Request</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mealFields.length === 0 && <p className="text-muted-foreground text-center py-8">No meal requests added yet.</p>}
                        {mealFields.map((field, index) => {
                            const quoteReceived = form.watch(`mealPlan.${index}.quoteReceived`);
                            return (
                                <Card key={field.id} className="p-4 pt-6 relative bg-muted/30">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeMeal(index)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove Meal Request</span>
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Controller
                                            name={`mealPlan.${index}.dateRequired`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col"><FormLabel>Date Required</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant={"outline"} className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                                    </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name={`mealPlan.${index}.timeRequired`} render={({ field }) => (<FormItem><FormLabel>Time Required</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`mealPlan.${index}.quantity`} render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        
                                        <FormField control={form.control} name={`mealPlan.${index}.mealTime`} render={({ field }) => (<FormItem><FormLabel>Meal Time</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Breakfast">Breakfast</SelectItem><SelectItem value="Lunch">Lunch</SelectItem><SelectItem value="supper">Supper</SelectItem><SelectItem value="Between Meal Supplement">Between Meal Supplement</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`mealPlan.${index}.mealType`} render={({ field }) => (<FormItem><FormLabel>Meal Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="boxed lunches">Boxed Lunches</SelectItem><SelectItem value="Fresh Rations (corps/sqn)">Fresh Rations (Corps/Sqn)</SelectItem><SelectItem value="fresh Rations (RCSU)">Fresh Rations (RCSU)</SelectItem><SelectItem value="Hay Boxes">Hay Boxes</SelectItem><SelectItem value="IMP (Corps/sqn)">IMP (Corps/Sqn)</SelectItem><SelectItem value="IMP (RCSU)">IMP (RCSU)</SelectItem><SelectItem value="meal allowance">Meal Allowance</SelectItem><SelectItem value="Messing">Messing</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name={`mealPlan.${index}.reservationHandledBy`} render={({ field }) => (<FormItem><FormLabel>Reservation Handled By</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Corps/Squadron">Corps/Squadron</SelectItem><SelectItem value="RCSU">RCSU</SelectItem><SelectItem value="Not Applicable">Not Applicable</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                        
                                        <FormField control={form.control} name={`mealPlan.${index}.vendor`} render={({ field }) => (<FormItem><FormLabel>Vendor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        
                                        <div className="space-y-2">
                                             <FormField control={form.control} name={`mealPlan.${index}.quoteReceived`} render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 pt-6"><FormLabel className="text-sm">Quote Received?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                             {quoteReceived && <FormField control={form.control} name={`mealPlan.${index}.amount`} render={({ field }) => (<FormItem><FormLabel>Amount ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                        </div>

                                        <FormField control={form.control} name={`mealPlan.${index}.comments`} render={({ field }) => (<FormItem className="lg:col-span-3"><FormLabel>Other Comments</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>)} />

                                    </div>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="j4" className="mt-4 space-y-6">
                 <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                          <CardTitle>J4 Plan</CardTitle>
                          {watchFields.j4Plan?.submitted && watchFields.j4Plan?.approved && (
                              <Badge variant="outline" className="text-green-600 border-green-600/60 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-500/60">
                                  <CheckCircle className="mr-1.5 h-4 w-4" />
                                  Approved
                              </Badge>
                          )}
                      </div>
                    </CardHeader>
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
                              <Button type="button" onClick={() => appendJ4({ id: crypto.randomUUID(), description: "", quantity: 1 })}>Add Item</Button>
                          </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {j4Fields.map((field, index) => (
                          <div key={field.id} className="flex items-end gap-4 p-3 border rounded-md">
                             <FormField control={form.control} name={`j4Plan.items.${index}.description`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Item Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={form.control} name={`j4Plan.items.${index}.quantity`} render={({ field }) => (<FormItem className="w-24"><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <Button type="button" variant="destructive" size="icon" onClick={() => removeJ4(index)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                        {j4Fields.length === 0 && <p className="text-muted-foreground text-center py-4">No items added yet.</p>}
                      </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
});

CsarPlanner.displayName = "CsarPlanner";
