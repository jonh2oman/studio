
"use client";

import { forwardRef } from 'react';
import { format } from 'date-fns';
import { useSettings } from '@/hooks/use-settings';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Cadet } from '@/lib/types';

interface PrintableAttendanceSheetProps {
  cadets: Cadet[];
  date: Date;
}

export const PrintableAttendanceSheet = forwardRef<HTMLDivElement, PrintableAttendanceSheetProps>(
  ({ cadets, date }, ref) => {
    const { settings } = useSettings();

    return (
      <div ref={ref} className="bg-white text-black p-8" style={{ width: '8.5in' }}>
        <header className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{settings.corpsName || 'Corps Name'}</h1>
            <h2 className="text-xl">Attendance Sheet</h2>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{format(date, 'EEEE, dd MMMM yyyy')}</p>
          </div>
        </header>

        <main>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] text-black font-bold">Cadet Name</TableHead>
                <TableHead className="w-[20%] text-black font-bold">Rank</TableHead>
                <TableHead className="text-center w-[10%] text-black font-bold">Present</TableHead>
                <TableHead className="text-center w-[10%] text-black font-bold">Absent</TableHead>
                <TableHead className="text-center w-[10%] text-black font-bold">Excused</TableHead>
                <TableHead className="text-center w-[10%] text-black font-bold">Late</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cadets.sort((a,b) => a.lastName.localeCompare(b.lastName)).map(cadet => (
                <TableRow key={cadet.id}>
                  <TableCell className="text-black py-3">{cadet.lastName}, {cadet.firstName}</TableCell>
                  <TableCell className="text-black py-3">{cadet.rank}</TableCell>
                  <TableCell className="text-center py-3"><div className="w-5 h-5 border border-black mx-auto" /></TableCell>
                  <TableCell className="text-center py-3"><div className="w-5 h-5 border border-black mx-auto" /></TableCell>
                  <TableCell className="text-center py-3"><div className="w-5 h-5 border border-black mx-auto" /></TableCell>
                  <TableCell className="text-center py-3"><div className="w-5 h-5 border border-black mx-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    );
  }
);
PrintableAttendanceSheet.displayName = 'PrintableAttendanceSheet';
