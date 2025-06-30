
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Edit, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useSchedule } from '@/hooks/use-schedule';
import { useTrainingYear } from '@/hooks/use-training-year';
import { CsarPlanner } from '@/components/csar/csar-planner';
import type { CsarDetails, DayMetadata } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CreateCsarDialog } from '@/components/csar/create-csar-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlannedCsar {
    date: string;
    details: CsarDetails;
    metadata: DayMetadata;
}

export default function CsarPage() {
    const { dayMetadata, updateDayMetadata } = useSchedule();
    const { isLoaded: yearLoaded } = useTrainingYear();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCsar, setEditingCsar] = useState<PlannedCsar | null>(null);
    const { toast } = useToast();

    const plannedCsars = useMemo<PlannedCsar[]>(() => {
        if (!dayMetadata) return [];
        return Object.entries(dayMetadata)
            .filter(([, meta]) => meta.csarDetails)
            .map(([date, meta]) => ({ date, details: meta.csarDetails!, metadata: meta }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [dayMetadata]);

    const handleCreateCsar = (name: string, date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        if (dayMetadata[dateStr]?.csarDetails) {
            toast({ variant: 'destructive', title: "CSAR Exists", description: "A CSAR plan already exists for this date." });
            return;
        }

        const newCsarDetails: CsarDetails = {
            activityName: name,
            activityLocation: '',
            startTime: '09:00',
            endTime: '17:00',
            isMultiUnit: false,
            numCadetsMale: 0,
            numCadetsFemale: 0,
            numStaffMale: 0,
            numStaffFemale: 0,
            transportRequired: false,
            transportation: { schoolBus44: 0, cruiser55: 0 },
            supportVehiclesRequired: false,
            supportVehicles: { van8: 0, crewCab: 0, cubeVan: 0, miniVan7: 0, panelVan: 0, staffCar: 0 },
            fuelCardRequired: false,
            accommodationsRequired: false,
            accommodation: { cost: 0 },
            mealsRequired: false,
            mealPlan: [],
            j4Plan: { submitted: false, approved: false, items: [] },
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

    const isLoading = !yearLoaded;

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
                                        <div className="flex flex-wrap gap-2">
                                            {csar.metadata.csarSubmitted && (
                                                <Badge variant={csar.metadata.csarApproved ? "default" : "secondary"} className={cn(csar.metadata.csarApproved && "bg-green-600 hover:bg-green-600/90")}>
                                                    CSAR {csar.metadata.csarApproved ? 'Approved' : 'Submitted'}
                                                </Badge>
                                            )}
                                            {csar.details.j4Plan.submitted && (
                                                <Badge variant={csar.details.j4Plan.approved ? "default" : "secondary"} className={cn(csar.details.j4Plan.approved && "bg-green-600 hover:bg-green-600/90")}>
                                                    J4 {csar.details.j4Plan.approved ? 'Approved' : 'Submitted'}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button onClick={() => setEditingCsar(csar)}><Edit className="mr-2 h-4 w-4"/> Edit Plan</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                
                <SheetContent className="w-full sm:max-w-4xl p-0 h-full flex flex-col">
                    {editingCsar && (
                        <>
                            <SheetHeader className="p-6 border-b flex-shrink-0">
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
