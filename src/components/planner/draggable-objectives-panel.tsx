
"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { ObjectivesList } from "./objectives-list";

export function DraggableObjectivesPanel() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 350, height: 600 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Dragging logic
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!panelRef.current) return;
    
    const newX = e.clientX - dragStartOffset.current.x;
    const newY = e.clientY - dragStartOffset.current.y;
    
    // Clamp position to be within viewport
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
    dragStartOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragUp);
    e.preventDefault();
  }, [position.x, position.y, handleDragMove, handleDragUp]);

  // Resizing logic
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
    e.stopPropagation(); // Prevent drag from starting
    if (e.button !== 0) return;

    document.body.style.userSelect = 'none';
    resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  }, [size.width, size.height, handleResizeMove, handleResizeUp]);


  return (
    <div
      ref={panelRef}
      className="absolute flex flex-col shadow-2xl z-40 bg-card/90 backdrop-blur-sm border rounded-lg overflow-hidden"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div
        onMouseDown={handleDragDown}
        className="flex items-center justify-center py-2 text-muted-foreground border-b cursor-move flex-shrink-0"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 overflow-hidden">
        <ObjectivesList />
      </div>
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
