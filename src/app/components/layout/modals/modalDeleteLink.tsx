// 'src/app/components/ModalImportImage.tsx'
'use client'
import { Modal } from './Modal'
import { Link } from '@/app/lib/server/db/prisma/prismaClient/client'
import { useSession } from 'next-auth/react'
import { FormEvent, useRef, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { ModalRef } from './Modal'
import { deleteLink } from '@/app/lib/server/actions/links/delete.action'
import { sileo } from 'sileo'
import { useReload } from '@/app/hooks/useReload'

export default function ModalDeleteLink({ link }: { link: Link }) {
  const [check, setCheck] = useState<boolean>()
  const modalRef = useRef<ModalRef>(null)
  const { data: session } = useSession()
  const { startReload } = useReload()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sileo.promise(
      async () => {
        if (!check) throw new Error('Debes estar de acuerdo con la eliminacion del link')
        if (!session) throw new Error('No hay sesion')
        if (session.user.tier != 2 || session.user.id != link.idUser) throw new Error('Debes ser administrador o el creador para eliminar un link')
        await deleteLink({ id: link.id, idUser: link.idUser })
        modalRef.current?.close()
        startReload()
      },
      {
        loading: { title: 'Cargando...' },
        success: { title: 'Muchas gracias por tu aporte! ❤️' },
        error: (error) => {
          return { title: (error as Error).message }
        },
      }
    )
  }

  return (
    <Modal
      refAux={modalRef}
      opener={
        <button className="h-full" aria-label="Eliminar link" title="Eliminar link">
          <MdDelete className="h-full" />
        </button>
      }
    >
      <form className="relative flex flex-col w-full" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg mb-4">
            <b>{`Eliminar link`}</b>
          </h3>
          <div className="flex flex-col gap-1 [&>*]:flex [&>*]:gap-1">
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
              <label htmlFor="check">Quiero eliminarlo</label>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm">Recuerda!</h3>
          <p className="text-xs">
            Por favor elimine el link solo si considera que este no debería estar presente en la página. En caso de cualquier problema podes contactarme:{' '}
            <a className="underline" target="_blank" href="https://wa.me/+5492235319564">
              2235319564
            </a>
          </p>
        </div>
        <div className="flex justify-center">
          <button className="px-2 py-1 border-slate-700 border-2 rounded-md hover:bg-slate-700  transition-colors" type="submit">
            Eliminar
          </button>
        </div>
      </form>
    </Modal>
  )
}
