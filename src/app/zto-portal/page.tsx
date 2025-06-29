
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useZtoPortal } from '@/hooks/use-zto-portal';
import { ImportPlanDialog } from '@/components/zto/import-plan-dialog';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ZtoPortalPage() {
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const { isLoaded, reviewedPlans, addPlan, removePlan } = useZtoPortal();
    
    return (
        <>
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
                            <Card key={plan.id}>
                                <CardHeader>
                                    <CardTitle>{plan.corpsName}</CardTitle>
                                    <CardDescription>Training Year: {plan.trainingYear}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        This card will eventually show a summary or a link to view the static calendar.
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end">
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
        </>
    );
}
