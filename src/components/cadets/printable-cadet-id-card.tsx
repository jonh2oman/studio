
"use client";

import { forwardRef } from 'react';
import { useSettings } from '@/hooks/use-settings';
import type { Cadet } from '@/lib/types';
import { getPhaseDisplayName } from '@/lib/utils';
import { User } from 'lucide-react';

interface PrintableCadetIdCardProps {
  cadet: Cadet;
  corpsName: string;
  corpsLogo: string | undefined;
  trainingYear: string;
}

export const PrintableCadetIdCard = forwardRef<HTMLDivElement, PrintableCadetIdCardProps>(
  ({ cadet, corpsName, corpsLogo, trainingYear }, ref) => {
    const { settings } = useSettings();

    return (
      <div ref={ref} className="bg-white text-black p-0" style={{ width: '337.5px', height: '212.5px', fontFamily: 'Arial, sans-serif' }}>
        <div className="flex flex-col h-full border-2 border-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary text-primary-foreground p-2" style={{ backgroundColor: '#003366', color: 'white' }}>
                {corpsLogo ? (
                    <img src={corpsLogo} alt="Corps Logo" className="h-10 w-10 object-contain bg-white rounded-sm p-0.5" />
                ) : (
                    <div className="h-10 w-10"></div>
                )}
                <div className="text-center">
                    <h1 className="text-sm font-bold uppercase tracking-wider">{corpsName}</h1>
                    <h2 className="text-xs uppercase">Cadet Identification</h2>
                </div>
                <div className="h-10 w-10"></div>
            </div>

            {/* Body */}
            <div className="flex-grow flex p-2 gap-3">
                <div className="w-1/3 flex-shrink-0 flex items-center justify-center border border-gray-300 bg-gray-100 rounded-md">
                    {/* Placeholder for photo */}
                    <User className="h-16 w-16 text-gray-400" />
                </div>
                <div className="flex-grow grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                    <div className="col-span-2">
                        <p className="text-gray-500 uppercase text-[10px]">Name</p>
                        <p className="font-bold text-sm truncate">{cadet.lastName}, {cadet.firstName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 uppercase text-[10px]">Rank</p>
                        <p className="font-semibold">{cadet.rank}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 uppercase text-[10px]">Level/Phase</p>
                        <p className="font-semibold">{getPhaseDisplayName(settings.element, cadet.phase)}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 uppercase text-[10px]">Date of Birth</p>
                        <p className="font-semibold">{cadet.dateOfBirth || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 uppercase text-[10px]">Training Year</p>
                        <p className="font-semibold">{trainingYear}</p>
                    </div>
                </div>
            </div>

             {/* Footer Bar */}
             <div className="h-3 w-full" style={{ backgroundColor: '#fdb813' }}></div>
        </div>
      </div>
    );
  }
);
PrintableCadetIdCard.displayName = 'PrintableCadetIdCard';
