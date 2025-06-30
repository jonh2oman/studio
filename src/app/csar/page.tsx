
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSchedule } from '@/hooks/use-schedule';
import { useTrainingYear } from '@/hooks/use-training-year';
import { CsarPlanner } from '@/components/csar/csar-planner';
import type { CsarDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function CsarPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const { dayMetadata, updateCsarDetails, isLoaded: scheduleLoaded } = useSchedule();
    const { isLoaded: yearLoaded } = useTrainingYear();
    const { toast } = useToast();

    const handleSaveCsar = (data: CsarDetails) => {
        if (!selectedDate) return;
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        updateCsarDetails(dateStr, data);
        toast({ title: "CSAR Saved", description: `Changes for ${format(selectedDate, 'PPP')} have been saved.`});
    };
    
    const csarDetailsForDate = selectedDate ? dayMetadata[format(selectedDate, 'yyyy-MM-dd')]?.csarDetails : undefined;

    const isLoading = !scheduleLoaded || !yearLoaded;

    return (
        <>
            <PageHeader
                title="CSAR Planning"
                description="Create and manage Cadet Support and Activity Requests for your training days."
            >
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date to plan</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </PageHeader>

            <div className="mt-8">
                {isLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : selectedDate ? (
                     <CsarPlanner
                        key={format(selectedDate, 'yyyy-MM-dd')} // Force re-render on date change
                        initialData={csarDetailsForDate}
                        onSave={handleSaveCsar}
                        startDate={format(selectedDate, "PPP")}
                        endDate={format(selectedDate, "PPP")}
                     />
                ) : (
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle>Select a Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground py-16">Please pick a date to start planning its CSAR.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
