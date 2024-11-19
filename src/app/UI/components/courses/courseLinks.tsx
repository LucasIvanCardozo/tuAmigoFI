'use client';
import { links } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc';
import { MdDelete } from 'react-icons/md';
import { deleteLink } from '@/app/lib/actions';

export default function CourseLinks({
  links,
  official,
}: {
  links: links[];
  official: boolean;
}) {
  const [viewState, setViewState] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleClick = () => {
    setViewState(!viewState);
  };

  const handleDeleteLink = async (idLink: number) => {
    await deleteLink(idLink);
    window.location.reload();
  };

  return (
    <>
      <button
        className="flex items-center cursor-pointer w-fit"
        onClick={handleClick}
      >
        {viewState ? <VscTriangleDown /> : <VscTriangleRight />}
        <h3>{official ? 'Links oficiales' : 'Links no oficiales'}</h3>
      </button>
      <div className="overflow-hidden">
        <ul
          className={
            (viewState ? 'h-auto' : 'h-0') +
            '  ease-linear duration-100 pl-5 transform-gpu w-min flex'
          }
        >
          {links.map(({ id, link, name }, index) => (
            <li key={index} className="relative text-sm text-nowrap pl-1 flex">
              <a href={link} target="_blanck" className="hover:underline">
                {name}
              </a>
              {session?.user.tier == 2 && (
                <button className="h-full" onClick={() => handleDeleteLink(id)}>
                  <MdDelete className="h-full" />
                </button>
              )}
              {index !== links.length - 1 && ' -'}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
