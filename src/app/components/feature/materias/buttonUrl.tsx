'use client';

import Link from 'next/link';
import { handleLoader } from '@/app/utils/handleLoader';

interface Params {
  url: string;
  label: string;
}

export const ButtonUrl = ({ url, label }: Params) => {
  return (
    <Link
      href={url}
      onClick={() => handleLoader(true)}
      className="font-bold w-max self-end py-1 px-2 rounded-sm bg-(--midnight-green) sm:font-normal"
    >
      {label}
    </Link>
  );
};
