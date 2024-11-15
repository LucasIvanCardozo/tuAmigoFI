'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdDownload,
} from 'react-icons/md';

export default function PdfView({ id, url }: { id: number; url: string }) {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isTherePage, setIsTherePage] = useState<boolean>(true);
  const [loadingImage, setLoadImage] = useState<boolean>(false);

  const handlePage = async (page: number) => {
    setLoadImage(true);
    const response = await fetch(
      `https://res.cloudinary.com/donzj5rlf/image/upload/pg_${page}/f_auto,q_auto/v${Math.floor(
        Date.now() / (1000 * 60 * 60 * 1)
      )}/${url}/${id}`
    );
    if (response.ok) {
      setIsTherePage(true);
      setPageNumber(page);
    } else {
      setIsTherePage(false);
    }
    setLoadImage(false);
  };

  const downloadFile = async () => {
    const response = await fetch(
      `https://res.cloudinary.com/donzj5rlf/image/upload/fl_attachment/${url}/${id}.pdf`
    );
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'descarga-Tu-Amigo-FI.pdf';
    link.click();
  };

  return (
    <>
      <div className="relative flex justify-center w-full">
        <Image
          src={`https://res.cloudinary.com/donzj5rlf/image/upload/pg_${pageNumber}/f_auto,q_auto/v${Math.floor(
            Date.now() / (1000 * 60 * 60 * 1)
          )}/${url}/${id}`}
          alt="PDF"
          onLoad={() => setLoadImage(false)}
          width={710}
          height={1000}
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 flex justify-center w-full">
        <div className="flex items-center">
          <span className="relative py-1">
            {pageNumber != 1 && (
              <button
                className="absolute right-full"
                onClick={() => handlePage(pageNumber - 1)}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
            )}
            Página {pageNumber}
            {isTherePage && (
              <button
                className="absolute left-full"
                onClick={() => handlePage(pageNumber + 1)}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            )}
            {loadingImage && (
              <div className="absolute bottom-full flex justify-center w-full sm:w-full">
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
        className="absolute h-9 w-9 top-0 right-0 p-2"
        onClick={downloadFile}
      >
        <MdDownload className="h-full w-full" />
      </button>
    </>
  );
}
