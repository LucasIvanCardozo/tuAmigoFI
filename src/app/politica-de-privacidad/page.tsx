import PrivacitySection from '../components/privacitySection';

export default async function Privacidad() {
  return (
    <>
      <main className="pt-14 text-[--black] w-11/12 mx-auto max-w-screen-md my-5 sm:pt-20">
        <h1 className="text-3xl">
          <b>Política de Privacidad de Tu-Amigo-FI</b>
        </h1>
        <PrivacitySection
          description={
            <>
              <p>
                <b>Última actualización:</b> 28/02/2025
              </p>
              <p>
                Bienvenido a Tu-Amigo-FI. Valoro tu privacidad y estoy
                comprometido a proteger tus datos personales. Esta Política de
                Privacidad describe cómo recopilo, utilizo y protejo tu
                información cuando usas mi sitio, diseñado para ayudar a
                estudiantes de ingeniería en Mar del Plata.
              </p>
            </>
          }
        />
      </main>
      <article className="flex flex-col py-8 gap-4 text-[--black] w-11/12 mx-auto max-w-screen-md">
        <PrivacitySection
          header="Información que recopilo"
          description={
            <>
              <p>
                Para ofrecer y mejorar los servicios de Tu-Amigo-FI, recolecto
                distintos tipos de información:
              </p>
              <ul>
                <li>
                  <strong>Información personal:</strong> Al registrarte,
                  solicito información como tu nombre y dirección de correo
                  electrónico para identificarte como usuario de la plataforma.
                </li>
                <li>
                  <strong>Información de uso:</strong> Recolecto datos sobre
                  cómo accedes y usas Tu-Amigo-FI, incluyendo el tipo de tu
                  dispositivo, navegador, y comportamiento de navegación en el
                  sitio.
                </li>
                <li>
                  <strong>Contenido generado por el usuario:</strong> Todo el
                  material que subas (como respuestas a trabajos prácticos o
                  finales) quedará almacenado en la base de datos de la
                  plataforma para que esté disponible.
                </li>
              </ul>
            </>
          }
        />
        <PrivacitySection
          header="Uso de la información"
          description={
            <>
              <p>Utilizo tus datos para:</p>
              <ul>
                <li>
                  Proporcionarte acceso a los recursos disponibles, como
                  trabajos prácticos, finales resueltos y otros materiales
                  académicos.
                </li>
                <li>
                  Mejorar la plataforma mediante el análisis de cómo la usan los
                  usuarios.
                </li>
                <li>Personalizar tu experiencia en Tu-Amigo-FI.</li>
              </ul>
            </>
          }
        />
        <PrivacitySection
          header="Compartición de la información"
          description={
            <>
              <p>
                Me comprometo a no vender, alquilar o intercambiar tus datos
                personales. Solo comparto información con terceros en estas
                situaciones:
              </p>
              <ul>
                <li>
                  <strong>Cumplimiento legal:</strong> En caso de que la ley lo
                  requiera, podré divulgar tu información para cumplir con
                  obligaciones legales o responder a solicitudes de autoridades
                  judiciales.
                </li>
              </ul>
            </>
          }
        />
        <PrivacitySection
          header="Almacenamiento y seguridad"
          description={
            <>
              <p>
                La información se almacena de manera segura en los servidores de
                la plataforma, ubicados en Estados Unidos. Implemento medidas de
                seguridad físicas, electrónicas y de procedimiento para proteger
                tus datos contra el acceso no autorizado. No obstante, debes
                saber que ningún sistema de seguridad es completamente
                infalible.
              </p>
            </>
          }
        />
        <PrivacitySection
          header="Derechos de los usuarios"
          description={
            <>
              <p>
                De acuerdo con la Ley de Protección de Datos Personales en
                Argentina, tienes derecho a:
              </p>
              <ul>
                <li>Acceder a tus datos personales.</li>
                <li>
                  Solicitar la rectificación de datos incorrectos o
                  desactualizados.
                </li>
                <li>Eliminar tu cuenta y todos los datos asociados a ella.</li>
                <li>
                  Revocar tu consentimiento para el tratamiento de tus datos
                  personales.
                </li>
              </ul>
              <p>
                Para ejercer estos derechos, puedes contactarme en{' '}
                <a
                  className="underline"
                  href="mailto:lucasivancardozo27@gmail.com"
                >
                  lucasivancardozo27@gmail.com
                </a>{' '}
                o a través de mi Whatsapp personal{' '}
                <a className="underline" href="https://wa.me/2235319564">
                  +542235319564
                </a>
                .
              </p>
            </>
          }
        />
        <PrivacitySection
          header="Uso de cookies"
          description={
            <>
              <p>
                Utilizo cookies para mejorar tu experiencia en el sitio. Estas
                cookies se usan para recordar tus preferencias y para fines de
                análisis y rendimiento. Puedes desactivar las cookies desde la
                configuración de tu navegador, aunque esto podría limitar
                algunas funciones de la plataforma.
              </p>
            </>
          }
        />
        <PrivacitySection
          header="Cambios en la política de privacidad"
          description={
            <>
              <p>
                Esta política puede actualizarse para reflejar cambios en el
                sitio o en la legislación aplicable. La fecha de la última
                actualizacion estará al principio de esta página.
              </p>
            </>
          }
        />
        <PrivacitySection
          header="Contacto"
          description={
            <>
              <p>
                Si tienes dudas o comentarios sobre esta Política de Privacidad,
                puedes escribirme a{' '}
                <a
                  className="underline"
                  href="mailto:lucasivancardozo27@gmail.com"
                >
                  lucasivancardozo27@gmail.com
                </a>{' '}
                o a través de mi Whatsapp personal{' '}
                <a className="underline" href="https://wa.me/2235319564">
                  +542235319564
                </a>
                .
              </p>
            </>
          }
        />
      </article>
    </>
  );
}
