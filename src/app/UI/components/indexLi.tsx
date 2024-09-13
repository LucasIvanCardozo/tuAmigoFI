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
        (page == index + modifier
          ? 'font-bold text-xl text-[--black-olive]'
          : 'opacity-60') + ' px-1'
      }
    >
      <button onClick={() => callback((index + modifier).toString())}>
        {index + modifier}
      </button>
    </li>
  );
}
