

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSchedule } from '@/hooks/use-schedule';
import { useTrainingYear } from '@/hooks/use-training-year';
import { CsarPlanner, CsarPlannerRef } from '@/components/csar/csar-planner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { format } from 'date-fns';
import type { CsarDetails, DayMetadata, TrainingYearData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type CsarFormData = Omit<CsarDetails, 'activityStartDate' | 'activityEndDate'> & {
    activityStartDate: Date;
    activityEndDate: Date;
};

export default function EditCsarPage() {
    const router = useRouter();
    const params = useParams();
    const date = params.date as string;

    const { dayMetadata, updateDayMetadata, updateCurrentYearData } = useSchedule();
    const { isLoaded } = useTrainingYear();
    const { toast } = useToast();
    const plannerRef = useRef<CsarPlannerRef>(null);

    const csarData = useMemo(() => {
        if (!isLoaded || !date) return null;
        return dayMetadata[date];
    }, [dayMetadata, date, isLoaded]);

    const handleSaveCsar = (originalDate: string, formData: CsarFormData) => {
        const { activityStartDate, activityEndDate, ...restOfDetails } = formData;
    
        // Convert dates back to strings for storage
        const csarDetailsToSave = {
            ...restOfDetails,
            activityStartDate: format(activityStartDate, 'yyyy-MM-dd'),
            activityEndDate: format(activityEndDate, 'yyyy-MM-dd'),
        };

        const newDateStr = format(activityStartDate, 'yyyy-MM-dd');
        
        if (originalDate === newDateStr) {
            // Date hasn't changed, just update metadata
            const currentMetadata = dayMetadata[originalDate] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
            const newMetadata: DayMetadata = { ...currentMetadata, csarDetails: csarDetailsToSave };
            updateDayMetadata(originalDate, newMetadata);
            toast({ title: "CSAR Saved" });
        } else {
            // Date has changed, move the object
            if (dayMetadata[newDateStr]?.csarDetails) {
                toast({ variant: 'destructive', title: "Move Failed", description: `A CSAR already exists for ${format(activityStartDate, 'PPP')}.` });
                return;
            }

            const metadataToMove = dayMetadata[originalDate];
            if (!metadataToMove) return; // Should not happen

            // Create new metadata object for new date, using newly edited details
            const newMetadataForNewDate: DayMetadata = {
                ...metadataToMove,
                csarDetails: csarDetailsToSave,
            };
            
            const finalDayMetadata = { ...dayMetadata };
            finalDayMetadata[newDateStr] = newMetadataForNewDate;
            delete finalDayMetadata[originalDate]; // Remove the old entry

            updateCurrentYearData({ dayMetadata: finalDayMetadata });
            toast({ title: "CSAR Moved", description: `Plan moved to ${format(activityStartDate, 'PPP')}` });
            router.push(`/csar/${newDateStr}`);
        }
    };
    
    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!csarData || !csarData.csarDetails) {
        return (
            <>
                <PageHeader title="CSAR Not Found" />
                <div className="mt-8 text-center">
                    <p>Could not find a CSAR for the specified date.</p>
                    <Button onClick={() => router.push('/csar')} className="mt-4">Back to CSAR Planning</Button>
                </div>
            </>
        )
    }

    const { csarDetails } = csarData;
    
    const initialStartDate = csarDetails.activityStartDate
        ? new Date(csarDetails.activityStartDate.replace(/-/g, '/'))
        : new Date(date.replace(/-/g, '/'));
    const initialEndDate = csarDetails.activityEndDate
        ? new Date(csarDetails.activityEndDate.replace(/-/g, '/'))
        : initialStartDate;

    const pageTitle = csarDetails.activityStartDate && csarDetails.activityEndDate && csarDetails.activityStartDate !== csarDetails.activityEndDate
        ? `${format(initialStartDate, 'MMM dd')} - ${format(initialEndDate, 'MMM dd, yyyy')}`
        : format(initialStartDate, 'EEEE, MMMM dd, yyyy');

    return (
        <>
            <PageHeader
                title={`Editing CSAR: ${csarDetails.activityName}`}
                description={pageTitle}
            >
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/csar')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </Button>
                    <Button onClick={() => plannerRef.current?.submit()}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </PageHeader>
            <div className="mt-8">
                 <CsarPlanner
                    ref={plannerRef}
                    key={date}
                    initialData={{
                        ...csarDetails,
                        activityStartDate: initialStartDate,
                        activityEndDate: initialEndDate
                    }}
                    onSave={(data) => handleSaveCsar(date, data)}
                />
            </div>
        </>
    )
}
