import { CgArrowRightO } from 'react-icons/cg'
import CorrelativeList from './correlativeList'
import { courseUseCases } from '@/app/lib/server/usecases/course.usecases'

export default async function CorrelativeTable({ idCourse, idDegree }: { idCourse: string; idDegree?: string }) {
  const dataCorrelatives = await courseUseCases.findCorrelativesById({ idCourse, idDegree })
  const dataEnabler = await courseUseCases.findEnablesById({ idCourse, idDegree })

  return (
    <div className="pl-2 my-1">
      <div className="flex h-6 min-h-6 gap-1 text-sm text-[--black-olive] sm:h-auto">
        <div className="flex items-center h-full justify-between gap-1 self-start w-19">
          <p>Necesitas</p>
          <CgArrowRightO className="self-center text-[--midnight-green]" />
        </div>
        <div className="flex  items-center overflow-x-auto overflow-y-hidden sm:overflow-hidden sm:flex-wrap">
          {dataCorrelatives.length != 0 ? (
            dataCorrelatives.map(({ id, name }, index) => <CorrelativeList key={id} index={index} name={name} />)
          ) : (
            <p className="opacity-75">No tiene correlativas</p>
          )}
        </div>
      </div>
      <div className="flex h-6 gap-1 text-sm text-[--black-olive] sm:h-auto">
        <div className="flex items-center h-full justify-between gap-1 self-start w-19">
          <p>Habilita</p>
          <CgArrowRightO className="self-center text-[--midnight-green]" />
        </div>
        <div className="flex items-center overflow-x-auto overflow-y-hidden sm:overflow-hidden sm:flex-wrap">
          {dataEnabler.length != 0 ? (
            dataEnabler.map(({ id, name }, index) => <CorrelativeList key={id} index={index} name={name} />)
          ) : (
            <p className="opacity-75">No tiene habilitantes</p>
          )}
        </div>
      </div>
    </div>
  )
}
