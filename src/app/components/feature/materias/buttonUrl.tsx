'use client';

import Link from 'next/link';
import { LinkLoader } from '../../layout/linkLoader';

interface Params {
  url: string;
  label: string;
}

export const ButtonUrl = ({ url, label }: Params) => {
  return (
    <Link
      href={url}
      className="font-bold w-max self-end py-1 px-2 rounded-sm bg-(--midnight-green) sm:font-normal"
    >
      <LinkLoader />
      {label}
    </Link>
  );
};
