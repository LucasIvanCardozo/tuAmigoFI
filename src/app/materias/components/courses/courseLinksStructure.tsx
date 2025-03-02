'use client';
import { links } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc';
import { MdOutlineReport } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import ModalReportLink from './modals/modalReportLink';
import ModalDeleteLink from './modals/modalDeleteLink';
import ReactDOM from 'react-dom';

interface Params {
  linksOfficial: ({
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
  linksUnofficial: ({
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
}

export default function CourseLinksStructure({
  linksOfficial,
  linksUnofficial,
}: Params) {
  const [modalReportLink, setModalReportLink] = useState<links | undefined>();
  const [modalDeleteLink, setModalDeleteLink] = useState<links | undefined>();
  const [viewStateOfficial, setViewStateOfficial] = useState<boolean>(false);
  const [viewStateUnofficial, setViewStateUnofficial] =
    useState<boolean>(false);
  const { data: session } = useSession();

  const handleClickOfficial = () => {
    setViewStateOfficial(!viewStateOfficial);
  };

  const handleClickUnofficial = () => {
    setViewStateUnofficial(!viewStateUnofficial);
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
        onClick={handleClickOfficial}
        aria-label="Ver links oficiales"
        title="Links oficiales"
      >
        {viewStateOfficial ? <VscTriangleDown /> : <VscTriangleRight />}
        <h3>
          <b>Links oficiales </b>
          {linksOfficial.length}
        </h3>
      </button>
      <div className="overflow-hidden">
        <div
          className={
            (viewStateOfficial ? 'h-auto' : 'h-0') +
            ' ease-linear duration-100 pl-5 transform-gpu w-min flex'
          }
        >
          {linksOfficial.map(
            (link, index) =>
              link._count.links_reports < 5 && (
                <span
                  key={link.id}
                  className="relative text-sm text-nowrap flex"
                >
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
                      aria-label="Reportar link"
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
                      aria-label="Eliminar link"
                      title="Eliminar link"
                    >
                      <MdDelete className="h-full" />
                    </button>
                  )}
                  {index !== linksOfficial.length - 1 && ' -'}
                </span>
              )
          )}
        </div>
      </div>
      <button
        aria-label="Ver links no oficiales"
        title="Links no oficiales"
        className="flex items-center cursor-pointer w-fit"
        onClick={handleClickUnofficial}
      >
        {viewStateUnofficial ? <VscTriangleDown /> : <VscTriangleRight />}
        <h3>
          <b>Links no oficiales</b>
          {linksUnofficial.length}
        </h3>
      </button>
      <div className="overflow-hidden">
        <div
          className={
            (viewStateUnofficial ? 'h-auto' : 'h-0') +
            '  ease-linear duration-100 pl-5 transform-gpu w-min flex'
          }
        >
          {linksUnofficial.map(
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
                      aria-label="Reportar link"
                      title="Reportar link"
                    >
                      <MdOutlineReport className="h-full" />
                    </button>
                  )}
                  {session?.user.tier == 2 && (
                    <button
                      className="h-full"
                      onClick={() => handleModalDeleteLink(link)}
                      aria-label="Eliminar link"
                      title="Eliminar link"
                    >
                      <MdDelete className="h-full" />
                    </button>
                  )}
                  {index !== linksUnofficial.length - 1 && ' -'}
                </span>
              )
          )}
        </div>
      </div>
      {modalReportLink &&
        ReactDOM.createPortal(
          <ModalReportLink
            link={modalReportLink}
            callback={handleModalReportLink}
          />,
          document.body
        )}
      {modalDeleteLink &&
        ReactDOM.createPortal(
          <ModalDeleteLink
            link={modalDeleteLink}
            callback={handleModalDeleteLink}
          />,
          document.body
        )}
    </>
  );
}
