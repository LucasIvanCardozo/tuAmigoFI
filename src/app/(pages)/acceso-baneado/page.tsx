'use cache: remote';
import Link from 'next/link';

export default async function AccesoBaneado() {
  return (
    <main className="pt-14 text-(--black) w-11/12 mx-auto max-w-(--breakpoint-md) my-10 sm:pt-20">
      <h1 className="font-bold text-4xl text-left bg-[#F3F4F6] ml-1 p-1 h-min rounded-2xl rounded-es-none shadow-md sm:ml-6 sm:p-2">
        Tu cuenta está baneada
      </h1>
      <section className="grow flex flex-col justify-start items-start text-(--black) w-11/12 mx-auto max-w-(--breakpoint-md)">
        <div className="text-left text-base sm:text-base m-6">
          <p className="mb-4">
            Tu usuario fue baneado de Tu amigo FI, así que no podés iniciar sesión ni seguir
            aportando TPs, parciales, respuestas o comentarios.
          </p>
          <p className="mb-4">
            Si creés que es un error o querés apelar la medida, escribime y lo revisamos. Cualquier
            duda o reclamo, es un mensaje de ida y vuelta.
          </p>
        </div>
        <div className="flex flex-wrap justify-start gap-4 w-full mt-4">
          <Link
            href="/"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-linear-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
          >
            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-(--white) rounded-md text-base group-hover:bg-transparent">
              Ir al inicio
            </span>
          </Link>
          <Link
            href="/contactame"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-linear-to-br from-teal-400 to-lime-600 group-hover:from-teal-300 group-hover:to-lime-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-teal-200"
          >
            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-(--white) rounded-md text-base group-hover:bg-transparent">
              Contactarme
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
