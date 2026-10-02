'use client';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Loader } from '@/app/components/layout/loader';

interface LoaderContextType {
  setPending: (key: string, pending: boolean) => void;
}

const loaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [pendingKeys, setPendingKeys] = useState<string[]>([]);

  const setPending = useCallback((key: string, pending: boolean) => {
    setPendingKeys((keys) => {
      if (pending) return keys.includes(key) ? keys : [...keys, key];
      return keys.includes(key) ? keys.filter((pendingKey) => pendingKey !== key) : keys;
    });
  }, []);

  const value = useMemo(() => ({ setPending }), [setPending]);

  return (
    <loaderContext.Provider value={value}>
      {children}
      {pendingKeys.length > 0 && <Loader />}
    </loaderContext.Provider>
  );
};

export const useLoaderPending = (pending: boolean) => {
  const context = useContext(loaderContext);
  if (!context) throw new Error('useLoaderPending must be used within a LoaderProvider');
  const { setPending } = context;
  const key = useId();

  useEffect(() => {
    setPending(key, pending);
    return () => setPending(key, false);
  }, [key, pending, setPending]);
};
