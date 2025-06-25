'use client';
import { TbSquareAsteriskFilled } from 'react-icons/tb';
import { useState } from 'react';
import { CgClose, CgMenu } from 'react-icons/cg';

export const MainSkeleton = () => {
  return (
    <main className="h-screen w-full pt-8 flex gap-2 max-w-screen-lg m-auto sm:pb-3 sm:px-2 sm:pt-16">
      <button
        className="fixed top-0 left-0 m-1 h-8 bg-[--black-olive] rounded-md aspect-square rounded-e-none z-50 sm:hidden"
        aria-label="Abrir o cerrar menú"
        title="Menú"
      >
        <CgMenu className=" transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1" />
        <div className="absolute h-8 left-full top-0 text-xl bg-[--black-olive] drop-shadow-sm rounded-md px-1 flex items-center justify-center rounded-s-none whitespace-nowrap sm:hidden">
          Cargando
        </div>
      </button>
      <aside
        className="
          fixed z-40 top-0 right-full  transform-gpu transition-transform bg-[--black-olive] w-max min-w-40  rounded-md mt-10 py-4 px-3 flex flex-col max-h-[80vh] gap-3 sm:max-h-none sm:relative sm:h-full sm:m-0 sm:max-w-52 sm:right-auto "
      >
        <h1 className="text-xl hidden whitespace-nowrap sm:block">Cargando</h1>
        <ul
          className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <li className="grid grid-cols-[1.2rem,1fr] gap-1 p-1 rounded-md [&>svg]:self-start [&>svg]:h-max [&>svg]:w-full transform-gpu transition-transform sm:hover:scale-105">
            <TbSquareAsteriskFilled />
            <button
              className="text-start"
              aria-label="Mostrar todos"
              title="Mostrar todos los TPs"
            >
              <h2 className="text-base leading-4">Mostrar todos</h2>
              <p className="text-xs text-[--silver]">{`Todos los TPs`} </p>
            </button>
          </li>
          <li
            className={
              'order-last gap-1 p-1 rounded-md transform-gpu text-center transition-transform sm:hover:scale-105'
            }
          >
            <button
              className="text-start bg-[--white] py-1 px-2 rounded-md"
              title="..."
            >
              <p className="text-base text-[--black-olive] leading-4">
                Agregar ...
              </p>
            </button>
          </li>
        </ul>
      </aside>
      <section className="text-[--black] flex flex-col grow relative h-full p-3 overflow-hidden sm:p-0 ">
        <div>
          <div className="flex justify-between items-end">
            <h1 className="text-2xl sm:text-3xl font-bold">
              <b>Cargando...</b>
            </h1>
          </div>
        </div>
        <ul className="flex flex-col gap-1 grow relative overflow-y-auto overflow-x-hidden">
          <li className="relative ">
            <div className="flex items-center text-xl sticky top-0 z-20 bg-[--platinum] py-1 "></div>
            <div className="bg-[--white] text-base leading-5 drop-shadow-md flex flex-col gap-1"></div>
          </li>
        </ul>
      </section>
    </main>
  );
};
