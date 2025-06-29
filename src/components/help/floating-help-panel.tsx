"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useHelp } from "@/hooks/use-help";
import { GripVertical, Search, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changelogData } from "@/lib/changelog-data";
import { instructionsData } from "@/lib/instructions-data";
import { Badge } from "@/components/ui/badge";

export function FloatingHelpPanel() {
    const { isHelpOpen, setHelpOpen } = useHelp();
    const [searchTerm, setSearchTerm] = useState("");
    
    // Draggable and Resizable Logic
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [size, setSize] = useState({ width: 600, height: 700 });
    const panelRef = useRef<HTMLDivElement>(null);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const handleDragMove = useCallback((e: MouseEvent) => {
        if (!panelRef.current) return;
        const newX = e.clientX - dragStartOffset.current.x;
        const newY = e.clientY - dragStartOffset.current.y;
        const clampedX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
        const clampedY = Math.max(0, Math.min(newY, window.innerHeight - size.height));
        setPosition({ x: clampedX, y: clampedY });
    }, [size.width, size.height]);

    const handleDragUp = useCallback(() => {
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragUp);
    }, [handleDragMove]);

    const handleDragDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        document.body.style.userSelect = 'none';
        dragStartOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragUp);
        e.preventDefault();
    }, [position.x, position.y, handleDragMove, handleDragUp]);

    const handleResizeMove = useCallback((e: MouseEvent) => {
        const newWidth = Math.max(400, resizeStart.current.width + (e.clientX - resizeStart.current.x));
        const newHeight = Math.max(500, resizeStart.current.height + (e.clientY - resizeStart.current.y));
        const maxWidth = window.innerWidth - position.x;
        const maxHeight = window.innerHeight - position.y;
        setSize({ width: Math.min(maxWidth, newWidth), height: Math.min(maxHeight, newHeight) });
    }, [position.x, position.y]);

    const handleResizeUp = useCallback(() => {
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeUp);
    }, [handleResizeMove]);

    const handleResizeDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        document.body.style.userSelect = 'none';
        resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeUp);
    }, [size.width, size.height, handleResizeMove, handleResizeUp]);

    // Search Logic
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

    const openAccordionItems = useMemo(() => {
        if (!lowercasedTerm) return ["getting-started"];
        return filteredInstructions.map(item => item.id);
    }, [lowercasedTerm, filteredInstructions]);
    
    if (!isHelpOpen) {
        return null;
    }

    return (
        <div
            ref={panelRef}
            className="fixed flex flex-col shadow-2xl z-[60] bg-card/90 backdrop-blur-sm border rounded-lg overflow-hidden"
            style={{
                width: `${size.width}px`,
                height: `${size.height}px`,
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <header 
                onMouseDown={handleDragDown} 
                className="flex items-center justify-between py-2 px-4 text-card-foreground border-b cursor-move flex-shrink-0"
            >
                <div className="flex items-center gap-2 font-semibold">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    Application Instructions
                </div>
                <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setHelpOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </header>
            <div className="p-4 border-b">
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
            <ScrollArea className="flex-1 p-4">
                <Accordion type="multiple" value={openAccordionItems} className="w-full space-y-4">
                    {filteredInstructions.map(item => (
                        <Card key={item.id} id={item.id}>
                            <AccordionItem value={item.id} className="border-b-0">
                                <AccordionTrigger className="p-6 text-xl hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-6 w-6" />{item.title}
                                    </div>
                                </AccordionTrigger>
                                {item.content}
                            </AccordionItem>
                        </Card>
                    ))}
                    <Card>
                         <AccordionItem value="changelog" className="border-b-0">
                            <AccordionTrigger className="p-6 text-xl hover:no-underline">Changelog</AccordionTrigger>
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
                </Accordion>
            </ScrollArea>
             <div
                onMouseDown={handleResizeDown}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                style={{
                    background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, hsl(var(--muted-foreground)) 4px, hsl(var(--muted-foreground)) 5px)',
                    opacity: 0.5,
                }}
            />
        </div>
    );
}
