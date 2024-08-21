import Image from 'next/image';
import { fetchDegree } from './lib/data';
import CalendarSection from './UI/components/calendar';
import QuestionsSection from './UI/components/questionsSection';

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
      <main className="pt-14 relative flex text-[--black] min-h-36 h-auto w-11/12 justify-between mx-auto max-w-screen-md my-10 sm:pt-20 sm:justify-around">
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
      <section className="text-[--black] max-w-screen-md m-auto w-full text-balance text-center">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
        doloribus est necessitatibus quis aut beatae nulla maiores iste possimus
        temporibus vero soluta delectus in similique, expedita nihil
        repellendus, molestiae corrupti? Lorem ipsum dolor sit, amet consectetur
      </section>
      
        <QuestionsSection degrees={degrees} />
      <CalendarSection />
      <section className="text-[--black] relative max-w-screen-md m-auto w-11/12 h-96">
        <h2 className="font-bold text-3xl my-2">Colaboradores</h2>
      </section>
      <section className="flex text-[--black] justify-center  max-w-screen-md m-auto w-11/12">
        <Image
          className="object-contain w-1/4 min-w-24"
          src="/FI.svg"
          width={200}
          height={200}
          alt=""
        />
        <div className="max-w-96 pl-2">
          <h2 className="text-2xl sm:text-3xl">
            <b>¿Algún problema?</b>
          </h2>
          <p className="pl-1 text-balance sm:text-lg">
            No dudes en contactarte con el{' '}
            <a
              className="text-blue-700"
              href="https://www.instagram.com/cei_unmdp/"
            >
              <b>CEI</b>
            </a>
            , éste es el centro de estudiantes actual de la facultad. Ellos no
            dudarán en darte una mano.
          </p>
        </div>
      </section>
    </>
  );
}
