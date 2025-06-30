
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { useTrainingYear } from '@/hooks/use-training-year';
import { CsarPlanner } from '@/components/csar/csar-planner';
import type { CsarDetails, DayMetadata } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CreateCsarDialog } from '@/components/csar/create-csar-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PlannedCsar {
    date: string;
    details: CsarDetails;
    metadata: DayMetadata;
}

export default function CsarPage() {
    const { dayMetadata, updateDayMetadata, isLoaded: scheduleLoaded } = useSchedule();
    const { currentYearData, updateCurrentYearData, isLoaded: yearLoaded } = useTrainingYear();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCsar, setEditingCsar] = useState<PlannedCsar | null>(null);
    const { toast } = useToast();

    const plannedCsars = useMemo<PlannedCsar[]>(() => {
        if (!dayMetadata) return [];
        return Object.entries(dayMetadata)
            .filter(([, meta]) => meta.csarDetails)
            .map(([date, meta]) => ({ date, details: meta.csarDetails!, metadata: meta }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [dayMetadata]);

    const handleCreateCsar = (name: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        if (dayMetadata[dateStr]?.csarDetails) {
            toast({ variant: 'destructive', title: "CSAR Exists", description: "A CSAR plan already exists for this date." });
            return;
        }

        const newCsarDetails: CsarDetails = {
            ...(currentYearData?.csarDetails || {}), // Start with default CSAR structure
            activityName: name,
        };

        const currentMetadata = dayMetadata[dateStr] || {};
        const newMetadata: DayMetadata = {
            ...currentMetadata,
            csarDetails: newCsarDetails,
        };
        
        updateDayMetadata(dateStr, newMetadata);
        toast({ title: "CSAR Created", description: `Plan for "${name}" on ${format(date, 'PPP')} has been created.`});
    };
    
    const handleSaveCsar = (date: string, data: CsarDetails) => {
        const currentMetadata = dayMetadata[date];
        if (!currentMetadata) return;
        const newMetadata: DayMetadata = { ...currentMetadata, csarDetails: data };
        updateDayMetadata(date, newMetadata);
        toast({ title: "CSAR Saved", description: `Changes for ${format(new Date(date.replace(/-/g,'/')), 'PPP')} have been saved.`});
    };

    const handleDeleteCsar = (date: string) => {
        const dayData = dayMetadata[date];
        if (!dayData || !dayData.csarDetails) return;

        const csarName = dayData.csarDetails.activityName;
        // Create a new object for the day, omitting csarDetails
        const { csarDetails, ...restOfDayData } = dayData;

        // Create a new copy of the entire dayMetadata object, excluding the day to be modified/deleted
        const { [date]: _, ...newDayMetadata } = dayMetadata;

        if (Object.keys(restOfDayData).length > 0) {
            // If there are other properties for that day (e.g., dress), add the day back without csarDetails
            newDayMetadata[date] = restOfDayData;
        }
        // If csarDetails was the only property, the day is now fully removed.
        
        updateCurrentYearData({ dayMetadata: newDayMetadata });
        toast({ variant: 'destructive', title: 'CSAR Deleted', description: `The plan for "${csarName}" has been deleted.`});
    };
    
    const isLoading = !scheduleLoaded || !yearLoaded;

    return (
        <>
            <PageHeader
                title="CSAR Planning"
                description="Create and manage Cadet Support and Activity Requests."
            >
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New CSAR
                </Button>
            </PageHeader>

            <Sheet open={!!editingCsar} onOpenChange={(isOpen) => !isOpen && setEditingCsar(null)}>
                <div className="mt-8">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : plannedCsars.length === 0 ? (
                        <Card className="text-center">
                            <CardHeader><CardTitle>No CSARs Planned</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground py-16">Click "Create New CSAR" to get started.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plannedCsars.map(csar => (
                                <Card key={csar.date} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{csar.details.activityName}</CardTitle>
                                        <CardDescription>{format(new Date(csar.date.replace(/-/g, '/')), 'EEEE, MMMM dd, yyyy')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        {/* Future summary content can go here */}
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the CSAR for "{csar.details.activityName}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteCsar(csar.date)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button onClick={() => setEditingCsar(csar)}><Edit className="mr-2 h-4 w-4"/> Edit Plan</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                
                <SheetContent className="w-full sm:max-w-4xl p-0">
                    {editingCsar && (
                        <>
                            <SheetHeader className="p-6 border-b">
                                <SheetTitle>Editing CSAR: {editingCsar.details.activityName}</SheetTitle>
                                <SheetDescription>
                                    {format(new Date(editingCsar.date.replace(/-/g, '/')), 'EEEE, MMMM dd, yyyy')}
                                </SheetDescription>
                            </SheetHeader>
                            <CsarPlanner
                                key={editingCsar.date} // Force re-render on selection change
                                initialData={editingCsar.details}
                                onSave={(data) => handleSaveCsar(editingCsar.date, data)}
                                startDate={format(new Date(editingCsar.date.replace(/-/g, '/')), "PPP")}
                                endDate={format(new Date(editingCsar.date.replace(/-/g, '/')), "PPP")}
                            />
                        </>
                    )}
                </SheetContent>
            </Sheet>

            <CreateCsarDialog 
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreate={handleCreateCsar}
            />
        </>
    );
}
