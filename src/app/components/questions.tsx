'use client'
import { use, useState } from 'react'
import { DegreesWithPlansType } from '../lib/server/db/repository/degree.repository'
import { sileo } from 'sileo'

export default function Questions({ callback }: { callback: Promise<DegreesWithPlansType[]> }) {
  const [degreeState, setDegreeState] = useState<string>()
  const [planState, setPlanState] = useState<string>()

  const degrees = use(callback)

  return (
    <>
      <div className="flex flex-col gap-2 w-full sm:flex-row">
        <div className="flex gap-2 grow">
          <select name="degree" id="degree" aria-label="Elegir carrera" className="w-full grow shadow-sm p-1" onChange={(e) => setDegreeState(e.target.value)}>
            <option hidden>Elegir carrera</option>
            {degrees?.map((degree) => (
              <option key={degree.id} value={degree.name}>
                {degree.name}
              </option>
            ))}
          </select>
          {degreeState && (
            <select name="plan" id="plan" className="w-24" aria-label="Elegir plan" onChange={(e) => setPlanState(e.target.value)}>
              <option hidden>Plan</option>
              {degrees
                .find((degree) => degree.name == degreeState)
                ?.degrees_plans.map((plan, index) => (
                  <option key={index} value={plan.plans.year}>
                    {plan.plans.year}
                  </option>
                ))}
            </select>
          )}
        </div>
        <div className="flex gap-2">
          <a
            className="whitespace-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              ;(!degreeState || !planState) && (e.preventDefault(), sileo.error({ title: 'Debes elegir tu carrera y tu plan.' }))
            }}
            href={degreeState && `/planes-de-estudio/${encodeURIComponent(degreeState)}-${planState}.pdf`}
            target="_blank"
          >
            Plan de estudio 👀
          </a>
          <a
            className="whitespace-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow"
            onClick={(e) => {
              !degreeState && (e.preventDefault(), sileo.error({ title: 'Debes elegir tu carrera.' }))
            }}
            href={degreeState && `/horarios-de-cursada/${encodeURIComponent(degreeState)}.pdf`}
            target="_blank"
          >
            Horarios de cursada 👀
          </a>
        </div>
      </div>
    </>
  )
}
