
"use client";

import { useSave } from '@/hooks/use-save-context';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function FloatingSaveButton() {
  const { triggerSave, isSaveAvailable } = useSave();

  if (!isSaveAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-24 z-50 print:hidden">
       <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={triggerSave}>
            <Save className="h-7 w-7" />
            <span className="sr-only">Save</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
            <p>Save Changes</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
