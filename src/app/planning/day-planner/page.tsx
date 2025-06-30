
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { ObjectivesPanel } from '@/components/planning/objectives-panel';
import { useSchedule } from '@/hooks/use-schedule';
import { useSettings } from '@/hooks/use-settings';
import type { ScheduledItem } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { getPhaseDisplayName } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Simplified card for displaying a scheduled item. No drag logic.
function ScheduledEoCard({ slotId, item }: { slotId: string; item: ScheduledItem }) {
    const { updateScheduleItem, removeScheduleItem } = useSchedule();
    const [instructor, setInstructor] = useState(item.instructor);
    const [classroom, setClassroom] = useState(item.classroom);

    return (
        <div className="relative p-3 rounded-md min-h-[6rem] border flex flex-col justify-center transition-colors bg-background/80 shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-7 w-7" onClick={(e) => { e.stopPropagation(); removeScheduleItem(slotId); }}>
                <X className="h-4 w-4" />
            </Button>
            <p className="font-bold text-sm pr-4">{item.eo?.id ? item.eo.id.split('-').slice(1).join('-') : 'Invalid EO'}</p>
            <p className="text-xs text-muted-foreground leading-tight mb-2 pr-4">{item.eo?.title || 'No Title'}</p>
            <div className="text-xs space-y-1 mt-auto">
                <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} onBlur={() => updateScheduleItem(slotId, { instructor })} className="h-6 text-xs" placeholder="Instructor" onClick={(e) => e.stopPropagation()} />
                <Input value={classroom} onChange={(e) => setClassroom(e.target.value)} onBlur={() => updateScheduleItem(slotId, { classroom })} className="h-6 text-xs" placeholder="Location" onClick={(e) => e.stopPropagation()} />
            </div>
        </div>
    );
}

// Clickable slot in the grid.
function PlannerSlot({ slotId, item, isSelected, onSelect }: { slotId: string; item?: ScheduledItem; isSelected: boolean; onSelect: () => void; }) {
    return (
        <div 
            className={cn(
                "relative p-3 rounded-md min-h-[6rem] border flex flex-col justify-center items-center transition-colors text-center cursor-pointer",
                isSelected && "ring-2 ring-primary ring-offset-2",
                item ? "bg-background" : "bg-muted/30 border-dashed hover:bg-primary/10"
            )}
            onClick={onSelect}
        >
            {item ? (
                 <div className="w-full">
                    <ScheduledEoCard slotId={slotId} item={item} />
                 </div>
            ) : (
                <span className="text-xs text-muted-foreground">Click to select slot</span>
            )}
        </div>
    );
}

export default function DayPlannerPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const { schedule, dayMetadata, updateDayMetadata } = useSchedule();
    const { settings } = useSettings();

    const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : '';
    const metadata = dateStr ? dayMetadata[dateStr] || {} : {};

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-8">
            <ObjectivesPanel selectedSlotId={selectedSlotId} />
            <div className="flex-1 flex flex-col">
                <PageHeader title="Day / Weekend Planner" description="Plan training for non-parade nights. Click a slot, then add an EO." />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 flex-1">
                    <div className="lg:col-span-1">
                            <Card>
                            <CardHeader>
                                <CardTitle>Select a Date</CardTitle>
                                <CardDescription>Pick a date to start planning.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                        setSelectedSlotId(null); // Reset selected slot when date changes
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                            <ScrollArea className="h-full pr-4 -mr-4">
                            {selectedDate ? (
                                    <Card>
                                    <CardHeader>
                                        <CardTitle>{format(selectedDate, "EEEE, MMMM dd, yyyy")}</CardTitle>
                                            <Alert className="mt-4">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>CSAR Status</AlertTitle>
                                            <AlertDescription>
                                                Use these toggles for visual tracking. For detailed planning, please use the main CSAR Planning module.
                                            </AlertDescription>
                                        </Alert>
                                        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
                                            <div className="flex items-center space-x-2">
                                                <Switch id="csar-required" checked={metadata.csarRequired} onCheckedChange={(checked) => updateDayMetadata(dateStr, { csarRequired: checked })} />
                                                <Label htmlFor="csar-required">CSAR Required?</Label>
                                            </div>
                                            {metadata.csarRequired && (
                                                <>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch id="csar-submitted" checked={metadata.csarSubmitted} onCheckedChange={(checked) => updateDayMetadata(dateStr, { csarSubmitted: checked })} />
                                                        <Label htmlFor="csar-submitted">CSAR Submitted</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch id="csar-approved" checked={metadata.csarApproved} onCheckedChange={(checked) => updateDayMetadata(dateStr, { csarApproved: checked })} />
                                                        <Label htmlFor="csar-approved">CSAR Approved</Label>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(period => (
                                                <div key={period} className="space-y-2">
                                                    <h4 className="font-semibold text-center text-muted-foreground text-sm">Period {period}</h4>
                                                    <div className="space-y-2 rounded-lg bg-background p-2">
                                                        {[1, 2, 3, 4].map(phase => {
                                                            const slotId = `${dateStr}-${period}-${phase}`;
                                                            return (
                                                                <div key={phase}>
                                                                    <p className="font-medium text-sm mb-1">{getPhaseDisplayName(settings.element, phase)}</p>
                                                                    <PlannerSlot 
                                                                        slotId={slotId}
                                                                        item={schedule[slotId]}
                                                                        isSelected={selectedSlotId === slotId}
                                                                        onSelect={() => setSelectedSlotId(slotId)}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">Select a date from the calendar to begin planning.</p>
                                </div>
                            )}
                            </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
