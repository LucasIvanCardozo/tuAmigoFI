interface Params {
  size: number
  mode: 'white' | 'black'
}

export const Loading = ({ size, mode }: Params) => {
  return (
    <div
      className={`${
        mode == 'white' ? 'border-white' : 'border-black'
      } inline-block h-${size} w-${size} animate-spin rounded-full border-2 border-solid  border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">Loading...</span>
    </div>
  )
}
