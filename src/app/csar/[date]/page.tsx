
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSchedule } from '@/hooks/use-schedule';
import { CsarPlanner, CsarPlannerRef } from '@/components/csar/csar-planner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { format } from 'date-fns';
import type { CsarDetails, DayMetadata } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function EditCsarPage() {
    const router = useRouter();
    const params = useParams();
    const date = params.date as string;

    const { dayMetadata, updateDayMetadata, isLoaded } = useSchedule();
    const { toast } = useToast();
    const plannerRef = useRef<CsarPlannerRef>(null);

    const csarData = useMemo(() => {
        if (!isLoaded || !date) return null;
        return dayMetadata[date];
    }, [dayMetadata, date, isLoaded]);

    const handleSaveCsar = (date: string, data: CsarDetails) => {
        const currentMetadata = dayMetadata[date];
        if (!currentMetadata) return;
        const newMetadata: DayMetadata = { ...currentMetadata, csarDetails: data };
        updateDayMetadata(date, newMetadata);
        toast({ title: "CSAR Saved", description: `Changes for ${format(new Date(date.replace(/-/g,'/')), 'PPP')} have been saved.`});
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

    return (
        <>
            <PageHeader
                title={`Editing CSAR: ${csarDetails.activityName}`}
                description={format(new Date(date.replace(/-/g, '/')), 'EEEE, MMMM dd, yyyy')}
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
                    onSave={(data) => handleSaveCsar(date, data)}
                    startDate={format(new Date(date.replace(/-/g, '/')), "PPP")}
                    endDate={format(new Date(date.replace(/-/g, '/')), "PPP")}
                />
            </div>
        </>
    )
}
