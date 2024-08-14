'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg';

export default function Nav() {
  const [navState, setNavState] = useState<boolean>(false);
  const pathname: string = usePathname();

  const handleNavState = () => {
    if (document.documentElement.scrollWidth < 640) {
      setNavState(!navState);
      console.log('hola');
    }
  };

  useEffect(() => {
    if (navState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navState]);

  //no bloquear el scroll en pantallas escritorio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)'); // Tailwind 'sm' breakpoint is 640px

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setNavState(false);
      }
    };

    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', (e) => handleMediaChange(e));

    // Limpieza para remover el event listener
    return () => {
      mediaQuery.removeEventListener('change', (e) => handleMediaChange(e));
    };
  }, []);

  return (
    <nav className="fixed top-0 h-10 w-full z-30 flex justify-end sm:justify-center sm:mt-2 sm:z-50">
      <Link
        className="text-xl bg-[--dark-cyan] drop-shadow-sm rounded-md m-1 px-1 flex items-center justify-center sm:hidden"
        href="/"
        onClick={handleNavState}
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
          ` absolute left-full top-10 bg-[--dark-cyan] rounded-md transform-gpu transition-transform sm:flex sm:relative sm:translate-x-0 sm:left-auto sm:top-auto`
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
