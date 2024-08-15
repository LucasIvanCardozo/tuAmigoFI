'use client';

import { fetchLinks } from '@/app/lib/data';
import { useState } from 'react';
import { CgArrowRightO } from 'react-icons/cg';
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc';
export default function CourseLinks({
  links,
}: {
  links: {
    official: boolean;
    link: string;
    name: string;
    id: number;
  }[];
}) {
  const [viewState, setViewState] = useState<boolean>(false);
  const handleClick = () => {
    setViewState(!viewState);
  };
  return (
    <>
      <button
        className="flex items-center cursor-pointer"
        onClick={handleClick}
      >
        {viewState ? <VscTriangleDown /> : <VscTriangleRight />}
        <h3>
          {
            /*links[0].official*/ true
              ? 'Links oficiales'
              : 'Links no oficiales'
          }
        </h3>
      </button>
      <div className="overflow-hidden">
        <ul
          className={
            (viewState ? 'h-auto' : 'h-0') +
            '  ease-linear duration-100 pl-2 transform-gpu w-min'
          }
        >
          {links.map(({ link, name }, index) => (
            <li key={index} className="text-sm flex gap-1">
              <span className="overflow-clip w-24 text-nowrap text-ellipsis">
                {' '}
                {name}
              </span>
              <CgArrowRightO className="self-center text-[--midnight-green]" />
              <a className="hover:underline" href={link}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
