interface Params {
  size: 4 | 6 | 8 | 12 | 16;
  mode: 'white' | 'black';
}

const SIZE_CLASSES: Record<Params['size'], string> = {
  4: 'h-4 w-4',
  6: 'h-6 w-6',
  8: 'h-8 w-8',
  12: 'h-12 w-12',
  16: 'h-16 w-16',
};

export const Loading = ({ size, mode }: Params) => {
  return (
    <div
      className={`${
        mode === 'white' ? 'border-white' : 'border-black'
      } ${SIZE_CLASSES[size]} inline-block animate-spin rounded-full border-2 border-solid border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">
        Loading...
      </span>
    </div>
  );
};
