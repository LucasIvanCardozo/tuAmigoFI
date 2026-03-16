import { Loading as Spinner } from '@/app/components/layout/loading'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner size={12} mode="black" />
    </div>
  )
}
