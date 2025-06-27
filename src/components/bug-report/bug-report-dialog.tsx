
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const reportSchema = z.object({
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  feature: z.string().min(1, "Please select the relevant page or feature."),
  steps: z.string().min(10, "Please provide detailed steps to reproduce the bug."),
  expected: z.string().min(1, "Please describe what you expected to happen."),
  actual: z.string().min(1, "Please describe what actually happened."),
  comments: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface BugReportDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const features = [
    "Dashboard", "Planner (Annual)", "Planner (Weekend)", "Planner (LDA)",
    "Cadet Management", "Attendance", "Awards", "Reports", "Settings",
    "Authentication (Login/Signup)", "Other"
];

export function BugReportDialog({ isOpen, onOpenChange }: BugReportDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const form = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            email: user?.email || '',
            feature: '',
            steps: '',
            expected: '',
            actual: '',
            comments: '',
        }
    });

    const onSubmit = (data: ReportFormData) => {
        const subject = `Bug Report: ${data.feature}`;
        const body = `
--- Bug Report ---

[IMPORTANT: Please do not change the content below this line. Just click "Send".]

User Email: ${data.email || 'Not Provided'}
Page/Feature: ${data.feature}

Steps to Reproduce:
${data.steps}

Expected Behavior:
${data.expected}

Actual Behavior:
${data.actual}

Additional Comments:
${data.comments || 'N/A'}
        `;

        const mailtoLink = `mailto:jonathan@waterman.work?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(mailtoLink, '_blank');

        toast({
            title: "Thank You for Your Report!",
            description: "Your email client has been opened with a pre-filled bug report. Please send the email to complete the submission.",
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report a Bug</DialogTitle>
                    <DialogDescription>
                        Thank you for helping improve the application. Please provide as much detail as possible.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <ScrollArea className="h-[60vh] p-1">
                            <div className="space-y-6 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Email (Optional)</FormLabel>
                                            <FormControl><Input placeholder="So we can contact you if needed" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="feature" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Page / Feature</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select an area..." /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {features.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="steps" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Steps to Reproduce</FormLabel>
                                        <FormControl><Textarea placeholder="1. Go to '...' page.&#10;2. Click on '...' button.&#10;3. See error." {...field} rows={4} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="expected" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected Behavior</FormLabel>
                                        <FormControl><Textarea placeholder="I expected the form to submit successfully." {...field} rows={2} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="actual" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Actual Behavior</FormLabel>
                                        <FormControl><Textarea placeholder="The application crashed and showed an error message." {...field} rows={2} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="comments" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Additional Comments</FormLabel>
                                        <FormControl><Textarea placeholder="Any other information, like the browser you're using, can be helpful." {...field} rows={2} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </ScrollArea>
                        <DialogFooter className="pt-6 pr-4">
                            <FormDescription className="text-xs text-left flex-1">Submitting will open your default email client.</FormDescription>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit">Prepare Report</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
