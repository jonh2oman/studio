
"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import type { Award, Cadet, CadetWithAttendance } from '@/lib/types';
import { useCadets } from '@/hooks/use-cadets';
import { useSchedule } from '@/hooks/use-schedule';
import { useAwards } from '@/hooks/use-awards';
import { determineAwardEligibility } from '@/ai/flows/determine-award-eligibility-flow';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Trash2, Pencil, Loader2, Sparkles } from 'lucide-react';
import { AwardDialog } from '@/components/awards/award-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AwardsPage() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const { awards, addAward, updateAward, removeAward, winners, setWinner, removeWinner, isLoaded: awardsLoaded } = useAwards();
    const { toast } = useToast();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingAward, setEditingAward] = useState<Award | null>(null);
    const [deletingAward, setDeletingAward] = useState<Award | null>(null);

    const [aiEligibleCadets, setAiEligibleCadets] = useState<Record<string, string[] | null>>({});
    const [isCheckingEligibility, setIsCheckingEligibility] = useState<Record<string, boolean>>({});

    const trainingDates = useMemo(() => {
        if (!scheduleLoaded) return [];
        const dates = new Set<string>();
        Object.keys(schedule).forEach(slotId => {
            const dateStr = slotId.substring(0, 10);
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                dates.add(dateStr);
            }
        });
        return Array.from(dates);
    }, [schedule, scheduleLoaded]);

    const attendancePercentages = useMemo(() => {
        if (!cadetsLoaded || trainingDates.length === 0) return {};
        const percentages: { [cadetId: string]: number } = {};
        cadets.forEach(c => {
             percentages[c.id] = Math.floor(70 + Math.random() * 31); // Random % between 70 and 100
        });
        return percentages;
    }, [cadets, cadetsLoaded, trainingDates]);
    
    const handleDetermineEligibility = async (award: Award) => {
        setIsCheckingEligibility(prev => ({...prev, [award.id]: true}));
        try {
            const cadetsWithAttendance: CadetWithAttendance[] = cadets.map(c => ({
                ...c,
                attendancePercentage: attendancePercentages[c.id] || 0
            }));

            const result = await determineAwardEligibility({ award, cadets: cadetsWithAttendance });
            
            setAiEligibleCadets(prev => ({ ...prev, [award.id]: result.eligibleCadetIds }));
            
            toast({
                title: "Eligibility Check Complete",
                description: `Found ${result.eligibleCadetIds.length} eligible cadets for "${award.name}".`
            })

        } catch (error) {
            console.error("Error determining eligibility:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not determine eligibility at this time."
            })
        } finally {
            setIsCheckingEligibility(prev => ({...prev, [award.id]: false}));
        }
    }


    const groupedAwards = useMemo(() => {
        return awards.reduce((acc, award) => {
            const category = award.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(award);
            return acc;
        }, {} as Record<string, Award[]>);
    }, [awards]);
    
    const isLoading = !cadetsLoaded || !scheduleLoaded || !awardsLoaded;

    return (
        <>
            <PageHeader
                title="Awards Management"
                description="Review award criteria, view eligible cadets, and assign winners."
            >
                <Button onClick={() => setIsAddDialogOpen(true)}>Add New Award</Button>
            </PageHeader>
            <div className="mt-6 space-y-8">
                 {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : Object.keys(groupedAwards).length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Awards Found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">There are no awards to display. Click "Add New Award" to get started.</p>
                        </CardContent>
                    </Card>
                 ) : (
                    Object.entries(groupedAwards).map(([category, awardItems]) => (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle>{category} Awards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {awardItems.map(award => {
                                        const eligibleCadetIds = aiEligibleCadets[award.id];
                                        const eligibleCadets = eligibleCadetIds ? cadets.filter(c => eligibleCadetIds.includes(c.id)) : [];
                                        const winnerId = winners[award.id];
                                        const winner = cadets.find(c => c.id === winnerId);
                                        const isChecking = isCheckingEligibility[award.id];
                                        
                                        return (
                                        <AccordionItem value={award.id} key={award.id}>
                                            <AccordionTrigger className="text-lg hover:no-underline">
                                                <div className="flex flex-col text-left">
                                                    <span>{award.name}</span>
                                                    {winner && (
                                                        <span className="text-sm font-normal text-primary flex items-center gap-1">
                                                            <Crown className="h-4 w-4" /> Winner: {winner.rank} {winner.lastName}, {winner.firstName}
                                                        </span>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-6">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Description</h4>
                                                    <p className="text-muted-foreground">{award.description}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Criteria</h4>
                                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                        {award.criteria.map((c, i) => <li key={i}>{c}</li>)}
                                                    </ul>
                                                </div>
                                                {award.deadline && <p className="text-sm"><span className="font-semibold">Deadline:</span> {award.deadline}</p>}
                                                {award.approval && <p className="text-sm"><span className="font-semibold">Approval:</span> {award.approval}</p>}

                                                <div className="flex justify-between items-center border-t pt-4">
                                                     <div>
                                                        <h4 className="font-semibold">Eligible Cadets ({eligibleCadets.length > 0 ? eligibleCadets.length : '?'})</h4>
                                                        <p className="text-xs text-muted-foreground">Click the button to use AI to check eligibility.</p>
                                                     </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => setEditingAward(award)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => setDeletingAward(award)}>
                                                             <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <Button onClick={() => handleDetermineEligibility(award)} disabled={isChecking}>
                                                    {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                                    {isChecking ? "Checking..." : "Check Eligibility with AI"}
                                                </Button>

                                                {eligibleCadetIds && (
                                                    eligibleCadets.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {eligibleCadets.map(cadet => (
                                                                <div key={cadet.id} className="p-3 rounded-md border bg-background flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">{cadet.lastName}, {cadet.firstName}</p>
                                                                        <p className="text-sm text-muted-foreground">{cadet.rank} / Phase {cadet.phase}</p>
                                                                    </div>
                                                                    <Button 
                                                                        size="sm" 
                                                                        onClick={() => {
                                                                            if (winnerId === cadet.id) {
                                                                                removeWinner(award.id);
                                                                            } else {
                                                                                setWinner(award.id, cadet.id);
                                                                            }
                                                                        }}
                                                                        variant={winnerId === cadet.id ? 'default' : 'outline'}
                                                                    >
                                                                        {winnerId === cadet.id ? <Crown className="mr-2 h-4 w-4" /> : null}
                                                                        {winnerId === cadet.id ? 'Winner' : 'Select'}
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-muted-foreground text-sm">AI check complete. No cadets currently meet the eligibility criteria for this award.</p>
                                                    )
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )})}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {isAddDialogOpen && (
                <AwardDialog 
                    onSave={(data) => {
                        addAward(data as Omit<Award, 'id'>);
                        setIsAddDialogOpen(false);
                    }}
                    onOpenChange={setIsAddDialogOpen}
                />
            )}

            {editingAward && (
                 <AwardDialog 
                    award={editingAward}
                    onSave={(data) => {
                        updateAward(data as Award);
                        setEditingAward(null);
                    }}
                    onOpenChange={(isOpen) => !isOpen && setEditingAward(null)}
                />
            )}
            
            {deletingAward && (
                <AlertDialog open onOpenChange={(isOpen) => !isOpen && setDeletingAward(null)}>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this award?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This will permanently delete the "{deletingAward.name}" award. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingAward(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => {
                                removeAward(deletingAward.id);
                                setDeletingAward(null);
                            }}
                        >
                        Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
