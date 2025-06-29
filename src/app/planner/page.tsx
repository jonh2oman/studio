
"use client";

import { useState, useRef, useCallback } from 'react';
import Planner from '@/components/planner/planner';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export default function PlannerPage() {
  const [viewMode, setViewMode] = useState('month');
  const [objectivesVisible, setObjectivesVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGeneratePdf = useCallback(async () => {
    const input = plannerRef.current;
    if (!input) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find planner content to capture.' });
      return;
    }

    setIsGenerating(true);
    const originalViewMode = viewMode;

    // Temporarily switch to 'year' view to capture everything
    if (originalViewMode !== 'year') {
      setViewMode('year');
      // Wait for the DOM to update
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        width: input.scrollWidth,
        height: input.scrollHeight,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
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
      
      const ratio = pdfWidth / imgWidth;
      const scaledImgHeight = imgHeight * ratio;

      let heightLeft = scaledImgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
      heightLeft -= pdfHeight;
      
      // Add subsequent pages if the content is taller than one page
      while (heightLeft > 0) {
        position = heightLeft - scaledImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('CSTP-Annual-Plan.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ variant: 'destructive', title: 'PDF Generation Failed', description: 'There was an error creating the PDF file.' });
    } finally {
      setIsGenerating(false);
      // Switch back to the original view
      if (originalViewMode !== 'year') {
        setViewMode(originalViewMode);
      }
    }
  }, [viewMode, toast]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 border-b bg-background/70 backdrop-blur-xl pb-6">
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
          ref={plannerRef}
          viewMode={viewMode} 
          objectivesVisible={objectivesVisible} 
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}
