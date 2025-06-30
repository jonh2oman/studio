
"use client";

import { forwardRef } from 'react';
import { format } from 'date-fns';
import type { Asset, Cadet } from '@/lib/types';

interface PrintableLoanCardProps {
  asset: Asset;
  cadet: Cadet;
  corpsName: string;
  corpsLogo: string | undefined;
}

export const PrintableLoanCard = forwardRef<HTMLDivElement, PrintableLoanCardProps>(
  ({ asset, cadet, corpsName, corpsLogo }, ref) => {
    return (
      <div ref={ref} className="bg-white text-black p-6 font-sans" style={{ width: '5in', height: '8in', display: 'flex', flexDirection: 'column' }}>
        <header className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <div>
            <h1 className="text-lg font-bold">{corpsName}</h1>
            <h2 className="text-md">Equipment Loan Agreement</h2>
          </div>
          {corpsLogo && <img src={corpsLogo} alt="Corps Logo" className="w-20 h-20 object-contain" />}
        </header>
        
        <main className="flex-grow space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border p-3">
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Cadet</h3>
                    <p>{cadet.rank} {cadet.firstName} {cadet.lastName}</p>
                </div>
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Loan Date</h3>
                    <p>{asset.loanDate ? format(new Date(asset.loanDate.replace(/-/g, '/')), 'dd MMMM yyyy') : 'N/A'}</p>
                </div>
                 <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Asset Loaned</h3>
                    <p>{asset.name}</p>
                </div>
                 <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Return Date</h3>
                    <p>{asset.returnDate ? format(new Date(asset.returnDate.replace(/-/g, '/')), 'dd MMMM yyyy') : 'N/A'}</p>
                </div>
                 <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Asset / Serial #</h3>
                    <p>{asset.assetId} / {asset.serialNumber || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Condition</h3>
                    <p>{asset.condition}</p>
                </div>
            </div>

            <div>
                <h3 className="font-bold mb-1">Terms and Conditions</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                    I, the undersigned cadet, acknowledge receipt of the asset listed above. I understand that this item is the property of the Department of National Defence and is on loan to me for the purpose of my training with the Canadian Cadet Organizations.
                    I agree to take all reasonable measures to care for and maintain this item. I will report any damage or loss to the corps/squadron Supply Officer immediately.
                    I understand that I am financially responsible for the replacement cost of the item if it is lost, stolen, or damaged beyond normal wear and tear due to my own negligence.
                    I agree to return the item in good condition on or before the specified return date.
                </p>
            </div>
        </main>
        
        <footer className="pt-8">
            <div className="flex justify-between gap-8 text-sm">
                <div className="w-1/2">
                    <div className="border-t border-black pt-1">Cadet Signature</div>
                </div>
                <div className="w-1/2">
                    <div className="border-t border-black pt-1">Staff Member Signature</div>
                </div>
            </div>
        </footer>
      </div>
    );
  }
);
PrintableLoanCard.displayName = 'PrintableLoanCard';
