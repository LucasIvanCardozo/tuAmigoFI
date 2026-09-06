'use client';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal } from '@/app/components/UI/Modal';

interface ModalContextType {
  openModal: (component: ReactNode) => void;
  closeModal: () => void;
}

const modalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback((component: ReactNode) => setContent(component), []);
  const closeModal = useCallback(() => setContent(null), []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  useEffect(() => {
    if (!content) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [content]);

  return (
    <modalContext.Provider value={value}>
      {children}
      {content && <Modal>{content}</Modal>}
    </modalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(modalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
