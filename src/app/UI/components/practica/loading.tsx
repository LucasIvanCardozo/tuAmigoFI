interface Params {
  size: number;
  mode: 0 | 1;
}

export const Loading = ({ size, mode }: Params) => {
  return (
    <div className={`flex justify-cente`}>
      <div className="relative">
        <div
          className={`absolute h-${size} w-${size} border-x-2 bg-${
            mode ? 'white' : 'black'
          } border-${
            mode ? 'white' : 'black'
          }  bg-opacity-20 rounded-full animate-spin`}
        ></div>
        <div
          className={`h-${size} w-${size} border-2 border-${
            mode ? 'white' : 'black'
          } opacity-40 rounded-full animate-ping`}
        ></div>
      </div>
    </div>
  );
};
