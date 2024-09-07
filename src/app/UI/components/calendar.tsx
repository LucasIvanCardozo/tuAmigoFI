'use client';
import { useEffect, useState } from 'react';
import { Calendar } from 'react-multi-date-picker';
import CoursesSkeleton from './skeletons/coursesSkeleton';

const spanish_es = {
  name: 'gregorian_es',
  months: [
    ['enero', 'ene'],
    ['febrero', 'feb'],
    ['marzo', 'mar'],
    ['abril', 'abr'],
    ['mayo', 'may'],
    ['junio', 'jun'],
    ['julio', 'jul'],
    ['agosto', 'ago'],
    ['septiembre', 'sep'],
    ['octubre', 'oct'],
    ['noviembre', 'nov'],
    ['diciembre', 'dic'],
  ],
  weekDays: [
    ['sábado', 'sáb'],
    ['domingo', 'dom'],
    ['lunes', 'lun'],
    ['martes', 'mar'],
    ['miércoles', 'mié'],
    ['jueves', 'jue'],
    ['viernes', 'vie'],
  ],
  digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  meridiems: [
    ['AM', 'am'], // En español, AM y PM suelen usarse igual que en inglés
    ['PM', 'pm'],
  ],
};

export default function CalendarSection() {
  const [countCalendar, setCountCalendar] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const yearCurrent: number = new Date().getFullYear();
  const recessDays: string[] = [
    `${yearCurrent}/01/01`,
    `${yearCurrent}/01/02`,
    `${yearCurrent}/01/03`,
    `${yearCurrent}/01/04`,
    `${yearCurrent}/01/05`,
    `${yearCurrent}/01/06`,
    `${yearCurrent}/01/07`,
    `${yearCurrent}/01/08`,
    `${yearCurrent}/01/09`,
    `${yearCurrent}/01/10`,
    `${yearCurrent}/01/11`,
    `${yearCurrent}/01/12`,
    `${yearCurrent}/01/13`,
    `${yearCurrent}/01/14`,
    `${yearCurrent}/01/15`,
    `${yearCurrent}/01/16`,
    `${yearCurrent}/01/17`,
    `${yearCurrent}/01/18`,
    `${yearCurrent}/01/19`,
    `${yearCurrent}/01/20`,
    `${yearCurrent}/01/21`,
    `${yearCurrent}/01/22`,
    `${yearCurrent}/01/23`,
    `${yearCurrent}/01/24`,
    `${yearCurrent}/01/25`,
    `${yearCurrent}/01/26`,
    `${yearCurrent}/01/27`,
    `${yearCurrent}/01/28`,
    `${yearCurrent}/01/29`,
    `${yearCurrent}/01/30`,
    `${yearCurrent}/01/31`,
    `${yearCurrent}/07/15`,
    `${yearCurrent}/07/16`,
    `${yearCurrent}/07/17`,
    `${yearCurrent}/07/18`,
    `${yearCurrent}/07/19`,
    `${yearCurrent}/07/20`,
    `${yearCurrent}/07/21`,
    `${yearCurrent}/07/22`,
    `${yearCurrent}/07/23`,
    `${yearCurrent}/07/24`,
    `${yearCurrent}/07/25`,
    `${yearCurrent}/07/26`,
  ];
  const holidays: string[] = [
    `${yearCurrent}/02/12`,
    `${yearCurrent}/02/13`,
    `${yearCurrent}/03/28`,
    `${yearCurrent}/03/29`,
    `${yearCurrent}/04/02`,
    `${yearCurrent}/04/16`,
    `${yearCurrent}/05/01`,
    `${yearCurrent}/05/25`,
    `${yearCurrent}/06/17`,
    `${yearCurrent}/06/20`,
    `${yearCurrent}/07/09`,
    `${yearCurrent}/08/17`,
    `${yearCurrent}/09/21`,
    `${yearCurrent}/10/12`,
    `${yearCurrent}/11/20`,
    `${yearCurrent}/12/25`,
  ];
  const midtermsDays: string[] = [
    `${yearCurrent}/02/14`,
    `${yearCurrent}/02/15`,
    `${yearCurrent}/02/16`,
    `${yearCurrent}/02/17`,
    `${yearCurrent}/02/19`,
    `${yearCurrent}/02/20`,
    `${yearCurrent}/02/26`,
    `${yearCurrent}/02/27`,
    `${yearCurrent}/02/28`,
    `${yearCurrent}/02/29`,
    `${yearCurrent}/03/01`,
    `${yearCurrent}/03/02`,
    `${yearCurrent}/07/05`,
    `${yearCurrent}/07/06`,
    `${yearCurrent}/07/08`,
    `${yearCurrent}/07/10`,
    `${yearCurrent}/07/11`,
    `${yearCurrent}/07/12`,
    `${yearCurrent}/07/29`,
    `${yearCurrent}/07/30`,
    `${yearCurrent}/07/31`,
    `${yearCurrent}/08/01`,
    `${yearCurrent}/08/02`,
    `${yearCurrent}/08/03`,
    `${yearCurrent}/08/05`,
    `${yearCurrent}/08/06`,
    `${yearCurrent}/08/07`,
    `${yearCurrent}/08/08`,
    `${yearCurrent}/08/09`,
    `${yearCurrent}/08/10`,
    `${yearCurrent}/12/16`,
    `${yearCurrent}/12/17`,
    `${yearCurrent}/12/18`,
    `${yearCurrent}/12/19`,
    `${yearCurrent}/12/20`,
    `${yearCurrent}/12/21`,
  ];
  const startEndDays: string[] = [
    `${yearCurrent}/03/04`,
    `${yearCurrent}/08/12`,
    `${yearCurrent}/11  /30`,
  ];
  const allDays: string[] = recessDays
    .concat(holidays)
    .concat(midtermsDays)
    .concat(startEndDays);

  useEffect(() => {
    const updateCountCalendar = () => {
      const width = document.documentElement.clientWidth;
      if (width < 640) setCountCalendar(1);
      else if (width >= 640 && width < 1024) setCountCalendar(2);
      else setCountCalendar(3);
    };
    updateCountCalendar();
    setTimeout(() => {
      setLoading(false);
    }, 400);
    const mediaQuery640 = window.matchMedia('(min-width: 640px)');
    const mediaQuery1024 = window.matchMedia('(min-width: 1024px)');

    // Escucha los cambios en las media queries
    mediaQuery640.addEventListener('change', updateCountCalendar);
    mediaQuery1024.addEventListener('change', updateCountCalendar);

    // Limpieza para remover los event listeners
    return () => {
      mediaQuery640.removeEventListener('change', updateCountCalendar);
      mediaQuery1024.removeEventListener('change', updateCountCalendar);
    };
  }, []);

  return (
    <section className="relative mt-5 text-[--black] max-w-screen-md m-auto w-11/12">
      <div className="text-3xl w-full flex h-fit sm:text-4xl">
        <h2 className="font-bold flex flex-col mb-2">
          <span>Calendario académico</span>
        </h2>
      </div>
      <div className="w-full">
        {loading ? (
          <div className="w-full h-72 flex justify-center items-center">
            <div className="w-16 h-16 border-dashed border-l-4 border-t-4 border-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <Calendar
            className="m-auto"
            locale={spanish_es}
            multiple
            numberOfMonths={countCalendar}
            readOnly
            mapDays={({ date, today }) => {
              let dateStr = date.toString().split('T')[0];
              if (allDays.includes(dateStr)) {
                if (recessDays.includes(dateStr)) {
                  return {
                    style: {
                      backgroundColor: '#9A031E',
                      color: 'white',
                      borderRadius: '20%',
                    },
                  };
                } else if (midtermsDays.includes(dateStr))
                  return {
                    style: {
                      backgroundColor: '#5F0F40',
                      color: 'white',
                      borderRadius: '20%',
                    },
                  };
                else if (holidays.includes(dateStr))
                  return {
                    style: {
                      backgroundColor: '#0F4C5C',
                      color: 'white',
                      borderRadius: '20%',
                    },
                  };
                else
                  return {
                    style: {
                      backgroundColor: '#5192A4',
                      color: 'white',
                      borderRadius: '20%',
                    },
                  };
              } else if (
                date.toDate().toDateString() == today.toDate().toDateString()
              ) {
                return {
                  style: {
                    backgroundColor: 'yellow',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '20%',
                  },
                };
              }
            }}
          />
        )}
        <div className="text-nowrap flex justify-center gap-2 flex-wrap m-2">
          <div className=" h-4 relative flex items-center gap-1">
            <div className="h-4/5 aspect-video  bg-[#9A031E]"></div>
            <span>Receso</span>
          </div>
          <div className=" h-4 relative flex items-center gap-1">
            <div className="h-4/5 aspect-video  bg-[#5F0F40]"></div>
            <span>Totalizadores</span>
          </div>
          <div className=" h-4 relative flex items-center gap-1">
            <div className="h-4/5 aspect-video  bg-[#0F4C5C]"></div>
            <span>Feriado</span>
          </div>
          <div className=" h-4 relative flex items-center gap-1">
            <div className="h-4/5 aspect-video  bg-[#5192A4]"></div>
            <span>Inicio/Fin de cuatrimestre</span>
          </div>
        </div>
      </div>
    </section>
  );
}
