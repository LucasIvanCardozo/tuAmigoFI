import Image from 'next/image'
import CalendarSection from './components/calendar'
import Contributors from './components/contributors'
import { Suspense } from 'react'
import ContributorsSkeleton from './components/skeletons/contributors.skeleton'
import ButtonInfoScore from './components/buttonInfoScore'
import { FaArrowRight } from 'react-icons/fa'
import QuestionSkeleton from './components/skeletons/question.skeleton'
import Questions from './components/questions'
import { degreeUseCases } from './lib/server/usecases/degree.usecases'
import { cacheLife } from 'next/cache'

export default async function Home() {
  const degreesCallback = degreeUseCases.findAllWithPlans()
  const callbackYear = async () => {
    'use cache: remote'
    cacheLife('weeks')
    return new Date().getFullYear()
  }

  return (
    <>
      <main className="pt-14 relative flex text-(--black) h-max w-11/12 justify-between mx-auto max-w-(--breakpoint-md) my-6 sm:pt-20 sm:justify-around">
        <div className="relative h-max w-2/5 max-w-52">
          <Image className="object-contain w-full " src="/FI.svg" width={200} height={200} alt="" priority />
          <h1 className="font-bold absolute text-4xl top-0 left-full text-left bg-[#F3F4F6] ml-1 p-1 rounded-2xl rounded-es-none shadow-md sm:ml-6 sm:p-2">
            Bienvenido!
            <p className="whitespace-nowrap text-xl font-normal">Aquí tu amigo 'FI'</p>
          </h1>
        </div>
        <div className="self-end h-auto">
          <span>Canales oficiales</span>
          <ul className="flex justify-around w-full drop-shadow-sm">
            {channelList.map((data, index) => (
              <li key={index}>
                <a href={data.link} target="_blank">
                  <Image
                    className="object-contain rounded-md"
                    src={data.src}
                    width={25}
                    height={25}
                    alt={`Logo de ${data.name}`}
                    aria-label={`Ir a la pagina de ${data.name}`}
                    priority
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <section className="text-(--black) max-w-(--breakpoint-md) m-auto my-4 w-full text-balance text-center sm:hidden">
        En <strong>Tu-Amigo-FI</strong> encontrás <strong>finales</strong>, <strong>trabajos prácticos</strong>, un <strong>calendario académico</strong> y
        mucho más. Todo pensado para darte una mano en tu carrera de ingeniería.
      </section>
      <section className="hidden text-(--black) max-w-(--breakpoint-md) my-4 m-auto w-full text-balance text-center sm:block">
        En <strong>Tu-Amigo-FI</strong> tenés todo lo que necesitás para avanzar en ingeniería: <strong>finales</strong>,{' '}
        <strong>trabajos prácticos resueltos por la comunidad</strong>, y mucho más para facilitarte el estudio. También podés consultar el{' '}
        <strong>calendario académico</strong> y subir tus propios aportes para ayudar a otros estudiantes. Todo en un solo lugar para que tu paso por la facu
        sea más llevadero.
      </section>

      <section className="text-(--black) my-4 relative max-w-(--breakpoint-md) m-auto w-11/12">
        <h2 className="w-full text-center font-bold -z-10 text-3xl mb-2 sm:text-4xl">Consultas</h2>
        <Suspense fallback={<QuestionSkeleton />}>
          <Questions callback={degreesCallback} />
        </Suspense>
        <ul className="w-full overflow-hidden my-2 flex flex-col gap-1">
          {questionList.map(({ question, link, value }, index) => (
            <li key={index} className="flex flex-nowrap gap-1 items-center whitespace-nowrap ">
              <span className="w-max">
                <b>{question}</b>
              </span>
              <FaArrowRight />
              <a className="underline" target="_blank" href={link}>
                {value}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <CalendarSection callbackYear={callbackYear()} />
      <section className="text-(--black) relative max-w-(--breakpoint-md) m-auto w-11/12 my-4">
        <h2 className="font-bold text-3xl my-2 flex gap-1 items-center justify-center">
          Colaboradores
          <ButtonInfoScore />
        </h2>
        <p className="text-balance pb-2 text-center">
          Gracias a quienes suman su esfuerzo compartiendo recursos y soluciones, ayudando a construir una comunidad más fuerte para todos los estudiantes. ¡Tu
          aporte marca la diferencia! 💖
        </p>
        <Suspense fallback={<ContributorsSkeleton />}>
          <Contributors />
        </Suspense>
      </section>
      <section className="flex text-(--black) justify-center  max-w-(--breakpoint-md) m-auto my-4 w-11/12">
        <Image className="object-contain w-1/4 min-w-24" src="/FI.svg" width={200} height={200} alt="" />
        <div className="max-w-96 pl-2">
          <h2 className="text-2xl sm:text-3xl">
            <b>¿Algún problema?</b>
          </h2>
          <p className="pl-1 text-balance sm:text-lg">
            No dudes en contactarte con{' '}
            <a className="text-blue-700" href="https://www.instagram.com/cei_unmdp/" target="_blank">
              <b>Cauces</b>
            </a>
            , éste es el centro de estudiantes actual de la facultad. Ellos no dudarán en darte una mano.
          </p>
        </div>
      </section>
    </>
  )
}

const questionList = [
  {
    question: '¿En que aula curso hoy?',
    link: 'https://salas.fi.mdp.edu.ar/',
    value: 'salas.fi.mdp.edu.ar',
  },
  {
    question: '¿Dónde me inscribo a las matrerias?',
    link: 'https://portalsiu.mdp.edu.ar/autogestion/cursada',
    value: 'portalsiu.mdp.edu.ar',
  },
  {
    question: '¿Novedades?',
    link: 'https://www.instagram.com/cei_unmdp/',
    value: 'instagram.com/cei',
  },
]

const channelList = [
  {
    link: 'https://www.fi.mdp.edu.ar/',
    src: '/unmdpfi.webp',
    name: 'UNMDP de Ingenieria',
  },
  {
    link: 'https://www.instagram.com/cei_unmdp/',
    src: '/unmdpcei.webp',
    name: 'centro de estudiates de la UNMDP de Ingenieria',
  },
  {
    link: 'https://campus.fi.mdp.edu.ar/',
    src: '/campus.ico',
    name: 'campus de la UNMDP de Ingenieria',
  },
]
