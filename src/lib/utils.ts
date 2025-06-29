import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CadetElement } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPhaseDisplayName(element: CadetElement, phaseId: number | string): string {
    const id = typeof phaseId === 'string' ? parseInt(phaseId.replace(/\D/g, ''), 10) : phaseId;

    if (isNaN(id)) return `Phase ${phaseId}`;

    switch (element) {
        case 'Sea':
            return `Phase ${id}`;
        case 'Air':
            return `Level ${id}`;
        case 'Army':
            switch (id) {
                case 1: return 'Green Star';
                case 2: return 'Red Star';
                case 3: return 'Silver Star';
                case 4: return 'Gold Star';
                case 5: return 'Master Cadet';
                default: return `Year ${id}`;
            }
        default:
            return `Phase ${id}`;
    }
}

export function getPhaseLabel(element: CadetElement): string {
    switch (element) {
        case 'Sea': return 'Phase';
        case 'Air': return 'Level';
        case 'Army': return 'Star Level';
        default: return 'Phase';
    }
}
