import { useMainContext } from '@/app/contexts'
import { CgClose, CgMenu } from 'react-icons/cg'

interface Params {
  viewAside: boolean
  onClick: () => void
}

export const AsideMainButton = ({ viewAside, onClick }: Params) => {
  const { typeModule } = useMainContext()
  const isTp = typeModule == 'TP'

  return (
    <button
      className="fixed top-0 left-0 m-1 h-8 bg-(--black-olive) rounded-md aspect-square rounded-e-none z-50 sm:hidden"
      aria-label="Abrir o cerrar menú"
      onClick={onClick}
      title="Menú"
    >
      <CgMenu className={(viewAside ? 'opacity-0' : 'opacity-100') + ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'} />
      <CgClose className={(viewAside ? 'opacity-100' : 'opacity-0') + ' transform-gpu transition-opacity absolute top-0 left-0 w-full h-full p-1'} />
      <div className="absolute h-8 left-full top-0 text-xl bg-(--black-olive) drop-shadow-sm rounded-md px-1 flex items-center justify-center rounded-s-none whitespace-nowrap sm:hidden">
        {isTp ? <b>Busca tu TP</b> : <b>Busca tu Examen</b>}
      </div>
    </button>
  )
}
