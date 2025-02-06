export default async function QuestionSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full sm:flex-row">
      <div className="flex gap-2 grow">
        <div className="w-full grow shadow-sm p-1 bg-[--white] opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu ">
          <p className="opacity-0 select-none">.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow opacity-65">
          Plan de estudio 👀
        </div>
        <div className="text-nowrap text-center cursor-pointer self-end py-1 px-2 text-base rounded-sm bg-[--midnight-green] text-[--white] grow opacity-65">
          Horarios de cursada 👀
        </div>
      </div>
    </div>
  );
}
