
"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { useSettings } from "@/hooks/use-settings";
import { useCadets } from "@/hooks/use-cadets";
import type { Asset, Cadet } from "@/lib/types";
import { CreateLoanForm } from "@/components/corps-management/loans/create-loan-form";
import { LoanedItemsList } from "@/components/corps-management/loans/loaned-items-list";
import { PrintableLoanCard } from "@/components/corps-management/loans/printable-loan-card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface LoanToPrint {
  asset: Asset;
  cadet: Cadet;
}

export default function LoanManagerPage() {
  const { settings, saveSettings, isLoaded } = useSettings();
  const { cadets, isLoaded: cadetsLoaded } = useCadets();
  const { toast } = useToast();
  
  const [loanToPrint, setLoanToPrint] = useState<LoanToPrint | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleCreateLoan = async (assetId: string, cadetId: string, returnDate: Date) => {
    const asset = settings.assets.find(a => a.id === assetId);
    if (!asset) return;

    const updatedAsset: Asset = {
      ...asset,
      status: 'On Loan',
      loanedToCadetId: cadetId,
      loanDate: format(new Date(), 'yyyy-MM-dd'),
      returnDate: format(returnDate, 'yyyy-MM-dd'),
    };
    
    const updatedAssets = settings.assets.map(a => a.id === assetId ? updatedAsset : a);
    await saveSettings({ assets: updatedAssets });
    
    toast({ title: "Loan Created", description: `"${asset.name}" has been loaned to a cadet.` });
  };
  
  const handleReturnLoan = async (assetId: string) => {
      const asset = settings.assets.find(a => a.id === assetId);
      if (!asset) return;

      const updatedAsset: Asset = {
        ...asset,
        status: 'In Stock',
        loanedToCadetId: undefined,
        loanDate: undefined,
        returnDate: undefined,
      };

      const updatedAssets = settings.assets.map(a => a.id === assetId ? updatedAsset : a);
      await saveSettings({ assets: updatedAssets });
      
      toast({ title: "Asset Returned", description: `"${asset.name}" is now back in stock.` });
  };
  
  const handlePrintLoanCard = (asset: Asset, cadet: Cadet) => {
    setLoanToPrint({ asset, cadet });
    
    setTimeout(() => {
        const input = pdfRef.current;
        if (!input) return;

        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [127, 203]); // 5x8 inches
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Loan-Card-${cadet.lastName}-${asset.name}.pdf`);
            setLoanToPrint(null);
        });
    }, 100);
  };

  const loanedAssets = settings.assets.filter(a => a.status === 'On Loan' && a.loanedToCadetId);
  const availableAssets = settings.assets.filter(a => a.status === 'In Stock');

  return (
    <>
      <PageHeader
        title="Cadet Loan Manager"
        description="Create and track equipment loans for cadets."
      />
      <div className="mt-6 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreateLoanForm 
            availableAssets={availableAssets}
            cadets={cadets}
            onCreateLoan={handleCreateLoan}
            isLoaded={isLoaded && cadetsLoaded}
          />
        </div>
        <div className="lg:col-span-2">
            <LoanedItemsList
                loanedAssets={loanedAssets}
                cadets={cadets}
                onReturnLoan={handleReturnLoan}
                onPrintLoanCard={handlePrintLoanCard}
                isLoaded={isLoaded && cadetsLoaded}
            />
        </div>
      </div>
      
      <div className="absolute -top-[9999px] -left-[9999px]">
        {loanToPrint && (
            <PrintableLoanCard 
                ref={pdfRef}
                asset={loanToPrint.asset}
                cadet={loanToPrint.cadet}
                corpsName={settings.corpsName}
                corpsLogo={settings.corpsLogo}
            />
        )}
      </div>
    </>
  );
}
