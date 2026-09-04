'use client';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Modal } from '@/app/components/UI/Modal';

interface ModalContextType {
  openModal: (component: ReactNode) => void;
  closeModal: () => void;
}

const modalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (component: ReactNode) => setContent(component);
  const closeModal = () => setContent(null);

  useEffect(() => {
    if (!content) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [content]);

  return (
    <modalContext.Provider value={{ openModal, closeModal }}>
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
