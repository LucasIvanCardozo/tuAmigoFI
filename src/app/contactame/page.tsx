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
          Hola! 🥰
          <p className="text-nowrap text-xl font-normal">
            Aquí podrás contactarme.
          </p>
        </h1>
      </main>
      <section className="grow flex flex-col justify-start items-center text-[--black] w-11/12 mx-auto max-w-screen-md">
        <div className="text-center text-base sm:text-base m-6">
          <p className="mb-4">
            Si tenés alguna <strong>consulta</strong>, querés{' '}
            <strong>reportar un error</strong>, saber cómo hice esta página o
            simplemente <strong>charlar</strong>, no dudes en contactarme. Estoy
            más que dispuesto a ayudarte en lo que necesites.
          </p>
          <p className="mb-4">
            También me encantaría recibir tus <strong>ideas</strong> o{' '}
            <strong>sugerencias</strong> para mejorar. ¡Toda{' '}
            <strong>opinión</strong> es bienvenida y me ayuda a hacer que esta
            página sea más útil para vos y para toda la comunidad!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 w-full mt-4">
          <a
            href="https://www.instagram.com/lucardozo27/"
            target="_blank"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
          >
            <Image
              className="object-contain rounded-md p-1"
              src="/instagram.svg"
              width={35}
              height={35}
              alt="Instagram"
            />
            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-[--white] rounded-md text-base group-hover:bg-transparent">
              @lucardozo27
            </span>
          </a>
          <a
            href="https://wa.me/2235319564"
            target="_blank"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br hover:text-white from-teal-400 to-lime-600 group-hover:from-teal-300 group-hover:to-lime-600 focus:ring-4 focus:outline-none focus:ring-lime-200"
          >
            <Image
              className="object-contain rounded-md p-1"
              src="/whatsapp.svg"
              width={35}
              height={35}
              alt="WhatsApp"
            />
            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-[--white] rounded-md text-base group-hover:bg-transparent">
              Enviame un mensaje ☺️​
            </span>
          </a>
          <a
            href="mailto:lucasivancardozo27@gmail.com"
            target="_blank"
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
          >
            <Image
              className="object-contain rounded-md p-0.5"
              src="/email.svg"
              width={35}
              height={35}
              alt="Email"
            />
            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-[--white] rounded-md text-base group-hover:bg-transparent">
              lucasivancardozo27@gmail.com
            </span>
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
