"use client";

import { useState, useRef } from 'react';
import Planner from '@/components/planner/planner';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PlannerPage() {
  const [viewMode, setViewMode] = useState('month');
  const [objectivesVisible, setObjectivesVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = async () => {
    const input = plannerRef.current;
    if (!input) return;

    setIsGenerating(true);
    const originalViewMode = viewMode;

    try {
        // Switch to 'year' view for the most comprehensive PDF, if not already there.
        if (originalViewMode !== 'year') {
            setViewMode('year');
            // Give the DOM time to update with the new view mode
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const canvas = await html2canvas(input, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a3',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        pdf.save('CSTP-Annual-Plan.pdf');

    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        setIsGenerating(false);
        // Switch back to the original view mode
        if (originalViewMode !== 'year') {
            setViewMode(originalViewMode);
        }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b bg-background/95 pb-6 backdrop-blur-sm">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 print:hidden">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setObjectivesVisible(!objectivesVisible)}
                            className="bg-card hover:bg-muted shadow-md"
                        >
                            <Menu className="mr-2 h-4 w-4" />
                            PO's / EO's
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Click to show/hide POs & EOs</p>
                    </TooltipContent>
                </Tooltip>
                <Button onClick={handleGeneratePdf} variant="outline" size="sm" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                  Generate PDF
                </Button>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">CSTP - Annual</h1>
                <p className="text-muted-foreground mt-1">Drag and drop lessons to build your training year schedule.</p>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-6">
        <Planner 
          printRef={plannerRef}
          viewMode={viewMode} 
          objectivesVisible={objectivesVisible} 
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}
