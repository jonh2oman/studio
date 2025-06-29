
"use client";

import { useState, useRef } from 'react';
import { LdaPlanner } from "@/components/lda/lda-planner";
import { Button } from '@/components/ui/button';
import { Menu, FileDown, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

export default function LdaPage() {
  const [objectivesVisible, setObjectivesVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGeneratePdf = async () => {
    const input = plannerRef.current;
    if (!input) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not find planner content to capture.' });
      return;
    }

    setIsGenerating(true);
    
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
      const imgProps = pdf.getImageProperties(imgData);
      
      const ratio = pdfWidth / imgProps.width;
      const pdfHeight = imgProps.height * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('LDA-Day-Plan.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({ variant: 'destructive', title: 'PDF Generation Failed', description: 'There was an error creating the PDF file.' });
    } finally {
      setIsGenerating(false);
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
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-headline">LDA Day Planner</h1>
                <p className="text-muted-foreground mt-1">Plan single ad-hoc training days. Schedules here are shared with all other planners.</p>
            </div>
        </div>
      </div>
      <div ref={plannerRef} className="flex-1 overflow-y-auto pt-6">
        <LdaPlanner objectivesVisible={objectivesVisible} />
      </div>
    </div>
  );
}
