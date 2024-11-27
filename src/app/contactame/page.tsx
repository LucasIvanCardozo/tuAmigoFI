import Image from 'next/image';

export default function Contactame() {
  return (
    <>
      <main className="pt-14 relative flex text-[--black] min-h-36 h-auto w-11/12 justify-center mx-auto max-w-screen-md my-10 sm:pt-20 sm:justify-center">
        <div className="relative w-2/5 max-w-52">
          <Image
            className="object-contain w-full "
            src="/FI.svg"
            width={200}
            height={200}
            alt=""
          />
        </div>
        <h1 className="font-bold text-4xl text-left bg-[#F3F4F6] ml-1 p-1 h-min rounded-2xl rounded-es-none shadow-md sm:ml-6 sm:p-2">
          Hola!
          <p className="text-nowrap text-xl font-normal">
            Querés decirme algo?
          </p>
        </h1>
      </main>
      <section className="grow flex flex-col justify-start items-center text-[--black] w-11/12 mx-auto max-w-screen-md">
        <div className="text-center text-base sm:text-base">
          <p className="mb-4">
            Si tenés alguna consulta, querés reportar un error, saber cómo hice
            esta página o simplemente charlar, no dudes en contactarme. Estoy
            más que dispuesto a ayudarte en lo que necesites.
          </p>
          <p className="mb-4">
            También me encantaría recibir tus ideas o sugerencias para mejorar.
            ¡Toda opinión es bienvenida y me ayuda a hacer que esta página sea
            más útil para vos y para toda la comunidad!
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center w-full max-w-96 mt-4">
          <a
            href="https://www.instagram.com/lucardozo27/"
            target="_blank"
            className="flex items-center gap-4 bg-[--white] rounded-lg shadow p-2 w-full text-[--dark-cyan] text-lg sm:hover:scale-105 sm:transition-transform sm:transform-gpu"
          >
            <Image
              className="object-contain rounded-md drop-shadow-md"
              src="/instagram.svg"
              width={40}
              height={40}
              alt="Instagram"
            />
            @lucardozo27
          </a>
          <a
            href="https://wa.me/2235319564"
            target="_blank"
            className="flex items-center gap-4 bg-[--white] rounded-lg shadow p-2 w-full text-[--dark-cyan] text-lg sm:hover:scale-105 sm:transition-transform sm:transform-gpu"
          >
            <Image
              className="object-contain rounded-md drop-shadow-md"
              src="/whatsapp.svg"
              width={40}
              height={40}
              alt="WhatsApp"
            />
            Enviame un mensaje
          </a>
          <a
            href="mailto:lucasivancardozo27@gmail.com"
            className="flex items-center gap-4 bg-[--white] rounded-lg shadow p-2 w-full text-[--dark-cyan] text-lg sm:hover:scale-105 sm:transition-transform sm:transform-gpu"
          >
            <Image
              className="object-contain rounded-md drop-shadow-md"
              src="/email.svg"
              width={40}
              height={40}
              alt="Email"
            />
            lucasivancardozo27@gmail.com
          </a>
        </div>
        <section className="text-center mt-8">
          <p className="text-base sm:text-lg">
            ¡Gracias por ser parte de esta comunidad! 💻🎓
          </p>
        </section>
      </section>
    </>
  );
}
