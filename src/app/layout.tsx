import type { Metadata } from 'next';
import './globals.css';
import { cabin } from './assets/fonts';
import Nav from './components/nav';
import {
  TbTools,
  TbRulerMeasure,
  TbCircuitCellPlus,
  TbBulbFilled,
  TbHammer,
  TbMathFunction,
  TbMathIntegral,
} from 'react-icons/tb';
import Providers from './components/providers';
import Footer from './components/footer';
import { Loader } from './components/loader';

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
      <body className={cabin.className + ' flex flex-col h-dvh'}>
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
          <Footer />
          <Loader />
        </Providers>
      </body>
    </html>
  );
}
