'use client';

import { type ReactNode, useState } from 'react';
import { useModal } from '@/app/contexts/ModalContext';

interface ButtonModalProps {
  modal: ReactNode;
  renderModal?: () => ReactNode | Promise<ReactNode>;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
  title?: string;
}

export const ButtonModal = ({
  modal,
  renderModal,
  children,
  className,
  type = 'button',
  disabled = false,
  ...rest
}: ButtonModalProps) => {
  const { openModal } = useModal();
  const [opening, setOpening] = useState(false);

  const handleSyncClick = () => {
    if (modal) {
      openModal(modal);
    }
  };

  const handleAsyncClick = async () => {
    if (!renderModal || opening) return;
    setOpening(true);
    try {
      const node = await renderModal();
      openModal(node);
    } finally {
      setOpening(false);
    }
  };

  if (renderModal) {
    return (
      <button
        type={type}
        onClick={handleAsyncClick}
        disabled={disabled || opening}
        className={className}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={handleSyncClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
};
