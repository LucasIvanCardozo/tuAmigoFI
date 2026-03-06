'use client'
import React, { ComponentProps, JSX, useImperativeHandle } from 'react'
import { CgClose } from 'react-icons/cg'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')
ReactModal.defaultStyles = {
  overlay: {
    zIndex: 100,
    position: 'relative',
  },
}

export const Modal = ({ opener, refAux, ...rest }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  useImperativeHandle(refAux, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }))

  return (
    <>
      {React.cloneElement(opener, { onClick: () => setIsOpen(true) })}
      <ReactModal isOpen={isOpen} {...rest} className="fixed inset-0 z-100 bg-slate-800 bg-opacity-30 text-white flex justify-center items-center">
        <div className="relative flex flex-col max-w-lg w-11/12 max-h-screen overflow-y-auto bg-slate-800 p-5 rounded-lg justify-center items-center">
          <button className="absolute top-0 right-0 p-2 h-10 w-10 z-50" onClick={() => setIsOpen(false)}>
            <CgClose className="h-full w-full " />
          </button>
          {rest.children}
        </div>
      </ReactModal>
    </>
  )
}

export type ModalRef = { open: () => void; close: () => void }

type Props = Omit<ComponentProps<typeof ReactModal>, 'isOpen'> & {
  children: React.ReactNode
  opener: JSX.Element
  refAux?: React.Ref<ModalRef>
}
