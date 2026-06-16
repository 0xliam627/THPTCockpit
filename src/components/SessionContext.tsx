'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { LoginResult } from './types';

type SessionContextType = {
  data: LoginResult | null;
  setData: (data: LoginResult | null) => void;
  isLoaded: boolean;
};

const SessionContext = createContext<SessionContextType>({
  data: null,
  setData: () => {},
  isLoaded: false,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<LoginResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('thpt_login_session');
    if (saved) {
      try {
        setDataState(JSON.parse(saved));
      } catch (err) {
        console.error('Lỗi parse session:', err);
      }
    }
    setIsLoaded(true);
  }, []);

  const setData = (newData: LoginResult | null) => {
    setDataState(newData);
    if (newData) {
      localStorage.setItem('thpt_login_session', JSON.stringify(newData));
    } else {
      localStorage.removeItem('thpt_login_session');
    }
  };

  return (
    <SessionContext.Provider value={{ data, setData, isLoaded }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
