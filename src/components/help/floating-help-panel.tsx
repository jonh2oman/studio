
'use client';

import React, { useState, useMemo } from "react";
import { useHelp } from "@/hooks/use-help";
import { Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { changelogData } from "@/lib/changelog-data";
import { instructionsData } from "@/lib/instructions-data";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function FloatingHelpPanel() {
    const { isHelpOpen, setHelpOpen } = useHelp();
    const [searchTerm, setSearchTerm] = useState("");
    const [userOpenedItems, setUserOpenedItems] = useState<string[]>(["getting-started"]);

    const lowercasedTerm = searchTerm.toLowerCase();

    const filteredInstructions = useMemo(() => {
        if (!lowercasedTerm) return instructionsData;
        const getNodeText = (node: React.ReactNode): string => {
            if (typeof node === 'string') return node;
            if (typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(getNodeText).join(' ');
            if (React.isValidElement(node) && node.props.children) {
                return getNodeText(node.props.children);
            }
            return '';
        };
        return instructionsData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(lowercasedTerm);
            const contentText = getNodeText(item.content).toLowerCase();
            const contentMatch = contentText.includes(lowercasedTerm);
            return titleMatch || contentMatch;
        });
    }, [lowercasedTerm]);

    const filteredChangelog = useMemo(() => {
        if (!lowercasedTerm) return changelogData;
        return changelogData.filter(entry => 
            entry.version.toLowerCase().includes(lowercasedTerm) ||
            entry.date.toLowerCase().includes(lowercasedTerm) ||
            entry.changes.some(change => change.toLowerCase().includes(lowercasedTerm))
        );
    }, [lowercasedTerm]);
    
    const displayedOpenItems = useMemo(() => {
        if (searchTerm) {
            const allMatchingIds = filteredInstructions.map(item => item.id);
            if (filteredChangelog.length > 0) {
                allMatchingIds.push("changelog");
            }
            return allMatchingIds;
        }
        return userOpenedItems;
    }, [searchTerm, filteredInstructions, filteredChangelog, userOpenedItems]);

    return (
        <Sheet open={isHelpOpen} onOpenChange={setHelpOpen}>
            <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle>Application Help & Instructions</SheetTitle>
                    <SheetDescription>Search for instructions or browse the changelog.</SheetDescription>
                </SheetHeader>
                <div className="px-6 pb-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search"
                            placeholder="Search instructions..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 p-6 pt-2">
                    <Accordion type="multiple" value={displayedOpenItems} onValueChange={setUserOpenedItems} className="w-full space-y-4">
                        {filteredInstructions.map(item => (
                            <Card key={item.id}>
                                <AccordionItem value={item.id} className="border-b-0">
                                    <AccordionTrigger className="p-6 text-lg hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-6 w-6" />{item.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6">
                                        {item.content}
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                        {filteredChangelog.length > 0 && (
                            <Card>
                                <AccordionItem value="changelog" className="border-b-0">
                                    <AccordionTrigger className="p-6 text-lg hover:no-underline">Changelog</AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6 space-y-4">
                                    {filteredChangelog.map((entry) => (
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
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        )}
                    </Accordion>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
