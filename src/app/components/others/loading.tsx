interface Params {
  size: number;
  mode: 'white' | 'black';
}

export const Loading = ({ size, mode }: Params) => {
  return (
    // <div className={`flex justify-cente`}>
    //   <div className="relative">
    //     <div
    //       className={`absolute h-${size} w-${size} border-x-2 ${
    //         mode == 'white' ? 'bg-white' : 'bg-black'
    //       } border-${
    //         mode == 'white' ? 'white' : 'black'
    //       }  bg-opacity-5 rounded-full animate-spin`}
    //     ></div>
    //     <div
    //       className={`h-${size} w-${size} border-2 ${
    //         mode == 'white' ? 'border-white' : 'border-black'
    //       } opacity-40 rounded-full animate-ping`}
    //     ></div>
    //   </div>
    // </div>
    <div
      className={`${
        mode == 'white' ? 'border-white' : 'border-black'
      } inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
