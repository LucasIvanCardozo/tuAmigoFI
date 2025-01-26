'use client';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer
      className="w-full h-20 flex flex-col justify-center items-center gap-1 bg-black self-end"
      role="Info"
    >
      <div className="flex gap-1">
        <p>Creada por</p>
        <a className="underline" href="">
          Lucas Cardozo
        </a>
      </div>
      <a
        className="text-sm underline sm:hover:underline sm:no-underline"
        href="https://tu-amigo-fi.vercel.app/politica-de-privacidad"
      >
        Política de Privacidad
      </a>
    </footer>
  );
}
