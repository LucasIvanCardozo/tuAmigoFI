import Image from 'next/image';
import { fetchDegree } from './lib/data';
import PlansDownload from './UI/components/plansDownload';
import DatePicker, { Calendar } from 'react-multi-date-picker';
import { Suspense } from 'react';
import CalendarSection from './UI/components/calendar';

export default async function Home() {
  const degrees: ({
    degrees_plans: {
      plans: {
        id: number;
        year: number;
      };
    }[];
  } & {
    id: number;
    name: string;
  })[] = await fetchDegree();
  return (
    <>
      <main className="mt-14 relative flex text-[--black] min-h-36 h-auto w-11/12 justify-between m-auto max-w-screen-md sm:mt-20 sm:justify-around">
        <div className="relative w-2/5 max-w-52">
          <Image
            className="object-contain w-full "
            src="/FI.svg"
            width={200}
            height={200}
            alt=""
          />
          <h1 className="font-bold absolute text-4xl top-0 left-full text-left bg-[#F3F4F6] ml-1 p-1 rounded-2xl rounded-es-none shadow-md sm:ml-6 sm:p-2">
            Bienvenido!
            <p className="text-nowrap text-xl font-normal">
              Aquí tu amigo 'FI'
            </p>
          </h1>
        </div>
        <div className="self-end h-auto">
          <span>Canales oficiales</span>
          <ul className="flex justify-around w-full drop-shadow-sm">
            {[
              { link: 'https://www.fi.mdp.edu.ar/', src: '/unmdpfi.jpg' },
              {
                link: 'https://www.instagram.com/cei_unmdp/',
                src: '/unmdpcei.png',
              },
              {
                link: 'https://campus.fi.mdp.edu.ar/',
                src: '/campus.ico',
              },
            ].map((data, index) => (
              <li key={index}>
                <a href={data.link} target="_blank">
                  <Image
                    className="object-contain rounded-md"
                    src={data.src}
                    width={25}
                    height={25}
                    alt=""
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <section className="text-[--black] max-w-screen-md m-auto my-10 w-full text-balance text-center">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
        doloribus est necessitatibus quis aut beatae nulla maiores iste possimus
        temporibus vero soluta delectus in similique, expedita nihil
        repellendus, molestiae corrupti? Lorem ipsum dolor sit, amet consectetur
      </section>
      <section className="text-[--black] relative max-w-screen-md m-auto w-11/12">
        <h2 className="font-bold text-3xl my-2">Planes de estudio</h2>
        <PlansDownload degrees={degrees} />
      </section>
      <Suspense>
        <CalendarSection />
      </Suspense>
      <section className="text-[--black] relative max-w-screen-md m-auto w-11/12 h-96">
        <h2 className="font-bold text-3xl my-2">Colaboradores</h2>
      </section>
    </>
  );
}
