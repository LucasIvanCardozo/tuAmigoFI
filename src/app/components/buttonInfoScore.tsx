'use client';
import { useModal } from '@/app/contexts/ModalContext';

export default function ButtonInfoScore() {
  const { openModal } = useModal();

  return (
    <button
      type="button"
      className="text-sm font-semibold text-(--dark-cyan) underline underline-offset-4 hover:opacity-80 transition-opacity"
      title="Como obtener puntos?"
      aria-label="Info sobre como obtener puntos"
      onClick={() =>
        openModal(
          <>
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
                    Responde consultas de TPs y/o exámenes y obtendrás <b>3 puntos</b>.
                  </li>
                  <li>
                    Deja un comentario y sumarás <b>1 punto</b>.
                  </li>
                  <li>
                    Comparte links útiles y obtendrás <b>1 punto</b>.
                  </li>
                  <li>
                    Cada reacción que dejes en la plataforma suma <b>1 punto</b>.
                  </li>
                </ul>
                <span>¡Colabora y construyamos juntos una comunidad más fuerte!</span>
                <span>
                  <b>Los datos se actualizan cada 24 hs</b>
                </span>
              </p>
            </div>
          </>,
        )
      }
    >
      ¿Cómo obtener puntos?
    </button>
  );
}
