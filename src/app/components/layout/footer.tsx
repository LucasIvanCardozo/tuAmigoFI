'use client';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer
      className="w-full h-20 flex flex-col justify-center items-center gap-1 bg-black self-end py-4"
      role="Info"
    >
      <div className="flex gap-1">
        <p>Creada por</p>
        <a
          className="underline"
          target="_blank"
          href="https://www.linkedin.com/in/lucas-ivan-cardozo/"
        >
          Lucas Cardozo
        </a>
      </div>
      <Link
        className="text-sm underline sm:hover:underline sm:no-underline"
        href="/politica-de-privacidad"
      >
        Política de Privacidad
      </Link>
    </footer>
  );
}
