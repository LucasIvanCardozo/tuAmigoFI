// 'src/app/components/ModalImportImage.tsx'
'use client'
import { Modal } from './Modal'
import { Loading } from '@/app/components/layout/loading'
import { Link } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { FormEvent, useRef, useState } from 'react'
import { MdOutlineReport } from 'react-icons/md'
import { ModalRef } from './Modal'

export default function ModalReportLink({ link }: { link: Link }) {
  const [check, setCheck] = useState<boolean>()
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const modalRef = useRef<ModalRef>(null)
  const { data: session } = useSession()

  const formValidate = (): boolean => {
    if (!check) {
      setError('Debes estar de acuerdo con la eliminacion del link')
      return false
    }
    if (!session?.user) {
      setError('Debes iniciar sesion y ser administrador para eliminar un TP')
      return false
    }
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formValidate() && session) {
      try {
        // await addReportLink({ id_link: link.id, id_user: session.user.id })
        setConfirmed(true)
        modalRef.current?.close()
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else setError('Ocurrio un error inesperado')
      }
    }
    setLoading(false)
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button className="h-full text-red-700" aria-label="Reportar link" title="Reportar link">
          <MdOutlineReport className="h-full" />
        </button>
      }
    >
      <form className="relative flex flex-col w-full" onSubmit={(e) => (setLoading(true), handleSubmit(e))}>
        <div>
          <h3 className="text-lg mb-4">
            <b>{`Reportar link`}</b>
          </h3>
          <div className="flex flex-col gap-1 *:flex *:gap-1">
            <span>
              <b>Nombre:</b>
              {link.name}
            </span>
            <span>
              <b>Link:</b>
              <a href={link.link} className="hover:underline">
                {link.link}
              </a>
            </span>
            <div>
              <input type="checkbox" name="check" id="check" onChange={(e) => setCheck(e.target.checked)} required />
              <label htmlFor="check">Quiero reportarlo</label>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor sea reporte el link solo si considera que este no debería estar presente en la pagina. En caso de cualquier problema podes contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
        {confirmed && <span>Gracias por tu reporte!</span>}
        <div className="flex justify-center">
          {loading ? (
            <Loading size={6} mode="white" />
          ) : (
            !confirmed && (
              <button className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors" type="submit">
                Reportar
              </button>
            )
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </Modal>
  )
}
