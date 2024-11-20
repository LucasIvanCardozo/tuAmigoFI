'use client';
import { links } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc';
import { MdOutlineReport } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { deleteLink } from '@/app/lib/actions';
import ModalReportLink from './modals/modalReportLink';
import ModalDeleteLink from './modals/modalDeleteLink';

export default function CourseLinks({
  links,
  official,
}: {
  links: ({
    _count: {
      links_reports: number;
    };
  } & {
    name: string;
    id: number;
    id_course: number;
    link: string;
    official: boolean;
    id_user: number;
  })[];
  official: boolean;
}) {
  const [modalReportLink, setModalReportLink] = useState<links | undefined>();
  const [modalDeleteLink, setModalDeleteLink] = useState<links | undefined>();
  const [viewState, setViewState] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleClick = () => {
    setViewState(!viewState);
  };

  const handleModalReportLink = (link: links | undefined) =>
    setModalReportLink(link);

  const handleModalDeleteLink = (link: links | undefined) => {
    setModalDeleteLink(link);
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
        <div
          className={
            (viewState ? 'h-auto' : 'h-0') +
            '  ease-linear duration-100 pl-5 transform-gpu w-min flex'
          }
        >
          {links.map(
            (link, index) =>
              link._count.links_reports < 5 && (
                <span key={index} className="relative text-sm text-nowrap flex">
                  <a
                    href={link.link}
                    target="_blanck"
                    className="underline hover:underline px-1 sm:no-underline"
                    title={link.link}
                  >
                    {link.name}
                  </a>
                  {session && (
                    <button
                      className="h-full text-red-700"
                      onClick={() => handleModalReportLink(link)}
                      title="Reportar link"
                    >
                      <MdOutlineReport className="h-full" />
                    </button>
                  )}
                  {session?.user.tier == 2 && (
                    <button
                      className="h-full"
                      onClick={() => handleModalDeleteLink(link)}
                      title="Eliminar link"
                    >
                      <MdDelete className="h-full" />
                    </button>
                  )}
                  {index !== links.length - 1 && ' -'}
                </span>
              )
          )}
        </div>
      </div>
      {modalReportLink && (
        <ModalReportLink
          link={modalReportLink}
          callback={handleModalReportLink}
        />
      )}
      {modalDeleteLink && (
        <ModalDeleteLink
          link={modalDeleteLink}
          callback={handleModalDeleteLink}
        />
      )}
    </>
  );
}
