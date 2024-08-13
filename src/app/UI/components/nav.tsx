'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg';

export default function Nav() {
  const [navState, setNavState] = useState<boolean>(false);
  const pathname: string = usePathname();

  const handleNavState = () => {
    setNavState(!navState);
  };

  return (
    <nav className="fixed top-0 h-10 w-full z-30 flex justify-end sm:justify-center sm:mt-2 sm:z-50">
      <Link
        className="text-xl bg-[--dark-cyan] drop-shadow-sm rounded-md m-1 px-1 flex items-center justify-center sm:hidden"
        href="/"
      >
        <b className="">Tu Amigo FI</b>
      </Link>
      <button
        className="relative m-1 bg-[--dark-cyan] rounded-md aspect-square sm:hidden"
        onClick={handleNavState}
      >
        <CgMenu
          className={
            (navState ? 'opacity-0' : 'opacity-100') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
        <CgClose
          className={
            (navState ? 'opacity-100' : 'opacity-0') +
            ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'
          }
        />
      </button>
      <ul
        className={
          (navState ? '-translate-x-full' : '-translate-x-0') +
          ` absolute left-full top-10 bg-[--dark-cyan] rounded-md transform-gpu transition-transform sm:flex sm:relative sm:left-auto sm:top-auto sm:translate-x-0`
        }
      >
        {[
          { href: '/', name: 'Inicio' },
          { href: '/ingresantes', name: 'Ingresantes' },
          { href: '/materias', name: 'Materias' },
          { href: '/contactame', name: 'Contáctame' },
        ].map(({ href, name }, index) => (
          <li
            key={index}
            className={
              'rounded-md ' +
              (pathname == href
                ? 'bg-[--midnight-green]'
                : 'hover:bg-[--midnight-green]')
            }
          >
            <Link
              href={href}
              className="inline-block text-center w-40 py-2 font-bold px-3 sm:w-28 sm:font-normal"
              onClick={handleNavState}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
