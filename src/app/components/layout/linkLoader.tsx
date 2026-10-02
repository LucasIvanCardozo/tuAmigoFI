'use client';
import { useLinkStatus } from 'next/link';
import { useLoaderPending } from '@/app/contexts/LoaderContext';

export const LinkLoader = () => {
  const { pending } = useLinkStatus();
  useLoaderPending(pending);
  return null;
};
