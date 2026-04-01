import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storage.js';
export function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(
    () =>  storageService.get(key, defaultValue)
  );

  const setValue = useCallback((value) => {
    setState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      storageService.set(key, next);
      return next;
    });
  }, [key]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === `planner::${key}` && e.newValue) {
        try { setState(JSON.parse(e.newValue).data); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [state, setValue];
}