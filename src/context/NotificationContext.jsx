import { createContext, useContext, useState, useCallback } from 'react';

const NotifContext = createContext(null);

let _id = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++_id;
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotifContext.Provider value={{ notifications, notify }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotification must be inside <NotificationProvider>');
  return ctx;
}
