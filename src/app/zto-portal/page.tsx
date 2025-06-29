
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useZtoPortal } from '@/hooks/use-zto-portal';
import { ImportPlanDialog } from '@/components/zto/import-plan-dialog';
import { Loader2, PlusCircle, Trash2, View } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { ZtoReviewedPlan } from '@/lib/types';
import { StaticCalendarView } from '@/components/zto/static-calendar-view';

export default function ZtoPortalPage() {
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const { isLoaded, reviewedPlans, addPlan, removePlan } = useZtoPortal();
    const [viewingPlan, setViewingPlan] = useState<ZtoReviewedPlan | null>(null);
    
    return (
        <Sheet>
            <PageHeader
                title="ZTO Plan Review Portal"
                description="Import and review training plans from corps and squadrons in your zone."
            >
                <Button onClick={() => setIsImportDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Import Plan
                </Button>
            </PageHeader>
            
            <div className="mt-8">
                {!isLoaded ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : reviewedPlans.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">No Plans Imported</h3>
                        <p className="text-muted-foreground mt-2">Click "Import Plan" to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviewedPlans.map(plan => (
                            <Card key={plan.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.corpsName}</CardTitle>
                                    <CardDescription>Training Year: {plan.trainingYear}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">
                                       Element: <span className="font-semibold text-foreground">{plan.element}</span>
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the imported plan for "{plan.corpsName}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => removePlan(plan.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                     <SheetTrigger asChild>
                                        <Button variant="outline" onClick={() => setViewingPlan(plan)}>
                                            <View className="mr-2 h-4 w-4" />
                                            View Plan
                                        </Button>
                                    </SheetTrigger>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {isImportDialogOpen && (
                <ImportPlanDialog 
                    isOpen={isImportDialogOpen}
                    onOpenChange={setIsImportDialogOpen}
                    onImport={addPlan}
                />
            )}
            
            <SheetContent className="w-full sm:max-w-full h-full max-h-full flex flex-col p-0">
                {viewingPlan && (
                    <>
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>Reviewing: {viewingPlan.corpsName} ({viewingPlan.trainingYear})</SheetTitle>
                        </SheetHeader>
                        <div className="overflow-auto flex-grow">
                           <StaticCalendarView plan={viewingPlan} />
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
