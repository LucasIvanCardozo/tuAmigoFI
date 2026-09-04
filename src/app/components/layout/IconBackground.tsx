'use cache: remote';
import {
  TbBulbFilled,
  TbCircuitCellPlus,
  TbHammer,
  TbMathFunction,
  TbMathIntegral,
  TbRulerMeasure,
  TbTools,
} from 'react-icons/tb';

export const IconBackground = async () => {
  return (
    <div className="overflow-hidden -z-10 fixed flex flex-col justify-around top-0 left-0 w-screen h-screen text-3xl text-[#BABDBA] sm:text-5xl">
      {[
        <TbMathIntegral key="math-integral-1" />,
        <TbTools key="tools" />,
        <TbRulerMeasure key="ruler" />,
        <TbMathIntegral key="math-integral-2" />,
        <TbCircuitCellPlus key="circuit" />,
        <TbMathFunction key="math-function-1" />,
        <TbBulbFilled key="bulb" />,
        <TbMathIntegral key="math-integral-3" />,
        <TbHammer key="hammer" />,
        <TbMathFunction key="math-function-2" />,
        <TbMathFunction key="math-function-3" />,
      ].map((element, index) => (
        <div
          key={element.key}
          className={`w-min relative origin-top *:animate-[spin_30s_linear_infinite]`}
          style={{
            left: `${index % 2 === 0 ? 5 + Math.random() * 25 : 95 - Math.random() * 25}vw`,
            animation: `spin ${Math.random() * 25 + 15}s linear infinite`,
          }}
        >
          {element}
        </div>
      ))}
    </div>
  );
};
