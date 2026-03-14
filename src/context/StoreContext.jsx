import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { loadStore, saveStore, DEFAULT_STORE } from '../utils/storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [isLoading, setIsLoading] = useState(true);
  const [storeWarning, setStoreWarning] = useState('');
  const writeQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    let isMounted = true;

    async function bootstrapStore() {
      const { store: loadedStore, warning } = await loadStore();
      if (!isMounted) return;

      setStore(loadedStore);
      setStoreWarning(warning || '');
      setIsLoading(false);
    }

    bootstrapStore();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback((updater) => {
    setStore(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      writeQueueRef.current = writeQueueRef.current
        .then(() => saveStore(next))
        .catch((err) => {
          console.error('Store persistence queue failed:', err);
        });

      return next;
    });
  }, []);

  return (
    <StoreContext.Provider value={{ store, persist, isLoading, storeWarning }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
