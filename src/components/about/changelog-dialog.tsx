
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { changelogData } from "@/lib/changelog-data";
import { Badge } from "@/components/ui/badge";

interface ChangelogDialogProps {
    children: React.ReactNode;
    onOpenChange: (open: boolean) => void;
    isOpen: boolean;
}

export function ChangelogDialog({ children, isOpen, onOpenChange }: ChangelogDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Application Changelog</DialogTitle>
                    <DialogDescription>A record of all notable changes made to the application.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-6">
                    <div className="space-y-8">
                        {changelogData.map((entry) => (
                            <div key={entry.version}>
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="text-xl font-bold">{entry.version}</h3>
                                    <Badge variant="outline">{entry.date}</Badge>
                                </div>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    {entry.changes.map((change, index) => (
                                        <li key={index}>{change}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
