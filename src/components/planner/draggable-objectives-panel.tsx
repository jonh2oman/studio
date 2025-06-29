
"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { ObjectivesList } from "./objectives-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface DraggableObjectivesPanelProps {
    viewMode?: string;
    setViewMode?: (mode: string) => void;
}

export function DraggableObjectivesPanel({ viewMode, setViewMode }: DraggableObjectivesPanelProps) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 350, height: 600 });
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleDragMove = useCallback((e: MouseEvent) => {
    const newX = e.clientX - dragStartOffset.current.x;
    const newY = e.clientY - dragStartOffset.current.y;
    
    // Clamp position to be within the window bounds
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
    if (e.button !== 0) return; // Only allow left-clicks to drag
    
    document.body.style.userSelect = 'none'; // Prevent text selection
    dragStartOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragUp);
    e.preventDefault();
  }, [position.x, position.y, handleDragMove, handleDragUp]);


  const handleResizeMove = useCallback((e: MouseEvent) => {
    const newWidth = resizeStart.current.width + (e.clientX - resizeStart.current.x);
    const newHeight = resizeStart.current.height + (e.clientY - resizeStart.current.y);
    const minWidth = 300;
    const minHeight = 400;
    const maxWidth = window.innerWidth - position.x;
    const maxHeight = window.innerHeight - position.y;

    setSize({
        width: Math.min(maxWidth, Math.max(minWidth, newWidth)),
        height: Math.min(maxHeight, Math.max(minHeight, newHeight)),
    });
  }, [position.x, position.y]);

  const handleResizeUp = useCallback(() => {
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeUp);
  }, [handleResizeMove]);
  
  const handleResizeDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent drag from firing on the header
    if (e.button !== 0) return;

    document.body.style.userSelect = 'none';
    resizeStart.current = {
      x: e.clientX, y: e.clientY,
      width: size.width, height: size.height,
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  }, [size.width, size.height, handleResizeMove, handleResizeUp]);


  return (
    <div
      ref={panelRef}
      className="fixed flex flex-col shadow-2xl z-50 bg-card/90 backdrop-blur-sm border rounded-lg overflow-hidden"
      style={{
        width: `${size.width}px`, height: `${size.height}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div onMouseDown={handleDragDown} className="flex items-center justify-between py-2 px-4 text-card-foreground border-b flex-shrink-0 cursor-move">
        <div className="flex-1 flex items-center gap-2 text-muted-foreground">
            <GripVertical className="h-5 w-5" />
            <h2 className="font-semibold text-card-foreground">Training Objectives</h2>
        </div>
        
        {viewMode && setViewMode && (
             <div className="flex-shrink-0">
                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-8">
                        <TabsTrigger value="week" className="text-xs px-2">Week</TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-2">Month</TabsTrigger>
                        <TabsTrigger value="year" className="text-xs px-2">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden relative">
        <ObjectivesList />
      </div>

       <div
            onMouseDown={handleResizeDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, hsl(var(--muted-foreground)) 4px, hsl(var(--muted-foreground)) 5px)', opacity: 0.5 }}
       />
    </div>
  );
}

