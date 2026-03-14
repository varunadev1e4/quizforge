import { createContext, useContext, useState, useCallback } from 'react';
import { loadStore, saveStore } from '../utils/storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(() => loadStore());

  const persist = useCallback((updater) => {
    setStore(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStore(next);
      return next;
    });
  }, []);

  return (
    <StoreContext.Provider value={{ store, persist }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
