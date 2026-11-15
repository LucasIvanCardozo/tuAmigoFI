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

export interface ModalContextPart {
  text: string;
  strong?: boolean;
}

export interface ModalOptions {
  title?: string;
  context?: ModalContextPart[];
}

interface ModalContextType {
  openModal: (component: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
}

const modalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode>(null);
  const [options, setOptions] = useState<ModalOptions>({});

  const openModal = useCallback((component: ReactNode, modalOptions?: ModalOptions) => {
    setContent(component);
    setOptions(modalOptions ?? {});
  }, []);
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
      {content && (
        <Modal title={options.title} context={options.context}>
          {content}
        </Modal>
      )}
    </modalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(modalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
