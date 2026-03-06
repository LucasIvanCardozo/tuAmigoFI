export default async function YearSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-16">
      <div className="w-full h-5 grow shadow-sm p-1 bg-[--white] opacity-65 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] transform-gpu sm:h-auto">
        <p className="hidden   sm:opacity-0 sm:select-none">.</p>
      </div>
    </div>
  );
}
