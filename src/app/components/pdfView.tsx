'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdDownload,
} from 'react-icons/md';

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
      <div className="relative flex justify-center w-full">
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
      <div className="absolute bottom-0 left-0 flex justify-center w-full">
        <div className="flex items-cente">
          <span className="relative my-1 bg-white bg-opacity-65 rounded-md">
            {pageNumber != 1 && (
              <button
                className="absolute h-full right-full top-0 bottom-0 bg-white bg-opacity-65 rounded-md"
                aria-label="Ir a página izquierda"
                title="Ir a izquierda"
                onClick={() => handlePage(pageNumber - 1)}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
            )}
            Página {pageNumber}
            {pageNumber != lastPage && (
              <button
                className="absolute h-full left-full top-0 bottom-0"
                aria-label="Ir a página derecha"
                title="Ir a derecha"
                onClick={() => handlePage(pageNumber + 1)}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            )}
            {loadingImage && (
              <div className="absolute bottom-full flex justify-center w-full sm:w-full bg-white bg-opacity-65 rounded-md">
                <div className="relative">
                  <div className="absolute h-3 w-3 border-[--black] border-x-2 rounded-full animate-spin"></div>
                  <div className="h-3 w-3 border-[--black] border-2 opacity-40 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      <button
        className="absolute h-9 w-9 top-0 right-0 p-2 bg-white bg-opacity-65 rounded-md"
        onClick={downloadFile}
        aria-label="Descargar PDF"
        title="Descargar PDF"
      >
        <MdDownload className="h-full w-full" />
      </button>
    </>
  );
}
