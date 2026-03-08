'use client'
import { useSession } from 'next-auth/react'
import { use, useState } from 'react'
import { VscTriangleDown, VscTriangleRight } from 'react-icons/vsc'
import ModalDeleteLink from '../../layout/modals/modalDeleteLink'
import { Link } from '@/app/lib/server/db/prisma/prismaClient/client'

export default function CourseLinks({ callbackLinks }: { callbackLinks: Promise<Link[]> }) {
  const [viewStateOfficial, setViewStateOfficial] = useState<boolean>(false)

  const links = use(callbackLinks)

  const { data: session } = useSession()

  const handleClickOfficial = () => {
    setViewStateOfficial(!viewStateOfficial)
  }

  return (
    <>
      <button className="flex items-center cursor-pointer w-fit" onClick={handleClickOfficial} aria-label="Ver links oficiales" title="Links oficiales">
        {viewStateOfficial ? <VscTriangleDown /> : <VscTriangleRight />}
        <h3>
          <b>Links </b>
          {`(${links.length})`}
        </h3>
      </button>
      <div className="overflow-hidden">
        <div className={(viewStateOfficial ? 'h-auto' : 'h-0') + ' ease-linear duration-100 pl-5 transform-gpu w-min flex'}>
          {
            links.map((link, index) => (
              <span key={link.id} className="relative text-sm whitespace-nowrap flex">
                <a href={link.link} target="_blanck" className="underline hover:underline px-1 sm:no-underline" title={link.link}>
                  {link.name}
                </a>
                {/* {session && <ModalReportLink link={link} />} */}
                {(session?.user.tier == 2 || session?.user.id == link.idUser) && <ModalDeleteLink link={link} />}
                {index !== links.length - 1 && ' -'}
              </span>
            ))
            // )
          }
        </div>
      </div>
    </>
  )
}
