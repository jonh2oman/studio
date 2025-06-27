
"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { ObjectivesList } from "./objectives-list";

export function DraggableObjectivesPanel() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!panelRef.current) return;
    
    const panelRect = panelRef.current.getBoundingClientRect();
    const newX = e.clientX - dragStartOffset.current.x;
    const newY = e.clientY - dragStartOffset.current.y;
    
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - panelRect.width));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - panelRect.height));

    setPosition({ x: clampedX, y: clampedY });
  }, []);

  const handleMouseUp = useCallback(() => {
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    
    document.body.style.userSelect = 'none';
    dragStartOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }, [position.x, position.y, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={panelRef}
      className="absolute w-[350px] h-[calc(100%-40px)] max-h-[800px] flex flex-col shadow-2xl z-40 bg-card/90 backdrop-blur-sm border rounded-lg"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-center py-2 text-muted-foreground border-b cursor-move"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ObjectivesList />
      </div>
    </div>
  );
}
