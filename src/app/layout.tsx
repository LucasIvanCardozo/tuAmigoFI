import type { Metadata } from 'next';
import './globals.css';
import { cabin } from './UI/fonts';
import Nav from './UI/components/nav';
import {
  TbTools,
  TbRulerMeasure,
  TbCircuitCellPlus,
  TbBulbFilled,
  TbHammer,
  TbMathFunction,
  TbMathIntegral,
} from 'react-icons/tb';
import Providers from './UI/components/providers';
import { useSession } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'Tu amigo FI',
  description:
    'Creada para ayudar a ingresantes y avanzados alumnos, en la Facultad de Ingenieria de Mar del Plata, con su desafiante carrera.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cabin.className + ' flex flex-col min-h-screen gap-8'}>
        <Providers>
          <Nav />
          <div className="overflow-hidden -z-10 fixed flex flex-col justify-around top-0 left-0 w-screen h-screen text-3xl text-[#BABDBA] sm:text-5xl">
            {[
              <TbMathIntegral />,
              <TbTools />,
              <TbRulerMeasure />,
              <TbMathIntegral />,
              <TbCircuitCellPlus />,
              <TbMathFunction />,
              <TbBulbFilled />,
              <TbMathIntegral />,
              <TbHammer />,
              <TbMathFunction />,
              <TbMathFunction />,
            ].map((element, index) => (
              <div
                key={index}
                className={`w-min relative origin-top [&>*]:animate-[spin_30s_linear_infinite]`}
                style={{
                  left: `${
                    index % 2 == 0
                      ? 5 + Math.random() * 25
                      : 95 - Math.random() * 25
                  }vw`,
                  animation: `spin ${Math.random() * 25 + 15}s linear infinite`,
                }}
              >
                {element}
              </div>
            ))}
          </div>
          {children}
          <footer className="w-full h-20 flex flex-col justify-center items-center gap-1 bg-black self-end">
            <div className="flex gap-1">
              <p>Creada por</p>
              <a className="underline" href="">
                Lucas Cardozo
              </a>
            </div>
            <a
              className="text-sm underline sm:hover:underline sm:no-underline"
              href="/privacidad"
            >
              Politica y privacidad
            </a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
