
"use client";

import { forwardRef } from 'react';
import { format } from 'date-fns';
import { trainingData } from '@/lib/data';
import type { Schedule, Settings } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WroPreviewProps {
    data: any;
    logo: string | null;
    schedule: Schedule;
    corpsName: string;
}

const nightSchedule = [
  { time: "1900-1930", period: 1 },
  { time: "1930-2000", period: 2 },
  { time: "2015-2045", period: 3 },
];

export const WroPreview = forwardRef<HTMLDivElement, WroPreviewProps>(({ data, logo, schedule, corpsName }, ref) => {
    
    const getScheduledItem = (period: number, phase: number) => {
        if (!data.trainingDate) return null;
        const dateStr = format(data.trainingDate, 'yyyy-MM-dd');
        const slotId = `${dateStr}-${period}-${phase}`;
        return schedule[slotId];
    }
    
    return (
        <div ref={ref} className="bg-white text-black p-12" style={{ width: '8.5in', minHeight: '11in' }}>
            <header className="flex justify-between items-center border-b-2 border-black pb-4">
                <div>
                    <h1 className="text-2xl font-bold">{corpsName}</h1>
                    <h2 className="text-xl">Weekly Routine Orders</h2>
                </div>
                {logo && <img src={logo} alt="Corps Logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
            </header>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 my-4 text-sm">
                <div><strong>Date:</strong> {data.trainingDate ? format(data.trainingDate, 'EEEE, dd MMMM yyyy') : ''}</div>
                <div><strong>RO #:</strong> {data.roNumber}</div>
                <div><strong>Duty Officer:</strong> {data.dutyOfficerName} {data.dutyOfficerPhone && `(${data.dutyOfficerPhone})`}</div>
                <div><strong>Duty PO:</strong> {data.dutyPOName} {data.dutyPOPhone && `(${data.dutyPOPhone})`}</div>
                <div className="col-span-2"><strong>Duty Officer Email:</strong> {data.dutyOfficerEmail}</div>
                <div><strong>Alternate Duty PO:</strong> {data.alternateDutyPO}</div>
                <div><strong>Duty Watch:</strong> {data.dutyWatch}</div>
                <div><strong>Dress (CAF):</strong> {data.dressCaf}</div>
                <div><strong>Dress (Cadets):</strong> {data.dressCadets}</div>
            </div>

            <section className="my-6">
                <h3 className="text-lg font-bold border-b border-black mb-2">TIMINGS</h3>
                <ul className="list-disc list-inside">
                    <li>1830: Arrival</li>
                    <li>1845-1900: Opening Parade</li>
                    <li>2000-2015: Break</li>
                    <li>2045-2115: Closing Parade</li>
                    <li>2115: Dismissal</li>
                </ul>
            </section>
            
            <section className="my-6">
                <h3 className="text-lg font-bold border-b border-black mb-2">TRAINING SCHEDULE</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-black">Time</TableHead>
                            <TableHead className="text-black">Phase 1</TableHead>
                            <TableHead className="text-black">Phase 2</TableHead>
                            <TableHead className="text-black">Phase 3</TableHead>
                            <TableHead className="text-black">Phase 4</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {nightSchedule.map(({ time, period }) => (
                           <TableRow key={period}>
                               <TableCell className="font-medium text-black">{time}</TableCell>
                               {[1,2,3,4].map(phase => {
                                   const item = getScheduledItem(period, phase);
                                   return (
                                       <TableCell key={phase} className="text-black">
                                           {item ? (
                                               <div>
                                                   <p className="font-bold">{item.eo?.id ? item.eo.id.split('-').slice(1).join('-') : 'Invalid EO'}</p>
                                                   <p className="text-xs">{item.eo?.title || 'No Title'}</p>
                                                   <p className="text-xs italic">Inst: {item.instructor || 'TBA'}</p>
                                                   <p className="text-xs italic">Loc: {item.classroom || 'TBA'}</p>
                                               </div>
                                           ) : '-'}
                                       </TableCell>
                                   )
                               })}
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </section>
            
            {(data.upcomingActivities && data.upcomingActivities.length > 0) &&
                <section className="my-6 break-inside-avoid">
                    <h3 className="text-lg font-bold border-b border-black mb-2">UPCOMING ACTIVITIES</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black">Activity</TableHead>
                                <TableHead className="text-black">Start</TableHead>
                                <TableHead className="text-black">End</TableHead>
                                <TableHead className="text-black">Location</TableHead>
                                <TableHead className="text-black">Dress</TableHead>
                                <TableHead className="text-black">OPI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.upcomingActivities.map((act: any) => (
                                <TableRow key={act.id}>
                                    <TableCell className="text-black">{act.activity}</TableCell>
                                    <TableCell className="text-black">{act.activityStart}</TableCell>
                                    <TableCell className="text-black">{act.activityEnd}</TableCell>
                                    <TableCell className="text-black">{act.location}</TableCell>
                                    <TableCell className="text-black">{act.dress}</TableCell>
                                    <TableCell className="text-black">{act.opi}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            }

             <section className="my-6 break-inside-avoid">
                <h3 className="text-lg font-bold border-b border-black mb-2">ANNOUNCEMENTS</h3>
                <p className="text-sm whitespace-pre-wrap">{data.announcements || 'Nil.'}</p>
            </section>
            
             <section className="my-6 break-inside-avoid">
                <h3 className="text-lg font-bold border-b border-black mb-2">NOTES</h3>
                <p className="text-sm whitespace-pre-wrap">{data.notes || 'Nil.'}</p>
            </section>

            <footer className="pt-16">
                 <div className="mt-16 border-t-2 border-black pt-2 w-1/2">
                    <p>{data.coName}</p>
                    <p className="text-sm">Commanding Officer</p>
                </div>
            </footer>
        </div>
    );
});

WroPreview.displayName = "WroPreview";
