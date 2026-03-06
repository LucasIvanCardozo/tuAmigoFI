import { VscTriangleRight } from 'react-icons/vsc';

export default function CourseLinksSkeleton() {
  return (
    <>
      <div className="flex items-center opacity-50 cursor-pointer w-fit select-none">
        <VscTriangleRight />
        <h3>
          <b>Links oficiales</b>
        </h3>
      </div>
      <div className="flex items-center opacity-50 cursor-pointer w-fit select-none">
        <VscTriangleRight />
        <h3>
          <b>Links no oficiales</b>
        </h3>
      </div>
    </>
  );
}
