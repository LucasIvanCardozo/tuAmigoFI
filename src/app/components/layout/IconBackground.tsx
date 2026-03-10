import { TbMathIntegral, TbTools, TbRulerMeasure, TbCircuitCellPlus, TbMathFunction, TbBulbFilled, TbHammer } from 'react-icons/tb'

export const IconBackground = () => {
  return (
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
          key={element.key}
          className={`w-min relative origin-top *:animate-[spin_30s_linear_infinite]`}
          style={{
            left: `${index % 2 == 0 ? 5 + Math.random() * 25 : 95 - Math.random() * 25}vw`,
            animation: `spin ${Math.random() * 25 + 15}s linear infinite`,
          }}
        >
          {element}
        </div>
      ))}
    </div>
  )
}
