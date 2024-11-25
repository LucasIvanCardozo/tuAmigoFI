export default function CoursesSkeleton() {
  return (
    <ul className="w-full flex flex-col gap-3 items-center my-5 text-[--black]">
      <div className="relative w-full bg-[--white] opacity-90 h-40 shadow-md p-2 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] sm:w-11/12"></div>
      <div className="relative w-full bg-[--white] opacity-90 h-40 shadow-md p-2 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_0.2s_infinite] sm:w-11/12"></div>
      <div className="relative w-full bg-[--white] opacity-90 h-40 shadow-md p-2 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_0.2s_infinite] sm:w-11/12"></div>
      <div className="relative w-full bg-[--white] opacity-90 h-40 shadow-md p-2 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_0.2s_infinite] sm:w-11/12"></div>
      <div className="relative w-full bg-[--white] opacity-90 h-40 shadow-md p-2 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_0.2s_infinite] sm:w-11/12"></div>
    </ul>
  );
}
