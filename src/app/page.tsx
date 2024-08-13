import Image from 'next/image';

export default function Home() {
  return (
    <main className="mt-14 relative flex text-[--black] min-h-36 h-auto w-11/12 m-auto max-w-screen-sm sm:mt-16">
      <div className="relative w-2/5 max-w-52">
        <Image
          className="object-contain w-full "
          src="/FI.png"
          width={200}
          height={200}
          alt=""
        />
        <h1 className="font-bold absolute text-4xl top-0 left-full text-left">
          Bienvenido!
          <p className="text-nowrap text-xl font-normal">Aquí tu amigo 'FI'</p>
        </h1>
      </div>
      <div className="absolute bottom-0 right-0 h-auto ">
        <span>Oficiales</span>
        <ul className="flex gap-4 ">
          <li>
            <Image
              className="object-contain"
              src="/instagram.svg"
              width={25}
              height={25}
              alt=""
            />
          </li>
          <li>
            <Image
              className="object-contain h-full"
              src="/facebook.svg"
              width={25}
              height={25}
              alt=""
            />
          </li>
          <li>
            <Image
              className="object-contain h-full"
              src="/whatsapp.svg"
              width={25}
              height={25}
              alt=""
            />
          </li>
        </ul>
      </div>
    </main>
  );
}
