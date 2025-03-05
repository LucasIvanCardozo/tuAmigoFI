'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdDownload,
} from 'react-icons/md';
import { Loading } from './others/loading';

export default function PdfView({ id, url }: { id: number; url: string }) {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const imageUrl = `https://res.cloudinary.com/donzj5rlf/image/upload/pg_${pageNumber}/f_auto/q_auto:eco/v${Math.floor(
    Date.now() / (1000 * 60 * 60 * 24 * 7)
  )}/${url}/${id}`;

  const handlePage = (newPage: number) => {
    setLoadingImage(true);
    setPageNumber(newPage);
  };

  const downloadFile = async () => {
    const response = await fetch(
      `https://res.cloudinary.com/donzj5rlf/image/upload/fl_attachment/${url}/${id}.pdf`
    );
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Tu-Amigo-FI-descarga.pdf';
    link.click();
  };

  return (
    <>
      <div className="relative flex justify-center w-full select-none object-contain aspect-[1/1.4142]">
        <Image
          src={imageUrl}
          alt="PDF"
          onLoad={() => setLoadingImage(false)}
          onError={() => {
            setLastPage(pageNumber - 1);
            setPageNumber(pageNumber - 1);
            setLoadingImage(false);
          }}
          width={1200}
          height={1697}
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 flex justify-center w-full select-none">
        <div className="flex items-cente">
          <span className="relative my-1 bg-white bg-opacity-65">
            {
              <button
                className={`${
                  pageNumber == 1 && 'opacity-0 pointer-events-none'
                } absolute h-full right-full top-0 bottom-0 bg-white bg-opacity-65 transform-gpu transition-opacity rounded-tl-md rounded-bl-md`}
                aria-label="Ir a página izquierda"
                title="Ir a izquierda"
                onClick={() => handlePage(pageNumber - 1)}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
            }
            Página {pageNumber}
            {
              <button
                className={`${
                  pageNumber == lastPage && 'opacity-0 pointer-events-none'
                } absolute h-full left-full top-0 bottom-0 bg-white bg-opacity-65 transform-gpu transition-opacity rounded-tr-md rounded-br-md`}
                aria-label="Ir a página derecha"
                title="Ir a derecha"
                onClick={() => handlePage(pageNumber + 1)}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            }
            {
              <div
                className={`${
                  !loadingImage && 'opacity-0'
                } absolute bottom-full flex justify-center w-full sm:w-full transform-gpu transition-opacity`}
              >
                <div
                  className="border-black inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] bg-white bg-opacity-65"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            }
          </span>
        </div>
      </div>
      <button
        className="absolute h-6 w-6 top-0 right-0 m-2 bg-white bg-opacity-65 rounded-md select-none"
        onClick={downloadFile}
        aria-label="Descargar PDF"
        title="Descargar PDF"
      >
        <MdDownload className="h-full w-full" />
      </button>
    </>
  );
}
