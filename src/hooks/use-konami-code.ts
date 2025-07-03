
import { useEffect, useState, useCallback } from 'react';

export const useKonamiCode = (callback: () => void) => {
  const [keys, setKeys] = useState<string[]>([]);
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    setKeys((prevKeys) => {
      const newKeys = [...prevKeys, event.key].slice(-konamiCode.length);

      if (JSON.stringify(newKeys) === JSON.stringify(konamiCode)) {
        callback();
        return []; // Reset after successful code
      }
      return newKeys;
    });
  }, [callback, konamiCode]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};
