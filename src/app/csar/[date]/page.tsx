
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
import type { CsarDetails, DayMetadata } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type CsarFormData = CsarDetails & { activityDate: Date };

export default function EditCsarPage() {
    const router = useRouter();
    const params = useParams();
    const date = params.date as string;

    const { dayMetadata, updateDayMetadata, isLoaded } = useSchedule();
    const { updateCurrentYearData } = useTrainingYear();
    const { toast } = useToast();
    const plannerRef = useRef<CsarPlannerRef>(null);

    const csarData = useMemo(() => {
        if (!isLoaded || !date) return null;
        return dayMetadata[date];
    }, [dayMetadata, date, isLoaded]);

    const handleSaveCsar = (originalDate: string, formData: CsarFormData) => {
        const { activityDate, ...csarDetailsToSave } = formData;
        const newDateStr = format(activityDate, 'yyyy-MM-dd');

        if (originalDate === newDateStr) {
            // Date hasn't changed, just update metadata
            const currentMetadata = dayMetadata[originalDate] || { csarRequired: false, csarSubmitted: false, csarApproved: false };
            const newMetadata: DayMetadata = { ...currentMetadata, csarDetails: csarDetailsToSave };
            updateDayMetadata(originalDate, newMetadata);
            toast({ title: "CSAR Saved" });
        } else {
            // Date has changed, move the object
            if (dayMetadata[newDateStr]?.csarDetails) {
                toast({ variant: 'destructive', title: "Move Failed", description: `A CSAR already exists for ${format(activityDate, 'PPP')}.` });
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
            toast({ title: "CSAR Moved", description: `Plan moved to ${format(activityDate, 'PPP')}` });
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
    const activityDate = new Date(date.replace(/-/g, '/'));

    return (
        <>
            <PageHeader
                title={`Editing CSAR: ${csarDetails.activityName}`}
                description={format(activityDate, 'EEEE, MMMM dd, yyyy')}
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
                    initialData={csarDetails}
                    activityDate={activityDate}
                    onSave={(data) => handleSaveCsar(date, data as CsarFormData)}
                />
            </div>
        </>
    )
}
