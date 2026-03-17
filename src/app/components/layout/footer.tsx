import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="w-full bg-(--black) text-white py-6 mt-auto" role="Info">
      <div className="max-w-(--breakpoint-md) mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>Creado con ❤️ por</span>
          <a
            className="text-(--dark-cyan) hover:underline font-medium transition-colors"
            target="_blank"
            href="https://www.linkedin.com/in/lucas-ivan-cardozo/"
          >
            Lucas Cardozo
          </a>
        </div>
        <Link className="text-sm text-gray-400 hover:text-white transition-colors" href="/politica-de-privacidad">
          Política de Privacidad
        </Link>
      </div>
    </footer>
  )
}
