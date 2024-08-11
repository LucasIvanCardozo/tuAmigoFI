import { Metadata } from 'next';
import {
  TbTools,
  TbRulerMeasure,
  TbCircuitCellPlus,
  TbBulbFilled,
  TbHammer,
  TbMathFunction,
  TbMathIntegral,
} from 'react-icons/tb';

export const metadata: Metadata = {
  title: 'Tu amigo FI - Materias',
  description:
    'Creada para ayudar a ingresantes y avanzados alumnos, en la Facultad de Ingenieria de Mar del Plata, con su desafiante carrera.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="overflow-hidden -z-10 absolute flex flex-col justify-around top-0 left-0 w-full h-full text-3xl text-[--silver] sm:text-5xl">
        {[
          <TbTools />,
          <TbRulerMeasure />,
          <TbCircuitCellPlus />,
          <TbBulbFilled />,
          <TbHammer />,
          <TbMathFunction />,
          <TbMathIntegral />,
        ].map((element, index) => (
          <div
            key={index}
            className={`w-min relative origin-top [&>*]:animate-[spin_30s_linear_infinite]`}
            style={{
              left: `${
                index % 2 == 0
                  ? 5 + Math.random() * 30
                  : 65 + Math.random() * 30
              }vw`,
              animation: `spin ${Math.random() * 25 + 15}s linear infinite`,
            }}
          >
            {element}
          </div>
        ))}
      </div>
      {children}
    </>
  );
}
