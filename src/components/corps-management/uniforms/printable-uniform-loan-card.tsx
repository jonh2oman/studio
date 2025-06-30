"use client";

import { forwardRef } from 'react';
import { format } from 'date-fns';
import type { IssuedUniformItem, UniformItem, Cadet } from '@/lib/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface PrintableUniformLoanCardProps {
  issuedItemsWithData: { issuedItem: IssuedUniformItem; uniformItem: UniformItem }[];
  cadet: Cadet;
  corpsName: string;
  corpsLogo: string | undefined;
}

export const PrintableUniformLoanCard = forwardRef<HTMLDivElement, PrintableUniformLoanCardProps>(
  ({ issuedItemsWithData, cadet, corpsName, corpsLogo }, ref) => {
    return (
      <div ref={ref} className="bg-white text-black p-6 font-sans" style={{ width: '5in', height: '8in', display: 'flex', flexDirection: 'column' }}>
        <header className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <div>
            <h1 className="text-lg font-bold">{corpsName}</h1>
            <h2 className="text-md">Uniform Loan Agreement</h2>
          </div>
          {corpsLogo && <img src={corpsLogo} alt="Corps Logo" className="w-20 h-20 object-contain" />}
        </header>
        
        <main className="flex-grow space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border p-3 mb-4">
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Cadet</h3>
                    <p>{cadet.rank} {cadet.firstName} {cadet.lastName}</p>
                </div>
                <div>
                    <h3 className="font-bold text-xs uppercase text-gray-500">Print Date</h3>
                    <p>{format(new Date(), 'dd MMMM yyyy')}</p>
                </div>
            </div>

             <div>
                <h3 className="font-bold mb-1">Items Loaned</h3>
                <div className="border rounded-md">
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-black font-bold h-8">Item</TableHead>
                                <TableHead className="text-black font-bold h-8">Size</TableHead>
                                <TableHead className="text-black font-bold h-8">Issue Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issuedItemsWithData.map(({ issuedItem, uniformItem }) => (
                                <TableRow key={issuedItem.id}>
                                    <TableCell className="py-1">{uniformItem.name}</TableCell>
                                    <TableCell className="py-1">{uniformItem.size}</TableCell>
                                    <TableCell className="py-1">{format(new Date(issuedItem.issueDate.replace(/-/g, '/')), 'dd MMM yyyy')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
                </div>
            </div>

            <div className="pt-2">
                <h3 className="font-bold mb-1">Terms and Conditions</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                    I, the undersigned cadet, acknowledge receipt of the uniform item(s) listed above. I understand that these items are the property of the Department of National Defence and are on loan to me for the purpose of my training with the Canadian Cadet Organizations.
                    I agree to take all reasonable measures to care for and maintain these items. I will report any damage or loss to the corps/squadron Supply Officer immediately.
                    I understand that I am financially responsible for the replacement cost of any item if it is lost, stolen, or damaged beyond normal wear and tear due to my own negligence.
                    I agree to return all items in good condition upon my departure from the cadet program or when requested to do so by the corps/squadron staff.
                </p>
            </div>
        </main>
        
        <footer className="pt-8 mt-auto">
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
PrintableUniformLoanCard.displayName = 'PrintableUniformLoanCard';
