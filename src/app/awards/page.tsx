
"use client";

import { useState, useMemo, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import type { Award, Cadet, CadetWithAttendance } from '@/lib/types';
import { useCadets } from '@/hooks/use-cadets';
import { useSchedule } from '@/hooks/use-schedule';
import { useAwards } from '@/hooks/use-awards';
import { determineAwardEligibility } from '@/ai/flows/determine-award-eligibility-flow';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Trash2, Pencil, Loader2, Sparkles, Upload, Download } from 'lucide-react';
import { AwardDialog } from '@/components/awards/award-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/use-settings';
import { getPhaseDisplayName } from '@/lib/utils';

export default function AwardsPage() {
    const { cadets, isLoaded: cadetsLoaded } = useCadets();
    const { schedule, isLoaded: scheduleLoaded } = useSchedule();
    const { awards, addAward, updateAward, removeAward, winners, addWinner, removeWinner, isLoaded: awardsLoaded, importAwards } = useAwards();
    const { toast } = useToast();
    const { settings } = useSettings();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingAward, setEditingAward] = useState<Award | null>(null);
    const [deletingAward, setDeletingAward] = useState<Award | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        const headers = ['name', 'category', 'description', 'eligibility', 'criteria', 'deadline', 'approval'];
        const exampleRow = [
            '"Example Corps Award"',
            '"Corps"',
            '"An award for being an example."',
            '"All cadets are eligible."',
            '"Criterion 1|Criterion 2|Criterion 3"',
            '""',
            '""'
        ];

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + exampleRow.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "awards_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const rows = text.split('\n').filter(row => row.trim() !== '');
                if (rows.length < 2) {
                    throw new Error("CSV file must have a header and at least one data row.");
                }
                const header = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const requiredHeaders = ['name', 'category', 'description', 'eligibility', 'criteria'];
                if (!requiredHeaders.every(h => header.includes(h))) {
                    throw new Error(`CSV must contain the following headers: ${requiredHeaders.join(', ')}`);
                }

                const newAwards: Omit<Award, 'id'>[] = [];
                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.trim().replace(/"/g, '')) || [];
                    if (values.length === 0) continue;
                    
                    const awardData: any = {};
                    header.forEach((h, index) => {
                        awardData[h] = values[index] || '';
                    });
                    
                    if (!awardData.name || !awardData.category || !awardData.description || !awardData.eligibility || !awardData.criteria) {
                        toast({ variant: 'destructive', title: `Import Error on row ${i + 1}`, description: "Skipping row due to missing required fields." });
                        continue;
                    }
                    
                    if (awardData.category !== 'National' && awardData.category !== 'Corps') {
                        toast({ variant: 'destructive', title: `Import Error on row ${i + 1}`, description: `Invalid category: ${awardData.category}. Must be 'National' or 'Corps'.` });
                        continue;
                    }

                    newAwards.push({
                        name: awardData.name,
                        category: awardData.category as 'National' | 'Corps',
                        description: awardData.description,
                        eligibility: awardData.eligibility,
                        criteria: awardData.criteria.split('|').map((c: string) => c.trim()).filter(Boolean),
                        deadline: awardData.deadline || '',
                        approval: awardData.approval || '',
                    });
                }
                
                if (newAwards.length > 0) {
                    const importedCount = importAwards(newAwards);
                    toast({ title: "Import Complete", description: `${importedCount} new awards were added. ${newAwards.length - importedCount} duplicates were skipped.` });
                } else {
                     toast({ variant: "destructive", title: "Import Failed", description: "No valid awards were found in the file." });
                }

            } catch (error: any) {
                 toast({ variant: "destructive", title: "Import Failed", description: error.message || "An unknown error occurred while parsing the file." });
            } finally {
                if (event.target) {
                    event.target.value = '';
                }
            }
        };
        reader.readAsText(file);
    };


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
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                    </Button>
                    <Button variant="outline" onClick={handleFileImportClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Awards
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv"
                        className="hidden"
                    />
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add New Award</Button>
                </div>
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
                                        const winnerIds = winners[award.id] || [];
                                        const currentWinners = cadets.filter(c => winnerIds.includes(c.id));
                                        const isChecking = isCheckingEligibility[award.id];
                                        
                                        return (
                                        <AccordionItem value={award.id} key={award.id}>
                                            <AccordionTrigger className="text-lg hover:no-underline">
                                                <div className="flex flex-col text-left">
                                                    <span>{award.name}</span>
                                                     {currentWinners.length > 0 && (
                                                        <span className="text-sm font-normal text-primary flex items-center gap-2 flex-wrap">
                                                            <Crown className="h-4 w-4" /> 
                                                            Winner{currentWinners.length > 1 ? 's' : ''}: {currentWinners.map(w => `${w.rank} ${w.lastName}`).join(', ')}
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
                                                            {eligibleCadets.map(cadet => {
                                                                const isWinner = winnerIds.includes(cadet.id);
                                                                return (
                                                                    <div key={cadet.id} className="p-3 rounded-md border bg-background flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-medium">{cadet.lastName}, {cadet.firstName}</p>
                                                                            <p className="text-sm text-muted-foreground">{cadet.rank} / {getPhaseDisplayName(settings.element, cadet.phase)}</p>
                                                                        </div>
                                                                        <Button 
                                                                            size="sm" 
                                                                            onClick={() => {
                                                                                if (isWinner) {
                                                                                    removeWinner(award.id, cadet.id);
                                                                                } else {
                                                                                    addWinner(award.id, cadet.id);
                                                                                }
                                                                            }}
                                                                            variant={isWinner ? 'default' : 'outline'}
                                                                        >
                                                                            {isWinner ? <Crown className="mr-2 h-4 w-4" /> : null}
                                                                            {isWinner ? 'Winner' : 'Select'}
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            })}
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
