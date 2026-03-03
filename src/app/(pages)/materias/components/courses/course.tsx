import CorrelativeTable from './correlativeTable'
import { Suspense } from 'react'
import CorrelativeTableSkeleton from '@/app/components/skeletons/correlativeTableSkeleton'
import DegreesListSkeleton from '@/app/components/skeletons/degreesListSkeleton'
import CourseLinksSkeleton from '@/app/components/skeletons/courseLinksSkeleton'
import { ButtonUrl } from './buttonUrl'
import { Course as CourseType } from '@/app/lib/server/db/prisma/prismaClient/client'
import CourseLinks from './courseLinks'
import DegreeList from './modals/degreeList'
import ModalCreateCorrelative from './modals/modalCreateCorrelative'
import ModalAddLink from './modals/modalAddLink'
import { linkUseCases } from '@/app/lib/server/usecases/link.usecases'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'
import { getServerUser } from '@/app/lib/server/actions/users/get.server.user'

export default async function Course({ course, idDegree }: { course: CourseType; idDegree?: string }) {
  const { id, name, cg, hs, optional } = course
  const session = await getServerUser()
  const callbackLinks = linkUseCases.findByCourseId(id)
  const callbackCourses = courseUseCases.findAll()

  return (
    <li className="relative select-none flex flex-col w-full h-min bg-[--white] shadow-md p-2 transform-gpu transition-transform sm:w-11/12 sm:will-change-transform">
      <div className="relative flex gap-1 justify-between w-full select-text">
        <h2 className="font-bold whitespace-nowrap overflow-x-auto text-lg text-[--white] bg-[--dark-cyan] sm:font-normal sm:text-wrap sm:leading-6">{name}</h2>
        {optional ? <span className="absolute left-full text-sm">{`(Opcional)`}</span> : ''}
        <div className="flex items-center text-center whitespace-nowrap px-1">
          <span>{`${cg}CG / ${hs}Hs`}</span>
        </div>
      </div>

      <Suspense fallback={CorrelativeTableSkeleton()}>
        <CorrelativeTable idCourse={id} idDegree={idDegree} />
      </Suspense>
      <Suspense fallback={<CourseLinksSkeleton />}>
        <CourseLinks callbackLinks={callbackLinks} />
      </Suspense>
      <div className="text-sm h-8 items-center w-full flex overflow-y-hidden overflow-x-auto gap-x-1 opacity-75 leading-4 sm:pt-2 sm:flex-wrap sm:overflow-visible sm:h-auto">
        <b className="whitespace-nowrap">Está en:</b>
        <Suspense fallback={<DegreesListSkeleton />}>
          <DegreeList idCourse={id} />
        </Suspense>
      </div>
      <div className="flex justify-end gap-1 pt-1 text-[--white] items-center text-sm sm:text-base">
        {session && session?.user && session?.user.tier > 0 && <ModalCreateCorrelative course={course} callback={callbackCourses} />}
        <ModalAddLink course={course} />
        <ButtonUrl url={`./materias/parciales/${id}`} label="Ver exámenes" />
        <ButtonUrl url={`./materias/practica/${id}`} label="Ir a la práctica" />
      </div>
    </li>
  )
}
