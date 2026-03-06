'use client';
export default function IndexLi({
  page,
  index,
  modifier,
  callback,
}: {
  page: number;
  index: number;
  modifier: number;
  callback: (index: string) => void;
}) {
  return (
    <li
      className={
        page == index + modifier
          ? 'font-bold text-2xl text-[--black-olive]'
          : 'opacity-60 text-lg' + ' sm:hover:scale-110'
      }
    >
      <button
        className="min-h-6 min-w-6"
        aria-label={`Ir a la pagina numero ${index + modifier}`}
        onClick={() => callback((index + modifier).toString())}
      >
        {index + modifier}
      </button>
    </li>
  );
}
