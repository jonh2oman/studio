
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TrainingYearData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

const importSchema = z.object({
  corpsName: z.string().min(1, 'Corps name is required'),
});

type ImportFormData = z.infer<typeof importSchema>;

interface ImportPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (corpsName: string, planData: TrainingYearData) => void;
}

export function ImportPlanDialog({ isOpen, onOpenChange, onImport }: ImportPlanDialogProps) {
  const { toast } = useToast();
  const [fileData, setFileData] = useState<TrainingYearData | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
    defaultValues: { corpsName: '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && typeof data.firstTrainingNight === 'string' && Array.isArray(data.cadets) && typeof data.schedule === 'object') {
          setFileData(data);
          toast({ title: 'File Ready', description: `"${file.name}" has been loaded.` });
        } else {
          throw new Error('Invalid file format.');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Import Error', description: 'The selected file is not a valid training year export.' });
        setFileData(null);
        setFileName('');
      }
    };
    reader.readAsText(file);
  };

  const onSubmit = (data: ImportFormData) => {
    if (!fileData) {
      toast({ variant: 'destructive', title: 'File Required', description: 'Please upload a training year file.' });
      return;
    }
    onImport(data.corpsName, fileData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Training Plan</DialogTitle>
          <DialogDescription>Give the plan a name and upload the `.json` file provided by the corps.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="corpsName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corps/Squadron Name</FormLabel>
                  <FormControl><Input placeholder="e.g., 288 Ardent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Training Plan File</FormLabel>
              <div className="flex items-center gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="mr-2 h-4 w-4" /> Upload File
                </Button>
                {fileName && <Badge variant="secondary">{fileName}</Badge>}
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Import Plan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
