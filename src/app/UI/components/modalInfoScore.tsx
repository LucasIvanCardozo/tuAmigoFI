// 'src/app/components/ModalImportImage.tsx'
'use client';

export default function ModalInfoScore({
  callback,
}: {
  callback: (display: boolean | undefined) => void;
}) {
  return (
    <div className="fixed z-50 inset-0 bg-slate-800 bg-opacity-30 text-[--white] flex justify-center items-center font-normal">
      <div className="flex flex-col max-w-80 w-11/12 bg-slate-800 p-5 rounded-lg gap-3">
        <h3 className="text-lg mb-4">
          <b>¿Cómo obtener puntos?</b>
        </h3>
        <div className="text-base">
          <p>
            Obtén puntos colaborando con la comunidad:
            <ul className="list-disc list-inside my-4 text-sm">
              <li>
                Añade TPs para sumar <b>6 puntos</b>.
              </li>
              <li>
                Sube parciales para ganar <b>5 puntos</b>.
              </li>
              <li>
                Responde consultas de TPs y obtendrás <b>3 puntos</b>.
              </li>
              <li>
                Recibe likes en tus respuestas para sumar <b>1 punto</b> por
                cada uno.
              </li>
              <li>
                Comparte links útiles y obtendrás <b>1 punto</b>.
              </li>
            </ul>
            ¡Colabora y construyamos juntos una comunidad más fuerte! Los datos
            se actualizan cada 2 hs.
          </p>
        </div>
        <button
          className="mt-4 py-2 px-4 text-base font-semibold rounded-lg"
          onClick={() => callback(false)}
        >
          Atrás
        </button>
      </div>
    </div>
  );
}
